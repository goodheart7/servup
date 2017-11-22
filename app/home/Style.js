import { StyleSheet, Dimensions, Platform } from 'react-native';
var { height, width } = Dimensions.get('window');
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:'#F2F1EF'
  },

  listView: {
    flex: 1,
    backgroundColor: '#F2F1EF',
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: StyleConstants.primary,
  },

  transparentTitle: {
    position: 'absolute',
    paddingHorizontal: 20,
    // top: Platform.OS === 'ios' ? 30: 20,
    top: 15,
    left: 0,
    right: 0,
    zIndex: 1,
  },

  parallax: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleConstants.TitleParallaxHeight,
  },

  sticky: {
    height: StyleConstants.TitleFixedHeight,
  },

  splash: {
    width: width,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: StyleConstants.primary,
  },

  rowPadding: {
    paddingVertical: 8,
    paddingHorizontal:10,
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
    fontWeight: 'bold',
    color: 'red',
    fontFamily: Fonts.regFont[Platform.OS],
  },

  coverPicContainer: {
    height: 100,
    width: width,
    backgroundColor: 'rgba(51,51,51,1)',
    borderColor: '#F2F1EF',
    justifyContent: 'flex-end',
  },

  profileImagePlaceholder: {
    width: 68,
    height: 68,
    borderWidth: 2,
    borderRadius: 35,
    borderColor: 'white',
    backgroundColor: StyleConstants.gray,
    marginHorizontal: 10,
  },

  profileImageStyle: {
    width: 68,
    height: 68,
    borderWidth: 2,
    borderRadius: 35,
    borderColor: 'white',
    alignSelf: 'center',
  },

  penAndSwitch: {
    marginTop: Platform.OS === 'ios' ? 40: 30,
  },

  tickStyle: {
    marginLeft: 20,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
  },

});

module.exports = styles;
