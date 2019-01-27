import React,{Component} from 'React';
import {Text, View,TouchableNativeFeedback,StyleSheet} from 'react-native';
import {colors} from '../Utils/theme';
const pickerItem=(props)=>{

    return(
        <View>
<TouchableNativeFeedback  onPress={()=>props.onSelect(props.item)}>
    <Text style={styles.pickerItem}>{props.item}</Text>
    </TouchableNativeFeedback>
    </View>
    )
    
}

export const styles=StyleSheet.create({
    pickerItem:{
        padding:12,
        color:"#000",
        fontSize:colors.textFontSize
    }
})
export default pickerItem;
