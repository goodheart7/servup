import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

import Icon from '../stylesheet/icons'

export default class MenuBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      title,
      leftIcon,
      rightIcon,
      rightImage,
      searchPlate,
      color,
      onPressLeftIcon,
      onPressRightIcon,
      disableLeftIcon,
      disableRightIcon
    } = this.props;

    fontColor = color ? color : 'black';
    leftBtnDisable = disableLeftIcon ? disableLeftIcon : false;
    rightBtnDisable = disableRightIcon ? disableRightIcon : false;
    titleBarText = title.length >= 22 ? title.substring(0, 18) : title;


    renderSearchPlate = () => {
      if (searchPlate) {
        return (
          <TouchableOpacity onPress={onPressLeftIcon} style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            backgroundColor: '#f2f2f2',
            height: 35,
            flex:4,
            marginTop: 13
          }}>
            <View style={{paddingVertical: 5, marginLeft: 10}}>
              <Icon name={searchPlate} fontSize={18} color={'grey'}/>
            </View>
            <Text style={{
              color: 'grey',
              paddingHorizontal: 14,
              fontFamily: Fonts.regFont[Platform.OS],
              paddingVertical: 6,
              fontSize: 16
            }}>Search Servup</Text>
          </TouchableOpacity>
        );
      }
    },
      renderRightSide = () => {
        if (rightIcon) {
          if (rightIcon === '+') {
            return (
              <TouchableOpacity
                onPress={onPressRightIcon}
                disabled={rightBtnDisable}
                style={styles.button}
              >
                <Text style={[styles.sign, {color: fontColor}]}>+</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              onPress={onPressRightIcon}
              disabled={rightBtnDisable}
              style={styles.button}
            >
              <Icon name={rightIcon} fontSize={25} color={fontColor}/>
            </TouchableOpacity>
          );
        }
        else if (rightImage) {
          return (
            <TouchableOpacity
              onPress={onPressRightIcon}
              disabled={rightBtnDisable}
              style={[styles.button, {marginLeft:10}]}
            >
              <Image
                style={{width: 34, height: 34, borderRadius:17}}
                source={rightImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          );
        }
        else {
          return (
            <View style={styles.empty}></View>
          );
        }
      }


    return (

        <View style={[styles.container, Style.rowWithSpaceBetween]}>
          <TouchableOpacity
            onPress={onPressLeftIcon}
            disabled={leftBtnDisable}
            style={styles.button}
          >
            <Icon name={leftIcon} fontSize={18} color={fontColor}/>
          </TouchableOpacity>
          {renderSearchPlate()}
          <Text style={[styles.titlebarName, {color: fontColor}]}>{titleBarText}</Text>

          {renderRightSide()}
        </View>

    );
  }

}

const styles = StyleSheet.create({

  container: {
    // flex: 1,
    height: 60,
    backgroundColor: 'white',//'#FCFFF5',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  titlebarName: {
    fontSize: 20,
    fontFamily: Fonts.regFont[Platform.OS],
    alignSelf: 'center',
  },

  sign: {
    fontSize: 40,
    fontFamily: Fonts.regFont[Platform.OS],
    alignSelf: 'center',
  },

  button: {
    justifyContent: 'center',
  },

  empty: {
    width: 20, height: 20,
    alignSelf: 'center',
    backgroundColor: '#FCFFF5',
  },

});
