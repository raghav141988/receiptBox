import React from "react";
import { View, Text, StyleSheet, Dimensions} from "react-native";
import Pdf from 'react-native-pdf';
const renderPdf=(props)=>{
  
   const source={uri:props.source,cache:true};
  
    const pdfViewer=props.source!==null?( <Pdf
        source={source}
        onLoadComplete={(numberOfPages,filePath)=>{
            console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page,numberOfPages)=>{
            console.log(`current page: ${page}`);
        }}
        onError={(error)=>{
            console.log(error);
        }}
        style={styles.pdf}/>):null;
     
   return (<View style={styles.container}>
{pdfViewer}
   
</View>
   );

;
    }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});

export default renderPdf;