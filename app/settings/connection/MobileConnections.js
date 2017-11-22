import React, {
  Component,
} from 'react';

import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
} from 'react-native';

import {
  Style,
  Fonts
} from '../../stylesheet/style';

import MenuBar from '../../common/MenuBar';
var bgWhite = '#FFFFFF';
var arrow_right = require('../../../res/common/arrow_right.png');



var MobileConnections = React.createClass(
  {
    getInitialState()
    {
      return {backed: false}
    },

    backFunction()
    {
      if (this.state.backed == false) {
        this.state.backed = true;
        setTimeout(()=> {
          this.state.backed = false;
        }, 1000);
        this.props.navigator.pop();
      }
    },

    firstField()
    {

    },

    secondField()
    {

    },

    thirdField()
    {
      this.props.navigator.push({id: 103});
    },

    forthField()
    {
      this.props.navigator.push({id: 90});
    },

    loyalltyField()
    {
      this.props.navigator.push({id: 138});
    },

    walletField()
    {
      this.props.navigator.push({id: 135});
    },


    render () {
      let {navigator} = this.props;

      return (
        <View style={styles.scrollBox}>

          <MenuBar
            // color = {'red'} // Optional By Default 'black'
            title = {'Mobile Connection'} // Optional
            leftIcon = {'icon-arrow-left2'}
            // rightIcon = {'icon-done2'} // Optional
            // disableLeftIcon = {true} // Optional By Default false
            // disableRightIcon = {true} // Optional By Default false
            onPressLeftIcon = {() => { navigator.pop() }} // Optional
            // onPressRightIcon = {() => { navigator.pop() }} // Optional
          />

          <ScrollView bounces={false} style={{flex: 1}} keyboardShouldPersistTaps={true}>

              <TouchableOpacity style={Style.listRow} onPress={this.firstField}>
                <View style={Style.rowWithSpaceBetween}>
                  <Text style={styles.textStyle}>
                    Operator
                  </Text>
                  <Text style={styles.textStyleGreyed}>
                      Telco
                  </Text>
                </View>

              </TouchableOpacity>

              <TouchableOpacity style={Style.listRow}  onPress={this.secondField}>
                <View style={Style.rowWithSpaceBetween}>
                  <Text style={styles.textStyle}>
                    Mobile Number
                  </Text>
                  <Text style={styles.textStyleGreyed}>
                    +1 560 6000{" "}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.greyArea}/>

              <TouchableOpacity style={Style.listRow} onPress={this.forthField}>
                <View style={Style.rowWithSpaceBetween}>
                  <View style={{flexDirection:'row'}}>
                    <Image
                      style={{ marginRight :10 }}
                      source = {require('../../../res/common/network_settings.png')}
                    />
                    <Text style={styles.textStyle}>
                      Network Settings
                    </Text>
                  </View>
                  <View style={{alignSelf:'center'}}>
                    <Image source={arrow_right}/>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={Style.listRow} onPress={()=>{this.props.navigator.push({id :91})}}>
                <View style={Style.rowWithSpaceBetween}>
                  <View style={{flexDirection:'row'}}>
                    <Image
                      style={{ marginRight :10 }}
                      source = {require('../../../res/common/other_settings.png')}
                    />
                    <Text style={styles.textStyle}>
                      Other Settings
                    </Text>
                  </View>
                  <View style={{alignSelf:'center'}}>
                    <Image source={arrow_right}/>
                  </View>
                </View>
              </TouchableOpacity>

          </ScrollView>
        </View>
      );
    },
  });

const styles = StyleSheet.create(
  {
    scrollBox: {
      flex: 1,
      backgroundColor: bgWhite,
    },


    textStyle: {
      //alignSelf: 'center',
      fontSize: 14,
      color: '#333',
      fontFamily: Fonts.regFont[Platform.OS],
    },
    greyArea: {
      backgroundColor: '#eeeeee',
      height: 15,
    },

    textStyleGreyed: {
      fontSize: 14,
      color: '#6666',
      fontFamily: Fonts.regFont[Platform.OS],
    },

  });

module.exports = MobileConnections
