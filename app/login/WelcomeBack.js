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
	verifyPassword,
	forgotPassword
} from '../../lib/networkHandler';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');


var WelcomeBack = React.createClass(
{
	getInitialState() {
		return {
			style: styles.nextOff,
			password: '',
			disabled: true,
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
		})
		.done();
	},

	buttonDisabler() {
		this.setState({disabled: true, style: styles.nextOff});
	},

	buttonEnabler() {
		this.setState({disabled: false, style: styles.next});
	},

	stopLoader() {
		this.setState({loader: false});
	},

	startLoader() {
		this.setState({loader: true});
	},

	nextButtonFunction() {
		this.buttonDisabler();
		this.startLoader();
		verifyPassword(this.state.UserPhoneNumber, this.state.password) // ADD CLIENT ID LATER
			.then( (jsonResp) => {
				this.stopLoader();
				if (jsonResp.status === 200)
				{
					var x = JSON.parse(jsonResp._bodyText);
					console.log("First: " + x.access_token);
					AsyncStorage.setItem("UserToken", x.access_token);
					AsyncStorage.setItem("UserRefreshToken", x.refresh_token);
					return this.props.navigator.push({id: 6, props: {notFirstTime: true}});
				}
				else
					this.invalidPassword();
			})
			.catch( (err) => {
				console.log("Error in Password Verification: "+ err);
				this.stopLoader();
				Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
				//this.stopLoader()
			})
			.done();
	},

	invalidPassword() {
		Alert.alert('', 'Sorry! You have entered an invalid email address / password. Please make sure the cresdentials you are using are correct.',
			[
				{text: 'OK', onPress: () => this.resetInputs()},
			]
		);
	},

	resetInputs() {
		this.stopLoader();
		this.setState({style: styles.next, disabled: false, password: ''}, function(){
			this.refs.password.focus();
		});
	},

	handleChangeText(p) {
		this.setState ({password: p});
		if (p.length >= 8)
			this.setState ({style: styles.next, disabled: false});
		else
			this.setState ({style: styles.nextOff, disabled: true});
	},

	handleFormSubmit() {
		this.keyboardDismisser();
		this.startLoader();
		this.nextButtonFunction();
	},

	onForgotPasswordClick() {
		this.keyboardDismisser();
		this.startLoader();
		forgotPassword(this.state.UserPhoneNumber)
		.then( (jsonResp) => {
			this.stopLoader();
			Alert.alert('Email Successful', 'The email has been sent to your Servup-registered email account.',
				[
					{text: 'OK', onPress: () => this.props.navigator.push({id: 5.5}) },
				]
			);
		})
		.catch( (err) => {
			console.log("Error in New Password Pin Generation: "+ err);
			this.stopLoader();
			Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
		})
		.done();
	},

	keyboardDismisser() {
		dismissKeyboard();
	},
  renderExtraSpaceForIOS (){
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  },

	render() {
		return (
			<View style={styles.container}>

				<TouchableOpacity onPress = {()=> this.props.navigator.pop()}>

					<Image
						source={require('./images/left_arrow_blue.png')}
						resizeMode={'contain'}
					/>
				</TouchableOpacity>
				<View style = {styles.headingContainer}>
					<Text style = {[Style.heading, Style.textColorPrimary, Style.center,
						{fontSize: 30, color: 'black'}
					]}>
						Welcome Back
					</Text>
					<Text style = {[Style.heading, Style.textColorPrimary, Style.center,
						{fontSize: 15, color: 'black'}
					]}>
						Good to see you again!
					</Text>

				</View>

				<View style = {[styles.formContainer, Style.centerItems]}>
					<View style = {styles.formField}>
						<Text style = {[Style.h1, Style.textColorPrimary]}>
							
						</Text>
					</View>

					<View style = {styles.inputGroup}>
						<Image
							source = {require('./images/Padlock.png')}
							resizeMode = {'contain'}
							style = {styles.inputIcon}
						/>
						<TextInput
							ref = 'password'
							style = {styles.textInput}
							value={this.state.password}
							maxLength = {25}
							underlineColorAndroid = {"transparent"}
							returnKeyType = {'next'}
							selectTextOnFocus  = {true}
							secureTextEntry = {true}
							selectionColor = {'dodgerblue'}
							placeholder = {'Enter password'}
							placeholderTextColor  = {StyleConstants.primary}
							onChangeText = {this.handleChangeText}
							onSubmitEditing = {this.handleFormSubmit}
							onBlur = {this.keyboardDismisser}
						/>
					</View>


					<TouchableOpacity
						disabled = {this.state.disabled}
						onPress = {this.handleFormSubmit}
						style = {this.state.style}
					>
						<Text style={[Style.p, Style.textColorWhite,
							{fontSize: 14}
						]}>
							Sign in
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style = {[styles.formField, {marginTop: height/3.8}]}
						onPress = {this.onForgotPasswordClick}
					>
						<Text style = {[Style.p, Style.textColorGray,
							{fontSize: 17, color: StyleConstants.primary}
						]}>
							Forgot your password ?
						</Text>
					</TouchableOpacity>
				</View>

				<ActivityIndicator
					animating={this.state.loader}
					style={{zIndex: 1, position: 'absolute', top: height/2, left: 0, right: 0, bottom: 0}}
					color={StyleConstants.primary}
					size= {'large'}
				/>
			</View>
		);
	},

});

const styles = StyleSheet.create({

	container: {
		// flex: 1,
		backgroundColor: 'white',
		padding: 20,
	},

	spinner: {
		alignSelf: 'center',
		justifyContent: 'center',
	},

	headingContainer: {
		marginVertical: 20
	},

	formContainer: {
		marginVertical: 35,
		marginHorizontal: 20,
	},

	formField: {
		paddingVertical: 15,
	},

	inputIcon: {
		flexGrow: 2,
		alignSelf: 'center'
	},

	textInput: {
		flexGrow: 8,
		fontSize: 15,
		textAlign: 'left',
		color: StyleConstants.primary,
		height: 50,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	inputGroup:
	{
		flexGrow: 8,
		height: height/12,
		borderBottomWidth: 1,
		// borderRadius:25,
		borderColor: '#6666',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},

	next:
	{
		// flex: 1,
		height: height/20,
		borderRadius: 2,
		backgroundColor: StyleConstants.primary,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
		marginVertical: 40,
	},

	nextOff:
	{
		// flex: 1,
		height: height/20,
		borderRadius: 2,
		backgroundColor: '#999',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
		marginVertical: 40,
	},

	nextText:
	{
		fontFamily: Fonts.regFont[Platform.OS],
		fontSize: 15,
		color: '#FFFFFF',
	}

});

module.exports = WelcomeBack;
