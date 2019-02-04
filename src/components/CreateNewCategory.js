import React from "react";
import {View,StyleSheet,Dimensions} from 'react-native';
import { CheckBox } from "react-native-elements";
import {colors} from '../Utils/theme';
import ColorChooser from './colorChooser';
import {
    Text,
     Input,
     FormValidationMessage,
    
     Icon,
     ButtonGroup,
   } from 'react-native-elements';

   const { width, height } = Dimensions.get('window');

  
class CreateNewCategory extends React.Component{ 

    state={
        showAllCategories:false,
        isAddNew:false,
        color:colors.defaultAvatarColor,
        isColorChoosing:false,
        input: {
            category: '',
          
            
          },
        }
onChooseColor=()=>{
this.setState({isColorChoosing:true});

}
onCategoryColorSelect=(color)=>{
    console.log(color);
    
    this.setState({
        color:color,
        isColorChoosing:false})
}
cancel=()=>{
    this.setState({isColorChoosing:false}) 
}
updateInput = (key, value) => {
            this.setState((state) => ({
              input: {
                ...state.input,
                [key]: value,
              }
            }))
          }

          
    render(){
    return (
    <View>
          <Input
            containerStyle={{width:width}}
            inputStyle={{fontSize:17,width:"100%",
            borderBottomWidth:1,
            borderColor:colors.primary}}
            inputContainerStyle={{borderRadius:25,
            //margin:5,
           
  //padding:5,
            alignSelf:"center",
 // borderTopWidth:1,
  //borderLeftWidth:1,
  //borderRightWidth:1,
  borderColor:colors.primary}}
  value={this.state.input.title}
  placeholder="Type Category Name"
  autoCapitalize="none"
  autoCorrect={false}
  returnKeyType="next"
  
  onChangeText={(name) => this.updateInput('category', name)}
  
  leftIcon={
    <Icon
      name='title'
      style={{paddingRight:5}}
      size={24}
      color={colors.accentColor}
    />
  }
  rightIcon={
   <View style={{flexDirection:"row"}}>
   <Icon
    onPress={()=>this.onChooseColor()}
    name='palette'
    style={{paddingRight:5}}
    size={24}
    color={colors.accentColor}
  />

    <Icon
    onPress={()=>this.props.onAddCategory(this.state.input,this.state.color)}
    name='check'
    size={24}
    style={{paddingRight:5}}
    color={colors.accentColor}
  />
  <Icon
    onPress={()=>this.props.onCancel(this.state.input)}
    name='cancel'
    style={{paddingRight:5}}
    size={24}
    color={colors.darkGray}
  />
  
  </View>

  }
  
/>
<ColorChooser
  onCategoryColorSelect={this.onCategoryColorSelect}
  cancel={this.cancel}
  modalVisible={this.state.isColorChoosing}
  />
    </View>
);
 }
}

const styles = StyleSheet.create({
    checkBoxContainer:{
        borderWidth:0,
        backgroundColor:'#fff',
      
                  },
});

export default CreateNewCategory;
