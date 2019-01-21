import React,{Component} from "react";
import { Image,View,Text, StyleSheet, Dimensions} from "react-native";
import Switch from '../components/Switch';

import { colors } from '../Utils/theme';
import {Navigation} from 'react-native-navigation';
 import HeadingText from '../components/HeadingText';

class NotificationSettings extends Component
{

    state={
      notificationSettings:{
        showPushNotifications:false,
        alertIncomingReceipt:false,
        alertUnKnownEmail:false,
        alertExpiringReceipts:false,
        alertUnknwonRcptExpiring:false
    }
  }

    componentDidAppear(){
      
    }
    
    constructor(props) {
      super(props);
      

      Navigation.events().bindComponent(this);
     
    }
    componentDidMount() {
      this.setState({
        notificationSettings:{
        showPushNotifications:this.props.notificationSettings.showPushNotifications,
        alertIncomingReceipt:this.props.notificationSettings.alertIncomingReceipt,
        alertUnKnownEmail:this.props.notificationSettings.alertUnKnownEmail,
        alertExpiringReceipts:this.props.notificationSettings.alertExpiringReceipts,
        alertUnknwonRcptExpiring:this.props.notificationSettings.alertUnknwonRcptExpiring
        }
      });
    }
    

    onSwitchToggle=(key)=>{
     let enablePush={
      showPushNotifications:this.state.notificationSettings['showPushNotifications']
     }
      if(!this.state.notificationSettings[key]){
        enablePush={
          showPushNotifications:true
         }
      }

      let notificationSetting={
        ...this.state.notificationSettings,
        ...enablePush,
        [key]:!this.state.notificationSettings[key],
       
      }

      if(key==='showPushNotifications'){
        if(this.state.notificationSettings[key]){
          notificationSetting={
            showPushNotifications:false,
            alertIncomingReceipt:false,
            alertUnKnownEmail:false,
            alertExpiringReceipts:false,
            alertUnknwonRcptExpiring:false
          }
          this.setState({
            notificationSettings:{
           ...notificationSetting
            }
          });
        }
        else {
          notificationSetting={
          showPushNotifications:this.props.notificationSettings.showPushNotifications,
          alertIncomingReceipt:this.props.notificationSettings.alertIncomingReceipt,
          alertUnKnownEmail:this.props.notificationSettings.alertUnKnownEmail,
          alertExpiringReceipts:this.props.notificationSettings.alertExpiringReceipts,
          alertUnknwonRcptExpiring:this.props.notificationSettings.alertUnknwonRcptExpiring
          }
          this.setState({
            notificationSettings:{
           ...notificationSetting
            }
          });
        }
      }
      
     else {

     this.setState(prevState=>{
      return {
       
        notificationSettings:{
          ...prevState.notificationSettings,
          [key]:!prevState.notificationSettings[key],
          ...enablePush
        }
       
      }

    });
  }

      this.props.onUpdateNotification(notificationSetting);
    }
    render() {
      return (
        <View style={styles.contatiner}>
          <Switch
          label="Allow Push Notiifications"
          value={this.state.notificationSettings.showPushNotifications}
          onValueChange={()=>this.onSwitchToggle('showPushNotifications')}
          />
          <View style={styles.notificationLabelContainer}>
            <HeadingText style={{fontWeight:'bold',paddingLeft:10}}>
             Notifications from Receipt Box
            </HeadingText>
          </View>
          <Switch
          label="New Email Receipt is received"
          value={this.state.notificationSettings.alertIncomingReceipt}
          onValueChange={()=>this.onSwitchToggle('alertIncomingReceipt')}
          />
          <Switch
          label="non categorized Email is received"
          value={this.state.notificationSettings.alertUnKnownEmail}
          onValueChange={()=>this.onSwitchToggle('alertUnKnownEmail')}
          />
          <Switch
          label="Email receipt is expiring"
          value={this.state.notificationSettings.alertExpiringReceipts}
          onValueChange={()=>this.onSwitchToggle('alertExpiringReceipts')}
          />
          <Switch
          label="non categorized email is expiring"
          value={this.state.notificationSettings.alertUnknwonRcptExpiring}
          onValueChange={()=>this.onSwitchToggle('alertUnknwonRcptExpiring')}
          />
        </View>
      )
    }

}
const styles=StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: '#efefef'
    },
    notificationLabelContainer:{
      marginTop:10,
      marginBottom:10,
      height:40,
      backgroundColor:colors.mediumGray,
     // alignItems:"center",
      justifyContent:"center"
    }
})
export default NotificationSettings;