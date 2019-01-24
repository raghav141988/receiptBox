import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback,Dimensions, Image  } from "react-native";

const { width, height } = Dimensions.get('window');
const uploadPhotoItem = props =>{ 
   

    
    return (
       
   
       
        <TouchableWithoutFeedback
       
        onPress={props.updateSelectedImage}
      >
        <Image
          source={{ uri: props.item.node.image.uri }}
          style={{ width: width / 2, height: width / 2, opacity: props.item.selectedImageIndex === props.index ? 0.7 : 1 }}
        />
      </TouchableWithoutFeedback>

      
       
     
      
     
   
   
  
);

}

const styles = StyleSheet.create({

    cardContainer:{
margin:0,
padding:0,
paddingTop:5

    },
    checkBoxContainer:{
borderWidth:0,
backgroundColor:'#fff',

width:40,

    },
    wrapper:{
      
       // paddingLeft:5,
       margin:0,
       
    },
    container:{
    flexDirection:"row",
    padding:0,
    margin:0,
    flex:1
    },
    cardContent:{
    paddingLeft:10,
flex:1,
flexDirection:"column"
    },
    dateCategoryStyle:{
        //width:width,
        paddingTop:10,
        flexDirection:"row",
 justifyContent:"space-between"
    },
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    height:100,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },
  imageAndText: {
   
    width:"100%",
    flexDirection: "row",
    
   // alignItems: "center"
  },
  checkBoxStyle:{
    height: 25,  
             // changes the hitspace but not the checkbox itself
    width: 25,
    borderWidth: 1, 
    borderRadius:20,        // does nothing
     // makes the area around and inside the checkbox red
    borderColor: '#03A9F4',   // does nothing
    
  },
  receiptImage: {
      marginRight: 8,
      height: 30,
      width: 30
  }
});

export default uploadPhotoItem;
