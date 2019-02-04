import React from "react";
import {View,StyleSheet,Modal,Dimensions,FlatList} from 'react-native';
import { Button } from "react-native-elements";
import {categoryColors,colors} from '../Utils/theme';
import { Avatar} from 'react-native-elements';
import MainText from './MainText';
import HeadingText from './HeadingText';
const { width, height } = Dimensions.get('window');



export const _keyExtractor = (item, index) => index.toString();//item.receiptId;


const colorChooser = props => (
   
    <Modal transparent={true}
       visible={props.modalVisible}
       animationType="slide"
       onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
  <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          shadowColor: '#717171',
         // borderRadius:15,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,  
          elevation: 5,
          alignItems: 'center'}}>
    <View style={{
            //width: width-30,
            margin:15,
            height: 350,
            backgroundColor:'white'
            }}>
      <View style={styles.imageContainer}>
      <MainText>
          <HeadingText>
          Choose Color for the category
          </HeadingText>
      </MainText>
          <FlatList
           numColumns={3}
           horizontal={false}
          contentContainerStyle={styles.scrollViewContainer}
            data={categoryColors}
           
          
          
            keyExtractor={_keyExtractor}
            renderItem={(info) => (
                <Avatar
                overlayContainerStyle={{backgroundColor:info.item}}
                containerStyle={{margin:10}}
                size="medium"
                onPress={()=>props.onCategoryColorSelect(info.item)}
             
                placeholderStyle={{backgroundColor:info.item}}
                avatarStyle={{opacity:0.7}}
                rounded
              
              
              />
              )
            }
          />  
         
 <Button containerStyle={{margin:20}}
  title="Close"
  titleStyle={{color:colors.primary}}
  buttonStyle={{borderColor:colors.primary}}
  onPress={props.cancel}
  type="outline"
  
 // buttonStyle={{backgroundColor:colors.primary,color:colors.primary}}
/>
  
        </View> 
    </View>
  </View>
</Modal>

   

   
 
);

const styles = StyleSheet.create({
    imageContainer: {
        alignItems:"center",
        justifyContent:"center"
      },
    checkBoxContainer:{
        borderWidth:0,
        backgroundColor:'#fff',
      
                  },
                  scrollViewContainer: {
                    //flexDirection: 'row',
                    margin:10,
                  },
});

export default colorChooser;
