import React from "react";
import { View, Text, StyleSheet,Platform, TouchableOpacity,Dimensions, Image  } from "react-native";
import { Card,ListItem ,Avatar} from 'react-native-elements';
import ReceiptImage from './ReceiptImage';
import HeadingText from './HeadingText';
import MainText from './MainText';
import { CheckBox } from 'react-native-elements'
import {colors} from '../Utils/theme';
import ItalicHeadingText from './ItalicHeading';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {getAvatarPrefix} from '../Utils/avatarPrefix';

import Moment from 'react-moment';
const receiptItem = props =>{ 
 const avatarDetails =getAvatarPrefix(props.receiptItem.category);

    return (
        <ListItem titleStyle={styles.receiptTextStyle}
        bottomDivider
        leftAvatar={(<Avatar
  size="medium"
  title={avatarDetails.text}
  placeholderStyle={{backgroundColor:avatarDetails.color}}
  
  rounded
 // onPress={() => console.log("Works!")}
  activeOpacity={0.7}
/>)
        }
        onLongPress={props.onLongPress}
        
        leftElement={
            props.canShowCheckbox?
                  (<CheckBox size={25} wrapperStyle={styles.wrapper} containerStyle={styles.checkBoxContainer}
                            checkedColor={colors.accentColor}
                  checked={props.isChecked}
                  onPress={()=>props.onToggleCheckBox()}
                />)
                    :null
        }
        onPress={props.onItemPressed}
        title={
            (<MainText>
           <HeadingText>{props.receiptItem.title}</HeadingText>
        </MainText>)
           }
        subtitle={(<View style={styles.dateCategoryStyle}>
            
            <MainText>
              <HeadingText style={{ fontSize: 14, color:'#86939e'}}>{props.receiptItem.category}</HeadingText>
            </MainText>
           
          
            <MainText >
              <ItalicHeadingText style={{ fontSize: 12, color:'#86939e'}} >
              <Moment format="DD-MMM-YYYY" element={Text} >{props.receiptItem.createdDate}</Moment>
              </ItalicHeadingText>
            </MainText>
           
           
            </View>)}
        //leftAvatar={{ source: { uri: item.avatar_url } }}
      />

    )


//     return (
//         <Card wrapperStyle={{margin:0,padding:0}} containerStyle={styles.cardContainer} >
//         <View style={styles.container}>
//     {props.canShowCheckbox?
//   <CheckBox size={25} wrapperStyle={styles.wrapper} containerStyle={styles.checkBoxContainer}
//             checkedColor={colors.accentColor}
//   checked={props.isChecked}
//   onPress={()=>props.onToggleCheckBox()}
// />
//     :null}
       
//         <TouchableOpacity style={{flex:1}} 
//          onLongPress={props.onLongPress}
//         onPress={props.onItemPressed}>
       
       
//    {/* {checkbox} */}
//        <View style={styles.imageAndText}>
       
//       <ReceiptImage contentType={props.receiptItem.contentType} />
//       <View style={styles.cardContent}>

//        <View style={styles.dateCategoryStyle}>
//       <View style={{width:"90%"}}>
//       <MainText>
//           <HeadingText>{props.receiptItem.title}</HeadingText>
//         </MainText>
//         </View>
//         <View style={{width:"10%"}}>
//         <Icon name={Platform.OS === 'android' ? "md-arrow-forward" : "ios-arrow-forward"} size={20} color="#757575" />
//         </View>
//         </View>
       
        
//       </View>
//       </View>
    

//   </TouchableOpacity>
    
//   </View>
//   </Card> 
      
       
     
      
     
   
   
  
// );

}

const styles = StyleSheet.create({
    receiptTextStyle:{
        flexWrap: "wrap"
    },
    cardContainer: {
        paddingLeft:0,
        paddingRight: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 1,
        elevation: 4,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowColor: "#d3d3d3",
        shadowOpacity: .5,
        shadowRadius: 3,
        borderColor: '#fff',
        padding:8,
        margin:0
    },
    checkBoxContainer: {
        margin:0,
        padding:0,
        borderWidth: 0,
        backgroundColor: '#fff',

        width: 25,

    },
    wrapper: {

        // paddingLeft:5,
        margin: 0,

    },
    container: {
        flexDirection: "row",
        padding: 0,
        margin: 0,
       flex: 1
    },
    cardContent: {
        margin: 0,
        flex: 1,
        flexDirection: "column"
    },
    dateCategoryStyle: {
        //width:width,
       // paddingTop: 0,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    imageAndText: {

       
        flexDirection: "row",

        // alignItems: "center"
    },
    checkBoxStyle: {
        height: 25,
        // changes the hitspace but not the checkbox itself
        width: 25,
        borderWidth: 1,
        borderRadius: 20, // does nothing
        // makes the area around and inside the checkbox red
        borderColor: '#d3d3d3', // does nothing

    },
    receiptImage: {
        marginRight: 8,
        height: 30,
        width: 30
    }
});

export default receiptItem;
