
import { StyleSheet, Dimensions, Platform } from 'react-native';
var { height, width } = Dimensions.get('window');
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const styles = StyleSheet.create(
  {
    container:
    {
      //height: height*0.63,
      width: width,
      backgroundColor: '#FFFFFF',
      borderColor: '#F2F1EF',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 5,
      borderTopWidth: 5,
    },
    planCard: {
      borderWidth: 0.5,
      marginHorizontal: 25,
      marginVertical: 20,
      //borderRadius: 10,
      borderColor: StyleConstants.primary,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dots:
    {
      flex:5,
      paddingHorizontal:5 ,
      paddingVertical:7,
      marginTop:10,

      //color:'black',
      //padding:10,
      //justifyContent:'center',
      //alignItems:'center',
      //marginHorizontal:0,
    },
    rowPadding: {
      paddingVertical: 8,
      paddingHorizontal:15,
      borderBottomWidth:0.5,
      borderBottomColor:'grey'
    },

    blueText: {
      textAlign: 'center',
      fontSize: 16,
      paddingVertical: 5,
      color: StyleConstants.primary,
      fontFamily: Fonts.regFont[Platform.OS],
    },

    redText: {
      textAlign: 'center',
      fontSize: 16,
      color: 'red',
      paddingVertical: 5,
      fontFamily: Fonts.regFont[Platform.OS],
    },

    lineSeparator: {
      height: 0.5,
      backgroundColor: 'black',
    //  marginHorizontal:5,
      marginVertical: 5,
      width: width - 70,
      marginHorizontal: 10,
    },
    SPLogoImage:
    {
      width: 53,
      height: 53,
      borderWidth: 2.5,
      borderRadius: 26,
      borderColor: 'white',
      marginRight: width/60,
      alignItems: 'center',
      justifyContent: 'center',
    },

    shareUser:
      {
        width: 30,
        height: 30,
        borderWidth: 0.1,
        borderRadius: 15,
        borderColor: 'black',
        marginHorizontal:3,
       // marginRight: width/60,
        alignItems: 'center',
        justifyContent: 'center',
      },
    SPLogoImageLarge:
    {
      width: 65,
      height: 65,
    //  borderWidth: 1,
      borderRadius: 40,
      borderColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spInfo:
    {
      marginHorizontal: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    favButtons:
    {
      flexDirection: 'row',
      marginHorizontal: 5,
      backgroundColor: 'transparent',
     // marginBottom: 2,
      justifyContent: 'center',
      alignSelf:'center',
      alignItems: 'center',
    },

    flexRow: {
      flexDirection: 'row',
    },

    flexColumn: {
      flexDirection: 'column',
    },

    resizeMode:
    {
      resizeMode: 'contain',
    },

    tabView :
    {
      marginHorizontal: 15,
      paddingVertical: 25,
      paddingHorizontal:15,
      borderTopColor: 'black',
      borderBottomColor: 'black',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderWidth: 0.7,
      //margin: 10,

    },

    actButton :
    {
      backgroundColor:StyleConstants.primary,
      justifyContent:'center',
      alignSelf:'center',
      padding: 10,
      borderRadius: 5

    },

    singleTab :
    {
      paddingVertical:10,
      alignItems: 'center',
     // height: 70,
      //marginHorizontal:5,
    //  width : (width -10)/4,
      alignSelf: 'center',

      //borderColor: 'Black',

      justifyContent: 'space-between',
      flexDirection : 'row',

     //borderLeftWidth: 0.7,

    },

    banner: {
      width: width*0.93,
      height: height*0.30,
      alignSelf: 'center',
      marginBottom: 3,
      //marginHorizontal:10,
      zIndex:-5,
    },

    cardActionButton:
    {
      //borderColor: StyleConstants.primary,
      //flex: 2,
       marginVertical:2,
      //marginBottom: 4,
      //marginLeft:20,
      height: 30,
      //borderWidth: 0.8,
      //borderRadius: 5,
      //paddingVertical: 10,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',

    },
    greyTextLight:
    {
      width: 40,
      alignSelf: 'center',
      marginLeft:4,
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 13,
      color: 'black',
      fontWeight: '400',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    detailedCardPrice :
    {
      fontSize: 20,
      fontWeight:"500",
      color:'black',
      justifyContent:'center',
      alignSelf:'center',
      //fontFamily: Fonts.regFont[Platform.OS],

    }
  });

export default styles;
