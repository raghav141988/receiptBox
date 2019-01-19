import React, { Component } from 'react'
import { connect } from "react-redux";
import {View,StyleSheet,Text,FlatList,Platform} from 'react-native';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import { List, ListItem,Button,ButtonGroup } from 'react-native-elements';
import {deleteNotification,moveNotification,fetchUserNotifications} from '../store/actions/notificationActions'
import { colors } from '../Utils/theme';

class Notification extends Component
{
  state = {
    selectedIndex: null
  }
  delete=(item)=>{
    this.props.deleteNotification(item);
}
 move=(item)=>{
    this.props.moveNotification(item);
}

  updateIndex= (selectedIndex,item) =>{
    console.log(item);
    this.setState({selectedIndex})
    if(selectedIndex==0){

      this.move(item);
    }else {
      this.delete(item);
    }
  }
  
 delete=(item)=>{
    this.props.deleteNotification(item);
}
 move=(item)=>{
    this.props.moveNotification(item);
}
 componentDidMount(){
    this.props.onMyNotifications();
  }
    renderRow= ({ item })=> {
      const buttons = ['Move', 'Delete']
  const { selectedIndex } = this.state

        return (
            <View>
            <ListItem containerStyle={{borderTopWidth:0}}
          hideChevron
          bottomDivider
            roundAvatar
            title={( <Text style={{flex: 1, flexWrap: 'wrap'}}>{item.receiptKey}</Text>)}
           subtitle={(
            <ButtonGroup 
            
            containerStyle={{height:30}}
            onPress={(selectedIndex)=>this.updateIndex(selectedIndex,item)}
            selectedIndex={selectedIndex}
            selectedBackgroundColor={styles.notificationPrimaryButton}
            buttons={buttons}
           
          />



           )}
           
          />
         
          </View>
        )
      }

    render(){
      const content=( 
        <FlatList
          data={this.props.notifications}
          renderItem={this.renderRow}
          keyExtractor={item => item.receiptKey}
        />
      );

     const notificationBody= this.props.notifications?content
         :(<Text>There are no new notifications currently</Text>);

 return (<View style={styles.container}>
        {notificationBody}
        </View>)
        
    }
 
}
export const styles= StyleSheet.create({
    container:{
        //flex:1
    },
    buttonHolder:{
      
      flexDirection:"row",
      width:200
    },
    buttonContainer:{
      flexDirection:"row",
    justifyContent:"flex-end",
   
   
    //justifyContent:"space-between"
    },
    notificationPrimaryButton:{
      backgroundColor: colors.primary,
    
    },
    notificationOptionalButton:{
      backgroundColor: colors.lightGray,
      padding:3,
      width:100,
      height:30,
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 10
       
      
    }
    });


const mapStateToProps = state => {
    return {
     notifications:state.notification.notifications
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        onMyNotifications: () => dispatch(fetchUserNotifications()),
        deleteNotification:(notification)=>dispatch(deleteNotification(notification)),
        moveNotification:(notification)=>dispatch(moveNotification(notification))
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(Notification)