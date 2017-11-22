import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ScrollView,
  Image,
  AsyncStorage,
} from 'react-native';
var rightArrow = require('../../res/common/arrow_right.png');

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import Icon from '../stylesheet/icons'
const {height, width} = Dimensions.get('window');

import MenuBar from '../common/MenuBar';
var NavBar = require('../common/NavBar');


var Settings = React.createClass(
  {
    getInitialState () {
      return {backed: false}
    },

    componentDidMount()
    {
      AsyncStorage.getItem("userDetails")
        .then((value) => {
          var userFromStorage = JSON.parse(value);
          console.log('value, ', userFromStorage);
          console.log('value, ', userFromStorage.name);
          this.setState({userName: userFromStorage.name,});
        });
    },

    backFunction() {
      this.props.navigator.pop()
    },

    render () {
      let {navigator} = this.props;

      return (
        <View style={styles.container}>

          <MenuBar
            // color = {'red'} // Optional By Default 'black'
            title={'Settings'} // Optional
            leftIcon={'icon-back_screen_black'}
            // rightIcon = {'icon-inputs-1'} // Optional
            // disableLeftIcon = {true} // Optional By Default false
            // disableRightIcon = {true} // Optional By Default false
            onPressLeftIcon={() => { navigator.pop() }} // Optional
            // onPressRightIcon = {() => { navigator.pop() }} // Optional
          />

          <ScrollView style={styles.wrapper}>
            <TouchableOpacity style={styles.listRow} onPress={() => {navigator.push({ id: 102 })}}>
              <View style={styles.row}>
                <Icon
                  name={'icon-designation_profile'}
                  fontSize={30}
                  color={'black'}
                />
                <Text style={[Style.f18, styles.textStyle]}>Profile</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.textStyle}>
                  {this.state.userName ? this.state.userName : 'Username'}{" "}
                </Text>

                <View style={Style.center}>
                  <Image
                    source={rightArrow}
                    style={{alignSelf:'center', marginHorizontal:10}}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listRow} onPress={() => {navigator.push({ id: 103 })}}>
              <View style={styles.row}>
                <Icon
                  name={'icon-address_settings'}
                  fontSize={30}
                  color={'black'}
                />
                <Text style={[Style.f18, styles.textStyle]}>Addresses</Text>

              </View>

              <View style={Style.center}>
                <Image
                  source={rightArrow}
                  style={{alignSelf:'center', marginHorizontal:10}}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listRow} onPress={() => {navigator.push({ id: 104 })}}>
              <View style={styles.row}>
                <Icon
                  name={'icon-payment_settings'}
                  fontSize={20}
                  color={'black'}
                />
                <Text style={[Style.f18, styles.textStyle]}>Payment and Billing</Text>
              </View>

              <View style={Style.center}>
                <Image
                  source={rightArrow}
                  style={{alignSelf:'center', marginHorizontal:10}}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listRow} onPress={() => {navigator.push({ id: 290 })}}>
              <View style={styles.row}>
                <Icon
                  name={'icon-change_password_settings'}
                  fontSize={28}
                  color={'black'}
                />
                <Text style={[Style.f18, styles.textStyle]}>Change Password</Text>
              </View>

              <View style={Style.center}>
                <Image
                  source={rightArrow}
                  style={{alignSelf:'center', marginHorizontal:10}}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listRow} onPress={() => {navigator.push({ id: 300 })}}>
              <View style={styles.row}>
                <Icon
                  name={'icon-notification_settings'}
                  fontSize={25}
                  color={'black'}
                />
                <Text style={[Style.f18, styles.textStyle]}>Notification Settings</Text>
              </View>

              <View style={Style.center}>
                <Image
                  source={rightArrow}
                  style={{alignSelf:'center', marginHorizontal:10}}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>

          <NavBar navigator={this.props.navigator}/>
        </View>
      );
    },
  });

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  wrapper: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#ececec',
    borderBottomWidth: 0,
  },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 1,
    backgroundColor: 'white',
    borderTopColor: 'white',
    borderBottomColor: '#ececec',
    borderLeftColor: 'white',
    borderRightColor: 'white',
  },

  row: {
    flexDirection: 'row',
  },

  textStyle: {
    marginHorizontal: 20,
    alignSelf: 'center',
    color: 'black',//'#333',
    fontFamily: Fonts.regFont[Platform.OS],
  },

});

module.exports = Settings
