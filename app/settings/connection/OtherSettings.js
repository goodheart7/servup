import React, {
  Component,
} from 'react';

import {
  Navigator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Switch,
  Platform
} from 'react-native';

import {
  Style,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import MenuBar from '../../common/MenuBar';
var NavBar = require('../../common/NavBar');

let images = {
  'back': require('../../../res/common/back.png'),
  'right_caret': require('../../../res/common/arrow_right.png')
}

var NetworkSettings = React.createClass({

  getInitialState () {
    return {
      block: false,
    }
  },

  onPressBack () {
    this.props.navigator.pop();
  },

  render () {
    return (
      <View style = {styles.scrollBox}>

        <MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {'Other Settings'} // Optional
					leftIcon = {'icon-arrow-left2'}
					rightIcon = {'icon-done2'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => { this.props.navigator.pop() }} // Optional
					// onPressRightIcon = {() => { navigator.pop() }} // Optional
				/>

        <TouchableOpacity style={Style.listRow} onPress={this.forthField}>
            <View style={Style.rowWithSpaceBetween}>
              <Text style={styles.textStyle}>
                Current Package
              </Text>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.textStyle}>
                  Prepaid
                </Text>
                <View style={{alignSelf:'center'}}>
                 <Image source={images.right_caret}/>
                </View>
              </View>
            </View>
        </TouchableOpacity>

        <View style={styles.greyArea}/>

        <View style = {Style.listRow}>
          <View style={Style.rowWithSpaceBetween}>
            <Text style = {styles.textStyle}>
              Block Line Temporary
            </Text>

            <Switch
              style = {styles.switchArea}
              value = {this.state.block}
              // onValueChange = {(block) => this.setState({block})}
            />
          </View>
        </View>
      </View>
    );
  }

});

const styles = StyleSheet.create({
  scrollBox: {
    flex:1,
    height: height,
    backgroundColor: '#ececec',
  },

  cols: {
    flex:1,
    borderWidth: 4,
    borderColor: '#ececec',
    borderBottomWidth: 0,
  },

  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 1,
    borderWidth: 1,
    borderBottomColor: '#ececec',
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    backgroundColor: 'white',
  },

  textStyle: {
    //alignSelf: 'flex-start',
    fontSize: 14,
    marginRight: 10,
    color: 'grey',
    fontFamily: Fonts.regFont[Platform.OS],
  },

  switchArea: {
    alignSelf: 'flex-end',
  },

  greyArea: {
    backgroundColor: '#eeeeee',
    height: 15,
  },

});

module.exports = NetworkSettings
