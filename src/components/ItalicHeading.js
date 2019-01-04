import React from "react";
import { Text, StyleSheet } from "react-native";

const ItalicHeadingText = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 15,
    fontStyle:"italic"
    
  }
});

export default ItalicHeadingText;
