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
//var TimerMixin = require('react-timer-mixin');
const {height, width} = Dimensions.get('window');
import {saveTpin as saveTpin} from '../../lib/networkHandler';
import {verifyTpin as verifyTpin} from '../../lib/networkHandler';
import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
const dismissKeyboard = require('dismissKeyboard');

var extraIOS = 0;

if (Platform.OS === 'ios')
	extraIOS = 20;

var LoginCredentials = React.createClass(
{
	nextScreenAndToken(data)
	{
		console.log('Top Up is ' + this.props.pageTitle);
		this.setState({
			disabled: false,
			spinner: false,
			style: styles.verifyButtonTextActive,
		});

		if (this.props.paymentVia == 'ChargeToCreditCard')
		{
			return	this.props.navigator.push({id: 99,
				props: {
					cards: this.props.cards,
					price: this.props.price,
					membershipType: this.props.membershipType,
					paymentVia: this.props.paymentVia,
					pageTitle: this.props.pageTitle,
				}
			});
		}

		if (!this.props.addingIOT)
			if( this.props.pageTitle == "Topup" ) {
				return	this.props.navigator.push({id: 47,
					props: {
						cards: this.props.cards,
						price: this.props.price,
						membershipType: this.props.membershipType,
						paymentVia: this.props.paymentVia,
					}
				});
			}
			else {
				return	this.props.navigator.push({id: 1000,
					props: {
						cards: this.props.cards,
						price: this.props.price,
						membershipType: this.props.membershipType,
						paymentVia: this.props.paymentVia,
					}
				});
			}
		else
			return this.props.navigator.push({id: 68, props: {
				addingIOT: this.props.addingIOT,
				numb: this.props.numb,
			}});
	},

	backButtonFunction()
	{
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	verifyButtonFunction()
	{
		this.setState({
			disabled: true,
            spinner: true,
            style: styles.verifyButtonTextInActive,
        });

    	return this.nextScreenAndToken();

        const Pin = this.state.pin;
        if (Pin.length == 4)
        {
            if (this.state.nexted == false)
            {
                this.state.nexted = true;
                verifyTpin( this.state.UserToken, Pin )
                .then( (jsonResp) => {
                    console.log(jsonResp);
                    var status = jsonResp.status;
                    console.log('  ', jsonResp.status, '  ',jsonResp.body);
                    if (jsonResp.status === 200 && jsonResp.body === 'OK')
                    {
                        AsyncStorage.setItem("userTpin", Pin);
					}
				})
				.catch( (err) => {
					console.log("\n\n\n"+ err);
					this.setState({
						disabled: false,
						spinner: false,
						style: styles.verifyButtonTextActive,
						nexted: false,
					});
					return this.InvalidPinFunction(err.body);
				})
			}
		}
		else
		{
			this.InvalidPinFunction();
		}
	},

	InvalidPinFunction(message)
	{
		this.setState({
						disabled: false,
						spinner: false,
						style: styles.verifyButtonTextActive,
						nexted: false,
					});
		if (!message) {

			return Alert.alert(
				'Invalid PIN Number',
				'Please make sure that you are connected to the internet and that the number you entered has atleast 4 digits and it is your correct pin code.'
			);
		}
		Alert.alert('Error', "Please make sure that you are connected to the internet and that the number you entered has atleast 4 digits and it is your correct pin code.");
	},

	componentDidMount()
	{
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
		this.setState({"UserPhoneNumber": value});
		}).done();

		AsyncStorage.getItem("UserToken").then((value) => {
		this.setState({"UserToken": value});
		console.log("Token is " +  value);
		}).done();

	},

	render()
	{
		return (
			<View style = {styles.bgColorContainer}>
				<ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps = {false}>
					<View style={styles.container}>

						<View style = {styles.topContainer}>

							<View style = {{marginHorizontal: 15}}>
								<View style={styles.backArea}>
									<TouchableOpacity onPress = {this.backButtonFunction} style = {styles.backButtonStyle}>
										<Image source = {require('../../res/common/back.png')}/>
										<Text style={styles.backButtonText}>
											{'  '}Back
										</Text>
									</TouchableOpacity>

									<TouchableOpacity disabled = {true} onPress = {this.savePinFunction}>
										<Text style = {this.state.style}>
											Next
										</Text>
									</TouchableOpacity>
								</View>
							</View>

							<Image source = {require('../login/images/mail.png')} style={styles.mail} />

							<Text style={styles.bigFont}>
								{'+'}
								{this.state.UserPhoneNumber.substring(0, 2)}
								{'  '}
								{this.state.UserPhoneNumber.substring(2, 5)}
								{'  '}
								{this.state.UserPhoneNumber.substring(5, 8)}
								{'  '}
								{this.state.UserPhoneNumber.substring(8, 13)}
							</Text>
						</View>

						<Text style={styles.lightText}>
							Please enter your custom 4 digit pin to verify
						</Text>

						<View style = {styles.inputView}>
							<TextInput
								text = {this.state.pin}
								style = {styles.inText}
								placeholder = 'Code'
								placeholderColor = '#999999'
								keyboardType ='phone-pad'
								maxLength = {4}
								onChangeText = {this.changer}
								underlineColorAndroid = {'#FFFFFF'}
								onSubmitEditing = { this.savePinFunction }
							/>
						</View>
					</View>
				</ScrollView>
				<ActivityIndicator size = 'large' verticalPosition="center" color = {themeColor.wind} visible = {this.state.spinner} overlayColor= {"rgba(0,0,0,0)"}/>
			</View>
		);
	},

	getInitialState()
	{
		return {
			spinner: false,
			pin: '',
			nexted: false,
			backed: false,
			userData: '',
			UserPhoneNumber: '',
			UserToken: '',
			disabled: true,
			style: styles.verifyButtonTextInActive,
		};
	},

	changer(e)
	{
		this.setState({disabled: false});
		this.setState({style: styles.verifyButtonTextActive});
		this.setState({pin: e}, function() {
			if (this.state.pin.length === 4)
				this.savePinFunction();
		});

	},

	savePinFunction()
	{
		dismissKeyboard();
		pinNumber = this.state.pin;
		this.verifyButtonFunction();
		this.setState({disabled: true});
		this.setState({style: styles.verifyButtonTextInActive});
	},

});

const styles = StyleSheet.create(
{
	bgColorContainer:
	{
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	contentContainer:
	{
		paddingBottom: 20,
		backgroundColor: '#FFFFFF',
	},

	container:
	{
		flex:1,
		backgroundColor: '#FFFFFF',
	},

	topContainer:
	{
		paddingTop: 10,
		backgroundColor: themeColor.wind,
		height: 150 + extraIOS,
	},

	backButtonStyle:
	{
		flexDirection: 'row',
		alignItems: 'center',
	},

	backArea:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: 10,
	//	borderWidth: 1,
	//	borderBottomColor: 'black',
	},

	backButtonText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		color: '#FFFFFF',
		fontSize: 22,
	},

	mail:
	{
		alignSelf: 'center',
		top:-30,
	},

	lightText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 15,
		color: '#666666',
		textAlign: 'center',
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 40,
		marginHorizontal: 10,
	},

	bigFont:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 19,
		color: '#ffffff',
		marginTop: 1,
		marginBottom: 1,
		alignSelf: 'center',
	},

	resendButton:
	{
		marginBottom: 10,
		margin:10,
		alignSelf: 'center',
	},

	resendButtonText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		color: themeColor.wind,
		fontSize: 12,
	},

	inText:
	{
		top: 10,
		height: 40,
		textAlign: 'center',
		fontSize: 17,
		borderWidth: 0,
	},

	verifyButtonTextActive:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 22,
		color: '#FFFFFF',
	},

	verifyButtonTextInActive:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 22,
		color: 'rgba(255, 255, 255, 0.75)',
	},

	inputView:
	{
		marginHorizontal: 15,
		flex: 1,
		width: width*0.75,
		alignSelf: 'center',
		borderColor: '#dedede',
		borderWidth: 0,
		borderBottomWidth: 1,
		// borderBottomColor: '#dedede',
	},

});

module.exports = LoginCredentials;
