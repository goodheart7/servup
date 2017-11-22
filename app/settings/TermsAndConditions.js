import React, {
  Component,
} from 'react';

import {
  Navigator,
  ScrollView,
  TouchableOpacity,
  AppRegistry,
  StyleSheet,
  Text,
  Modal,
  View,
  Alert,
  Image,
  Dimensions,
  Platform,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import {fnt as fnt} from '../common/fontLib';
import {themeColor as themeColor} from '../common/theme';
import {
  registerAppUser,
  verifyPassword,
  sendByEmail,
  sendByEmailPP,
  getTOC	} from '../../lib/networkHandler';


import MenuBar from '../common/MenuBar';
const {height, width} = Dimensions.get('window');
var frame = height/1.7;

var TermsAndConditions = React.createClass(
  {
    getInitialState() {
      AsyncStorage.getItem("UserPhoneNumber")
        .then((value) => {
          this.setState({"UserPhoneNumber": value});
        })
        .done();

      return {
        disabled: false,
        terms:'',
        agreed: false,
        disagreed: false,
        modalOpen: false,
        backed: false
      };
    },

    componentDidMount() {
      setTimeout(this.stopLoader, 50);
      AsyncStorage.getItem("UserPhoneNumber")
        .then((value) => {
          this.setState({"UserPhoneNumber": value});
          return AsyncStorage.getItem("UserEmail")
        })
        .then((value) => {
          this.setState({"UserEmail": value});
          return AsyncStorage.getItem("UserPassword")
        })
        .then((value) => {
          this.setState({"UserPassword": value});
          return AsyncStorage.getItem("Name")
        })
        .then((value) => {
          console.log('value', value);
          this.setState({"Name": value});
          return getTOC();
        })
        .then((value) => {
          console.log('value', value);
          this.setState({"terms": value});
        })
        .done();
    },

    stopLoader() {
      this.setState({loader: false});
    },

    render() {
      console.log("PP is: " + this.props.PP);
      return(
        <View style = {styles.bgColorContainer}>
          <MenuBar
            // color = {'red'} // Optional By Default 'black'
            title = {'Terms & Conditions'} // Optional
            leftIcon = {'icon-arrow-left2'}
            // disableLeftIcon = {true} // Optional By Default false
            // disableRightIcon = {true} // Optional By Default false
            onPressLeftIcon = {() => this.props.navigator.pop()} // Optional
          />

          <View style={styles.scrollBox}>
            <ScrollView contentContainerStyle={styles.contentContainer} bounces = {false}>


              <Text style={styles.headingFont}>
                General
              </Text>
              <Text style={{color:'black'}}>
                {this.state.terms}
              </Text>
            </ScrollView>
          </View>
        </View>
      )
    }
  });

const styles = StyleSheet.create(
  {
    bgColorContainer:
      {
        //	height: height,
        flex: 1,
        backgroundColor: '#FFFFFF',
      },

    emailView:
      {
        marginTop: 25,
        marginBottom: 25,
        borderWidth: 1,
        borderRightColor: '#FFFFFF',
        borderLeftColor: '#FFFFFF',
        borderBottomColor: '#D7D7D7',
        borderTopColor: '#D7D7D7',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 15,
      },

    emailViewText:
      {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        color: themeColor.wind,
        fontSize: 14,
        fontFamily: fnt.regFont[Platform.OS],
      },

    contentContainer:
      {
        backgroundColor: '#FFFFFF',
        // marginHorizontal: 20,
      },

    scrollBox:
      {
        // height: frame,
        flex: 1,
        backgroundColor: '#FFFFFF',
      },

    eulaFont:
      {
        fontFamily: fnt.regFont[Platform.OS],
        fontSize: 14,
        color: '#666666',
        margin:10,
        alignSelf: 'flex-start',
        marginHorizontal: 20,
        textAlign: 'left',
      },

    headingFont:
      {
        color: themeColor.wind,
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 20,
        fontFamily: fnt.regFont[Platform.OS],
      },

    rowView:
      {
        // flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderWidth: 1,
        borderRightColor: '#FFFFFF',
        borderLeftColor: '#FFFFFF',
        borderBottomColor: '#333',
        borderTopColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        height: height*0.1,
      },

    YButton:
      {
        marginRight: 5,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
      },

    NButton:
      {
        marginLeft: 5,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
      },

    YNButtonText:
      {
        color: themeColor.wind,
        fontSize: 15,
        fontFamily: fnt.regFont[Platform.OS],
        marginHorizontal: 15,
      },

    YNButtonText2:
      {
        // fontWeight: '500',
        color: themeColor.wind,
        fontSize: 15,
        fontFamily: fnt.regFont[Platform.OS],
        marginHorizontal: 15,
      },
  });

module.exports = TermsAndConditions
/**
 * Created by Shoaib on 12/16/2016.
 */
