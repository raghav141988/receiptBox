import React, { Component } from 'react'
import { connect } from "react-redux";
import {View,StyleSheet,Text} from 'react-native';

class NotificationSettings extends React.Component
{
    render(){
        return (<View style={styles.container}>
         <Text>This is my notifcation settings screen</Text></View>)
    }
}

export const styles =StyleSheet.create({
container:{
    flex:1
}
});

const mapStateToProps = state => {
    return {
     
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
     
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(import React, { Component } from 'react'
import { connect } from "react-redux";
import {View,StyleSheet} from 'react-native';

class Notification extends React.Component
{
    render(){
        return (<View style={styles.container}></View>)
    }
}

export const styles =StyleSheet.create({
container:{
    flex:1
}
});

const mapStateToProps = state => {
    return {
     
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
     
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(NotificationSettings)