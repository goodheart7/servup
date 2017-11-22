
import { StyleSheet, Dimensions, Platform } from 'react-native';
var { height, width } = Dimensions.get('window');
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';

let cardBaseStyle = StyleSheet.create ({
    cardTitle : {
        marginHorizontal:10,
        padding:10,
        paddingBottom:10,
        fontSize:22,
        fontWeight: "400",
        color: 'black',
      //fontFamily: Fonts.regFont[Platform.OS],
    },
    spImage:
    {
      width: 53,
      height: 53,
      borderWidth: 1,
      borderRadius: 26,
      borderColor: 'white',
      marginRight: width/60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spName: {
      fontSize:17,
      color:'black',
      marginTop:10,
      marginLeft:10,
      //fontFamily: Fonts.regFont[Platform.OS],
    },
    descriptionArea:
    {
      padding:10,
      //marginTop:2,
      marginHorizontal: 20,
      marginVertical: 15,
      //flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      //alignSelf: 'flex-start',
      //margin: 5,
    },
    descriptionText:
    {
      fontSize: 18,//16
      color: 'black',
      //padding:19,
      fontFamily: Fonts.regFont[Platform.OS],
    },
    reviewerImage :{
      width: 53,
      height: 53,
      borderWidth: 1,
      borderRadius: 26,
      borderColor: 'white',
      marginTop:10,
      //marginRight: width/60,
      //marginHorizontal:5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spInfo: {
      marginHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
     // margin: 5,
     // padding: 10,
     // borderTopColor: 'black',
     // borderTopWidth: 0.5,
    },

    titleBar: {
      backgroundColor:'transparent',
      position:'absolute',
      //  marginTop:20,
      paddingLeft:20,
      padding:8,
      flex:1,
      width:width,
      top:0,
      zIndex:1
    },
    lineSeparator: {
      //height: 0.4,
      borderBottomWidth:0.5,
      borderBottomColor:'black',
    //  backgroundColor: 'grey',
      marginVertical: 5,
      //width: width *0.90,
      marginHorizontal: 25,
    },

    icon:
    {
      marginRight: 5,
      flex:1,
     // backgroundColor:'lightblue',
       //marginBottom: 2,
      //justifyContent: 'center',
      alignSelf:'center',
      alignItems: 'center',
    },

    tabView : {
     // width:width,
      //flex:1,
        marginHorizontal:25,
        marginVertical:25
    },
    cardPrice : {
      fontSize: 20,
      fontWeight:"400",
      color:'black',
      justifyContent:'center',
      alignSelf:'center',
      //fontFamily: Fonts.regFont[Platform.OS],

    },
    actionButton : {
      backgroundColor:StyleConstants.primary,
      justifyContent:'center',
      alignSelf:'center',
      //padding: 10,
      paddingHorizontal:15,
      paddingVertical:8,
      borderRadius: 5

    },

    cardImage: {
      resizeMode: 'cover',
      width: width,
      height: height * 0.30,
      // alignSelf: 'center',
      marginBottom: 5,
    },
  });

export default cardBaseStyle;
