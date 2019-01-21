import React,{Component} from "react";
import { Image,View,Text, StyleSheet, Dimensions,Alert} from "react-native";
import {ListItem} from 'react-native-elements';
import {colors} from '../Utils/theme';

const AboutApp=(props)=>{
    return ( <View style={styles.contatiner}>
          
          <ListItem 
       onPress={()=>Alert.alert('Show terms of use')}
        title = "Terms of use"
        chevron
        bottomDivider >
       
        </ListItem> 
        <ListItem 
       chevron
       title = "Privacy policy"
       onPress={()=>Alert.alert('Show Privacy policy')}
       bottomDivider >
       
       </ListItem> 

            </View>)
}



const styles=StyleSheet.create({
    container:{
        
    }
})
export default AboutApp;