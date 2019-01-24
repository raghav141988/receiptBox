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

import { StyleSheet } from 'react-native';
import {colors} from '../../Utils/theme';
// Colors
export const deepSquidInk = colors.primary;
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F5B';

// Theme

export default AmplifyTheme = StyleSheet.create({
    parentContainer:{
       // backgroundColor:'red',
        flex: 1,
    },
    backgroundImage: {
       
       resizeMode:"contain",
        flex: 1,
        opacity:0.9
      
      },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        width: '100%',
        //marginTop: 30
    },
    signUpContainer:{
        flex: 1,
      
        width: '100%',
        
        padding: 20
    },
    sectionBody:{
       width:"100%"
    },
    section: {
        //flex: 1,
        alignItems:"center",
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent:"center",
        padding: 20,
        paddingLeft:30,
        paddingRight:30,
        paddingBottom:5,
    },
    sectionHeader: {
        width: '100%',
      //  marginBottom: 20,
        paddingLeft:20
    },
    sectionHeaderText: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: '500',
        //fontWeight:'bold'
    
    },
    sectionFooter: {
    width: "100%",
        paddingLeft: 10,
        //height:20,
       // flexDirection: 'row',
        //justifyContent: 'space-between',
        //marginTop: 15,
        //marginBottom: 20
    },
    sectionFooterLink: {
        fontSize: 19,
        fontWeight:'500',
        color: colors.primary,
        textDecorationLine:'underline',
        //alignItems: 'baseline',
        textAlign: 'center'
    },
    sectionFooterLeftLink: {
        fontSize: 19,
        fontWeight:'bold',
        color: colors.primary,
        //textDecorationLine:'underline',
        //alignItems: 'baseline',
        textAlign: 'left'
    },
    navBar: {
        marginTop: 35,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    navButton: {
        marginLeft: 12,
        borderRadius: 4
    },
    leftCell:{
       padding:20,
       paddingLeft:5 
    },
    cell: {
        //flex: 1,
        //width: '50%'
        padding:20
    },
    errorRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    errorRowText: {
        marginLeft: 10,
        fontSize:18,
        color:'red',
        fontWeight: '600'
    },
    photo: {
        width: '100%'
    },
    album: {
        width: '100%'
    },
    formFieldElement:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    paddingRight:20,
    paddingLeft:20,
    paddingBottom:5,
    paddingTop:5
    
    },
    button: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        padding: 10,
        marginTop:30,
        borderRadius:25
    },
    buttonDisabled: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        marginTop:30,
        padding: 10,
        borderRadius:25
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    formField: {
       // marginBottom: 22,
       // padding:20,
        width:"100%"
    },
    input: {
        padding: 20,
        borderBottomWidth: 1,
        borderRadius: 3,
      borderColor: colors.primary,
        color:colors.primary,
        fontSize:18,
      //  fontWeight:"800",
     //  backgroundColor:'#795548',
       //opacity:.7,
       
    },
    inputLabel: {
        marginBottom: 8,
        color:colors.primary
    },
    phoneContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    phoneInput: {
        flex: 2,
        padding: 20,
        borderBottomWidth: 1,
        borderRadius: 3,
        borderColor: colors.primary,
       // backgroundColor:'#795548',
        fontSize:18,
        color:colors.primary
    },
    picker: {
        flex: 1,
        paddingTop:12,
        height: 50
    },
    pickerItem: {
        height: 45,
        
        borderBottomWidth: 1,
       // backgroundColor:'#795548',
       borderColor: colors.primary,
        color:colors.primary,
        alignItems:"center"
    }
});