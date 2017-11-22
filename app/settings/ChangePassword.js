import React, {
	Component,
} from 'react';

import {
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
  TextInput,
  Alert
} from 'react-native';

var NavBar = require('../common/NavBar');
import MenuBar from '../common/MenuBar';
var KeyboardSet = require('../common/KeyboardSet');
const dismissKeyboard = require('dismissKeyboard');
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

import {changePassword} from '../../lib/networkHandler';

let images = {
	'right_caret': require('../../res/common/arrow_right.png'),
	'left_caret': require('../../res/common/back.png'),
	'check': require('../../res/common/check.png'),
  'empty': require('../../res/common/emptyPixel.png'),
};

var Settings = React.createClass({

  getInitialState () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  },

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({ token: value });
    });
  },

	onPressBack () {
		this.props.navigator.pop()
	},

  onSubmitForm () {
    let {oldPassword, newPassword, confirmPassword} = this.state;
    if (oldPassword.length !== 0 && newPassword.length >= 8 && confirmPassword.length >= 8 ) {
      this.checkPasswordMatch();
    } else {
      Alert.alert('Error', 'New Password Should Be Atleast 8 Characters');
    }
  },

  checkPasswordMatch () {
    let {oldPassword, newPassword, confirmPassword} = this.state;
    if (newPassword === confirmPassword) {
      let object = {oldPassword, newPassword};
      changePassword(this.state.token, object)
      .then((res) => {
        if(res.message) {
          Alert.alert('Error', res.message);
        } else if(res.isChanged){
          Alert.alert('Success', 'Password Changed Succesfully');
        }
      })
      .catch((err) => {
        console.log('Error :', err);
      });

    } else {
      Alert.alert('Error', 'New Password & Confirm Password Do Not Match');
    }
  },

	render () {

    let {oldPassword, newPassword, confirmPassword} = this.state;
    let {navigator} = this.props;

		return (
			<View style = {styles.container}>
				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Change Password'} // Optional
          leftIcon = {'icon-back_screen_black'}
          rightIcon = {'icon-done'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          onPressRightIcon = {this.onSubmitForm} // Optional
        />

        <ScrollView style={styles.form} keyboardShouldPersistTaps={true}>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Old Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                selectTextOnFocus  = {true}
                ref="oldPassword"
                autoFocus={true}
                placeholder="Current Password"
                keyboardType = "default"
                value = {oldPassword}
                returnKeyType = {'next'}
                underlineColorAndroid = "transparent"
                style={[Style.f16, styles.input]}
                secureTextEntry = {true}
                onChangeText={(oldPassword) => {
                  this.setState({ oldPassword });
                }}
                onSubmitEditing={(event) => {
                  this.refs.newPassword.focus();
                }}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              New Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref="newPassword"
                autoFocus={false}
                placeholder="New Password"
                selectTextOnFocus  = {true}
                value = {newPassword}
                returnKeyType = {'next'}
                underlineColorAndroid = "transparent"
                style={[Style.f16, styles.input]}
                secureTextEntry = {true}
                onChangeText={(newPassword) => {
                  this.setState({ newPassword });
                }}
                onSubmitEditing={(event) => {
                  this.refs.confirmPassword.focus();
                }}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Confirm Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref="confirmPassword"
                autoFocus={false}
                placeholder="Confirm Password"
                selectTextOnFocus  = {true}
                value = {confirmPassword}
                returnKeyType = {'done'}
                underlineColorAndroid = "transparent"
                style={[Style.f16, styles.input]}
                secureTextEntry = {true}
                onChangeText={(confirmPassword) => {
                  this.setState({ confirmPassword });
                }}
                onSubmitEditing={(event) => {
                  this.onSubmitForm();
                }}
              />
            </View>
          </View>

        </ScrollView>
			</View>
		);
	},
});

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: StyleConstants.lightGray,
  },

  form: {
    marginHorizontal: 5,
    marginVertical: 5,
  },

  inputGroup: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  inputContainer: {
    flex: 1,
		height: 60,
		justifyContent: 'center',
  },

	input: {
		height: 40,
    //backgroundColor:'red',
	},

  inputName: {
    width: 120,
    color: 'dimgrey',
    alignSelf: 'center',
  },

});

module.exports = Settings
