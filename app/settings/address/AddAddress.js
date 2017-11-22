import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  ScrollView,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';

import {postAddress} from '../../../lib/networkHandler';

var KeyboardSet = require('../../common/KeyboardSet');
import MenuBar from '../../common/MenuBar';
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');
let AddAddress = React.createClass({

  getDefaultProps () {
    return {
      type: '',
    };
  },

  getInitialState () {
    return {
      name: '',
      address1: '',
      address2: '',
      zipcode: '',
      city: '',
      state: '',
      country: '',
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
  componentWillUnmount(){
    console.log('@@@@@@@@@@@component Unmount Called');
   /* AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({ token: value });
        // This get method will get all Home Address(es) of user
        return get(value, 'ProfileCard/GetAddress/home');
      })
      .then((value) => {
        // console.log(value);
        this.setState({
          addresses: this.state.addresses.cloneWithRows(value),
          show: true,
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
      });*/
    this.props.onUnmount();
  },
  onPressSubmit () {
    if (this.state.disable === false) {
      this.formValidate();
    }
  },

  formValidate () {
    let {name, address1, address2, zipcode, city, state, country} = this.state;

    let object = {
      name, address1, zipcode, city, state, country, address2
    };

    for (let property in object) {
      if (object[property] === '') {
        Alert.alert(`Field ${property}`, 'This Is A Required Field');
        break;
      }
    }

    check1 = (name !== '' && address1 !== '' && zipcode !== '');
    check2 = (city !== '' && state !== '' && country !== '');

    if (check1 && check2) {
      this.setState({ disable: true }, this.submitForm() );
    }

  },

  submitForm () {
    let {name, address1, address2, zipcode, city, state, country} = this.state;
    let {token, disable} = this.state;
    let {type, navigator} = this.props;

    if ( type !== '' || type !== null || disable === true) {
      let addressType;
      if (type === 'HOME_ADDRESS') { addressType = 'home'}
      if (type === 'BILLING_ADDRESS') { addressType = 'billing'}
      if (type === 'SHIPPING_ADDRESS') { addressType = 'shipping'}

      let object = {
        addressType, name, address1, address2, zipcode, city, state, country
      };

      postAddress(token, object)
      .then((res) => {
        this.props.paymentMethod ? navigator.pop() : navigator.pop();//N(2);

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
          title = {'Add Address'} // Optional
          leftIcon = {'icon-back_screen_black'}
          rightIcon = {'icon-done'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          onPressRightIcon = {this.onPressSubmit} // Optional
        />

        <ScrollView style={styles.form} keyboardShouldPersistTaps={true}>

          <View style={styles.inputGroup}>
            <Text style={[Style.f20, styles.text]}>Name</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref = "name"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Name"
                autoCapitalize = "words"
                autoFocus = {true}
                blurOnSubmit={false}
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "next"
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
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {false}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(zipcode) => {
                  this.setState({ zipcode });
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

export default AddAddress;
