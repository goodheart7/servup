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
	View,
	Alert,
	Image,
	Dimensions,
	Platform,
	TextInput,

} from 'react-native';
import {fnt as fnt} from './fontLib';
var TitleBar = require('./TitleBar');
import {themeColor as themeColor} from './theme';

const {height, width} = Dimensions.get('window');

var ScratchCard = React.createClass( 
{
	getInitialState()
	{
		return {cardLevel: 1, inputValue: 0, backed: false};
	},

	enterNumber(e)
	{
		var num = parseInt(e);
		num = isNaN(num)? 0 : num;
		this.setState({inputValue: num});
	},
	
	checkNumber()
	{
		if (this.state.inputValue === 0)
			Alert.alert('Invalid Input', 'You did not provide any correct input');
		else
		{
			if (this.state.inputValue === 123)
				this.setState({cardLevel: 2});
			else
				this.setState({cardLevel: 3});
		}
	},

	backFunction()
	{
		if  (this.props.backScreen === 6 || this.props.pageTitle || this.props.backScreen === 999)
			this.props.navigator.pop();
		else
			this.props.navigator.push({id: 6});
	},

	sideMenuFunction()
	{
		this.props.navigator.push({id: this.props.backScreen, props: {cards: this.props.cards, paymentVia: this.props.paymentVia, pageTitle: this.props.pageTitle}});
	},

	rightTextFunction()
	{
		this.setState({cardLevel: 1});
	},


	firstScreen()
	{
		return(
			<View style = {styles.mainContainer}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Scratch Card"
				//	titleImage = {require('../res/common/back.png')}
				//	rightButton = {require('../res/common/cross.png')}
				//	rightButton2 = {require('../res/common/contact.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.backFunction}
				//	onRightButton2Press={this.backFunction}
				//	subText="last seen at 2:10 PM"
					rightText = "Recharge"
					onRightButton2Press = {this.checkNumber}
				/>

				<View style={styles.borderStyle}>
					<View style = {styles.cardLogo}>
						<Image					
							source = {require('../../res/common/scratch_recahrge_icon.png')}
						/>
					</View>

					<View style = {styles.textViewStyle}>
						<Text style = {styles.mainTextStyle}>
							Scratch your card's coating to reveal the hidden code
						</Text>
					</View>

					<View style={styles.inputFieldView}>
						<TextInput
							style={styles.inputStyle}
							placeholder  = 'Please enter your scratch card code here'
							placeholderTextColor = '#9999'
							keyboardType = 'phone-pad'
							maxLength = {14}
							onChangeText = {this.enterNumber}
							onSubmitEditing = {this.checkNumber}
							underlineColorAndroid = {"#FFFFFF"}
						/>
					</View>

					<TouchableOpacity>
						<Text style = {styles.TOSstyle}>
							Terms & Conditions
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	},
	
	secondScreen()
	{
		return(
			<View style = {styles.mainContainer}>
				<TitleBar
					title="Success!"
				//	leftButton = {require('../../res/common/back.png')}
				//	titleImage = {require('../res/common/back.png')}
				//	rightButton = {require('../res/common/cross.png')}
				//	rightButton2 = {require('../res/common/contact.png')}
				//	onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.backFunction}
				//	onRightButton2Press={this.backFunction}
				//	subText="last seen at 2:10 PM"
					rightText = {this.props.backScreen === 6 ? "Done" : "Next"}
					onRightButton2Press = {this.sideMenuFunction}
				/>

				<View style={styles.borderStyle}>
					<View style = {styles.cardLogo}>
						<Image					
							source = {require('../../res/common/recharge_successful_icon.png')}
						/>
					</View>

					<View style = {styles.textViewStyle}>
						<Text style = {styles.mainTextStyle}>
							Recharge Successful!
						</Text>
					</View>

					<View style={styles.inputFieldView2}>
						<Text style = {styles.textStyle}>
							Your account has been recharged.
							Your account balance now, is is 34.43 and your credit limit is valid till 30th December, 2016.
							To proceed with your service payments, select billing.
						</Text>
					</View>

				</View>
			</View>
		)
	},

	thirdScreen()
	{
		return(
			<View style = {styles.mainContainer}>
				<TitleBar
					title = "  Oops!"
					leftButton = {require('../../res/common/back.png')}
				//	titleImage = {require('../res/common/back.png')}
				//	rightButton = {require('../res/common/cross.png')}
				//	rightButton2 = {require('../res/common/contact.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.backFunction}
				//	onRightButton2Press={this.backFunction}
				//	subText="last seen at 2:10 PM"
					rightText = "Retry"
					onRightButton2Press = {this.rightTextFunction}

				/>

				<View style={styles.borderStyle}>
					<View style = {styles.cardLogo}>
						<Image					
							source = {require('../../res/common/recharge_failed_icon.png')}
						/>
					</View>

					<View style = {styles.textViewStyle}>
						<Text style = {styles.mainTextStyle}>
							Recharge Failed!
						</Text>
					</View>

					<View style={styles.inputFieldView2}>
						<Text style = {styles.textStyle}>
							This card may have already been used. Or you may have entered an incorrect number. Please try another card or contact technical support.
						</Text>
					</View>

					<TouchableOpacity style = {styles.supportView}>
						<Text style = {styles.supportStyle}>
							Contact Support
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	},

	render()
	{
		if (this.state.cardLevel === 1)
		{
		 	return this.firstScreen();
		}

		if (this.state.cardLevel === 2)
		{
		 	return this.secondScreen();
		}

		else if (this.state.cardLevel === 3)
		{
		 	return this.thirdScreen();
		}
	},
});

const styles = StyleSheet.create(
{
	mainContainer:
	{
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	borderStyle:
	{
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 0,
	},

	cardLogo:
	{
		margin: 50,
		marginBottom: 20,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	
	textViewStyle:
	{
		alignSelf: 'center',
		marginBottom: 30,
		marginHorizontal: 15,
	},

	textStyle:
	{
		fontSize: 13,
		color: '#999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	mainTextStyle:
	{
		fontSize: 13,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	inputFieldView:
	{
		borderTopColor: '#FFFFFF',
		borderBottomColor: '#333',
		borderLeftColor: '#FFFFFF',
		borderRightColor: '#FFFFFF',
		borderWidth: 1,
		margin: 30,
	},

	inputFieldView2:
	{
		margin: 30,
	},

	inputStyle:
	{
		alignSelf: 'center',
		height: 50,
		width: width/1.25,
		borderWidth: 0,
		textAlign: 'center',
		fontFamily: fnt.regFont[Platform.OS],
		marginHorizontal: 65,
		borderColor: '#FFFFFF',
		borderTopColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderRightColor: '#FFFFFF',
		fontSize: 15,
	},

	TOSstyle:
	{
		color: themeColor.wind,
		fontSize: 11,
		margin: 10,
		textAlign: 'center',
		fontFamily: fnt.regFont[Platform.OS],
	},

	supportView:
	{
		padding: 10,		
		borderWidth: 1,
		marginHorizontal: 120,
		borderColor: '#6666',
		borderRadius: 5,
	},

	supportStyle:
	{
		
		fontFamily: fnt.regFont[Platform.OS],
		color: '#666',
		fontSize: 13,
		textAlign: 'center',
	},

});

module.exports = ScratchCard