import React,{Component} from "react";
import { Image,View,Text, StyleSheet, Dimensions} from "react-native";

import { colors } from '../Utils/theme';
import {Avatar,ListItem} from 'react-native-elements';
import {getAvatarPrefix} from '../Utils/avatarPrefix';
class UserProfileComponent extends Component
{
    state={

    }
    render() {
        const avatarDetails =getAvatarPrefix("raghu141988");

      return (
        <View >
        <View style={styles.contatiner}>
        <View style={{alignItems:"center"}}>
          <Avatar
          //containerStyle={{alignItems:"center"}}
  size="xlarge"
  title={avatarDetails.text}
  placeholderStyle={{backgroundColor:avatarDetails.color}}
  
  rounded
 // onPress={() => console.log("Works!")}
  activeOpacity={0.7}
/>
<Text style={styles.userLabel} >raghu141988
</Text>
<Text style={styles.userLabel} >raghavendra.pes@gmail.com
</Text>
</View>

</View>

        </View>

      )
    }

}
const styles=StyleSheet.create({
    container:{
flex:1,
justifyContent:"center",
alignItems:"center"
    },
    userLabel:{
        fontSize:colors.textFontSize,
        padding:10,
        
        fontWeight:'bold'
    }
})
export default UserProfileComponent;