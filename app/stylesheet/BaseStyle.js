import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

import {StyleConstants} from './StyleConstants';
import {Fonts} from './Fonts';

const {height, width} = Dimensions.get('window');

let BaseStyle = StyleSheet.create({

  row: {
    flex: 1,
    flexDirection: 'row',
  },
  activeButton: {
    backgroundColor: StyleConstants.primary,
    borderColor: StyleConstants.primary,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  rowWithSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  center: {
    alignSelf: 'center',
  },

  centerItems: {
    alignItems: 'center',
    marginHorizontal:15,
  },

  listRow: {
    padding: 15,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    borderTopColor: '#ececec',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: '#ffffff',
  },
  contactsRow: {
    padding: 10,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  userImage: {
    width: 44,
    alignSelf: 'center',
    height: 44,
    borderRadius: 22
  },
  contactsUserImage: {
    width: 44,
    alignSelf: 'center',
    height: 44,
    marginRight:15,
    borderRadius: 22
  },
  navbarContainer: {
    height: StyleConstants.navbarHeight,
    backgroundColor: StyleConstants.navbarBg,
    paddingHorizontal: 20,
  },

  textColorPrimary: {
    color: StyleConstants.primary,
  },

  textColorWhite: {
    color: 'white',
  },

  textColorBlack: {
    color: StyleConstants.black,
  },

  textColorGray: {
    color: StyleConstants.gray,
  },

  textUnderline: {
    textDecorationLine: 'underline',
  },

  p: {
    fontSize: StyleConstants.paragraphFontSize,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  b: {
    fontWeight: 'bold',
  },

  extraSpaceForIOS: {
    height: 0,
    //backgroundColor: 'grey',
    //marginBottom:5,
  },
  marginForIOS: {
    marginTop: 20,
  },

  h1: {
    fontSize: StyleConstants.h1FontSize,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  h2: {
    fontSize: StyleConstants.h2FontSize,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  f12: {
    fontSize: 12,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  f14: {
    fontSize: 14,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  f15: {
    fontSize: 15,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  f16: {
    fontSize: 16,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f17: {
    fontSize: 17,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f18: {
    fontSize: 18,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  f20: {
    fontSize: 20,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f22: {
    fontSize: 22,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f24: {
    fontSize: 24,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f26: {
    fontSize: 26,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f28: {
    fontSize: 28,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  f30: {
    fontSize: 30,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  heading: {
    fontSize: StyleConstants.headingFontSize,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  btnDefault: {
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#9999',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lineSeparator: {
    height: 0.5,
    backgroundColor: 'grey',
    //  marginHorizontal:5,
    marginVertical: 5,
    //width: width - 40,
    marginHorizontal: 10,
  },

  btnPrimary: {
    borderColor: StyleConstants.primary,
    flex: 2,
    marginVertical: 2,
    marginBottom: 4,
    marginLeft: 20,
    height: 30,
    borderWidth: 0.8,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }


});
export {BaseStyle};
