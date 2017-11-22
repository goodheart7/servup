import React, {
	Component,
} from 'react';

import {
	ActivityIndicator,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	Platform,
	StatusBar,
	AsyncStorage,
	Dimensions,
	Navigator,
	TextInput,
	Alert,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import Modalbox from 'react-native-modalbox';
import {
  forgotPasswordPin,
  forgotPassword,
  resetPassword} from '../../lib/networkHandler';

import AppConstants from '../AppConstants';

const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');


var Forgotpassword = React.createClass(
{
	getInitialState(){
		return {
			style: styles.nextOff,
			e1: '',
			disabled: true,
			pin1: '',
			pin2: '',
			pin3: '',
			pin4: '',
			pin5: '',
			pin6: '',
			fullPin: '',
			modalIsOpen: false,
			correctPinEntered: false,
			p1: '',
			p2: '',
		};
	},

	componentDidMount() {
		setTimeout(this.stopLoader, 50);
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
		this.setState({"UserPhoneNumber": value});
		}).done();
	},

	stopLoader() {
		this.setState({loader: false});
	},

	startLoader() {
		this.setState({loader: true});
	},
	buttonDisabler() {
		this.setState({disabled: true, style: styles.nextOff, loader: true,});
	},
  renderExtraSpaceForIOS (){
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  },
	buttonEnabler() {
		this.setState({disabled: false, style: styles.next, loader: false,});
	},
	nextButtonFunction() {
		this.buttonDisabler();
		setTimeout(()=>{ this.buttonEnabler() }, 1000);
		setTimeout(()=>{ this.props.navigator.push({id: 3,}) }, 1250);
	},

	resetInputs(){
		this.stopLoader();
		this.setState({
			style: styles.nextoff,
			disabled: true,
			e1: '',
			pin1: ' ',
			pin2: ' ',
			pin3: ' ',
			pin4: ' ',
			pin5: ' ',
			pin6: ' ',
		}, function(){
			this.refs.f1.focus();
		});
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
		this.setState ({correctPinEntered: true, modalIsOpen: true});
	},

	nextScreenAndToken() {
		this.buttonEnabler();
	},

	changePassword() {
		console.log('@@@@@@@@@@@@@@@@@Set New Password Pressed');
		dismissKeyboard();
		this.startLoader();
		resetPassword(this.state.UserPhoneNumber, this.state.fullPin, this.state.p1)
		.then( (jsonResp) => {
			this.stopLoader();
			return Alert.alert('Password Successfully Reset', 'Your new password has successfully been set.',
			[
				{text: 'OK', onPress: () => this.props.navigator.push ({id: 6})},
			]);
		})
		.catch( (err) => {
			this.stopLoader();
			console.log("ERROR: "+ err);
			Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
		});
	},

	pin1(e) {
		if (e.length != 0)
		{
			this.refs.f2.focus();
		}
		this.setState({pin1: e});
	},

	pin2(e) {
		this.setState({pin2: e});
		if (e == '' && this.state.pin2 != '')
			this.refs.f1.focus();
		else
			this.refs.f3.focus();
	},

	pin3(e) {
		this.setState({pin3: e});
		if (e == '' && this.state.pin3 != '')
			this.refs.f2.focus();
		else
			this.refs.f4.focus();
	},

	pin4(e) {
		this.setState({pin4: e});
		if (e == '' && this.state.pin4 != '')
			this.refs.f3.focus();
		else
			this.refs.f5.focus();
	},

	pin5(e) {
		this.setState({ pin5: e, pin6: '' });
		if (e == '' && this.state.pin5 != '')
			this.refs.f4.focus();
		else
			this.refs.f6.focus();
	},

	pin6(e) {
    if (e == '') {
      this.refs.f5.focus();
      this.setState({ pin6: '' });
    } else {
      this.setState({ pin6: e });
    }

	  this.setState({pin6: e}, function() {
			this.checkPin();
		});
	},


	checkPin() {
		dismissKeyboard();
		this.startLoader();
		this.setState({fullPin: this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4 + this.state.pin5 + this.state.pin6}, function(){
			console.log ('fullPin: ' + this.state.fullPin);
			forgotPasswordPin( this.state.UserPhoneNumber, this.state.fullPin )
			.then( (jsonResp) => {
				var status = jsonResp._bodyText;
				console.log ('status : ' + status);
				if (status === 'false')
					return this.InvalidPinFunction();
				else
					return this.modalOpener();
			})
			.catch( (err) => {
				console.log("ERROR: "+ err);
				Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
			});
		});
	},

	pass1(p) {
		this.setState ({p1: p});
	},

	pass2(p) {
		this.setState ({p2: p});
		var px= this.state.p2
		if(px.length >= 7)
		{
			console.log('@@@@@@@@@@@@@@@@@@',px)
			this.buttonEnabler();
		}
	},

	gotoP1() {
		if (this.state.p1.length >= 8) {
			//this.setState({correctPassword:true});
			this.refs.p2.focus();
		}
		else
			Alert.alert('Password too short', 'Please make sure that the password you entered has atleast 8 characters.',
			[
				{text: 'OK', onPress: () => this.focusOnP1()},
			]);
	},
	validationCheck() {
		if(this.state.p1.length < 8 ) {
				this.gotoP1();
			}
	},
	gotoP2() {
		this.startLoader();
		if (this.state.p1 == this.state.p2)
		{
			this.stopLoader();
			this.nextScreenAndToken();
		}
		else
		{
			//this.setState({correctPassword:true})
			Alert.alert('Passwords do not match', 'Please make sure that you entered the same password in both fields.',
			[
				{text: 'OK', onPress: () => this.focusOnP1()},
			]);
		}
	},

	focusOnP1() {
		this.refs.p1.focus();
		this.stopLoader();
	},

	submitPasswords() {

		this.startLoader();
		if (this.state.p1 == this.state.p2)
		{
			this.stopLoader();

			this.setState({disabled: false, style: styles.next});
			this.buttonEnabler();
		}
		else
		{
			this.setState({disabled: true, style: styles.nextOff});
			Alert.alert('Passwords do not match', 'Please make sure that you entered the same password in both fields.',
			[
				{text: 'OK', onPress: () => this.focusOnP1()},
			]);
		}
	},

	keyboardDismisser(){
		dismissKeyboard();
	},

	subHeading(){
		if 	(this.state.correctPinEntered)
			return(<View/>);
		else
			return (
				<View style = {styles.verticalMargin}>
					<Text style = {styles.subheadingText}>
						A verification code has been sent{'\n'}
						to your Servup-Registered email address{'\n'}
						Enter to verify this number.
					</Text>
				</View>
			);
	},

	tickResend() {
		if 	(this.state.correctPinEntered)
			return(
				<View style = {[styles.verticalMargin, {justifyContent: 'center', flexDirection: 'row'}]}>
					<Image source = {require('./images/success_check.png')} resizeMode={'contain'}/>
				</View>
			);
		else
			return (
				<View style = {[styles.verticalMargin, {justifyContent: 'center', flexDirection: 'row'}]}>
					<Text style = {styles.didntGetTheCode}>
						Didn't get the code?{' '}
					</Text>
					<TouchableOpacity onPress = {this.resendPIN}>
						<Text style = {styles.resend}>
							Resend
						</Text>
					</TouchableOpacity>
				</View>
			);
	},
  resendPIN() {
		this.startLoader();

	    forgotPassword(this.state.UserPhoneNumber)
	      .then( (jsonResp) => {
	        this.stopLoader();
	        Alert.alert('Email Successful', 'The email has been sent to your Servup-registered email account.');
	      })
	      .catch( (err) => {
	        console.log("Error in New Password Pin Generation: "+ err);
	        this.stopLoader();
	        Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
	      })
	      .done();
  },

	render(){
		return (
			<View style = {{flex:1, backgroundColor: StyleConstants.primary}}>
				<View style = {styles.fullMargin}>
					<TouchableOpacity onPress = { ()=> this.props.navigator.pop() } >
						<Image source = {require('../../res/common/back.png')} resizeMode={'contain'}/>
					</TouchableOpacity>
					<View style = {styles.centralStuff}>
						<View style = {{flex: 2}}>
							<View style = {styles.verticalMargin}>
								<Text style = {styles.headingText}>
									Verify Pin Code
								</Text>
							</View>

							{this.subHeading()}

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

								<View style = {styles.pincodeInputContainer}>
									<TextInput
										ref = 'f5'
										style = {styles.pincodeInputText}
										value={this.state.pin5}
										keyboardType ='phone-pad'
										maxLength = {1}
										underlineColorAndroid = {"transparent"}
										returnKeyType = {'next'}
										onChangeText = {this.pin5}
										selectTextOnFocus  = {true}
										selectionColor = {'dodgerblue'}
										placeholderTextColor  = {'#DDD'}
										secureTextEntry = {true}
									/>
								</View>

								<View style = {styles.pincodeInputContainer}>
									<TextInput
										ref = 'f6'
										style = {styles.pincodeInputText}
										value={this.state.pin6}
										keyboardType ='phone-pad'
										maxLength = {1}
										underlineColorAndroid = {"transparent"}
										returnKeyType = {'next'}
										onChangeText = {this.pin6}
										selectTextOnFocus  = {true}
										selectionColor = {'dodgerblue'}
										placeholderTextColor  = {'#DDD'}
										secureTextEntry = {true}
									/>
								</View>
							</View>

							{this.tickResend()}

						</View>

						<View style = {{flex: 3}}>

						</View>
						<ActivityIndicator
							animating={this.state.loader}
							style={{alignItems: 'center', justifyContent: 'center', bottom: 200}}
							color={'white'}
							size= {'large'}
						/>
					</View>
				</View>
				<Modalbox
					isOpen = {this.state.modalIsOpen}
					position = {'bottom'}
					backdrop = {false}
					style = {{height: height*2.7/5, backgroundColor: 'white'}}
					swipeToClose = {false}
				>
					<View style = {styles.modalInnerView}>
						<Text style = {styles.modalHeading}>
							Enter your new password{'\n'} for your Servup account
						</Text>

						<View style = {styles.topMarginSmall}>
							<View style = {styles.passwordBorder}>
								<Image
									source = {require('./images/Padlock.png')}
									resizeMode = {'contain'}
									style = {{flex: 1, alignSelf: 'center'}}
								/>
								<View style = {styles.passwordInput}>
									<TextInput
										ref = 'p1'
										style = {styles.passwordText}
										value={this.state.p1}
										maxLength = {25}
										underlineColorAndroid = {"transparent"}
										returnKeyType = {'next'}
										onChangeText = {this.pass1}
										selectTextOnFocus  = {true}
										secureTextEntry = {true}
										selectionColor = {'dodgerblue'}
										placeholder = {'Enter password'}
										placeholderTextColor  = {'#DDD'}
										onSubmitEditing = {this.gotoP2}
										//onBlur = { this.keyboardDismisser }
									/>
								</View>
							</View>
						</View>

						<View style = {styles.topMarginSmall}>
							<View style = {styles.passwordBorder}>
								<Image
									source = {require('./images/Padlock.png')}
									resizeMode = {'contain'}
									style = {{flex: 1, alignSelf: 'center'}}
								/>
								<View style = {styles.passwordInput}>
									<TextInput
										ref = 'p2'
										style = {styles.passwordText}
										value={this.state.p2}
										maxLength = {25}
										underlineColorAndroid = {"transparent"}
										returnKeyType = {'done'}
										onChangeText = {this.pass2}
										secureTextEntry = {true}
										selectTextOnFocus  = {true}
										selectionColor = {'dodgerblue'}
										placeholderTextColor  = {'#DDD'}
										placeholder = {'Re-enter password'}
										onSubmitEditing = {this.submitPasswords}
										onEndEditing = {this.submitPasswords}
										//onBlur = { this.keyboardDismisser }
										onFocus = {() => {this.validationCheck()}}
									/>
								</View>
							</View>
						</View>
						<View style = {styles.topMarginSmall}>
							<Text style = {[styles.passwordText], {fontSize: 12}}>
								Password must have atleast 8 characters
							</Text>
						</View>

						<View style = {styles.verticalMarginSmall}/>
							<View style = {{justifyContent: 'center'}}>
								<TouchableOpacity
									disabled = {this.state.disabled}
									onPress = {this.changePassword}
									style = {this.state.style}
								>
									<Text style={[styles.nextText, styles.verticalMargin]}>
										 Set New Password
									</Text>
								</TouchableOpacity>
							</View>
						</View>
				</Modalbox>
			</View>
		);
	},
});

const styles = StyleSheet.create({

	pincode: {
		margin: 20,
		flexDirection: 'row',
		// borderBottomWidth: 1,
		// borderColor: 'red',
	},

	pincodeInputContainer: {
		borderBottomWidth: 1,
		width: 20,
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

	fullMargin:
	{
		flex: 1,
		margin: 15,
	},

	centralStuff:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	verticalMargin:
	{
		marginVertical: height/30,
	},

	headingText:
	{
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	subheadingText:
	{
		fontSize: 15,
		color: 'white',
		textAlign: 'center',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	verticalMarginBig:
	{
		marginVertical: height/25,
	},

	inputBarsArea:
	{
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	singleInputBar:
	{
		borderColor: 'white',
		borderBottomWidth: 1,
		marginHorizontal: width/50,
	},

	inText:
	{
		fontSize: 20,
		textAlign: 'center',
		color: 'white',
		height: height/12,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	didntGetTheCode:
	{
		fontSize: 13,
		color: 'white',
	},

	resend:
	{
		fontWeight: 'bold',
		fontSize: 13,
		color: 'white',
		textDecorationLine: 'underline',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	modalInnerView:
	{
		flex: 1,
		marginTop: height/20,
		alignItems: 'center',
	//	justifyContent: 'center',
	},

	modalHeading:
	{
		fontSize: 15,
		textAlign: 'center',
		color: StyleConstants.primary,
	},

	topMarginSmall:
	{
		marginTop: height/36,
		alignItems: 'center',
	},

	passwordBorder:
	{
		flex: 1,
		width: width/1.5,
		height: height/12,
		borderWidth: 1,
		borderRadius:width/3,
		borderColor: '#6666',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},

	passwordInput:
	{
		flex: 8,
	},

	passwordText:
	{
		fontSize: 15,
		textAlign: 'left',
		color: '#666',
		height: height/15,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	verticalMarginSmall:
	{
		marginVertical: height/40,
	},

	next:
	{
		width: width/1.5,
		height: height/15,
		borderRadius: width/80,
		backgroundColor: StyleConstants.primary,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
	},

	nextOff:
	{
		width: width/1.5,
		height: height/15,
		borderRadius: width/80,
		backgroundColor: '#999',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
	},

	nextText:
	{
		fontFamily: Fonts.regFont[Platform.OS],
		fontSize: 15,
		color: '#FFFFFF',
	}
});

module.exports = Forgotpassword;
