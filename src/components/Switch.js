import React from 'react';
import {View,Switch,StyleSheet,Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {colors} from '../Utils/theme';
const switchComponent=(props)=>{
    return (
        <View style = {
            styles.container
        }>
        <ListItem 
        containerStyle={styles.listItemContainer}
        title = {<View style={styles.switchContainer}>
        
        <Text style={styles.textStyle}>{props.label}</Text>
      
        <Switch
        
        style={styles.switchStyle}
        trackColor={{true: colors.accentColor}}
        value={props.value}
        onValueChange={props.onValueChange}
        />
      </View>}
        bottomDivider >
       
        </ListItem> 
        </View>
    )
  }
  const styles=StyleSheet.create({
      container:{
        //flex: 1,

      //  backgroundColor: '#efefef'
      },
      textStyle:{
          fontSize:colors.textFontSize,
          
      },
      listItemContainer:{
       // marginBottom: 5,
      },
    switchContainer:{
      flexDirection:'row',
      justifyContent:"space-between"
      },
      switchStyle:{
          marginLeft:5,
          height:24
      }
  });

  export default switchComponent;


