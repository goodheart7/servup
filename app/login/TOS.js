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
import {
	registerAppUser,
	verifyPassword,
	sendByEmail,
	sendByEmailPP,
	getTOC
} from '../../lib/networkHandler';
import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
var TitleBar = require('../common/TitleBar');

//Mixpanel.sharedInstanceWithToken('c343f769e6fb158f861f3d66fff3fe02');

const {height, width} = Dimensions.get('window');
var frame = height / 1.7;

var TOS = React.createClass(
	{
		getInitialState() {
			AsyncStorage.getItem("UserPhoneNumber")
				.then((value) => {
					this.setState({"UserPhoneNumber": value});
				})
				.done();

			return {
				loader: false,
				disabled: false,
				terms: '',
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
					// return getTOC();
				// })
				// .then((value) => {
					// console.log('value', value.termsOfUse);
					// this.setState({"terms": value.termsOfUse});
				})
				.catch((err) => {
					console.log("\n\n\n" + err);
					Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
				})
		},

		stopLoader() {
			// this.setState({loader: false});
		},

		sendByEmail() {
			var analytics = this.state.UserPhoneNumber + " pressed send by email at " + new Date().toUTCString();
			// Mixpanel.track(analytics);
			if (this.props.PP)
				sendByEmail(this.state.UserEmail)
			else
				sendByEmailPP(this.state.UserEmail)
					.then((response) => {
						console.log("SendByemail response is:" + JSON.stringify(response));
					})
					.catch((err) => {
						console.log(err);
					})
					.done();

			//this.setState({modalOpen:true});

			Alert.alert('Email Sent!', 'Terms & Conditions have been emailed to your provided email address',
				[
					{text: 'Done'},
				]
			);
		},

		onPressAgree() {
			this.setState({disabled: true, loader: true}, this.agreeFunction());
		},

		agreeFunction()  {
			registerAppUser(this.state.UserPhoneNumber, this.state.UserPassword, this.state.UserEmail, this.state.Name)
				.then((resp) => {
					return verifyPassword(this.state.UserPhoneNumber, this.state.UserPassword)
				})
				.then((jsonResp) => {
					this.setState({loader: false});
					var x = JSON.parse(jsonResp._bodyText);
					console.log("First: " + x.access_token);
					AsyncStorage.setItem("UserToken", x.access_token);
					AsyncStorage.setItem("UserRefreshToken", x.refresh_token);
					return this.props.navigator.push({id: 6, props: {notFirstTime: true}});
				})
				.catch((err) => {
					Alert.alert('Error Contacting the Server', 'There was a problem connecting to the server. Please check your internet connection and try later.');
				})
				.done();
		},

		disAgreeFunction()  {
			// var analytics = this.state.UserPhoneNumber + " disagreed to TOS at " + new Date().toUTCString();
			// Mixpanel.track(analytics);
			this.props.navigator.push({id: 1,});
		},

		backFunction()  {
			// var analytics = this.state.UserPhoneNumber + " pressed back on TOS screen, at " + new Date().toUTCString();
			// Mixpanel.track(analytics);
			this.props.navigator.popN(2);
		},

		AgreeDisagreeBar()  {
			return (
				<View style={styles.rowView}>
					<TouchableOpacity onPress={this.disAgreeFunction} style={styles.NButton}>
						<Text style={styles.YNButtonText2}>
							Back
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={this.onPressAgree}
						style={styles.YButton}
						// disabled={this.state.loader}
					>
						<Text style={styles.YNButtonText}>
							Agree
						</Text>
					</TouchableOpacity>
				</View>
			);
		},

		loaderFunction() {
			if (this.state.loader)
			return (
				<ActivityIndicator
					animating = {this.state.loader}
					style = {{position: 'absolute', top: height/2, bottom: height/2, left: 0, right: 0, zIndex: 1}}
					color = {StyleConstants.primary}
					size = {'large'}
				/>
			);
		},

		render() {
			console.log("PP is: " + this.props.PP);
			return (
				<View style={styles.bgColorContainer}>
				{this.loaderFunction()}
					
					<View style = {{flex: 1}}>
						<TitleBar
							leftButton={require('../../res/common/back.png')}
							title={this.props.PP ? "Privacy Policy" : "Terms & Conditions"}
							// titleImage = {require('../res/common/back.png')}
							// rightButton = {require('../res/common/cross.png')}
							// rightButton2 = {require('../res/common/contact.png')}
							onLeftButtonPress={this.backFunction}
							// onRightButtonPress={this.backFunction}
							// onRightButton2Press={this.backFunction}
							// subText="last seen at 2:10 PM"
						/>

						<View style={styles.scrollBox}>
							<ScrollView contentContainerStyle={styles.contentContainer} bounces={false}>

								<TouchableOpacity style={styles.emailView} onPress={this.sendByEmail}>
									<Text style={styles.emailViewText}>
										Send by Email
									</Text>
								</TouchableOpacity>

								<Text style={styles.headingFont}>
									General
								</Text>
								<Text style={{color:'black', fontSize:14, marginHorizontal:10}}>
									{this.state.terms}
								</Text>
							</ScrollView>
						</View>

						{this.AgreeDisagreeBar()}
					</View>
				</View>
			)
		}
	});

const styles = StyleSheet.create({
	bgColorContainer: {
		//	height: height,
		flex: 1,
		backgroundColor: '#FFFFFF',
		backgroundColor: 'pink',
	},

	emailView: {
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

	emailViewText: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		color: StyleConstants.primary,
		fontSize: 14,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	contentContainer: {
		// flex: 1,
		backgroundColor: '#FFFFFF',
		// marginHorizontal: 20,
	},

	scrollBox: {
		// height: frame,
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	eulaFont: {
		fontFamily: Fonts.regFont[Platform.OS],
		fontSize: 14,
		color: '#666666',
		margin: 10,
		alignSelf: 'flex-start',
		marginHorizontal: 20,
		textAlign: 'left',
	},

	headingFont: {
		color: StyleConstants.primary,
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		marginLeft: 20,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	rowView: {
		flex: 0.1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderWidth: 1,
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderBottomColor: '#333',
		borderTopColor: '#D7D7D7',
		backgroundColor: '#FFFFFF',
		// height: height * 0.1,
	},

	YButton: {
		marginRight: 5,
		backgroundColor: '#FFFFFF',
		alignSelf: 'center',
	},

	NButton: {
		marginLeft: 5,
		backgroundColor: '#FFFFFF',
		alignSelf: 'center',
	},

	YNButtonText: {
		color: StyleConstants.primary,
		fontSize: 15,
		fontFamily: Fonts.regFont[Platform.OS],
		marginHorizontal: 15,
	},

	YNButtonText2: {
		// fontWeight: '500',
		color: StyleConstants.primary,
		fontSize: 15,
		fontFamily: Fonts.regFont[Platform.OS],
		marginHorizontal: 15,
	},
});

module.exports = TOS
