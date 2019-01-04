import React from "react";
import {View,StyleSheet} from 'react-native';
import { CheckBox } from "react-native-elements";
import {colors} from '../Utils/theme';

const checkBox = props => (
    <View>
    <CheckBox containerStyle={styles.checkBoxContainer}
        checkedColor={colors.accentColor}
      checked={props.checked}
      
      onPress={()=>props.toggle()}
    />
    </View>
);

const styles = StyleSheet.create({
    checkBoxContainer:{
        borderWidth:0,
        backgroundColor:'#fff',
      
                  },
});

export default checkBox;
