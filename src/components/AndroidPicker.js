import {TouchableWithoutFeedback,ScrollView,View,Dimensions,Modal,Text,StyleSheet} from 'react-native';
import React from 'react';
import PickerItem from './AndroidPickerItem';
const { width, height } = Dimensions.get('window');


//import {CATEGORIES} from '../Utils/avatarPrefix'
const androidPicker=props=>{

const pickerItems =props.items.map((item,index)=>{
    return (<PickerItem key={index}
        item={item}
        onSelect={props.onSelect}
        />
        )
});
 return (<Modal 
    transparent={true}
     visible={props.showPicker}
     onRequestClose={props.onClose}>
   <TouchableWithoutFeedback style={styles.container}
   onPress={props.onClose}
   >
   <View style={styles.backdrop}
      
       >
   <View style={styles.pickerContainer   }>
     <ScrollView style={styles.picker}
   contentContainerStyle={{padding:20}}
   >
   {pickerItems}
   </ScrollView>
   </View>
   </View>
   </TouchableWithoutFeedback>
   </Modal>)
 
}
const styles=StyleSheet.create({
container:{
    flex:1
},
backdrop:{
    flex: 1,

    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flexDirection: 'column',
   },
   pickerContainer:{
    
        
        width: width,
        zIndex:999,
        bottom:0,right:0, 
        position:'absolute',
       
        height: height/2},
picker:{
    backgroundColor:'#fff',
    elevation: 2  
   
        }
   
})
export default androidPicker;