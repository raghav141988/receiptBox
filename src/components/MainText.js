import React from 'react';
import { Text, StyleSheet } from 'react-native';

const mainText = props => (
    <Text style={styles.mainText}>{props.children}</Text>
);

const styles = StyleSheet.create({
    mainText: {
        color: "black",
        marginLeft:5,
        padding:5,
        backgroundColor: "transparent"
    }
});

export default mainText;