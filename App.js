/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';
import {configureAmplify} from './AwsConfig';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, { API, Auth,Storage } from 'aws-amplify';
import amplify from './src/aws-exports';
import { PushNotificationIOS } from 'react-native';
import { Navigation } from "react-native-navigation";
import PushNotification from '@aws-amplify/pushnotification';
import { Provider } from "react-redux";
import configureStore from "./src/store/configureStore";
import Icon from 'react-native-vector-icons/dist/Ionicons';
/* ALL SCREEN IMPORTS */
import MyReceipts from './src/screens/MyReceipts'
import AddReceipt from './src/screens/AddReceipt';

import LatestReceipts from './src/screens/LatestReceipts';
import ReceiptDetail from './src/screens/ReceiptDetail';
import Notifications from './src/screens/Notification';
import {colors} from './src/Utils/theme';
import UnknownReceipts from './src/screens/UnknownReceipts';
import MyAccount from './src/screens/MyAccount';
import NotificationSettings from './src/screens/NotificationSettings';
import AboutApp from './src/screens/AboutApp';


/* ALL SCREEN IMPORTS END */
 const store = configureStore();

configureAmplify(store);

type Props = {};
/* REGISTER FOR ALL THE SCREENS GLOBALLY */

Navigation.registerComponentWithRedux(
  "receiptManager.addreceipt-screen",
  () => AddReceipt,
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  "receiptManager.receiptDetail-screen",
  () => ReceiptDetail,
  Provider,
  store
);

Navigation.registerComponentWithRedux(
  "receiptManager.myreceipts-screen",
  () => MyReceipts,
  Provider,
  store
);

Navigation.registerComponentWithRedux(
  "receiptManager.latestReceipts-screen",
  () => LatestReceipts,
  
  Provider,
  store
);
Navigation.registerComponentWithRedux(
  "receiptManager.unknownReceipts-screen",
  () => UnknownReceipts,
  
  Provider,
  store
);


Navigation.registerComponentWithRedux(
  "receiptManager.notifications-screen",
  () => Notifications,
  
  Provider,
  store
);

Navigation.registerComponentWithRedux(
  "receiptManager.myaccounts-screen",
  () => MyAccount,
  
  Provider,
  store
);

Navigation.registerComponent(
  "receiptManager.notification-settings-screen",
  () => NotificationSettings,
  
);

Navigation.registerComponent(
  "receiptManager.aboutapp-screen",
  () => AboutApp,
  
);



Promise.all([
  Icon.getImageSource(Platform.OS==='ios'?"ios-home":"md-home" , 25),
  Icon.getImageSource(Platform.OS==='ios'?"ios-mail-open":"md-mail-open" , 25),
  Icon.getImageSource(Platform.OS==='ios'?"ios-notifications":"md-notifications" , 25),
  Icon.getImageSource(Platform.OS==='ios'?"ios-person":"md-person" , 25)
  
]).then(sources => {
  

 
    
  
//PUSH NEW SCREENS
Navigation.setRoot({
root: {
  appStyle: {
    navBarTitleFontFamily: 'Lato-Bold',
    navBarNoBorder: true,
  
},

statusBar: {
  visible: false,
  style:  'dark'
},
    
      bottomTabs: {
        id: 'tabs',
        options: {
          statusBar: {
            visible: false,
            style:  'dark'
          },
          topbar: {
           // hideOnScroll: true,
            visible: true,
            buttonColor: colors.buttonEnabledColor,
            background:{
              color: colors.primary,
             // translucent: true,
            },
            title: {
              text: 'ReceiptBox',
              color: colors.primaryTextColor,
            },
          }
        },
        children: [
          {
            stack: {
              id: 'tab1',
              children: [
                {
                  
                  component: {
                    name: 'receiptManager.myreceipts-screen',
                    options: {
                      statusBar: {
                        visible: false,
                        style:  'dark'
                      },
                      topBar: {
                       // hideOnScroll: true,
                        buttonColor: colors.buttonEnabledColor,
                        background:{
                          color: colors.primary,
                         // translucent: true,
                        },
                        title: {
                          text: 'ReceiptBox',
                          color: colors.primaryTextColor,
                        },
                       
                        animate: true, 
                       
                        // subtitle: {
                        //   text: 'My Receipts',
                        //   fontSize: 14,
                        //   color: 'white',
                        //   fontFamily: 'Helvetica'
                          
                       
                        // },
                        
                        
                      },
                      bottomTab: {
                        fontSize: 12,
                        text: 'My Receipts',
                        textColor:colors.bottomTabColor,
                        color: colors.bottomTabColor,
                        icon: sources[0],
                        iconColor:colors.bottomTabColor,
                       
                       
                      //  selectedTextColor: colors.,
                        selectedIconColor: colors.primary
                      }
                    }
                  },
                },
              ]
            }
          },
          {
            stack: {
              id: 'tab2',
              children: [
                {
                  component: {
                    name: 'receiptManager.latestReceipts-screen',
                    options: {
                      topBar: {
                       // hideOnScroll: true,
                        animate: true, 
                       
                          buttonColor: colors.buttonEnabledColor,
                          background:{
                            color: colors.primary,
                           // translucent: true,
                          },
                          title: {
                            text: 'Inbox',
                            color: colors.primaryTextColor,
                          },
                       
                       
                        // subtitle: {
                        //   text: 'Newly Arrived',
                        //   fontSize: 14,
                        //   color: 'white',
                        //   fontFamily: 'Helvetica'
                         
                        // },
                        
                      },
                      bottomTab: {
                        text: 'Inbox',
                        fontSize: 12,
                        icon: sources[1],
                        textColor:colors.bottomTabColor,
                        color: colors.bottomTabColor,
                        iconColor:colors.bottomTabColor,
                        //selectedTextColor: colors.primaryTextColor,
                        selectedIconColor: colors.primary
                      }
                    }
                  },
                },
              ]
            }
          },
          
          {
          stack: {
            id: 'notifications',
            children: [
              {
                
                component: {
                  name: 'receiptManager.notifications-screen',
                  options: {
                    topBar: {
                     // hideOnScroll: true,
                      buttonColor: colors.buttonEnabledColor,
                      background:{
                        color: colors.primary,
                       // translucent: true,
                      },
                      title: {
                        text: 'Notifications',
                        color: colors.primaryTextColor,
                      },
                     
                      animate: true, 
                     
                      // subtitle: {
                      //   text: 'My Receipts',
                      //   fontSize: 14,
                      //   color: 'white',
                      //   fontFamily: 'Helvetica'
                        
                     
                      // },
                      
                      
                    },
                    bottomTab: {
                      fontSize: 12,
                      text: 'Notifications',
                      icon: sources[2],
                      textColor:colors.bottomTabColor,
                        color: colors.bottomTabColor,
                        iconColor:colors.bottomTabColor,
                    
                    //  selectedTextColor: colors.,
                      selectedIconColor: colors.primary
                    }
                  }
                },
              },
              
            ]
          }
        },
        {
          stack: {
            id: 'account',
            children: [
              {
                
                component: {
                  name: 'receiptManager.myaccounts-screen',
                  options: {
                    topBar: {
                     // hideOnScroll: true,
                      buttonColor: colors.buttonEnabledColor,
                      background:{
                        color: colors.primary,
                       // translucent: true,
                      },
                      title: {
                        text: 'My Account',
                        color: colors.primaryTextColor,
                      },
                     
                      animate: true, 
                     
                      // subtitle: {
                      //   text: 'My Receipts',
                      //   fontSize: 14,
                      //   color: 'white',
                      //   fontFamily: 'Helvetica'
                        
                     
                      // },
                      
                      
                    },
                    bottomTab: {
                      fontSize: 12,
                      text: 'Account',
                      icon: sources[3],
                      iconColor:colors.bottomTabColor,
                     
                      textColor:colors.bottomTabColor,
                        color: colors.bottomTabColor,
                    //  selectedTextColor: colors.,
                      selectedIconColor: colors.primary
                    }
                  }
                },
              },
              
            ]
          }
        },
        ],
      },
    
  }

});


});

 class App extends Component<Props> {


  
  signOut=async ()=>{
    Auth.signOut()
    .then(() => {
    this.props.onStateChange('signedOut', null);
    })
    .catch(err => {
    console.log('err: ', err)
    })
  }
  componentDidMount=()=>{
    console.log('component did mount');
  }
  constructor(props){
    super(props);
   

  }
componentDidMount(){
  console.log('component did mount');
  
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="sign out" onPress={this.signOut}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default withAuthenticator(App);