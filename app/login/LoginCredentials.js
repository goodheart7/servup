import React, {
	Component,
} from 'react';

import {
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Image,
	Platform,
	AsyncStorage,
	Dimensions,
	Navigator,
	TextInput,
	Alert,
} from 'react-native';

import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import Modalbox from 'react-native-modalbox';

import {
	registerPin,
	resendPin,
} from '../../lib/networkHandler';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import AppConstants from '../AppConstants';

const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');

import KeyboardSet from '../common/KeyboardSet';
import SmsListener from 'react-native-android-sms-listener';

var LoginCredentials = React.createClass({

	getInitialState() {
		return {
			pin1: '',
			pin2: '',
			pin3: '',
			pin4: '',
			fullPin: '',

			modalOpen: false,
			correctPinEntered: false,

			position:'bottom',
			name: '',
			email: '',
			p1: '',
			p2: '',
		};
	},

	componentDidMount() {
		this.getSms = SmsListener.addListener(message => {
			console.info(message);
		});
		AsyncStorage.getItem("UserPhoneNumber")
		.then((value) => {
			this.setState({ "UserPhoneNumber": value});
		})
		.done();
		setTimeout(this.stopLoader, 50);
	},

	componentWillUnmount() {
		this.getSms.remove();
	},

	stopLoader() {
		this.setState({ loader: false });
	},

	startLoader() {
		this.setState({ loader: true });
	},

	InvalidPinFunction() {
		this.stopLoader();
		Alert.alert('Invalid Pin Number', 'Please make sure that the PIN number you entered is valid',
			[
				{text: 'OK', onPress: () => this.resetInputs()},
			]
		);
	},

	modalOpener() {
		this.setState ({correctPinEntered: true, modalOpen: true});
	},

	renderExtraSpaceForIOS (){
		if (Platform.OS === 'ios') {
			return (<View style={Style.extraSpaceForIOS}/>)
		}
		else {
			return (<View/>)
		}
	},

	nextScreenAndToken() {
		this.stopLoader();
		this.validationCheck('email');
		this.validationCheck('password');
		if (this.state.email.length >= 8 && this.state.p1.length >= 8 ) {
			AsyncStorage.setItem("Name", this.state.name);
			AsyncStorage.setItem("UserEmail", this.state.email);
			AsyncStorage.setItem("UserPassword", this.state.p2,);
			this.getSms.remove();
			this.props.navigator.push({ id: 4 });
		}
	},

	pin1(e) {
		if (e.length != 0) {
			this.refs.f2.focus();
		}
		this.setState({ pin1: e });
	},

	pin2(e) {
		this.setState({ pin2: e });
		if (e == '' && this.state.pin2 != ''){
			this.refs.f1.focus();
		} else {
			this.refs.f3.focus();
		}
	},

	pin3(e) {
		this.setState({ pin3: e, pin4: '' });
		if (e == '' && this.state.pin3 != '') {
			this.refs.f2.focus();
		} else {
			this.refs.f4.focus();
		}
	},

	pin4(e) {
		if (e == '') {
			this.refs.f3.focus();
    	this.setState({ pin4: '' });
    } else {
      this.setState({ pin4: e }, function() {
				this.checkPin();
			});
    }
	},

	checkPin() {
		let {pin1, pin2, pin3, pin4} = this.state;

		dismissKeyboard();
		this.startLoader();
		var pin = pin1 + pin2 + pin3 + pin4;

		this.setState({fullPin: pin }, function() {
			console.log ('fullPin: ' + this.state.fullPin);
			registerPin(this.state.UserPhoneNumber, this.state.fullPin)
			.then((resp) => {
				//var status = jsonResp._bodyText;
				// console.log ('status : ' + status);
				// status='any'
				if (!resp.isVerified) return this.InvalidPinFunction();
				else return this.modalOpener();
			})
			.catch((err) => {
				this.stopLoader();
				console.log("ERROR: "+ err);
				Alert.alert('Server Error', AppConstants.ServerFailureMessage);
			});
		});
	},

	resetInputs(){
		this.setState({
			pin1: ' ',
			pin2: ' ',
			pin3: ' ',
			pin4: ' '
		}, function(){
			this.refs.f1.focus();
		});
	},

	resendPIN() {
		this.startLoader();
		resendPin(this.state.UserPhoneNumber);
		Alert.alert('', 'A PIN has sent to your Number');
		this.stopLoader();
	},

	emailSet(e) {
		this.setState({ email: e });
	},

	nameSet(e) {
		this.setState({ name: e });
	},

	pass1(p) {
		this.setState ({p1: p});
	},

	pass2(p) {
		this.setState ({p2: p}, function() {
			if (this.state.p1.length == this.state.p2.length)
				this.submitPasswords();
		});

	},

	validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},

	gotoEmail() {
		let {name} = this.state;
		if(name.length > 0) {
			this.stopLoader();
			this.refs.email.focus();
		} else {
			Alert.alert('Incorrect Name', 'Please make sure that your name is not empty.',
			[
				{text: 'OK', onPress: () => this.refs.name.focus()},
			]);
		}
	},

	gotoP1() {
		let flag = this.validateEmail(this.state.email);
		console.log('Flag', flag);
		if (flag) {
			this.setState({correctEmail:true});
			this.stopLoader();
			this.focusOnP1();
		}
		else
			Alert.alert('Incorrect Email Address', 'Please make sure that the email address you entered is correct.',
			[
				{text: 'OK', onPress: () => this.refs.email.focus()},
			]);
	},

	gotoP2() {
		if (this.state.p1.length >= 8) {
			this.setState({correctPassword:true});
			this.refs.p2.focus();
		}
		else
			Alert.alert('Password too short', 'Please make sure that the password you entered has atleast 8 characters.',
			[
				{text: 'OK', onPress: () => this.focusOnP1()},
			]);
	},

	focusOnP1() {
		this.stopLoader();
		this.refs.p1.focus();
	},

	validationCheck(type) {
		let flag = this.validateEmail(this.state.email)
		if (!flag && type == 'email') {
			this.gotoP1();
		}
		else if(this.state.p1.length < 8 && type == 'password') {
			this.gotoP2();
		}
	},

	submitPasswords() {
		this.startLoader();
		if (this.state.p1 == this.state.p2) {
			this.stopLoader();
			this.nextScreenAndToken();
		}
		else {
			this.setState({correctPassword: true})
			Alert.alert('Passwords do not match', 'Please make sure that you entered the same password in both fields.',
			[
				{text: 'OK', onPress: () => this.focusOnP1()},
			]);
		}
	},

	render(){

		let {
			correctPinEntered,
			loader,
			modalOpen
		} = this.state;

		let renderVerificationCodeMessage = () => {
			if (correctPinEntered) {
				return <View />;
			} else {
				return (

					<View>
					<Text style = {[Style.heading, Style.textColorWhite, styles.title]}>
						Verify Phone Number
					</Text>
					<Text style={styles.subheading}>
						A verification code has been sent. {'\n'}
						Enter to verify this number.
					</Text>
					</View>
				);
			}
		}

		let renderResendMessageOrSuccess = () => {
			if (correctPinEntered)
				return (
					<Image
						source={require('./images/success_check.png')}
						resizeMode={'contain'}
						style={styles.tickIcon}
					/>
				);
			else
				return (
					<View>
						<View style={[Style.row, Style.center]}>
							<Text style = {styles.text}>
								Didn't get the code?
							</Text>
							<TouchableOpacity
								onPress = {() => this.resendPIN() }
							>
								<Text style = {[styles.text, styles.textBoldAndUnderline]}>
									Resend
								</Text>
							</TouchableOpacity>
						</View>
						<View style={[Style.center, styles.pincode]}>
							<View style = {styles.pincodeInputContainer}>
								<TextInput
									ref = 'f1'
									autoFocus = {true}
									style = {styles.pincodeInputText}
									value={this.state.pin1}
									keyboardType ='phone-pad'
									maxLength = {1}
									underlineColorAndroid = {"transparent"}
									returnKeyType = {'next'}
									onChangeText = {this.pin1}
									selectTextOnFocus  = {true}
									selectionColor = {'dodgerblue'}
									placeholderTextColor  = {'#DDD'}
									secureTextEntry = {true}
									onSubmitEditing = {this.saveVarFunction}
									onBlur = { this.saveVarFunction }
								/>
							</View>
							<View style = {styles.pincodeInputContainer}>
								<TextInput
									ref = 'f2'
									style = {styles.pincodeInputText}
									value={this.state.pin2}
									keyboardType ='phone-pad'
									maxLength = {1}
									underlineColorAndroid = {"transparent"}
									returnKeyType = {'next'}
									onChangeText = {this.pin2}
									selectTextOnFocus  = {true}
									selectionColor = {'dodgerblue'}
									placeholderTextColor  = {'#DDD'}
									secureTextEntry = {true}
								/>
							</View>
							<View style = {styles.pincodeInputContainer}>
								<TextInput
									ref = 'f3'
									style = {styles.pincodeInputText}
									value={this.state.pin3}
									keyboardType ='phone-pad'
									maxLength = {1}
									underlineColorAndroid = {"transparent"}
									returnKeyType = {'next'}
									onChangeText = {this.pin3}
									selectTextOnFocus  = {true}
									selectionColor = {'dodgerblue'}
									placeholderTextColor  = {'#DDD'}
									secureTextEntry = {true}
								/>
							</View>
							<View style = {styles.pincodeInputContainer}>
								<TextInput
									ref = 'f4'
									style = {styles.pincodeInputText}
									value={this.state.pin4}
									keyboardType ='phone-pad'
									maxLength = {1}
									underlineColorAndroid = {"transparent"}
									returnKeyType = {'next'}
									onChangeText = {this.pin4}
									selectTextOnFocus  = {true}
									selectionColor = {'dodgerblue'}
									placeholderTextColor  = {'#DDD'}
									secureTextEntry = {true}
								/>
							</View>
						</View>
					</View>
				);
		}

		return (
			<View style = {styles.container}>
				<TouchableOpacity onPress = {() => this.props.navigator.pop() }>
					<Image
						source = {require('../../res/common/back.png')}
						resizeMode={'contain'}
					/>
				</TouchableOpacity>

				{renderVerificationCodeMessage()}

				

				{renderResendMessageOrSuccess()}

				<ActivityIndicator
					animating = {this.state.loader}
					style = {{top: height/2, bottom: 0, left: 0, right: 0, zIndex: 1}}
					color = {StyleConstants.primary}
					size = {'large'}
				/>

				<Modalbox
					isOpen = {modalOpen}
					position = {'bottom'}
					backdrop = {false}
					style = {styles.modalBoxContainer}
					swipeToClose = {false}
				>
					<View style = {{flex: 1}}>
						<View style = {[styles.inputGroup]}>
							<TextInput
								ref = 'name'
								style = {styles.inputTextStyle}
								value={this.state.name}
								maxLength = {50}
								autoCapitalize = "words"
								underlineColorAndroid = {"transparent"}
								returnKeyType = {'next'}
								onChangeText = {this.nameSet}
								selectTextOnFocus  = {true}
								autoFocus = {true}
								selectionColor = {'dodgerblue'}
								placeholder = {'Your Name'}
								placeholderTextColor  = {'#DDD'}
								onSubmitEditing = {this.gotoEmail}
							/>
						</View>

						<View style = {[styles.inputGroup,]}>
							<TextInput
								ref = 'email'
								style = {styles.inputTextStyle}
								value={this.state.email}
								maxLength = {50}
								underlineColorAndroid = {"transparent"}
								returnKeyType = {'next'}
								onChangeText = {this.emailSet}
								selectTextOnFocus  = {true}
								autoFocus = {false}
								selectionColor = {'dodgerblue'}
								placeholder = {'Your Email Address'}
								placeholderTextColor  = {'#DDD'}
								onSubmitEditing = {this.gotoP1}
							/>
						</View>

						<View style = {[styles.inputGroup,]}>
							<TextInput
								ref = 'p1'
								style = {styles.inputTextStyle}
								value={this.state.p1}
								maxLength = {25}
								underlineColorAndroid = {"transparent"}
								returnKeyType = {'next'}
								onChangeText = {this.pass1}
								selectTextOnFocus  = {true}
								secureTextEntry = {true}
								selectionColor = {'dodgerblue'}
								placeholder = {'Password'}
								placeholderTextColor  = {'#DDD'}
								onSubmitEditing = {this.gotoP2}
								onFocus = {() => {this.validationCheck('email')}}
							/>
						</View>

						<View style={[styles.inputGroup,]}>
							<TextInput
								ref = 'p2'
								style = {styles.inputTextStyle}
								value={this.state.p2}
								maxLength = {25}
								underlineColorAndroid = {"transparent"}
								returnKeyType = {'done'}
								onChangeText = {this.pass2}
								secureTextEntry = {true}
								selectTextOnFocus  = {true}
				     			selectionColor = {'dodgerblue'}
								placeholderTextColor  = {'#DDD'}
								placeholder = {'Confirm Password'}
								onSubmitEditing = {this.submitPasswords}
								onFocus = {() => {this.validationCheck('password')}}
							/>
						</View>

						<Text style = {[Style.p, {fontSize: 15, marginVertical: 10, fontStyle: 'italic'}]}>
							Password must have atleast 8 characters
						</Text>

					</View>
					<KeyboardSet/>
				</Modalbox>

			</View>
		);
	},

});

const styles = StyleSheet.create({

	container: {
		flexGrow: 1,
		backgroundColor: StyleConstants.primary,
		padding: 20,
	},

	spinner: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
	},

	title: {
		marginVertical: StyleConstants.headingFontSize,
		textAlign: 'center',
	},

	subheading: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	pincode: {
		margin: 20,
		flexDirection: 'row',
		// borderBottomWidth: 1,
		// borderColor: 'red',
	},

	pincodeInputContainer: {
		borderBottomWidth: 1,
		width: 40,
		borderColor: 'white',
		marginHorizontal: 10,
	},

	pincodeInputText: {
		fontSize: 20,
		textAlign: 'center',
		color: 'white',
		height: 50,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	text: {
		fontSize: StyleConstants.h2FontSize,
		color: 'white',
		marginHorizontal: 2,
	},

	textBoldAndUnderline: {
		fontWeight: 'bold',
		// textDecorationLine: 'underline',
	},

	tickIcon: {
		marginTop: 120,
		alignSelf: 'center',
	},

	modalBoxContainer: {
		// flexGrow: 1,
		height: height*0.9,
		backgroundColor: 'white',
		// top:13
		padding: 20,
	},

	modalHeading: {
		fontSize: 20,
		textAlign: 'center',
		color: StyleConstants.primary,
	},

	inputGroup: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',
		borderBottomWidth: 1,
		borderColor: '#6666',
	},

	inputIcon: {
		flexGrow: 1,
		alignSelf: 'center'
	},

	inputText: {
		flex: 1,
		justifyContent: 'center',
	},

	inputTextStyle: {
		// backgroundColor: 'pink',
		fontSize: 20,
		textAlign: 'left',
		color: '#666',
		height: 50,
		width: width/2,
		fontFamily: Fonts.regFont[Platform.OS],
	},

});

module.exports = LoginCredentials;
