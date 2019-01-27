import  React, { Component } from 'react';
import {withAuthenticator}from './Authentication/Auth/index';
import amplifyTheme from './Authentication/AmplifyTheme';
import {View,Button,Text,Platform, StyleSheet,} from 'react-native';

import { Navigation } from "react-native-navigation";
import Amplify, {
    Auth
} from 'aws-amplify';

import MyReceipts from './MyReceipts'
import AddReceipt from './AddReceipt';

import LatestReceipts from './LatestReceipts';
import ReceiptDetail from './ReceiptDetail';
import Notifications from './Notification';

import UnknownReceipts from './UnknownReceipts';
import MyAccount from './MyAccount';
import NotificationSettings from './NotificationSettings';
import AboutApp from './AboutApp';
import {colors} from '../Utils/theme';
import Icon from 'react-native-vector-icons/dist/Ionicons';


export const onStateChange=(state,data)=>{
    console.log(state);
    console.log(data);
    if(data!==null && data!==undefined){
       startApp();
    }
}

export const startApp=()=>{
    console.log('starting app');
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
        style:  'light',
       // drawBehind: false,
      },
          
            bottomTabs: {
              id: 'tabs',
              options: {
                statusBar: {
                //  visible: false,
                
                  backgroundColor:colors.primary,
                  drawBehind: true,
                              style:  'light',
                              visible: true,
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
                    options:{
                      bottomTab:{
                        selectedIconColor: colors.primary,
                        selectedTextColor:colors.primary,
                        textColor:colors.bottomTabColor,
                        iconColor:colors.bottomTabColor
                      }
                    },
                    children: [
                      {
                        
                        component: {
                          name: 'receiptManager.myreceipts-screen',
                          options: {
                           
                              statusBar: {
                               // visible: false,
                               backgroundColor:colors.primary,
                               
                                drawBehind: false,
                              style:  'light',
                              visible: true,
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
                             
                              selectedIconColor: colors.primary,
                              selectedTextColor: colors.primary,
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
                    options:{
                      bottomTab:{
                        selectedIconColor: colors.primary,
                        selectedTextColor:colors.primary,
                        textColor:colors.bottomTabColor,
                        iconColor:colors.bottomTabColor
                      }
                    },
                    children: [
                      {
                        component: {
                          name: 'receiptManager.latestReceipts-screen',
                          options: {
                           
                              statusBar: {
                               // visible: false,
                                backgroundColor:colors.primary,
                                drawBehind: false,
                              style:  'light',
                              visible: true,
                              },
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
                              selectedTextColor: colors.primary,
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
                  options:{
                    bottomTab:{
                      selectedIconColor: colors.primary,
                      selectedTextColor:colors.primary,
                      textColor:colors.bottomTabColor,
                      iconColor:colors.bottomTabColor
                    }
                  },
                  children: [
                    {
                      
                      component: {
                        name: 'receiptManager.notifications-screen',
                        options: {
                         
                            statusBar: {
                            //  visible: false,
                              backgroundColor:colors.primary,
                              drawBehind: false,
                              style:  'light',
                              visible: true,
                            },
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
                          
                              selectedTextColor: colors.primary,
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
                  options:{
                    bottomTab:{
                      selectedIconColor: colors.primary,
                      selectedTextColor:colors.primary,
                      textColor:colors.bottomTabColor,
                      iconColor:colors.bottomTabColor
                    }
                  },
                  children: [
                    {
                      
                      component: {
                        name: 'receiptManager.myaccounts-screen',
                        options: {
                         
                            statusBar: {
                             
                              backgroundColor:colors.primary,
                              drawBehind: false,
                              style:  'light',
                              visible: true,
                            },
                          topBar: {
                             style:  'light',
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
                              selectedTextColor: colors.primary,
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
}

 class LoginScreen extends Component {
     constructor(props){
         super(props);
    if(Auth.user!==null && Auth.user!==undefined){
        startApp();
    }
     }
    logout = () => {
        console.log('log out called');
        Auth.signOut()
            .then(() => {
                console.log('signed out')
                this.props.onStateChange('signedOut', null);
            })
            .catch(err => {
                console.log('err: ', err)
            })
    }
  render() {
  
    return (
      <View style={{flex:1}}>
     
      </View>
    )
  }
}
export default withAuthenticator(()=><LoginScreen onStateChange={onStateChange}/>,includeGreetings = false, authenticatorComponents = [], federated = null, theme = amplifyTheme, signUpConfig = {});
