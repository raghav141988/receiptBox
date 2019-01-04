import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Dimensions, Image  } from "react-native";
import { Card } from 'react-native-elements';
import ReceiptImage from './ReceiptImage';
import HeadingText from './HeadingText';
import MainText from './MainText';
import { CheckBox } from 'react-native-elements'
import {colors} from '../Utils/theme';
import ItalicHeadingText from './ItalicHeading';

import Moment from 'react-moment';
const receiptItem = props =>{ 
   
 //  console.log(props.currentIndex);
    
    return (
        <Card  containerStyle={styles.cardContainer} >
        <View style={styles.container}>
    {props.canShowCheckbox?
            <CheckBox size={25} wrapperStyle={styles.wrapper} containerStyle={styles.checkBoxContainer}
            checkedColor={colors.accentColor}
  checked={props.isChecked}
  onPress={()=>props.onToggleCheckBox()}
/>
    :null}
       
        <TouchableOpacity style={{flex:1}} 
         onLongPress={props.onLongPress}
        onPress={props.onItemPressed}>
       
       
   {/* {checkbox} */}
       <View style={styles.imageAndText}>
       
      <ReceiptImage contentType={props.receiptItem.contentType} />
      <View style={styles.cardContent}>
      <MainText>
          <HeadingText>{props.receiptItem.title}</HeadingText>
        </MainText>
        <View style={styles.dateCategoryStyle}>
        <View style={{width:"60%"}}>
        <MainText>
          <HeadingText style={{ fontSize: 15}}>{props.receiptItem.category}</HeadingText>
        </MainText>
        </View>
       <View style={{width:"40%"}}>
        <MainText >
          <ItalicHeadingText style={{ fontSize: 10}} >
          <Moment format="DD-MMM-YYYY" element={Text} >{props.receiptItem.createdDate}</Moment>
          </ItalicHeadingText>
        </MainText>
        
        </View>
        </View>
      </View>
      </View>
    

  </TouchableOpacity>
    
  </View>
  </Card> 
      
       
     
      
     
   
   
  
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

export default receiptItem;
