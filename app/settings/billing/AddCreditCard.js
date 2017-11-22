import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
  TextInput,
  ScrollView,
  Alert,
  AsyncStorage
} from 'react-native';

var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';
var KeyboardSet = require('../../common/KeyboardSet');
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import {createCardToken} from './api/createCardToken';
import {AddCustomerPaymentMethod} from '../../../lib/networkHandler';
import Errors from './ErrorMessages';

let images = {
	'left_caret': require('../../../res/common/back.png'),
	'check': require('../../../res/common/check.png'),
};

let creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;


let AddCreditCard = React.createClass({

  getInitialState () {
    return {
      name: '',
      cardno: '',
      expiryMonth: '',
      expiryYear: '',
      secureCode: '',
      error: false,
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

  clearForm () {
    this.setState({
      cardno: '',
      expiryMonth: '',
      expiryYear: '',
      secureCode: '',
    });
  },

  onSubmitForm () {
    let {cardno, expiryMonth, expiryYear, secureCode} = this.state;
    let validate = (cardno !== '' || expiryMonth !== '' || expiryYear !== '' || secureCode !== '');

    if (validate) {
      let object = {cardno, expiryMonth, expiryYear, secureCode};

      createCardToken(object)
      .then((res) => {
        if (res.error) {
          this.clearForm();
          return Promise.reject({message: res.error.message});
        } else {
          // console.log('Yo Stripe: ', res);
          // console.log('Yo Stripe: ', res.id);
          // res.id is the token provided by Stripe
          return res;
        }
      })
      .then((res) => {
        if (res.id) {
          let object = {
            "name": this.state.name,
            "addtionalParameters": {
              "token": res.id,
              "last4": res.card.last4,
              "brand": res.card.brand,
              "country": res.card.country,
              "exp_month": res.card.exp_month,
              "exp_year": res.card.exp_year,
              "funding": res.card.funding,
            }
          };
          return object;
        }
        else {
          return Promise.reject({ message: 'darnit rigged' });
        }
      })
      .then((value) => {
        if (value) {
          return AddCustomerPaymentMethod(this.state.token, value);
        } else {
          return Promise.reject({ message: Errors.WrongBody });
        }
      })
      .then((value) => {
        // console.log(value);
        if(this.props.routedFrom=='paymentMethodAddedLater') {
          this.props.navigator.replace({id:110, transactionId: this.props.transactionId, subscriptionId: this.props.subscriptionId});
        //  this.props.onUnmount();
        }
        else {
          this.props.navigator.popN(2);
        }

      })
      .catch((error) => {
        Alert.alert(Errors.Wrong, error.message);
        console.log('AddCreditCard.js Error: ', error.message);
      });
    } else {
      Alert.alert(Errors.Required, Errors.RequiredBody);
    }
  },

  onChangeCardNo (cardno) {
    this.setState({ cardno });
  },

  onSubmitCardNo (e) {
    let nospaceordash = this.state.cardno.replace(/-|\s/g,"")
    this.setState({ cardno: nospaceordash }, () => {
      let {cardno} = this.state;
      if (creditCardRegex.test(cardno)) {
        this.refs.expiryMonth.focus();
      } else {
        this.setState({ cardno: '' }, () => {
          Alert.alert(Errors.CardErrorHeading, Errors.CardErrorBody);
          this.refs.cardno.focus();
        });
      }
    });
  },

  render () {
    let {name, cardno, expiryMonth, expiryYear, secureCode} = this.state;
    let {navigator} = this.props;

    return (
      <View style={styles.container} >
				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Add Payment'} // Optional
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
              Name
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref="name"
                autoFocus={true}
                placeholder="Card Holder Name"
                keyboardType = "default"
                value = {name}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[Style.f16, styles.input]}
                onChangeText={(name) => {
                  this.setState({ name });
                }}
                onSubmitEditing={(event) => {
                  this.refs.cardno.focus();
                }}
              />
            </View>
          </View>

					<View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Card Number
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
  							ref="cardno"
  							placeholder="Enter Card Number"
                keyboardType = "phone-pad"
                maxLength = {20}
                value = {cardno}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
  							style={[Style.f16, styles.input]}
                onChangeText={this.onChangeCardNo}
                onSubmitEditing={this.onSubmitCardNo}
  						/>
            </View>
					</View>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Expiry Month
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
  							ref="expiryMonth"
  							placeholder="MM"
                keyboardType = "phone-pad"
                maxLength = {2}
                value = {expiryMonth}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
  							style={[Style.f16, styles.input]}
                onChangeText={(expiryMonth) => {
                  this.setState({ expiryMonth }, () => {
                    if (expiryMonth.length === 2) {
                      this.refs.expiryYear.focus()
                    }
                  });
                }}
                onSubmitEditing={(event) => {
                  this.refs.expiryYear.focus();
                }}
  						/>
            </View>
					</View>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Expiry Year
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
  							ref="expiryYear"
  							placeholder="YY"
                keyboardType = "phone-pad"
                maxLength = {2}
                value = {expiryYear}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
  							style={[Style.f16, styles.input]}
                onChangeText={(expiryYear) => {
                  this.setState({ expiryYear });
                }}
                onSubmitEditing={(event) => {
                  this.refs.secureCode.focus();
                }}
  						/>
            </View>
					</View>

          <View style={[styles.inputGroup, Style.row]}>
            <Text style={[styles.inputName, Style.f16]}>
              Secury Code
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
  							ref="secureCode"
  							placeholder="CVC"
                keyboardType = "phone-pad"
                maxLength = {3}
                value = {secureCode}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
  							style={[Style.f16, styles.input]}
                onChangeText={(secureCode) => {
                  this.setState({ secureCode });
                }}
                onSubmitEditing={(event) => {
                  this.onSubmitForm();
                }}
  						/>
            </View>
					</View>

				</ScrollView>

        <KeyboardSet/>
      </View>
    );
  }
});

const styles = StyleSheet.create({

	container: {
		flex:1,
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
	},

  inputName: {
    width: 120,
    color: 'dimgrey',
    alignSelf: 'center',
  },


});

export default AddCreditCard;
