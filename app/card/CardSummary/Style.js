/**
 * Created by Shoaib on 11/11/2016.
 */
import { StyleSheet, Dimensions, Platform } from 'react-native';
var { height, width } = Dimensions.get('window');
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';

let styles = StyleSheet.create ({
    textStyle: {
      fontSize: 20,
      color: 'black',
      paddingVertical: 10,
      fontFamily: Fonts.regFont[Platform.OS],
    },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    width: width - 20,
    marginHorizontal: 10,
  },
  planLabel: {
    fontSize: 20,
    paddingVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    color: StyleConstants.primary,
    fontFamily: Fonts.regFont[Platform.OS],
    fontWeight: '400',
    //marginHorizontal: 10
  },

    row: {
      flexDirection: 'row',
      padding: 10,
      width: width / 4,
    },

  });

module.exports = styles;