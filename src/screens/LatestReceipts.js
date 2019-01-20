import React, { Component } from 'react'
import { Animated, Alert,Button,Image, Platform, StyleSheet,DatePickerIOS, View, TouchableOpacity,Text, TextInput,FlatList ,ImageBackground} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native';

import Amplify, { API, Auth,Storage } from 'aws-amplify';
import { connect } from "react-redux";
import {fetchLatestReceipts,markInboxSelection,fetchUnknownReceipts,resetReceiptDetail,moveToMyReceipts,deleteReceipts} from '../store/actions/receipts';
import Icon from 'react-native-vector-icons/dist/Ionicons';
const STATUS_BAR_HEIGHT = Platform.select({ ios: 0, android: 0 });
import ReceiptItem from '../components/ReceiptItem';
import ActionButton from 'react-native-action-button';
import {showAddReceipt} from '../components/addReceipt';
import { modalOpen,resetUIState } from '../store/actions/ui';
import {Navigation} from 'react-native-navigation';
import {colors} from '../Utils/theme';
import CheckBox from '../components/CheckBox';
import MainText from '../components/MainText';
import HeadingText from '../components/HeadingText';
import {ButtonGroup} from 'react-native-elements';

const AnimatedListView = Animated.createAnimatedComponent(FlatList);
const MOVE_RECEIPTS_TEXT='Move all emails to my receipts';
const buttons = ['Receipts', 'Others']
  class LatestReceipts extends Component {
    NAVBAR_HEIGHT=100;

    setDate = (newDate)=>{
      this.setState({
          ...this.state,
          chosenDate:newDate
      });
     }
   
     toggleAdvanceSearch=()=>{
       Animated.timing(                  // Animate over time
         this.state.adVanceSearchClickAnim,            // The animated value to drive
         {
           toValue: !this.state.isAdvSearchOpened?0:-300,                   // Animate to opacity: 1 (opaque)
           duration: 300,   
           useNativeDriver: true,           // Make it take a while
         }
       ).start(); 
   
       Animated.timing(                  // Animate over time
         this.state.searchIconRotateAnim,            // The animated value to drive
         {
           toValue: this.state.isAdvSearchOpened?0:1,                   // Animate to opacity: 1 (opaque)
           duration: 150,   
           useNativeDriver: true,           // Make it take a while
         }
       ).start(); 
     
       Animated.timing(                  // Animate over time
         this.state.navBarHeightChangeAnim,            // The animated value to drive
         {
           toValue: this.state.isAdvSearchOpened?0:1,                   // Animate to opacity: 1 (opaque)
           duration: 150,   
           useNativeDriver: true,           // Make it take a while
         }
       ).start(); 
     
       if(this.state.isAdvSearchOpened){
   setTimeout(() => {
     this.setState(prevState=>{
      // this.NAVBAR_HEIGHT=prevState.isAdvSearchOpened?100:130
      
         return {
           ...this.state,
           isAdvSearchOpened:!prevState.isAdvSearchOpened,
         //  NAVBAR_HEIGHT:prevState.isAdvSearchOpened?100:120
           
        }
       
        
     });
   }, 250);
       }else {
         this.setState(prevState=>{
         //  this.NAVBAR_HEIGHT=prevState.isAdvSearchOpened?100:130
          
             return {
               ...this.state,
               isAdvSearchOpened:!prevState.isAdvSearchOpened,
             //  NAVBAR_HEIGHT:prevState.isAdvSearchOpened?100:120
               
            }
           });
       }
      
   
     }

   


    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
      //const dataSource = new FlatList.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  
      const scrollAnim = new Animated.Value(0);
      
     
      this.state = {
        //dataSource: dataSource.cloneWithRows(data),
        scrollAnim,
       selectedReceipts:[],
       isChecked:[],
       selectedIndex: 0,
       canMultiSelect:false,
       allChecked:false,
       isFetching:false,
       didScreenAppear:false,
       isReceiptFolder:true,
    };
    }
    /* Handle the selection of the receipt */
    onItemSelected=(receipt)=>{
      this.handleCancelSelection();
      this.updateCheckedState(this.props.receipts);
      this.props.resetReceiptDetail();
    // WE NEED TO NAVIGATE TO NEW SCREEN TO VIEW THE SELECTED REPORT
    Promise.all([
      Icon.getImageSource(Platform.OS === 'android' ? "md-create" : "ios-create", 25),
      Icon.getImageSource(Platform.OS === 'android' ? "md-trash" : "ios-trash", 25),
     
    ]).then(sources => {
      
    Navigation.push(this.props.componentId, {
      component: {
        name: 'receiptManager.receiptDetail-screen',
        passProps: {
          receipt: receipt,
          isReceiptFolder:this.state.isReceiptFolder
        },
        options: {
          topBar: {
            //hideOnScroll: true,
            backButton: {
              color: colors.buttonEnabledColor, // For back button text
            },
            buttonColor: colors.buttonEnabledColor,
        background:{
          color: colors.primary,
          //translucent: true,
        },
            title: {
              text: receipt.title
            },
            rightButtons:[
            //   {
            //     id: 'edit',
            //     icon: sources[0]
            //  },
             {
                id: 'delete',
                icon: sources[1]
             }
            ]
          }
        }
      }
    });
  });
    }
    

    signOut=async ()=>{
        Auth.signOut()
        .then(() => {
        this.props.onStateChange('signedOut', null);
        })
        .catch(err => {
        console.log('err: ', err)
        })
      }
      
      navigationButtonPressed({ buttonId }) {
      
        if(buttonId==='move'){
          this.moveSelectedReceipts();
        }
        else if(buttonId==='cancel'){
          this.handleCancelSelection();
        }
        else if(buttonId==='delete'){
          this.deleteSeletedReceipts();
        }
      }  
      handleCancelSelection=()=>{
        const initialCheck=this.props.receipts.map(()=>false);
  this.setState({isChecked : initialCheck,
    allChecked:false
  })
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
         rightButtons: [
              
            ]
          }
        });
      } 

      componentDidDisappear(){
        this.setState({didScreenAppear:false});
     }
async componentDidAppear(){
  try {
    const user = await Auth.currentAuthenticatedUser();
    if (user) {
      this.setState({
        didScreenAppear: true
      });
      if (this.props.receipts === undefined || this.props.receipts === null || this.props.receipts.length === 0) {
        this.fetchReceipts(this.state.isReceiptFolder);
      }
    } else {
      this.props.onStateChange('signedOut', null);
    }
  } catch (err) {
    console.log('err: ', err);
    this.props.onStateChange('signedOut', null);
  }

  
}
componentWillReceiveProps(nextProps) {

  if(this.props.receipts!==undefined && this.props.receipts.length!==nextProps.receipts.length){
    //Handle cancel of deletes
    this.handleCancelSelection();
   }
   this.setState({refreshing:false})
  this.updateCheckedState(nextProps.receipts);
 }
 updateCheckedState=(receipts)=>{
  const initialCheck=receipts.map(()=>false);
  this.setState({isChecked : initialCheck})
}

componentDidMount(){
    //FETCH MY RECEIPTS FROM DATABASE AND GET IT FROM REDUX
    this.props.resetUIState();
    this.fetchReceipts(this.state.isReceiptFolder);
}

toggleMultiSelect=()=>{
  this.setState(prevState=>{
    return {
      canMultiSelect:!prevState.canMultiSelect
    }
  });
}

/* Deletes the selected receipts */
deleteSeletedReceipts =()=>{
  let deletableReceipts=[];
this.props.receipts.map((receipt,index)=>{
  if(this.state.isChecked[index]){
    deletableReceipts.push(receipt);
  }

});
if(deletableReceipts.length>0){
  this.deleteReceipts(deletableReceipts);
}
}
deleteReceipts=(deletableReceipts)=>{
  const isReceiptFolder=  this.state.isReceiptFolder;
  this.props.deleteReceipts(deletableReceipts,isReceiptFolder);
 
  
}
/* Moves the selected latest receipts to my receipts folder */
moveSelectedReceipts=()=>{
  let movableReceipts=[];
this.props.receipts.map((receipt,index)=>{
  if(this.state.isChecked[index]){
    movableReceipts.push(receipt);
  }

})
console.log(movableReceipts)
if(movableReceipts.length>0){
  //CALL API TO MOVE RECEIPTS TO MY RECEIPT FOLDER

  this.moveReceipts(movableReceipts);
}
}
moveReceipts=(receipts)=>{
  const isReceiptFolder=  this.state.isReceiptFolder;
  this.props.onMoveLatestReceipts(receipts,isReceiptFolder);
 
  
}
selectAllToggle=()=>{
  let allSelected=[];
  if(this.state.allChecked){
    allSelected=this.state.isChecked.map(()=>false);
  }else {
    allSelected=this.state.isChecked.map(()=>true);
  }
  this.setState(prevState=>{ 
    return {
        isChecked:allSelected,
        allChecked:!prevState.allChecked
 
    }
     });
  this.updateNavBarForSelection(allSelected);
 
}
onToggleCheckBox=(index)=>{
  
 const newArray=[...this.state.isChecked.slice(0, index),!this.state.isChecked[index],...this.state.isChecked.slice( index+1)];
  

this.setState({isChecked:newArray});
//IF any item is selected then show move icon

this.updateNavBarForSelection(newArray);
//this.setState({isChecked:null});
}
updateNavBarForSelection=(newArray)=>{
  if(newArray.includes(true)){

    Promise.all([
      Icon.getImageSource(Platform.OS === 'android' ? "md-move" : "ios-move", 25),
      Icon.getImageSource(Platform.OS === 'android' ? "md-trash" : "ios-trash", 25),
    ]).then(sources => {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          backButton: {
            color: colors.buttonEnabledColor, // For back button text
          },
          buttonColor: colors.buttonEnabledColor,
          rightButtons: [
            {
              id: 'cancel',
              text: 'Cancel'
            },
            {
              id: 'delete',
              icon: sources[1],
              text:'delete'
            },
           
            {
              id: 'move',
              icon: sources[0],
              text:'move'
            },
          ]
        }
      });
    
  });
  }else {
    this.handleCancelSelection();

  }
}
fetchReceipts=(isReceiptFolder)=>{
//const isReceiptFolder=  this.state.isReceiptFolder;
if(isReceiptFolder){
this.props.onMyLatestReceipts();
}else{
  this.props.onMyOtherReceipts();
}
}
onRefresh=()=>{
  this.setState({refreshing:true});
  this.fetchReceipts(this.state.isReceiptFolder);
}
isanyItemSelected=()=>{
  return this.state.isChecked.find(el=>el===true);
}
_keyExtractor = (item, index) => index.toString();//item.receiptId;

updateIndex= (selectedIndex) =>{
  //console.log(item);
 const isReceiptFolder=selectedIndex==0?true:false
  this.setState({
    selectedIndex: selectedIndex,
    isReceiptFolder:isReceiptFolder
  })
  this.props.markInboxSelection(isReceiptFolder);
  this.fetchReceipts(isReceiptFolder);
}

  render() {
    
    if(this.props.isReceiptDeleted){
     // this.updateCheckedState(this.props.receipts);
      if(this.state.didScreenAppear){this.props.resetUIState();
      }
    

  }
    
    return (
    
      
      <View style={styles.fill}>
       <ButtonGroup containerStyle={{height:30}}
         onPress={(selectedIndex)=>this.updateIndex(selectedIndex)}
         selectedIndex={this.state.selectedIndex}
         selectedButtonStyle={styles.notificationPrimaryButton}
         buttons={buttons}
         selectedTextStyle={styles.selectedTextStyle}
        textStyle={{fontSize:17}}
       />
      {
        
       this.props.receipts?(
     
       <View style={styles.instrContainer}>
       
        <CheckBox size={25} wrapperStyle={{padding:15}} checked={this.state.allChecked} toggle={this.selectAllToggle}/>
        <MainText>
          <HeadingText style={{fontSize:17}}>{MOVE_RECEIPTS_TEXT}</HeadingText>
        </MainText>
        </View>
      
        ):null
      }
      {/* {
      this.props.receipts?(
     <View style={styles.instrContainer}>
<View style={{width:'25%'}}>
<CheckBox  
  
 
  toggle={()=>this.selectAllToggle()}
/>
</View>
<MainText>
          <HeadingText style={{fontSize:14}}>{MOVE_RECEIPTS_TEXT}</HeadingText>
        </MainText>
  
     </View>):null
      } */}
      <Animated.View style={styles.receiptList} >
        <AnimatedListView
         data={this.props.receipts}
         extraData={this.state}
         keyExtractor={this._keyExtractor}
         onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
         onLongPress={()=>{}}
        // ListHeaderComponent={this._getHeaderComponent}
         renderItem={(info) => (
          <ReceiptItem
          receiptItem={info.item}
          isChecked={this.state.isChecked[info.index]}
         
          canShowCheckbox={true}
         
          receiptImage={info.item.image}
          onToggleCheckBox={()=>this.onToggleCheckBox(info.index)}
          onItemPressed={() => this.onItemSelected(info.item)}
        />
         )}

         
          scrollEventThrottle={1}
         
          
          onScrollEndDrag={this._onScrollEndDrag}
          
        />
        </Animated.View>
        {
          this.isanyItemSelected()?
        (<ActionButton 
          offsetY={20}
          offsetX={20}
        buttonColor={colors.primary}>
         <Icon name="md-create" style={styles.actionButtonIcon} />
          
          <ActionButton.Item buttonColor={colors.primary} title="Move to My Receipts" onPress={() => this.moveSelectedReceipts()}>
            <Icon name="md-move" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={colors.primary} title="Delete Receipts" onPress={this.deleteSeletedReceipts}>
            <Icon name="md-trash" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>):null
        }
      </View>
    );
  }
}
const mapStateToProps = state => {
 
    return {
      receipts: state.receipts.isReceiptFolder?state.receipts.latestReceipts:state.receipts.unknownReceipts,
      isReceiptDeleted:state.ui.isReceiptDeleted
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      resetReceiptDetail:()=>dispatch(resetReceiptDetail()),
      resetUIState:()=>dispatch(resetUIState()),
      deleteReceipts:(receipts,isReceiptFolder)=>dispatch(deleteReceipts(receipts,isReceiptFolder)),
      onMoveLatestReceipts:(receipts,isReceiptFolder)=>dispatch(moveToMyReceipts(receipts,isReceiptFolder)),
      onMyLatestReceipts: () => dispatch(fetchLatestReceipts()),
      markInboxSelection:(isReceiptFolder)=>dispatch(markInboxSelection(isReceiptFolder)),
      onMyOtherReceipts: () => dispatch(fetchUnknownReceipts()),
      openModal:()=>  dispatch(modalOpen())
    };
  };

  


  const styles = StyleSheet.create({
    fill: {
      flex: 1,
    },
    notificationPrimaryButton:{
      backgroundColor: colors.primary,
    
    },
    selectedTextStyle:{
      color:'white'
    },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
    instrContainer:{
      flexDirection:"row",
     
     // justifyContent:"space-around",
      alignItems:"center",
     // margin:0,
     height:50
    },
    receiptList:{
    //paddingTop:65
    },
    navbar: {
     
    },
  
    title: {
      color: '#333333',
    },
    row: {
      height: 300,
      width: null,
      marginBottom: 1,
      padding: 16,
      backgroundColor: 'transparent',
    },
    rowText: {
      color: 'white',
      fontSize: 18,
    },
    searchContainer: {
      zIndex: 99,
      paddingTop: 10,
      width: '100%',
      overflow: 'hidden',
      paddingBottom: 10,
     display:'flex',
    
     flexDirection:'row'
     
    },
    arrowMinimizeContainer: {
      position: 'relative',
  
      
    },
    arrowMinimizeIcon: {
      marginLeft: 5,
    },
    searchInput: {
     // display: 'flex',
      backgroundColor: '#fff',
      borderRadius: 20,
      height: 45,
      width:'80%',
      marginLeft: 5,
      marginRight: 5,
      
     
    },
    dateInput:{
      backgroundColor: '#fff',
      borderRadius: 20,
      height: 45,
      width:'50%',
      marginLeft: 5,
      marginRight: 5,
    },
    AdvancedSearch: {
       display: 'flex',
       flexDirection:'row',
       backgroundColor: '#fff',
       
       height: 45,
       //width:'100%',
       marginLeft: 5,
       marginRight: 5,
       
      
     },
    locationInput: {
      marginTop: 10,
    },
   
    checkBoxContainer:{
     
borderWidth: 2, 
borderRadius:5,  
borderColor:'#ccc',

     
      
          },
    searchIcon: {
      position: 'absolute',
      left: 13,
      top: 12,
    },
    datePicker :{
        zIndex:999,
        backgroundColor:'#eee'
    },
    inputText: {
      
      marginTop: 13,
      marginLeft: 43,
      fontSize: 15,
      color: '#999',
      width:'100%'
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(withAuthenticator(LatestReceipts))
