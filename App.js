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
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
/* ALL SCREEN IMPORTS */
import MyReceipts from './src/screens/MyReceipts'
import AddReceipt from './src/screens/AddReceipt';
import LatestReceipts from './src/screens/LatestReceipts';
import ReceiptDetail from './src/screens/ReceiptDetail';
import CollapsibleScreen from './src/screens/CollapsibleScreen';
import {colors} from './src/Utils/theme';
/* ALL SCREEN IMPORTS END */
 const store = configureStore();

configureAmplify(store);

type Props = {};
/* REGISTER FOR ALL THE SCREENS GLOBALLY */
Navigation.registerComponent(
  "receiptManager.search-screen",
  () => CollapsibleScreen
);

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

Promise.all([
  Icon.getImageSource("fiber-new" , 30),
  Icon.getImageSource("receipt" , 30)
  
]).then(sources => {
  

 
    
  
//PUSH NEW SCREENS
Navigation.setRoot({
root: {
  appStyle: {
    navBarTitleFontFamily: 'Lato-Bold',
    navBarNoBorder: true,
},
    
      bottomTabs: {
        id: 'tabs',
        options: {
          topbar: {
            visible: true,
            buttonColor: colors.buttonEnabledColor,
            background:{
              color: colors.primary,
              translucent: true,
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
                      topBar: {
                        buttonColor: colors.buttonEnabledColor,
                        background:{
                          color: colors.primary,
                          translucent: true,
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
                        icon: sources[1],
                      
                       
                        color: colors.primaryTextColor,
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
                        animate: true, 
                       
                          buttonColor: colors.buttonEnabledColor,
                          background:{
                            color: colors.primary,
                            translucent: true,
                          },
                          title: {
                            text: 'ReceiptBox',
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
                        icon: sources[0],
                        
                        //selectedTextColor: colors.primaryTextColor,
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