import React from 'react'
import {View,Text,Alert} from 'react-native';

const another=(props)=> {
    Alert.alert('test component is being called');
  return (
    <View>
      <Text>hello</Text>
    </View>
  )
}
export default another;
