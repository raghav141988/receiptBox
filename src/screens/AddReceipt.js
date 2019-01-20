/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import React from 'react';
import {
  View,
  
  CameraRoll,
  StyleSheet,
  Picker,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Image,
  ScrollView,
  ImageStore,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
 Text,
  Input,
  FormValidationMessage,
  Button,
  Icon,
  ButtonGroup,
} from 'react-native-elements';
import IonicanIcon from 'react-native-vector-icons/dist/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from "react-redux";
import uuid from 'react-native-uuid';
import mime from 'mime-types';
import {Navigation} from 'react-native-navigation';

import { colors } from '../Utils/theme';
import { API, Storage } from 'aws-amplify';
import files from '../Utils/files';
import UploadPhoto from '../components/UploadPhoto'
import {storeReceipt} from '../store/actions/receipts';
import {modalOpen} from '../store/actions/ui';
import RenderPDF from '../components/RenderPDF';
import RenderHTML from '../components/RenderHTML';
import {CATEGORIES} from '../Utils/avatarPrefix';
const { width, height } = Dimensions.get('window');

let styles = {};

class AddReceipt extends React.Component {
 
  


  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
   showPicker:false,
    modalVisible: false,
    isPicSelInProgress:false,
   
    input: {
      title: '',
      category: '',
      
    },
    
  }
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
   
  }
  navigationButtonPressed({ buttonId }) {
      
    if(buttonId==='cancel'){
    Navigation.dismissModal(this.props.componentId);
    }else if(buttonId==='save'){
     this.props.isEdit?this.EditReceipt(): this.AddReceipt();
    }
    
  }

  updateSelectedImage = (selectedImage, selectedImageIndex) => {

    if (selectedImageIndex === this.state.selectedImageIndex) {
      this.setState({
        selectedImageIndex: null,
        selectedImage: {},
        isPicSelInProgress:false
      })
    } else {
      this.setState({
        selectedImageIndex,
        selectedImage,
        isPicSelInProgress:false
      });
    }
  }

  updateInput = (key, value) => {
    this.setState((state) => ({
      input: {
        ...state.input,
        [key]: value,
      }
    }))
  }

  getPhotos = () => {
    CameraRoll
      .getPhotos({
        first: 20,
      })
      .then(res => {
        this.setState({ images: res.edges,
            isPicSelInProgress:true,
            pageInfo:res.page_info
          
         });
      
       

       // this.props.navigation.navigate('UploadPhoto', { data: this.state, updateSelectedImage: this.updateSelectedImage })
      })
      .catch(err => console.log('error getting photos...:', err))
  }

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }))
  }

  readImage(imageNode = null) {
    
    if (imageNode === null) {
      return Promise.resolve();
    }

    const { image } = imageNode;
    const result = {};

    if (Platform.OS === 'ios') {
      result.type = mime.lookup(image.filename);
    } else {
      result.type = imageNode.type;
    }
   const contentType= mime.contentType(image.filename);

    const extension = mime.extension(result.type);
    const imagePath = image.uri;
    const picName = this.props.isEdit?this.props.receipt.receiptKey:`${uuid.v1()}.${extension}`;
    const createdDate = this.props.isEdit?this.props.receipt.createdDate:null;
    const key = `${picName}`;
    const receipt={
        fileName:key,
        receiptKey:key,
        filePath:imagePath,
        title:this.state.input.title,
        category:this.state.input.category,
        createdDate:createdDate,
        contentType:contentType
    }
   /* return files.readFile(imagePath)
      .then(buffer => Storage.put(key, buffer, { level: 'private', contentType: result.type }))
      .then(fileInfo => ({ key: fileInfo.key }))
      .then(x => console.log('SAVED', x) || x);
      */
    return Promise.resolve(receipt);
  }

  AddReceipt = async () => {
    const receiptInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;

    //this.setState({ showActivityIndicator: true });
    if(!this.props.cameraPicUri){
    this.readImage(imageNode).then((receipt)=>{
       
        this.props.onAddReceipt(receipt);
    });
  }
  else {
    //ITS FROM CAMERA SO SET THE PATH DETAILS AND UPLOAD

    const contentType= 'image/jpeg';

    const extension = 'jpg';
    const imagePath = this.props.cameraPicUri;
    const picName = `${uuid.v1()}.${extension}`;

    const key = `${picName}`;
    const receipt={
        fileName:key,
        receiptKey:key,
        imageData:this.props.camData,
        filePath:imagePath,
        title:this.state.input.title,
        category:this.state.input.category,
        
        contentType:contentType
    }

    this.props.onAddReceipt(receipt);

  }
      
     
  }

  EditReceipt= async () => {
    console.log('Edit called');
        const receiptInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;

    //this.setState({ showActivityIndicator: true });
 
    this.readImage(imageNode).then((receipt)=>{
        let newReceipt=receipt;
        if((newReceipt===null||newReceipt===undefined) && this.props.isEdit){
            newReceipt={
               
                  
                    title:this.state.input.title,
                    category:this.state.input.category,
                    createdDate:this.props.receipt.createdDate,
                    contentType:this.props.receipt.contentType,
                    receiptKey:this.props.receipt.receiptKey,
                    isLatestReceipt:this.props.receipt.isLatestReceipt
                
           }
       }


        this.props.onAddReceipt(newReceipt);
    });
      
      
     
  }
  /* Fetch more photos from the camera roll */
  fetchMorePhotos=()=>{
    if(this.state.pageInfo && this.state.pageInfo.has_next_page){
    CameraRoll
    .getPhotos({
      first: 20,
      after:this.state.pageInfo.end_cursor
    })
    .then(res => {
      this.setState((prevState)=>{return { images: prevState.images.concat(res.edges),
          isPicSelInProgress:true,
          pageInfo:res.page_info
       }});
    
     

     // this.props.navigation.navigate('UploadPhoto', { data: this.state, updateSelectedImage: this.updateSelectedImage })
    })
    .catch(err => console.log('error getting photos...:', err))
  }
  }

  async apiSavePet(pet) {
    return await API.post('Pets', '/items/pets', { body: pet });
  }

  
  componentDidAppear() {
   console.log('component appeared in add receipt');
   
    if(this.props.receipt!==undefined){
       
      this.setState({
        input: {
            title: this.props.receipt.title,
            category: this.props.receipt.category,
            
          },
        //   selectedImageIndex:1,
        //   selectedImage:this.props.receipt.uri
          
      })
    }
  }

  _getPicker=()=>{
    const categories=CATEGORIES.map(category=>{
      return (<Picker.Item label={category} value={category} />)
     });
return this.state.showPicker?
   (  <View
      style={{ bottom:0,right:0, position:'absolute',height: 200, width:width,zIndex:999,backgroundColor:"#efefef" }}
        >
       <Picker
      
       mode='dropdown'
selectedValue={this.state.input.category}

onValueChange={(itemValue, itemIndex) => this.updateInput('category', itemValue)}>
{
  categories
}

</Picker>
</View>):null;

  }

  handleCategorySelection=()=>{
    this.setState(prevState=>{
      return {
        showPicker:!prevState.showPicker

      }
    })
  }
  render() {
    const { selectedImageIndex, selectedImage } = this.state;

    const editedImage=(<Image
        style={styles.addImageContainer}
        source={{ uri: selectedImage.node?selectedImage.node.image.uri:null }}
      />);
      
    const receiptContent=this.props.isEdit?( this.props.receipt.contentType.toString().toUpperCase().includes('PDF')?
    <View ><RenderPDF source={this.props.receipt.uri}/></View>:
    <View ><RenderHTML contentType={this.props.receipt.contentType.toString()} source={this.props.receipt.uri}/></View>):null;

   

    const content= (selectedImageIndex!==null && selectedImageIndex!==undefined) ?editedImage:
    (this.props.receipt!==null?receiptContent:null);
    
   
    //IF ADD RECEIPT IS FROM CAMERA, 
  const camContent =this.props.cameraPicUri?(
  <Image
    style={styles.addImageContainer}
    source={{ uri: this.props.cameraPicUri }}
  />):null

if(this.props.isModalClosed){
       Navigation.dismissModal(this.props.componentId);
 }
return (
  this.state.isPicSelInProgress===false?
    (<View style={{ flex: 1, paddingBottom: 0 }}>
      <ScrollView 
        contentContainerStyle={{flex: 1}}
        style={{ flex: 1 }}>
           <Input
            containerStyle={{width:width}}
            inputStyle={{fontSize:17,width:"100%"}}
            inputContainerStyle={{borderRadius:25,
            margin:5,
            fontSize:17,
  //padding:5,
            alignSelf:"center",
 // borderTopWidth:1,
  //borderLeftWidth:1,
  //borderRightWidth:1,
  borderColor:colors.primary}}
  value={this.state.input.title}
  placeholder="Please enter receipt's title"
  autoCapitalize="none"
  autoCorrect={false}
  returnKeyType="next"
  
  onChangeText={(name) => this.updateInput('title', name)}
  leftIcon={
    <Icon
      name='title'
      size={24}
      color={colors.accentColor}
    />
  }
  
/>

<View 
style={{width:width}}
>

< TouchableOpacity
style = {
  {
    flexDirection: "row",
    alignContent: "center",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    
    padding: 5,
    borderBottomWidth: 1,
    //borderLeftWidth:1,
    //borderRightWidth:1,
    borderColor: colors.accentColor,
    justifyContent: "space-between",
    alignItems: "center"
  }
}
onPress = {
    this.handleCategorySelection
  } >
<View style={{flexDirection:"row"}}>
<View style={{marginRight:5}}>
<Icon 
  color={colors.accentColor}
  name="group-work" size={24}/>
</View>
 <Text style={styles.labelStyle}>{this.state.input.category?this.state.input.category:'Select Category'}</Text>
 </View>
 <View style={{flexDirection:"row"}}>

 <Icon
  color={colors.accentColor}
  name="arrow-drop-down" size={30}/>
{
  this.state.showPicker?(
    <View style={{marginLeft:5}}>
  <Icon
    onPress={()=>this.setState({showPicker:false})}
    color={colors.accentColor}
    name="check" size={24}/>
    </View>
    ):null
  
}

</View>
</TouchableOpacity>
</View>
      {   
       this._getPicker() 
      }
         
          {
            !this.props.cameraPicUri?
          
            
                this.props.receipt==null &&
              selectedImageIndex === null ? (
                //THIS IS WHERE ADD TOUCHABLE FEEDBACK
                <TouchableWithoutFeedback onPress={this.getPhotos} style={{flex:1}}>
                <View style={styles.addImageContainer}>
                  <Icon size={100} name='camera-roll' color={colors.grayIcon} />
                  <Text style={styles.addImageTitle}>Upload Photo</Text>
                </View>
                </TouchableWithoutFeedback>
              ) :
              <View style={{margin:15}}>
                <TouchableOpacity style={{alignItems:"flex-end"}}
                onPress={this.getPhotos}
                >
                <Icon name="insert-photo" size={30}
                color={colors.accentColor}>
                
                </Icon>
                </TouchableOpacity>
                
              <View style={styles.addImageContainer}>{content}</View> 
              </View>
:camContent
          }
    
        </ScrollView>
        <Modal
          visible={this.props.isLoading}
          onRequestClose={() => null}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
      </View>)
    :
    <UploadPhoto fetchMorePhotos={this.fetchMorePhotos} data={this.state} updateSelectedImage={ this.updateSelectedImage} />
    );
  }
}

styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8,
  },
  addImageContainer: {
    width: width,
    padding:5,
    marginTop:5,
    height: 0.80*height,
    backgroundColor: colors.lightGray,
    borderColor: colors.mediumGray,
    borderWidth: 1,
   
   // borderRadius: 60,
    alignSelf: 'center',
   justifyContent: 'center',
    alignItems: 'center',
  },
  addImageTitle: {
    color: colors.darkGray,
    marginTop: 3,
  },
  closeModal: {
    color: colors.darkGray,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  labelStyle:{
  fontSize:17,
  alignContent:"center"
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: colors.darkGray,
    fontSize: 17,
    marginBottom: 15,
  },
  input: {
    //fontFamily: 'lato',
  },
  activityIndicator: {
    backgroundColor: colors.mask,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

const mapStateToProps = state => {
    return {
        isModalClosed: state.ui.isModalClosed,
        isLoading:state.ui.isLoading
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
  
      onAddReceipt: (receipt) => dispatch(storeReceipt(receipt))
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(AddReceipt);
