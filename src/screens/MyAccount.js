import React, { Component } from 'react'
import { connect } from "react-redux";
import {View,StyleSheet,Text} from 'react-native';

class MyAccount extends React.Component
{
    render(){
        return (<View style={styles.container}>
        <Text>This is my account screen</Text>
        </View>)
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

export default connect(mapStateToProps,mapDispatchToProps)(MyAccount)