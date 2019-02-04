import React from "react";
import {View,StyleSheet,Text,TouchableOpacity,Platform} from 'react-native';

import {colors} from '../Utils/theme';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const badge = props => (
    <TouchableOpacity 
            onPress={()=>props.onPress(props.item)}
                 style={{ 
                    
                flexDirection:"row",
                alignItems:"center",
                backgroundColor:props.backgroundColor,
                justifyContent:"space-between",
                borderRadius:25,
                margin:5
                }}
    
               >
                
                <Text style={{marginLeft:3, marginRight:3,color:props.textColor,padding:5}}>{props.title}</Text>
                 {props.icon?(<Icon size={14} style={{ paddingRight:5,color:props.iconColor?props.iconColor:'white'}}  name={Platform.OS === 'android' ? props.iconName :  props.iconName}  />):null}
               </TouchableOpacity>
);

const styles = StyleSheet.create({
    checkBoxContainer:{
        borderWidth:0,
        backgroundColor:'#fff',
      
                  },
});

export default badge;
