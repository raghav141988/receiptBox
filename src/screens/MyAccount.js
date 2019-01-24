import React, {
    Component
} from 'react'
import {
    connect
} from "react-redux";
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    ListItem,
    Button
} from 'react-native-elements'
import Amplify, {
    Auth
} from 'aws-amplify';
import UserProfileComponent from '../components/UserProfileComponent';
import NotificationSettings from './NotificationSettings';
import AboutApp from './AboutApp';
import {updateNotificationSettings} from '../store/actions/userDetailsAction';
import LoginScreen from './LoginScreen';
import {
    Navigation
} from "react-native-navigation";
import {
    withAuthenticator
} from 'aws-amplify-react-native';
import {
    colors
} from '../Utils/theme';
class MyAccount extends React.Component {

    state = {
        user: null,
    }
    pushScreen = (screenName, title, properties) => {
        Navigation.push(this.props.componentId, {
                component: {
                    name: screenName,
                    passProps: {
                        ...properties
                        
                    },

                
                options: {
                    
                    topBar: {
                        visible: true,
                        backButton: {
                            color: colors.buttonEnabledColor,
                            title:''
                        },
                        buttonColor: colors.buttonEnabledColor,
                        background: {
                            color: colors.primary
                            // translucent: true,
                        },
                        title: {
                            text: title,
                            color: colors.primaryTextColor,
                        }

                    }
                }
            }
            });
        }



onAvatarUpdate = (avatar) => {

}
onProfileUpdate = (profile) => {

}
onSettingChanged = (setting) => {

}
loadUserProfile = () => {

}
onUpdateNotification=(notificationSetting)=>{
    
this.props.updateNotificationSettings(notificationSetting);
}
loadNotificationSettings = () => {
    this.pushScreen('receiptManager.notification-settings-screen', 'Notification Settings', {
        notificationSettings:{...this.props.userDBDetails.notificationSettings},
        onUpdateNotification:this.onUpdateNotification
    }
  );
}
loadAboutApp = () => {
    this.pushScreen('receiptManager.aboutapp-screen', 'About ReceiptBox', {
    }
  );

}
shareApp = () => {

}
logout = () => {
    Auth.signOut()
        .then(() => {
           this.goBackToLogin();
        })
        .catch(err => {
            console.log('err: ', err)
        })
}
goBackToLogin=()=>{
  //  Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
          root: {
            component: {
              name: "receiptManager.LoginScreen"
            }
          }
        });
     // });
}
async componentDidAppear() {
    if (this.state.user === null) {
        const user = await Auth.currentAuthenticatedUser();

        this.setState({
            user: user
        });
    }

}

render() {
    return ( < ScrollView style={{flex:1}} contentContainerStyle = {styles.container } >
        < View style = {styles.listItem}
        onPress = { this.loadUserProfile } >
        < ListItem bottomDivider title={
        <UserProfileComponent cognitoUser = {this.props.userCognitoDetails}
        userDBDetails={this.props.userDBDetails}
           
        
        onAvatarUpdate = {
            (avatar) => this.onAvatarUpdate(avatar)
        }
        onProfileUpdate = {
            (profile) => this.onProfileUpdate(profile)
        }
    
        />
    }>
         </ListItem> 
         </View > 
        <TouchableOpacity style = {
            styles.listItem
        }
        onPress = {
            this.loadNotificationSettings
        } >
        <ListItem title = "Push Notifications"
        bottomDivider chevron >

        </ListItem> 
        </TouchableOpacity>  
         <TouchableOpacity style = {
            styles.listItem
        }
        onPress = {
            this.loadAboutApp
        } >
        <ListItem 
        bottomDivider chevron 
        title = "About ReceiptBox"
        > 
        </ListItem> 
        </TouchableOpacity>  

        <TouchableOpacity style = { styles.listItem }
         onPress = { this.shareApp } 
        >
        <ListItem 
         bottomDivider
         chevron
        title = "share ReceiptBox"
        >
        </ListItem> 
        </TouchableOpacity> 
      <TouchableOpacity style = {styles.listItem}
        onPress = {this.logout} 
        >
        <ListItem title={ 
        <Button
        onPress = {this.logout} 
            containerStyle = {
                {
                    flex: 1
                }
            }
            buttonStyle = {
                {
                    backgroundColor: colors.accentColor,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                }
            }
            icon = {<Icon
                name = {Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out' }
                size = { 24}
                color = 'white'
                style = {{paddingLeft: 5}}
                />
            }
            iconRight
            title = 'Sign Out' />
        
        }

        >

        </ListItem>
         </TouchableOpacity> 
        </ScrollView>)
    }
}

export const styles = StyleSheet.create({
    container: {
        //flex: 1,

        backgroundColor: '#efefef'
    },
    listItem: {
        marginBottom: 20,

    }
});

const mapStateToProps = state => {
    return {
        userDBDetails:state.user.userDBDetails,
        userCognitoDetails:state.user.userCognitoDetails
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateNotificationSettings:(settings)=>dispatch(updateNotificationSettings(settings))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount)