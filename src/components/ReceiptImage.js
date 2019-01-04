import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image,CheckBox } from "react-native";
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import mime from 'mime-types';

const receiptImage = props =>{
    
   // const source=fetchImageSource();
   const extension = mime.extension(props.contentType);
   let iconSource="file-o";
   switch(extension){
      case 'pdf':
       iconSource='file-pdf-o';
       break;
       case 'jpeg':
       case 'png':
       case 'JPG':
       case 'jpg':
       case 'JPEG':
       case 'bmp':
       case 'gif':

       iconSource='file-image-o';
       break;
       case 'xl':
       case 'xls':
       case 'xlsx':
       iconSource='file-excel-o';
       break;
       case 'ppt':
       case 'pptx':
       iconSource='file-powerpoint-o';
       break;
       case 'doc':
       case 'docx':
       iconSource='file-word-o';
       break;
       case 'html':
       case 'txt':
       iconSource=' file-text-o';
       default:

       iconSource="file-o";
       
   }

    return (
        <View style={styles.container}>
        <Icon name={iconSource} size={40} color="#757575" />
        </View>
    ) 

    
     
    

   
}



const styles = StyleSheet.create({
  container:{
      width:70,
     
      alignItems:"center",
      height:70,
   //   borderColor:'#ddd',
   // borderWidth:1,
      padding:5
  }
});

export default receiptImage;
