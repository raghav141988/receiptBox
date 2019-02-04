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
import {getAvatarByCategory} from '../Utils/avatarPrefix';
import Swipeout from 'react-native-swipeout';
import Moment from 'react-moment';
const receiptItem = props =>{ 

 const avatarDetails =getAvatarByCategory(props.receiptItem.category,props.categories);

    return (

        <Swipeout 
        autoClose
       
        right={props.swipeoutBtns}>
        <ListItem
        containerStyle={{padding:5, paddingLeft:10,paddingRight:10}}
          
          leftAvatar={(<Avatar
  size="medium"
  overlayContainerStyle={{backgroundColor:avatarDetails.color}}
  title={avatarDetails.text}
  placeholderStyle={{backgroundColor:avatarDetails.color}}
  avatarStyle={{opacity:0.7}}
  rounded
 // onPress={() => console.log("Works!")}
 
/>)
        }

         leftElement={
            props.canShowCheckbox?
                  (<CheckBox size={25} wrapperStyle={styles.wrapper} containerStyle={styles.checkBoxContainer}
                            checkedColor={colors.accentColor}
                  checked={props.isChecked}
                  onPress={()=>props.onToggleCheckBox()}
                />)
                    :null
        }
         title={
             <ListItem titleStyle={styles.receiptTextStyle}
             bottomDivider
             chevron
             containerStyle={{padding:2}}
             
             onLongPress={props.onLongPress}
             
            
             onPress={props.onItemPressed}
             title={
                 (<MainText style={{margin:10}}>
                <HeadingText>{props.receiptItem.title}</HeadingText>
             </MainText>)
                }
             subtitle={(<View style={styles.dateCategoryStyle}>
                 
                 <MainText>
                   <HeadingText style={{ fontSize: 14, color:'#717171'}}>{props.receiptItem.category}</HeadingText>
                 </MainText>
                
               
                 <MainText >
                   <ItalicHeadingText style={{ fontSize: 12, color:'#717171'}} >
                   <Moment format="DD-MMM-YYYY" element={Text} >{props.receiptItem.createdDate}</Moment>
                   </ItalicHeadingText>
                 </MainText>
                
                
                 </View>)}
             //leftAvatar={{ source: { uri: item.avatar_url } }}
           />
         }

        />
        </Swipeout>

    )



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
