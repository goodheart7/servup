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
  TextInput,
  View,
  Alert,
  Image,
  Dimensions,
  Platform,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
//var TimerMixin = require('react-timer-mixin');
const {height, width} = Dimensions.get('window');
import {themeColor as themeColor} from '../common/theme';
import {saveTpin as saveTpin} from '../../lib/networkHandler';
import {sendByEmail as sendByEmail} from '../../lib/networkHandler';
import {sendByEmailPP as sendByEmailPP} from '../../lib/networkHandler';
import {fnt as fnt} from '../common/fontLib';
var TitleBar = require('../common/TitleBar');
const dismissKeyboard = require('dismissKeyboard');


//Mixpanel.sharedInstanceWithToken('c343f769e6fb158f861f3d66fff3fe02');

var SendByEmail = React.createClass(
  {

    getInitialState()
    {
      return {
        nexted: false,
        backed: false,
        userData: '',
        UserPhoneNumber: '',
        UserToken: '',
        disabled: true,
        // style: styles.nextOff,
        email: '',
        style: styles.verifyButtonTextInActive,
      };
    },
    renderExtraSpaceForIOS (){
      if (Platform.OS === 'ios') {
        return (<View style={Style.extraSpaceForIOS}/>)
      } else {
        return (<View/>)
      }
    },
    nextScreenAndToken(data) {
      var analytics = this.state.UserPhoneNumber + " pressed next on send by email screen at " + new Date().toUTCString();
      //	Mixpanel.track(analytics);

      dismissKeyboard();
      if (this.props.PP)
        sendByEmail(this.state.email)
      else
        sendByEmailPP(this.state.email)
          .then((response) => {
            console.log("SendByemail response is:" + JSON.stringify(response));
          })
          .catch((err) => {
            console.log(err);
          })

      if (this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 3].id === 3)
        this.props.navigator.pop();
      else
        this.props.navigator.push({id: 6,});
    },

    backButtonFunction() {
      var analytics = this.state.UserPhoneNumber + " pressed back on send by email screen at " + new Date().toUTCString();
      //	Mixpanel.track(analytics);

      if (this.state.backed == false) {
        this.state.backed = true;
        setTimeout(() => {
          this.state.backed = false;
        }, 1000);
        this.props.navigator.pop();
      }
    },

    buttonDisabler() {
      this.setState({disabled: true, style: styles.verifyButtonTextInActive});
    },

    buttonEnabler()  {
      this.setState({disabled: false, style: styles.verifyButtonTextActive});
    },

    verifyButtonFunction()  {
      this.setState({disabled: true});
      this.setState({style: styles.verifyButtonTextInActive});
      // const Pin = this.state.pin;
      // if (Pin.length == 4)
      // {
      if (this.state.nexted == false) {
        this.state.nexted = true;
        // saveTpin( this.state.UserToken, Pin )
        // .then( (jsonResp) => {
        // var status = jsonResp.status;
        // if (status !== 200)
        // return this.InvalidPinFunction(jsonResp.json.message);
        return this.nextScreenAndToken();
        // })
        // .catch( (err) => {
        // console.log("\n\n\n"+ err);
        // Alert.alert('Server Error', 'There was a problem connecting to the server. Please try again in a while');
        // this.setState({disabled: false});
        // this.setState({style: styles.next});
        // })
      }
      // }
      // else
      // {
      // this.InvalidPinFunction();
      // }
    },

    InvalidPinFunction(message)  {
      this.setState({disabled: false});
      this.setState({style: styles.next});
      this.state.nexted = false;
      if (!message) {
        return Alert.alert(
          'Invalid PIN Number',
          'Please make sure that the number you entered has atleast 4 digits'
        );
      }
      Alert.alert('Error', message);
    },

    componentDidMount()  {
      AsyncStorage.getItem("UserPhoneNumber")
        .then((value) => {
          this.setState({"UserPhoneNumber": value});
          return AsyncStorage.getItem("UserToken");
        })
        .then((value) => {
          this.setState({"UserToken": value});
        })
        .done();
    },

    backFunction()  {
      this.props.navigator.pop();
    },

    emailSet(e) {
      this.setState({email: e});
    },

    render(){
      return (
        <View style={styles.bgColorContainer}>
          <TitleBar
            leftButton={require('../../res/common/back.png')}
            title={"Email"}
            //	titleImage = {require('./images/Servup_logo.png')}
            //	rightButton = {require('../res/common/menu.png')}
            //	rightButton2 = {require('../res/common/wDots.png')}
            //	onLeftButtonPress = {() => this.props.stateSetter() } SUPER SPECIAL MOVE. PASS PROPS TO PARENET!
            onLeftButtonPress={this.backFunction}
            //	onRightButtonPress={this.backFunction}
            //	subText="last seen at 2:10 PM"
            rightText={"Send"}
            onRightButton2Press={this.savePinFunction}
          />
          <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={true}>
            <Text style={styles.lightText}>
              Please enter your email address{'\n'} to recieve Terms and Conditions
            </Text>

            <View style={styles.topMarginSmall}>
              <View style={styles.passwordBorder}>
                <Image
                  source={require('./images/Padlock.png')}
                  resizeMode={'contain'}
                  style={{flex: 1, alignSelf: 'center'}}
                />
                <View style={styles.passwordInput}>
                  <TextInput
                    ref='email'
                    style={styles.passwordText}
                    value={this.state.email}
                    maxLength={50}
                    underlineColorAndroid={"transparent"}
                    returnKeyType={'next'}
                    onChangeText={this.emailSet}
                    //	selectTextOnFocus  = {true}
                    //	secureTextEntry = {true}
                    selectionColor={'dodgerblue'}
                    placeholder={'Enter email address'}
                    placeholderTextColor={'#DDD'}
                    onSubmitEditing={this.gotoP1}
                    onBlur={ this.keyboardDismisser }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    },

    changer(e)  {
      this.setState({disabled: false});
      this.setState({style: styles.verifyButtonTextActive});
      this.setState({email: e});
    },

    savePinFunction() {
      if (this.state.email.length < 'xyz@xyz.com'.length)
        Alert.alert('Incorrect Email', 'The email address you entererd is Incorrect. Please try again.');
      else {
        dismissKeyboard();
        emailAddress = this.state.email;
        this.setState({disabled: true});
        this.setState({style: styles.verifyButtonTextInActive});
        this.verifyButtonFunction();
      }
    },


  });

const styles = StyleSheet.create(
  {
    bgColorContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },

    contentContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      marginTop: height / 20,
      //	justifyContent: 'center',
    },

    backButtonText: {
      fontFamily: fnt.regFont[Platform.OS],
      color: '#FFFFFF',
      fontSize: 22,
    },

    lightText: {
      fontFamily: fnt.regFont[Platform.OS],
      fontSize: 15,
      color: '#666666',
      textAlign: 'center',
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 40,
      marginHorizontal: 10,
    },


    topMarginSmall: {
      marginTop: height / 36,
      alignItems: 'center',
    },

    passwordBorder: {
      flex: 1,
      width: width / 1.25,
      height: height / 12,
      borderWidth: 1,
      borderRadius: width / 3,
      borderColor: '#6666',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    passwordInput: {
      flex: 8,
    },

    passwordText: {
      fontSize: 15,
      textAlign: 'left',
      color: '#666',
      height: height / 15,
      fontFamily: fnt.regFont[Platform.OS],
    },

    resendButton: {
      marginBottom: 10,
      margin: 10,
      alignSelf: 'center',
    },

    inText: {
      top: 10,
      height: 40,
      fontSize: 17,
      borderColor: 'gray',
      borderWidth: 0,
      marginTop: 15,
      marginBottom: 5,
      // margin:50,
      borderTopColor: '#FFFFFF',
      borderLeftColor: '#FFFFFF',
      borderRightColor: '#FFFFFF',
      textAlign: 'center',
    },

    next: {
      padding: 12,
      marginLeft: 100,
      marginRight: 100,
      borderRadius: 5,
      marginTop: 40,
      marginBottom: 20,
      margin: 10,
      backgroundColor: themeColor.wind,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },

    nextOff: {
      padding: 12,
      marginLeft: 100,
      marginRight: 100,
      borderRadius: 5,
      marginTop: 40,
      marginBottom: 20,
      margin: 10,
      backgroundColor: '#999',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },

    verifyButtonTextActive: {
      fontFamily: fnt.regFont[Platform.OS],
      fontSize: 22,
      color: '#FFFFFF',
    },

    verifyButtonTextInActive: {
      fontFamily: fnt.regFont[Platform.OS],
      fontSize: 22,
      color: 'rgba(255, 255, 255, 0.75)',
    },

  });

module.exports = SendByEmail;
