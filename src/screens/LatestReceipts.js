import React, { Component } from 'react'
import { Animated,RefreshControl,ActivityIndicator,Picker, Alert,Button,Image, Dimensions,Platform, StyleSheet,DatePickerIOS, View, TouchableOpacity,Text, TextInput,FlatList ,ImageBackground} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native';

import Amplify, { API, Auth,Storage } from 'aws-amplify';
import { connect } from "react-redux";
import {fetchLatestReceipts,markInboxSelection,fetchUnknownReceipts,resetReceiptDetail,moveToMyReceipts,deleteReceipts} from '../store/actions/receipts';
import {fetchCategories} from '../store/actions/categorizeAction';

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
import {ButtonGroup, ThemeConsumer} from 'react-native-elements';
import Constants from '../Utils/constants';
import {CATEGORIES} from '../Utils/avatarPrefix';
import constants from '../Utils/constants';
const { width, height } = Dimensions.get('window');

const AnimatedListView = Animated.createAnimatedComponent(FlatList);
const MOVE_RECEIPTS_TEXT='Move all emails to my receipts';
const buttons = ['Receipts', 'Others']
  class LatestReceipts extends Component {
    NAVBAR_HEIGHT=100;

    setDate = (newDate)=>{
      this.setState({
         
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
          
           isAdvSearchOpened:!prevState.isAdvSearchOpened,
         //  NAVBAR_HEIGHT:prevState.isAdvSearchOpened?100:120
           
        }
       
        
     });
   }, 250);
       }else {
         this.setState(prevState=>{
         //  this.NAVBAR_HEIGHT=prevState.isAdvSearchOpened?100:130
          
             return {
              
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
        showPicker:false,
        currentUser:null,
        pickerCategory:null,
        scrollAnim,
        swipedReceipt:null, 
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

    updateCategory=(category)=>{
      this.setState({pickerCategory:category});
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
          statusBar: {

            backgroundColor:colors.primary,
            drawBehind: false,
                        style:  'light',
                        visible: true,
          },
          topBar: {
            //hideOnScroll: true,
           
            backButton: {
              title:'',
              color: colors.buttonEnabledColor, // For back button text
            },
            buttonColor: colors.buttonEnabledColor,
        background:{
          color: colors.primary,
          //translucent: true,
        },
            title: {
              text: receipt.title,
              color: colors.primaryTextColor,
            },
            rightButtons:[
            //   {
            //     id: 'edit',
            //     icon: sources[0]
            //  },
             {
                id: 'delete',
                icon: sources[1],
                color: colors.buttonEnabledColor, 
             }
            ]
          }
        }
      }
    });
  });
    }
    
/* GET PICKER OF CATEGORIES */
_getPicker=()=>{
 
  const categories=this.props.categories.map((category,index)=>{
    return (<Picker.Item key={index} label={category.category} value={category.category} />)
   });
  
return this.state.showPicker?
 (  <View
    style={{ bottom:0,right:0, position:'absolute',height: 200, width:width,zIndex:999,backgroundColor:"#efefef" }}
      >
     <Picker
    
     mode='dialog'
selectedValue={this.state.pickerCategory}

onValueChange={(itemValue, itemIndex) => this.updateCategory( itemValue)}>
{
categories
}

</Picker>
</View>):null;

}
getCategorizeButtons=(sources)=>{
  return [
 
     {
       id: 'categorized',
       text: 'Done',
       color: colors.buttonEnabledColor, 
     },
     {
       id: 'cancel',
       text: 'Cancel',
       color: colors.buttonEnabledColor, 
     }
   ]
 }

showTopBarButtons=(buttonFunction )=>{
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? "md-trash" : "ios-trash", 25),
   
  ]).then(sources => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: '',
          
        },
        backButton: {
          color: colors.buttonEnabledColor, // For back button text
        },
        buttonColor: colors.buttonEnabledColor,
        rightButtons: buttonFunction(sources)
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
          this.askForUpdateCategory();
        }
        else if(buttonId==='cancel'){
          this.handleCancelSelection();
        }
        else if(buttonId==='delete'){
          this.deleteSeletedReceipts();
        }
        else if(buttonId==='categorized'){
          this.moveSelectedReceipts(this.state.pickerCategory);
          
        }
      }  
      handleCancelSelection=()=>{
        const initialCheck=this.props.receipts.map(()=>false);
  this.setState({isChecked : initialCheck,
    allChecked:false,
    showPicker:false,
  })
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            title:{
              text:Constants.APP_NAME
              
            },
         rightButtons: [
              
            ]
          }
        });
      } 

      componentDidDisappear(){
        this.setState({didScreenAppear:false});
     }
async componentDidAppear(){
  let currentUser = this.state.currentUser;
  console.log(currentUser);
  try {
   // if(currentUser===null){
    const user = await Auth.currentAuthenticatedUser();
    console.log('user setting');
    console.log(user['username']);
    this.setState({currentUser:user});
   // }
  
    if (currentUser) {
      this.setState({
        didScreenAppear: true
      });
      if (this.props.receipts === undefined || this.props.receipts === null || this.props.receipts.length === 0) {
        this.fetchReceipts(this.state.isReceiptFolder);
      }
    } 
  } catch (err) {
    console.log('err: ', err);
    //this.props.onStateChange('signedOut', null);
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
if(this.props.categories.length===0){
    this.props.fetchCategories();
}
}

toggleMultiSelect=()=>{
  this.setState(prevState=>{
    return {
      canMultiSelect:!prevState.canMultiSelect
    }
  });
}

/* Deletes the selected receipts */
deleteSeletedReceipts =(swipedReceipt)=>{
  let deletableReceipts=[];
this.props.receipts.map((receipt,index)=>{
  if(this.state.isChecked[index]){
    deletableReceipts.push(receipt);
  }

});
if(deletableReceipts.length==0){
  //VERIFY ITS FROM SWIPE
  swipedReceipt!==null && swipedReceipt!==undefined ?deletableReceipts.push({...swipedReceipt}):null;


}
console.log(swipedReceipt);
console.log(deletableReceipts);

if(deletableReceipts.length>0){
  this.deleteReceipts(deletableReceipts);
}
this.setState({swipedReceipt:null});
}
deleteReceipts=(deletableReceipts)=>{
  const isReceiptFolder=  this.state.isReceiptFolder;
  this.props.deleteReceipts(deletableReceipts,isReceiptFolder);
 
  
}
/* ASK FOR UPDATING CATEGORIES */
askForUpdateCategory=()=>{
  Alert.alert(
    Constants.CATEGORIZE_RECEIPT_TITLE_ALERT,
    Constants.MOVE_RECEIPT_MESSAGE,
    [
      {text: Constants.YES, onPress: () => {
        this.setState({pickerCategory:CATEGORIES[0],
        showPicker:true
      });
      this.showTopBarButtons(this.getCategorizeButtons);

    }
    },
      {text: Constants.NO, onPress: () => this.moveSelectedReceipts()},
      
    ],
    { cancelable: false }
  )
}
/* Moves the selected latest receipts to my receipts folder */
moveSelectedReceipts=(category)=>{
  console.log('move selected reeipts'+category);
  let movableReceipts=[];
this.props.receipts.map((receipt,index)=>{
  if(this.state.isChecked[index]){
    let newReceipt={...receipt};
    if(category!==null && category!==undefined){
      newReceipt['category']=category;
    }
    movableReceipts.push(newReceipt);
  }

})

console.log(movableReceipts);
if(movableReceipts.length==0){
  //VERIFY ITS FROM SWIPE
  let categoriableReceipt={...this.state.swipedReceipt}
  if(category!==null && category!==undefined){
  
    categoriableReceipt['category']=category;
  }

  this.state.swipedReceipt!==null && this.state.swipedReceipt!==undefined ?movableReceipts.push(categoriableReceipt):null;


}
if(movableReceipts.length>0){
  //CALL API TO MOVE RECEIPTS TO MY RECEIPT FOLDER

  this.moveReceipts(movableReceipts);
  this.setState({swipedReceipt:null});
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
          title:{
            text:''
          },
          buttonColor: colors.buttonEnabledColor,
          rightButtons: [
            {
              id: 'cancel',
              text: 'Cancel',
              color: colors.buttonEnabledColor, 
            },
            {
              id: 'delete',
              icon: sources[1],
              text:'delete',
              color: colors.buttonEnabledColor, 
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
  
  const defaultText=this.state.selectedIndex===0?
  constants.RECEIPTS_DEFAULT_PREFIX+(this.state.currentUser!==null?this.state.currentUser['username']:'')
  +constants.EMAIL_DOMAIN+ constants.RECEIPTS_DEFAULT_TEXT:constants.RECEIPTS_DEFAULT_PREFIX+(this.state.currentUser!==null?this.state.currentUser['username']:'')+constants.EMAIL_DOMAIN+constants.UNKNOWN_RECEIPTS_DEFAULT_TEXT

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
      {
        
        (this.props.receipts===undefined ||this.props.receipts.length==0)?
        (<View style={{padding:20}}>
          <Text style={{fontSize:colors.textFontSize,
          //fontStyle:'italic',
          color:colors.primary,
          }}>
          {
            defaultText
          }
          </Text>
        </View>):(

<Animated.View style={styles.receiptList} >
<AnimatedListView
 data={this.props.receipts}
 extraData={this.state}
 keyExtractor={this._keyExtractor}
 refreshControl={<RefreshControl
  progressBackgroundColor={colors.primary}
 refreshing={this.state.isFetching}
 tintColor={colors.primary}
 onRefresh={this.onRefresh}
/>}
 onLongPress={()=>{}}
// ListHeaderComponent={this._getHeaderComponent}
 renderItem={(info) =>{
  const swipeoutBtns = [
    {
      text: 'Move',
      backgroundColor:colors.primary,
      onPress: () => {
        this.setState({swipedReceipt:info.item});
        this.askForUpdateCategory();
    }
    },
    {
        text: 'Delete',
        backgroundColor:colors.accentColor,
        onPress: () => {

          this.setState({swipedReceipt:info.item});
          this.deleteSeletedReceipts(info.item);
      }
      },
      
  ]; 
  
  return (
  <ReceiptItem
  receiptItem={info.item}
  categories={this.props.categories}
  isChecked={this.state.isChecked[info.index]}
  swipeoutBtns={swipeoutBtns}
  canShowCheckbox={true}
 
  receiptImage={info.item.image}
  onToggleCheckBox={()=>this.onToggleCheckBox(info.index)}
  onItemPressed={() => this.onItemSelected(info.item)}
/>
 )}
  }
 
  scrollEventThrottle={1}
 
  
  onScrollEndDrag={this._onScrollEndDrag}
  
/>
</Animated.View>
        )
      }
      
        {
          this.isanyItemSelected()?
        (<ActionButton 
          offsetY={20}
          offsetX={20}
        buttonColor={colors.primary}>
         <Icon name="md-create" style={styles.actionButtonIcon} />
          
          <ActionButton.Item buttonColor={colors.primary} title="Move to My Receipts" onPress={() => this.askForUpdateCategory()}>
            <Icon name="md-move" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={colors.primary} title="Delete Receipts" onPress={this.deleteSeletedReceipts}>
            <Icon name="md-trash" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>):null
        }
        {this._getPicker()}
        {this.props.isLoading?<View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary}  />
    </View>:null
        }
      </View>
    );
  }
}
const mapStateToProps = state => {
 
    return {
      categories:state.categories.categories,
      receipts: state.receipts.isReceiptFolder?state.receipts.latestReceipts:state.receipts.unknownReceipts,
      isReceiptDeleted:state.ui.isReceiptDeleted,
      isLoading:state.ui.isLoading
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
      openModal:()=>  dispatch(modalOpen()),
      fetchCategories:()=>dispatch(fetchCategories())
    };
  };

  


  const styles = StyleSheet.create({
    fill: {
      flex: 1,
    },
    notificationPrimaryButton:{
      backgroundColor: colors.primary,
    
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
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
