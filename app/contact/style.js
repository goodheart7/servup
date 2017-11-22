import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

import {StyleConstants} from '../stylesheet/StyleConstants';
import {Fonts} from '../stylesheet/Fonts';

const {height, width} = Dimensions.get('window');

let ContactsStyle = StyleSheet.create({
  scrollBox: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cols: {
    flex: 1,
    width:width,
   // backgroundColor:'blue'
  },
  rowsTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greyText: {
    fontSize: 15,//width*0.03,
    //alignSelf: 'center',
    //justifyContent: 'center',
    //paddingVertical:5,
    color:'black',
    fontFamily: Fonts.regFont[Platform.OS]
  },
  stateGreyText: {
    marginHorizontal: 3,
    marginTop: 13,
    fontSize: 14,//width*0.032,
    alignSelf: 'center',
    color:'black',
    fontFamily: Fonts.regFont[Platform.OS],
    justifyContent: 'center',
  },
  buttonBlue: {
    //marginTop: 9,
    height: 30,//height*0.042,
    width: 75,//width*0.22,
    marginHorizontal: 3,
    borderRadius: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: StyleConstants.primary,
    //paddingVertical:10,
    //paddingHorizontal:10,

  },
  topGreyLine: {
    width: width,
    borderWidth: 0,
    borderTopWidth: 4,
    borderTopColor: '#ececec',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: '#ffffff',
  },
  buttonWhiteSmall: {
    //marginTop: 9,
    height: 30,//height*0.042,
    width: 75,//width*0.22,
    marginHorizontal: 3,
    alignItems:'center',
    borderRadius: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    //paddingVertical: 10,
    //paddingHorizontal: 10,

  },
  headerListRow: {
    width:width,
    paddingHorizontal: 10,
    paddingVertical:20,

    //marginHorizontal:10,
    borderWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomColor: '#ececec',
    borderTopColor: '#ececec',
    borderLeftColor: '#ffffff',
    borderRightColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  buttonWhiteHeader: {

    //marginLeft: width*0.23,
    height: 30,//height*0.042,
    width: 95,//width*0.22,
    borderRadius: 3,
    marginHorizontal: 3,
    //paddingVertical:10,
    //alignSelf: 'center',
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    // paddingVertical:10,
    //paddingHorizontal:15,

  },
  buttonWhiteLarge: {
    marginTop: 9,
    height: 25,//height*0.042,
    width: 150,//width*0.40 ,
    marginHorizontal: 7,
    borderRadius: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'darkslategrey',
    //padding: 5,

  },

  buttonBlueText: {
    fontSize: 16,//width*0.03,
    color: '#ffffff',
    fontFamily: Fonts.regFont[Platform.OS],
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textStyle: {

    // width: width*.26,
    alignSelf: 'flex-start',
    fontSize: 18,//width*0.035,
    color: 'black',
  //  flex:0.1,
    flexWrap:'wrap',
   // flex:1,
    //flexWrap:'wrap',
    fontWeight: '400',
    fontFamily: Fonts.regFont[Platform.OS],
    //marginLeft: 10,
    marginBottom: 5,
  },

  textStyleMini: {
    //width: width*.29,
    alignSelf: 'flex-start',
    fontSize: 15,//width*0.03,
    color: '#666666',
    fontFamily: Fonts.regFont[Platform.OS],
    //marginLeft: 10,
  },
  buttonParentView: {
    flexDirection: 'row',
    //marginTop:10,
    //padding:5,
    /* width*0.6,
     borderWidth: 0,
     borderTopWidth: 1,
     borderBottomWidth: 4,
     borderBottomColor: '#ececec',
     borderTopColor: '#ececec',
     borderLeftColor: '#ececec',
     borderRightColor: '#ececec',
     backgroundColor: '#ffffff',
     */
  },
  selectedFontStyle: {
    alignSelf: 'center',
    fontSize: 14,//width*0.035,
    color: StyleConstants.primary,
    fontFamily: Fonts.regFont[Platform.OS],
    marginLeft: 10,
  },

  unSelectedFontStyle: {
    alignSelf: 'center',
    fontSize: 14,//width*0.035,
    color: '#666666',
    fontFamily: Fonts.regFont[Platform.OS],
    marginLeft: 10,
  },
  topButton: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#ffffff',
    borderTopColor: 'transparent',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginBottom: -1,
  },

  topButtonSelectedActive: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: StyleConstants.primary,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: '#ffffff',
    marginLeft: 15,
    marginBottom: -1,
  },

  topButtonSelectedSaved: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: StyleConstants.primary,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: '#ffffff',
    marginRight: 15,
    marginBottom: -1,
  },
});

export {ContactsStyle};
