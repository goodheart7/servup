import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';

import {updateAddress} from '../../../lib/networkHandler';

let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
	'left_caret': require('../../../res/common/back.png'),
	'check': require('../../../res/common/check.png'),
  'empty': require('../../../res/common/emptyPixel.png'),
};

var KeyboardSet = require('../../common/KeyboardSet');
import MenuBar from '../../common/MenuBar';
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let UpdateAddresses = React.createClass({

  getDefaultProps () {
    return {
      name: '',
			address1: '',
			address2: '',
			zipCode: '',
			city: '',
			state: '',
			country: ''
    };
  },

  getInitialState () {
		let { name, address1, address2, zipCode, city, state, country } = this.props.object;
    return {
      name: name,
      address1: address1,
      address2: address2,
      zipCode: zipCode,
      city: city,
      state: state,
      country: country,
      disable: false,
    }
  },

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({ token: value });
    });
  },

  onPressBack () {
    this.props.navigator.pop();
  },

  onPressSubmit () {
    if (this.state.disable === false) {
      this.formValidate();
    } else {
			this.submitForm();
		}
  },

  formValidate () {
    let { name, address1, zipCode, city, state, country} = this.state;

    let object = {
      name, address1, zipCode, city, state, country
    };

    for (let property in object) {
      if (object[property] === '') {
        Alert.alert(`Field ${property}`, 'This Is A Required Field');
        break;
      }
    }

    check1 = (name !== '' && address1 !== '' && zipCode !== '');
    check2 = (city !== '' && state !== '' && country !== '');

    if (check1 && check2) {
      this.setState({ disable: true }, () => {
				this.submitForm()
			});
    }

  },

  submitForm () {
    let {
			name, address1, address2, zipCode, city, state, country
		} = this.state;

		let {
			addressId, addressType
		} = this.props.object;

		console.log(addressId);

		let {token, disable} = this.state;

		let {navigator} = this.props;

		let object = {
			 addressType, name, address1, address2, zipCode, city, state, country
		};

		console.log(disable);
    if (disable === true) {
      updateAddress(token, object, addressId)
      .then((res) => {
				console.log('Yo Nigger! I am working!', res);
        navigator.popN(2);
      })
      .catch((error) => {
        console.log('Error ', error);
      });
    }
  },

  render () {
    let {type, navigator} = this.props;
    let {disable} = this.state;

    return (
      <View style={styles.container}>

        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Update Address'} // Optional
          leftIcon = {'icon-arrow-left2'}
          rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          onPressRightIcon = {this.onPressSubmit} // Optional
        />

        <ScrollView style={styles.form}>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Name</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "name"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Name"
								value = {this.state.name}
                autoCapitalize = "words"
                autoFocus = {true}
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(name) => {
                  this.setState({ name });
                }}
                onSubmitEditing={(event) => {
                  this.refs.address1.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Address 1</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "address1"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter First Address"
								value = {this.state.address1}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {true}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(address1) => {
                  this.setState({ address1 });
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Address 2</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "address2"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Second Address"
								value = {this.state.address2}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {true}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(address2) => {
                  this.setState({ address2 });
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Zipcode</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "zipcode"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter zipcode"
								value = {this.state.zipCode}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(zipCode) => {
                  this.setState({ zipCode });
                }}
                onSubmitEditing={(event) => {
                  this.refs.city.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>City</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "city"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter City"
								value = {this.state.city}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(city) => {
                  this.setState({ city });
                }}
                onSubmitEditing={(event) => {
                  this.refs.state.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>State</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "state"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter state"
								value = {this.state.state}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(state) => {
                  this.setState({ state });
                }}
                onSubmitEditing={(event) => {
                  this.refs.country.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Country</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "country"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Country"
								value = {this.state.country}
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(country) => {
                  this.setState({ country });
                }}
                onSubmitEditing={this.onPressSubmit}
              />
            </View>
          </View>

        </ScrollView>

        <KeyboardSet/>
      </View>
    )
  }
});

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  form: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  inputGroup: {
    paddingBottom: 10,
  },

  text: {
    // fontWeight: '300',
    color: 'lightslategrey',
    marginTop: 10,
  },

  textInputContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },

  textInput: {
    height: 33,
    padding: 0,
    marginHorizontal: 5,
    marginVertical: 15,
  },

});

export default UpdateAddresses;
