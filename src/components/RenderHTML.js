import React from "react";
import { Image,WebView,View,Text, StyleSheet, Dimensions} from "react-native";
import HTML from 'react-native-render-html';
const { width, height } = Dimensions.get('window');
import { colors } from '../Utils/theme';
import mime from 'mime-types';
const renderHTML=(props)=>{
  
  
   const extension = mime.extension(props.contentType);
   
   switch(extension){
     
       case 'jpeg':
       case 'png':
       case 'JPG':
       case 'jpg':
       case 'JPEG':
       case 'bmp':
       case 'gif':
       <Image
                    style={styles.addImageContainer}
                    source={{ uri: props.source }}
   />

       break;

       default:(<WebView style={styles.viwerStyle}
        
        source={{uri:props.source}}
       
      /> );
       break;
   }

   return (
    props.source?
    <View style={styles.container}>
       <WebView style={styles.viwerStyle}
        
        source={{uri:props.source}}
       
      /> 
      {/* <Text>Hellow world</Text> */}
      </View> :null
   

   );

;
    }
const styles = StyleSheet.create({
    addImageContainer: {
       // width: width,
        margin:15,
       // marginTop:5,
        height: 0.5*height,
       // backgroundColor: colors.lightGray,
        //borderColor: colors.mediumGray,
       // borderWidth: 1.5,
       
       // borderRadius: 60,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
      
       // alignItems: 'left',
      
       width:Dimensions.get('window').width,
       padding:0,
       height:.8*height
    },
    viwerStyle:{
        //width:'100%',
        flex: 1,
       // height:height,
        
    }
});

export default renderHTML;