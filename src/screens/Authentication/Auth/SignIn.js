/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from 'react';
import { View,Text,TouchableWithoutFeedback, Keyboard,Platform,Alert } from 'react-native';
import { Auth, I18n, Logger, JS } from 'aws-amplify';
import AuthPiece from './AuthPiece';
import { AmplifyButton, FormField, LinkCell,LinkLeftCell, Header, ErrorRow } from '../AmplifyUI';
import Icon from 'react-native-vector-icons/dist/Ionicons';
const logger = new Logger('SignIn');
import {colors} from '../../../Utils/theme';
import { PushNotificationIOS } from 'react-native';
import amplify from '../../../../src/aws-exports';
import PushNotification from '@aws-amplify/pushnotification';

export default class SignIn extends AuthPiece {
    constructor(props) {
        super(props);

        this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
        this.state = {
            username: null,
            password: null,
            error: null
        };

        this.checkContact = this.checkContact.bind(this);
        this.signIn = this.signIn.bind(this);
    }
componentDidMount() {
    
}

    signIn() {
        const { username, password } = this.state;
        logger.debug('Sign In for ' + username);
        Auth.signIn(username, password).then(user => {
            logger.debug(user);
            const requireMFA = user.Session !== null;
            if (user.challengeName === 'SMS_MFA') {
                this.changeState('confirmSignIn', user);
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                logger.debug('require new password', user.challengeParam);
                this.changeState('requireNewPassword', user);
            } else {
                this.checkContact(user);
            }
        }).catch(err => this.error(err));
    }

    showComponent(theme) {
        return React.createElement(
            TouchableWithoutFeedback,
            { onPress: Keyboard.dismiss, accessible: false },
            React.createElement(
                View,
                { },
                React.createElement(
                    View,
                    { style: theme.section },
  
                React.createElement(
                    View,
                    { style: theme.sectionBody },

                 React.createElement(View,{style:theme.formFieldElement},
                    React.createElement(Icon,{size:24, color:colors.primary,name:Platform.OS==='ios'?"ios-person":"md-person"}),

                    React.createElement(FormField, {
                        theme: theme,
                        onChangeText: text => this.setState({ username: text }),
                        label: I18n.get('Username'),
                        placeholder: I18n.get('Enter your username *'),
                       // placeholderTextColor:'white',
                        required: true
                    })),
                    React.createElement(View,{style:theme.formFieldElement},
                        React.createElement(Icon,{size:24, color:colors.primary,name:Platform.OS==='ios'?"ios-unlock":"md-unlock"}),
    
                    React.createElement(FormField, {
                        theme: theme,
                        onChangeText: text => this.setState({ password: text }),
                        label: I18n.get('Password'),
                        placeholder: I18n.get('Enter your password *'),
                       // placeholderTextColor:'white',
                        secureTextEntry: true,
                        required: true
                    })),
                    React.createElement(AmplifyButton, {
                        text: I18n.get('Sign In').toUpperCase(),
                        theme: theme,
                        onPress: this.signIn,
                        disabled: !this.state.username || !this.state.password
                    })
                ),
               
            ),
            
            React.createElement(
                View,
                { },
                React.createElement(
                    View,
                    { style: theme.sectionFooter },
                    React.createElement(
                        LinkCell,
                        { theme: theme, onPress: () => this.changeState('forgotPassword') },
                        I18n.get('Forgot Password?')
                    ),
                    React.createElement(
                        View,
                        { style: {flexDirection:'row'} },
                    React.createElement(
                        Text,
                        { style: {color:colors.primary, fontSize:19,alignSelf:'center'}, onPress: () => this.changeState('signUp') },
                        I18n.get('No Account?')
                    ),
                    React.createElement(
                        LinkLeftCell,
                        { theme: theme, onPress: () => this.changeState('signUp') },
                        I18n.get('SignUp')
                    ),
                    ))
                ,
                React.createElement(
                    ErrorRow,
                    { theme: theme },
                    this.state.error
                )
                )),
           
        );
    }
}