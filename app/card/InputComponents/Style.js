/**
 * Created by Shoaib on 11/16/2016.
 */
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

let attributeStyle = StyleSheet.create ({
  textStyle: {
    fontSize: 20,
    color: 'black',
    paddingVertical: 10
  },

  row: {
    flexDirection: 'row',
    //padding: 10,
    height: 30,
    marginHorizontal:20,
    //width:width/4,
    justifyContent:'center',
    alignSelf:'flex-start',
    alignItems:'center',
    //backgroundColor:'blue'
    marginVertical:5,
  },
  valueText: {
    fontSize: 16,
    color: 'black',
    alignSelf:'center',
    paddingVertical:6,
    justifyContent:'center',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    width: width - 20,
    marginHorizontal: 10,
  },

});

module.exports = attributeStyle;