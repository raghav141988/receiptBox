import React, { Component } from 'react'
import { Animated,UIManager,RefreshControl,findNodeHandle,ScrollView,TouchableNativeFeedback,TouchableWithoutFeedback,ActivityIndicator,Alert,Dimensions,StatusBar, Picker,Button,Image, Platform, StyleSheet,DatePickerIOS,Modal, View, TouchableOpacity,Text, TextInput,FlatList ,ImageBackground} from 'react-native';
import PushNotification from '@aws-amplify/pushnotification';

import { PushNotificationIOS } from 'react-native';
import Amplify, { API, Auth,Storage } from 'aws-amplify';
import { connect } from "react-redux";
import amplify from '../../src/aws-exports';
import {fetchMyReceipts,deleteReceipts,resetReceiptDetail,categorizeReceipts} from '../store/actions/receipts';
import {fetchCategories,addNewCategory} from '../store/actions/categorizeAction';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons'
const STATUS_BAR_HEIGHT = Platform.select({ ios: 0, android: 0 });
import ReceiptItem from '../components/ReceiptItem';
import ActionButton from 'react-native-action-button';
import {showAddReceipt,showAddReceiptFromCamera} from '../components/addReceipt';
import { modalOpen,resetUIState,resetNotificationData } from '../store/actions/ui';
import {Navigation} from 'react-native-navigation';
import ImagePicker from 'react-native-image-picker';
import {colors} from '../Utils/theme';
import {CATEGORIES} from '../Utils/avatarPrefix';
import AndroidPicker from '../components/AndroidPicker';
import CategoryListing from '../components/CategoryListing';
const AnimatedListView = Animated.createAnimatedComponent(FlatList);
const { width, height } = Dimensions.get('window');



  class MyReceipts extends Component {
    NAVBAR_HEIGHT=100;

    setDate = (newDate)=>{
      this.setState({
          ...this.state,
          chosenDate:newDate
      });
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
  getLongScreenButtons=(sources)=>{
   const key =Platform.OS==='android'?'icon':'iconText';
   const value=Platform.OS==='android'?sources[1]:'Cancel';

    return  [
      {
        id: 'delete',
        icon: sources[0],
        color: colors.buttonEnabledColor, 
        buttonAlign:'right'
      },
      {
        id: 'categorize',
        text: 'Categorize',
        color: colors.buttonEnabledColor, 
        buttonAlign:'right'
      },
      {
        id: 'cancel',
        text: 'Cancel',
        [key]:value,
        color: colors.buttonEnabledColor, 
        buttonAlign:'left'
      }
    ];

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

    _getAdvanceSearchComponent=(advSearchTranslate,advSearchOpacity)=>{
    
    
   
      return this.state.isAdvSearchOpened? 
          (
          
  <Animated.View style={[styles.AdvancedSearch,
  {opacity:advSearchOpacity},
  { transform: [
  {translateX:this.state.adVanceSearchClickAnim}
  ] }]
  }>
            <View style={styles.dateInput}>
               
                   <Icon
                    name='date-range' 
                    size={22} 
                    style={styles.searchIcon} 
                    color='#bbb'
                  /> 
                  <TextInput 
                    style={styles.inputText}
                    placeholder={'From date...'}
                    placeholderTextColor={'#999'}
                    underlineColorAndroid={'#fff'}
                    autoCorrect={false}
                    onFocus={() => {
                      //animation.expandBar();
                      this.props.changeInputFocus('search');
                    }}
                    ref={(inputSearch) => {
                      this.inputSearch = inputSearch;
                    }}
                  />
                </View>
  
                <View style={styles.dateInput}>
               
               <Icon
             name={Platform.OS === 'android' ? 'md-date-range' : 'ios-date-range'}
                size={22} 
                style={styles.searchIcon} 
                color='#bbb'
              /> 
              <TextInput 
                style={styles.inputText}
                placeholder={'To Date...'}
                placeholderTextColor={'#999'}
                underlineColorAndroid={'#fff'}
                autoCorrect={false}
                onFocus={() => {
                  //animation.expandBar();
                  this.props.changeInputFocus('search');
                }}
                ref={(inputSearch) => {
                  this.inputSearch = inputSearch;
                }}
              />
            </View>
  
  
          {/* <DatePickerIOS style={styles.datePicker}
            date={this.state.chosenDate}
            onDateChange={this.setDate}
          /> */}
        </Animated.View>
  
      )
      
  :null;
      }


    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
      //const dataSource = new FlatList.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  
      const scrollAnim = new Animated.Value(0);
      
     
      this.state = {
        //dataSource: dataSource.cloneWithRows(data),
        scrollAnim,
        showPicker:false,
        pickerCategory:null,
       selectedReceipts:[],
       isChecked:[],
       swipedReceipt:null,  
       
       canShowCheckbox:false,
        adVanceSearchClickAnim:new Animated.Value(-300),
        searchIconRotateAnim:new Animated.Value(0),
        navBarHeightChangeAnim:new Animated.Value(0),
        isAdvSearchOpened:false,
        isFetching:false,
        didScreenAppear:false,
        chosenDate: new Date(),
        clampedScroll: Animated.diffClamp(
         
            scrollAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolateLeft: 'clamp',
            }),
          
          0,
         this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
        ),
      };
    }
    /* Handle the selection of the receipt */
    onItemSelected=(receipt)=>{
      this.props.resetReceiptDetail();
      //RESET PICKER
      this.setState({showPicker:false});

      this.updateCheckedState(this.props.receipts);

      this.handleCancelSelection();
    // WE NEED TO NAVIGATE TO NEW SCREEN TO VIEW THE SELECTED REPORT
    Promise.all([
      Icon.getImageSource(Platform.OS === 'android' ? "md-create" : "ios-create", 25,'white'),
      Icon.getImageSource(Platform.OS === 'android' ? "md-trash" : "ios-trash", 25,'white'),
      Icon.getImageSource(Platform.OS === 'android' ? "md-share" : "ios-share", 25,'white'),
     
    ]).then(sources => {
      
    Navigation.push(this.props.componentId, {
      component: {
        name: 'receiptManager.receiptDetail-screen',
        passProps: {
          receipt: {...receipt,
            isLatestReceipt:false,
            isReceiptFolder:false
          }
          
        },
        options: {
          statusBar: {
          //  visible: false,
            backgroundColor:colors.primary,
            drawBehind: false,
                        style:  'light',
                        visible: true,
          },
          topBar: {
           // hideOnScroll: true,
            backButton: {
              title:'',
              color: colors.buttonEnabledColor, // For back button text
            },
            buttonColor: colors.buttonEnabledColor,
        background:{
          color: colors.primary,
         // translucent: true,
        },
            title: {
              text: receipt.title,
              color: colors.primaryTextColor,
            },
            rightButtons:[
              {
                id: 'edit',
               
                icon: sources[0],
                color: colors.buttonEnabledColor, 
             },
             {
              id: 'share',
              icon: sources[2],
              color: colors.buttonEnabledColor, 
           },
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
    

    signOut=async ()=>{
        Auth.signOut()
        .then(() => {
        this.props.onStateChange('signedOut', null);
        })
        .catch(err => {
        console.log('err: ', err)
        })
      }

      componentWillReceiveProps(nextProps) {
        if(this.props.receipts!==undefined && this.props.receipts.length!==nextProps.receipts.length){
         //Handle cancel of deletes
         this.handleCancelSelection();
        }
        this.updateCheckedState(nextProps.receipts)
       }
      updateCheckedState=(receipts)=>{
        const initialCheck=receipts.map(()=>false);
        this.setState({isChecked : initialCheck})
      }
      

// componentWillReceiveProps(nextProps) {
//     const initialCheck = this.nextProps.receipts.map(() => false);
//     this.setState({isChecked : initialCheck})

// }
errorHandler=(error)=>{
  console.log('push notification error');
  alert(error);
}

componentDidDisappear(){
  this.setState({didScreenAppear:false});
}
async componentDidAppear(){
  try {
  const user=await Auth.currentAuthenticatedUser();
  if(user){
    this.setState({didScreenAppear:true});
    if(this.props.receipts===undefined ||this.props.receipts===null ||this.props.receipts.length===0){
      this.props.onMyReceipts();
     // this.props.fetchCategories();
    }
   
  }else {
    //this.props.onStateChange('signedOut', null);
  }
  }
  catch(err)  {
    console.log('err: ', err);
   // this.props.onStateChange('signedOut', null);
    }


}
componentDidMount(){
    //FETCH MY RECEIPTS FROM DATABASE AND GET IT FROM REDUX
   

   
    this.props.resetUIState();
    this.props.onMyReceipts();
    this.props.fetchCategories();
}
navigationButtonPressed({ buttonId }) {
      
  if(buttonId==='delete'){
    this.deleteSeletedReceipts();
  }
  else if(buttonId==='cancel'){
    this.updateCheckedState(this.props.receipts);
    this.setState({swipedReceipt:null,
    showPicker:false
    });
    
    this.handleCancelSelection();
  }
  else if(buttonId==='categorize'){
    this.categorizeReceipts();
  }
  else if(buttonId==='categorized'){
    this.handleCateogrizationComplete()
  }
  
  
}
handleCancelSelection=()=>{
  this.setState({canShowCheckbox:false});
  Navigation.mergeOptions(this.props.componentId, {
    topBar: {
      title:{
        text:'ReceiptBox'
      },
      rightButtons: [
        
      ],
      leftButtons:[]
    }
  });
}

showTopBarButtons=(buttonFunction )=>{
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? "md-trash" : "ios-trash", 25),
    Icon.getImageSource(Platform.OS === 'android' ? "md-close" : "ios-close", 25),
  ]).then(sources => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: '',
          
        },
       
        buttonColor: colors.buttonEnabledColor,
        rightButtons: Platform.OS==='android'?this.getRightButtonsForAndroid(buttonFunction(sources)):buttonFunction(sources),
        leftButtons:  Platform.OS==='android'?this.getLeftButtonsForAndroid(buttonFunction(sources)):[]
      }
    });
  
});
}

getLeftButtonsForAndroid=(buttons)=>{
  const rightButtons=buttons.filter(button=>{
    return (button.buttonAlign==='left')
  })

return rightButtons;
}
getRightButtonsForAndroid=(buttons)=>{
  const rightButtons=buttons.filter(button=>{
    return (button.buttonAlign!=='left')
  });
  return rightButtons;
}
addLongPressButtons=()=>{

  this.showTopBarButtons(this.getLongScreenButtons);

}
onRefresh=()=>{
  this.setState({refreshing:true});
  this.props.onMyReceipts();
}
handleLongPress=(index)=>{
  //Select current item
 
  const newArray=[...this.state.isChecked.slice(0, index),!this.state.isChecked[index],...this.state.isChecked.slice( index+1)];
  
  this.setState({canShowCheckbox:true,
    isChecked:newArray});
   this.addLongPressButtons();
}
addReceiptFromCamera=()=>{
  const options = {
    title: 'Take Receipt picture',
    customButtons: [{ name: 'fb', title: 'Take picture of Receipt from Camera' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  //Image gallery to open a camera
  ImagePicker.launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
      this.props.openModal();
      showAddReceiptFromCamera(response,this.props.categories );
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  
     
    }
  });
  
}
updateCategory=(category)=>{
this.setState({pickerCategory:category});
}

handleCategorySelAndroid=(category)=>{
  this.updateCategory(category);
  if('Cancel'!==category){
  this.handleCateogrizationComplete(category);
  }else {
    this.setState({showPicker:false});
  }
}
/* GET PICKER OF CATEGORIES */
_getPicker=()=>{
 if(Platform.OS==='ios'){
  const categories=this.props.categories.map((category,index)=>{
    return (<Picker.Item key={index} label={category.category} value={category.category} />)
   });
  
return this.state.showPicker?
 (  <View
    style={{ bottom:0,right:0, position:'absolute',height: 200, width:width,zIndex:999,backgroundColor:'#fff' }}
      >
     <Picker
     style={{justifyContent:"center"}}
     mode='dropdown'
selectedValue={this.state.pickerCategory}

onValueChange={(itemValue, itemIndex) => this.updateCategory( itemValue)}>
{
categories
}

</Picker>
</View>):null;
 }
  else if(Platform.OS==='android'){
    const catLabels=this.props.categories.map(category=>{
      return category.category
    })
   let categories=[...catLabels,'Cancel'];

   return ( <AndroidPicker
    items={categories}
    showPicker={this.state.showPicker}
    onSelect={this.handleCategorySelAndroid}
    onClose={()=>{
      
      this.setState({showPicker:false})}}
  /> );

  }

}
selectCategoryFromPopUp=(category)=>{
  if("Cancel"!==category){
  this.updateCategory(category);
  }
  this.setState({showPicker:false});

}
onError =()=> {
  console.log('Popup Error')
}
onPopUpPress=(eventName, index) => {
  console.log(eventName);
  console.log(index);
}

/* Handles the completion of categorization of receipts */
handleCateogrizationComplete=(category)=>{
  this.setState({showPicker:false});


  let categorizableReceipts=[];
  this.props.receipts.map((receipt,index)=>{
    if(this.state.isChecked[index]){
      categorizableReceipts.push(receipt);
    }
  
  });
  console.log(categorizableReceipts);
  if(categorizableReceipts.length==0){
    //VERIFY ITS FROM SWIPE
    this.state.swipedReceipt!==null && this.state.swipedReceipt!==undefined ?categorizableReceipts.push({...this.state.swipedReceipt}):null;


  }
  if(categorizableReceipts.length>0){

    this.props.categorizeReceipts(categorizableReceipts,category!==undefined?category:this.state.pickerCategory);
  }
  this.setState({swipedReceipt:null});
  this.updateCheckedState(this.props.receipts);
  this.handleCancelSelection();
}

/* Categorize the selected reports */
categorizeReceipts=()=>{
  this.setState({pickerCategory:CATEGORIES[0],
    showPicker:true
  });
// CHANGE LEFT BUTTONS TO SHOW SELECT OPTION
Platform.OS==='ios'?
this.showTopBarButtons(this.getCategorizeButtons):null;

  

}
/* Deletes the selected receipts */
deleteSeletedReceipts =(swipedReceipt)=>{
  let deletableReceipts=[];
this.props.receipts.map((receipt,index)=>{
  if(this.state.isChecked[index]){
    deletableReceipts.push(receipt);
  }

});
console.log(deletableReceipts);
if(deletableReceipts.length==0){
  //VERIFY ITS FROM SWIPE
  swipedReceipt!==null && swipedReceipt!==undefined ?deletableReceipts.push({...swipedReceipt}):null;


}
if(deletableReceipts.length>0){
  this.props.deleteReceipts(deletableReceipts);
}
this.setState({swipedReceipt:null});
}
onToggleCheckBox=(index)=>{
  
  const newArray=[...this.state.isChecked.slice(0, index),!this.state.isChecked[index],...this.state.isChecked.slice( index+1)];
   
  if(!newArray.includes(true)){
    this.handleCancelSelection();
  }
 this.setState({isChecked:newArray});
 //this.setState({isChecked:null});
 }

 loadNotificationScreen=()=>{
  Navigation.mergeOptions('tabs', {
    bottomTabs: {
      currentTabIndex: 1
    }
  });

  this.props.resetNotificationData();
 }

 onSelectCategory=(category)=>{
   //STORE SELECTED CATEGORY AND FETCH RECORDS MATCHING
  const receiptCategories=this.props.userFilteredCategories.concat(category);
  this.props.onMyReceipts(receiptCategories);
 }
 onRemoveCategory=(category)=>{
   //STORE SELECTED CATEGORY AND FETCH RECORDS MATCHING
   console.log(category);
  const receiptCategories=this.props.userFilteredCategories.filter(eachCategory=>{
    return eachCategory.category!==category.category
  });

  this.props.onMyReceipts(receiptCategories);
 }
_getHeaderComponent=()=>
{
  const { clampedScroll } = this.state;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });

    const navbarOpacityTranslate = this.state.navBarHeightChangeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1,1],
    
    });

    const advSearchTranslate = clampedScroll.interpolate({
        inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [0, -(this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
        extrapolate: 'clamp',
      });
      const advSearchOpacity = clampedScroll.interpolate({
        inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const spinAnimation= this.state.searchIconRotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

  return (<Animated.View style={[styles.navbar,{ transform: [{ translateY: navbarTranslate }] }]}>
        
  <Animated.View style={[styles.searchContainer, { opacity: navbarOpacity }]}>
  <Animated.View style={[
      styles.arrowMinimizeContainer, 
      {transform: [{rotate: spinAnimation},{perspective:1000}]}
    ]}>
      <TouchableOpacity onPress={() => {
      //  animation.minimizeBar();
       this.toggleAdvanceSearch()
      //  this.blurInputs();
      }}>
        { <Icon
        
          name= {this.state.isAdvSearchOpened? (Platform.OS === 'android' ? 'md-arrow-up' : 'ios-arrow-up'):Platform.OS === 'android' ? 'md-arrow-down' : 'ios-arrow-down' }
          size={25} 
          style={styles.arrowMinimizeIcon} 
          color='#A9A9A9'
        /> }
      </TouchableOpacity>
    </Animated.View>

  <View style={styles.searchInput}>
     
         <Icon
          name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
          size={25} 
          style={styles.searchIcon} 
          color='#bbb'
        /> 
        <TextInput 
          style={styles.inputText}
          placeholder={'Search by tags...'}
          placeholderTextColor={'#999'}
          underlineColorAndroid={'#fff'}
          autoCorrect={false}
          onFocus={() => {
            //animation.expandBar();
            this.props.changeInputFocus('search');
          }}
          ref={(inputSearch) => {
            this.inputSearch = inputSearch;
          }}
        />
      </View>
  </Animated.View>
 {this._getAdvanceSearchComponent(advSearchTranslate,advSearchOpacity)}

</Animated.View>)};

_keyExtractor = (item, index) => index.toString();//item.receiptId;

  render() {
    
   
    if(this.props.isReceiptDeleted){
     // this.updateCheckedState(this.props.receipts);
      if(this.state.didScreenAppear){this.props.resetUIState();
      }
      

  }

  

  if(this.props.notification!==null &&  this.props.notification!==undefined){
    
    this.loadNotificationScreen();
  }
    
    
    return (
      
      <View style={styles.fill}>

     {Platform.OS==='ios'?<StatusBar barStyle="light-content" />:null}

       {/* <Button title="sign out" onPress={this.signOut}/> */}
      <Animated.View style={styles.receiptList} >
      <CategoryListing
      categories={this.props.categories}
      onAddNewCategory={(category)=>this.props.onAddNewCategory(category)}
      userFilteredCategories={this.props.userFilteredCategories}
      onSelectCategory={this.onSelectCategory}
      onRemoveCategory={this.onRemoveCategory}
      />
        <AnimatedListView
         data={this.props.receipts}
         extraData={this.state.isChecked}
         keyExtractor={this._keyExtractor}
         
         refreshControl={<RefreshControl
          progressBackgroundColor={colors.primary}
          tintColor={colors.primary}
         refreshing={this.state.isFetching}
         onRefresh={this.onRefresh}
       />}

        
         extraData={this.state}
        // ListHeaderComponent={this._getHeaderComponent}
         renderItem={(info) =>{
          const swipeoutBtns = [
            {
              text: 'Categorize',
              backgroundColor:colors.primary,
              onPress: () => {
                this.setState({swipedReceipt:info.item})
                this.categorizeReceipts();
           // console.log(info.item)
            }
            },
            {
                text: 'Delete',
                backgroundColor:colors.accentColor,
                onPress: () => {
                  this.setState({swipedReceipt:info.item})
                  this.deleteSeletedReceipts(info.item);
              }
              },
              
          ];

          return (
          <ReceiptItem
          receiptItem={info.item}
          categories={this.props.categories}
          swipeoutBtns={swipeoutBtns}
          canShowCheckbox={this.state.canShowCheckbox}
          isChecked={this.state.isChecked[info.index]}
          canMultiSelect={this.state.canMultiSelect}
          onToggleCheckBox={()=>this.onToggleCheckBox(info.index)}
          receiptImage={info.item.image}
         
          onLongPress={()=>this.handleLongPress(info.index)}
          onItemPressed={() => this.onItemSelected(info.item)}
        />
         )}
          }
          scrollEventThrottle={1}
         
          
          onScrollEndDrag={this._onScrollEndDrag}
          onScroll={
             
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                { useNativeDriver: true },
              //  { listener: this._handleListViewScroll },
              )
          
        }
        />
        </Animated.View>
        <ActionButton 
        offsetY={20}
        offsetX={20}
        style={styles.actionButton} buttonColor={colors.primary}>
          <ActionButton.Item buttonColor={colors.primary} title="Take Picture" onPress={() => {
           // this.props.openModal();
            this.addReceiptFromCamera();
          
          }}>
            <Icon    name={Platform.OS === 'android' ? 'md-camera' : 'ios-camera'} style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={colors.primary} title="Upload from Gallery" onPress={() => {
            this.props.openModal();
            showAddReceipt(undefined,false,this.props.categories);
          
          }}>
            <MaterialIcon name="file-upload" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          {/* <ActionButton.Item buttonColor='#1abc9c' title="Delete Receipts" onPress={this.deleteSeletedReceipts}>
            <Icon name="md-trash" style={styles.actionButtonIcon} />
          </ActionButton.Item> */}
        </ActionButton>
        { this.state.showPicker? this._getPicker():null}
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
      receipts: state.receipts.myReceipts,
      categories:state.categories.categories,
      userFilteredCategories:state.categories.userFilteredCategories,
      isReceiptDeleted:state.ui.isReceiptDeleted,
      notification:state.ui.notification,
      isLoading:state.ui.isLoading
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      resetUIState:()=>dispatch(resetUIState()),
      categorizeReceipts:(receipts,category)=>dispatch(categorizeReceipts(receipts,category)),
      resetReceiptDetail:()=>dispatch(resetReceiptDetail()),
      onMyReceipts: (receiptCategories) => dispatch(fetchMyReceipts(receiptCategories)),
      deleteReceipts:(receipts)=>dispatch(deleteReceipts(receipts,false)),
      openModal:()=>  dispatch(modalOpen()),
      resetNotificationData:()=>dispatch(resetNotificationData()),
      fetchCategories:()=>dispatch(fetchCategories()),
      onAddNewCategory:(category)=>dispatch(addNewCategory(category))
    };
  };


  const styles = StyleSheet.create({
    fill: {
      flex: 1,
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
    actionButton:{
      shadowOffset: {
        width: 5,
        height: 5
    },
    shadowColor: "#d3d3d3",
    shadowOpacity: .1,
    shadowRadius: 50,
    },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
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

export default connect(mapStateToProps, mapDispatchToProps)(MyReceipts)
