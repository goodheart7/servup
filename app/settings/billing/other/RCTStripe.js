/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
// import Tcomb from 'tcomb-form-native';
import {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View,
	Platform,
	Navigator,
	Dimensions,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
var TitleBar = require('./TitleBar');
const dismissKeyboard = require('dismissKeyboard');
var config = require ('./stripeConfig');
var StripeAPI = require('./StripeAPI')(config.stripeUrl, config.apiKey.public, config.apiKey.secret);


var RCTStripe = React.createClass({

	getInitialState()
	{
		return {
			card_number: '',
			exp_year: '',
			exp_month: '',
			cvc: '',
			spinner: false,
		};
	},

	cardFunc(text){
		this.setState({card_number: text});
		console.log("Card Number : " + text);
	},
	cardMonth(text){
		this.setState({exp_month : text});
	},
	cardYear(text){
		this.setState({exp_year : text});
	},
	cardCvc(text){
		this.setState({cvc: text});
	},

	 _onError : function(error) {

			 console.log("error ",error);


	},

	_onReceiveToken: function(response){

		this.setState ({spinner: false, });
		 if(!response.ok){
				Alert.alert('Transaction Failed', "Your transaction was unsuccessful.");
				console.log("Result : " + JSON.stringify(response));
		 }else {
			console.log('card token',response);
			StripeAPI.createCustomerToken(response.body.id, null, null, customer =>{
				if(customer.ok){
					StripeAPI.chargeCustomer(customer.body.id, this.props.price, null, charged => {
						if(charged.ok){
							Alert.alert('Transaction Successful', "You have successfully completed the transaction.");
							console.log("charged : " , charged);
							if( this.props.pageTitle == "Topup" )
							{
								return	this.props.navigator.push({id: 47,
									props: {
										cards: this.props.cards,
										price: this.props.price,
										membershipType: this.props.membershipType,
										paymentVia: this.props.paymentVia,
									}
								});
							}
							else
							{
								this.props.navigator.push({id: 1000,
									props: {
										cards: this.props.cards,
										price: this.props.price,
										membershipType: this.props.membershipType,
										paymentVia: this.props.paymentVia,
									}
								});
							}
						}else{
							Alert.alert('Transaction Failed', "Your transaction was unsuccessful.");
							console.log("ERROR in create Charge Customer : " , charged);
						}
					})
				}else{
					Alert.alert('Transaction Failed', "Your transaction was unsuccessful.");
					console.log("ERROR in createCustomer TOken : " , customer)
				}
			})
		}

	},

	submit()
	{
		// call getValue() to get the values of the form
		console.log("Length of Card : " + this.state.card_number.length);
		console.log("Length of Card : " + this.state.exp_month.length);
		console.log("Length of Card : " + this.state.exp_year.length);
		console.log("Length of Card : " + this.state.cvc.length);
		if(this.state.card_number.length === 16){
			if(this.state.exp_month.length === 2){
				if(this.state.exp_year.length === 4){
					if(this.state.cvc.length === 3){
						this.setState ({spinner: true, });
						StripeAPI.createCardToken(this.state.card_number, this.state.exp_month, this.state.exp_year, this.state.cvc,  this._onReceiveToken);
					}
				}
			}
		}
	},

	blurred()
	{
		dismissKeyboard();
	},

	backFunction()
	{
		this.props.navigator.pop();
		this.props.navigator.pop();
	},

	render() {
		return (
			<ScrollView contentContainerStyle = {styles.container} keyboardShouldPersistTaps= {true}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Credit Card"
				//	rightText = "Done"
				//	titleImage = {themeColor.windSplash}
				//	rightButton = {require('../res/common/search.png')}
				//	rightButton2 = {require('../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.searchModule}
				//	onRightButton2Press={this.nextFunction}
				//	subText="last seen at 2:10 PM"
				//	isHome = {false}
				/>
				<View style = {styles.border}>
					<View style = {styles.singleRow}>
						<Text style = {styles.headings}>
							Card Number
						</Text>

						<View style = {styles.inputBorder}>
							<TextInput
							//	defaultValue='4242424242424242'
								autoFocus={true}
								style = {styles.inputBar}
								keyboardType ='numeric'
								maxLength = {16}
								placeholder='4242424242424242'
								onChangeText={this.cardFunc}
								placeholderTextColor='#6666'
								underlineColorAndroid = {'#FFFFFF'}
							/>
						</View>
					</View>

					<View style = {styles.singleRow}>
						<Text style = {styles.headings}>
							Expiry Month
						</Text>
						<View style = {styles.inputBorder}>
							<TextInput
							//	defaultValue='12'
								style = {styles.inputBar}
								keyboardType ='numeric'
								maxLength = {2}
								placeholder='08'
								onChangeText={this.cardMonth}
								underlineColorAndroid = {'#FFFFFF'}
								placeholderTextColor='#6666'
							/>
						</View>
					</View>

					<View style = {styles.singleRow}>
						<Text style = {styles.headings}>
							Expiry Year
						</Text>
						<View style = {styles.inputBorder}>
							<TextInput
							//	defaultValue='2016'
								style = {styles.inputBar}
								keyboardType ='numeric'
								maxLength = {4}
								placeholder='2018'
								placeholderTextColor='#6666'
								onChangeText={this.cardYear}
								underlineColorAndroid = {'#FFFFFF'}
							/>
						</View>
					</View>

					<View style = {styles.singleRow}>
						<Text style = {styles.headings}>
							Card Number
						</Text>
						<View style = {styles.inputBorder}>
							<TextInput
							//	defaultValue='123'
								style = {styles.inputBar}
								onChangeText={this.cardCvc}
								keyboardType ='numeric'
								placeholder='123'
								placeholderTextColor='#6666'
								maxLength = {3}
								underlineColorAndroid = {'#FFFFFF'}
							/>
						</View>
					</View>

					<TouchableHighlight style={styles.button} onPress={this.submit} underlayColor='#99d9f4'>
						<Text style={styles.buttonText}>
							Pay ${this.props.price}
						</Text>
					</TouchableHighlight>
				</View>
				<ActivityIndicator size = 'large' verticalPosition="center" color = {themeColor.wind} visible = {this.state.spinner} overlayColor= {"rgba(0,0,0,0)"}/>
			</ScrollView>
		);
	},

});

var styles = StyleSheet.create({
	container:
	{
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	border:
	{
		flex: 1,
		borderWidth: 4,
		borderColor: '#F2F1EF',
		borderTopWidth: 0,
	},

	singleRow:
	{
	//	flex: 1,
		flexDirection: 'row',
		height: height/12,
		justifyContent: 'space-between',
		borderWidth: 0,
		borderBottomWidth: 1,
		borderColor: '#F2F1EF',
		alignItems: 'center',
	//	marginBottom: 10,
	},

	title:
	{
		fontSize: 20,
		alignSelf: 'center',
		marginBottom: 20,
	},

	buttonText:
	{
		fontSize: 15,
		color: '#FFFFFF',
		alignSelf: 'center',
		fontFamily: fnt.regFont[Platform.OS],
	},

	button:
	{
		padding: 15,
		backgroundColor: themeColor.wind,
		borderRadius: 5,
		marginTop: 75,
		alignSelf: 'center',
		justifyContent: 'flex-end',
		width: width*0.5,
	},

	inputBorder:
	{
		flex: 2,
		alignSelf: 'center',
	},

	headings:
	{
	//	top: 20,
	//	height: 60,
	//	width: width,
	//	width: width/2,
		flex: 1,
		marginHorizontal: 15,
		alignSelf: 'center',
		textAlign: 'left',
		fontSize: 15,
		fontFamily: fnt.regFont[Platform.OS],
		color: '#666',
	},

	inputBar:
	{
	//	top: 20,
	//	height: 60,
	//	width: width/2,
	//	alignSelf: 'flex-start',
		flex: 1,
		textAlign: 'left',
		fontSize: 15,
		fontFamily: fnt.regFont[Platform.OS],
		color: '#666',
	},
});

module.exports = RCTStripe;
