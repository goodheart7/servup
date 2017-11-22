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
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
	TextInput,
	Alert,

} from 'react-native';

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
var TitleBar = require('./TitleBar');
const {height, width} = Dimensions.get('window');
var numWithSpaces = '+92';

var EnterIOTNumber = React.createClass( 
{
	getInitialState()
	{
		console.log ("addingIOT:: " + this.props.addingIOT);
		return {
			numb: numWithSpaces,
		}
	},

	backFunction()
	{
		this.props.navigator.pop();
	},

	nextFunction()
	{
		console.log ("addingIOT:: " + this.props.addingIOT);
		if (this.state.numb.length < 13)
		{
    		Alert.alert('Invalid Phone Number', 'Please make sure that the number you entered is valid');
    	}	 
		else
			this.props.navigator.push({id: 999, props: {
				addingIOT: this.props.addingIOT,
				numb: this.state.numb.substring(1, this.state.numb.length),
			}});
	},

	minValue(e)
	{
		if (e.length < numWithSpaces.length || e.indexOf(numWithSpaces) != 0)
			this.setState({numb:numWithSpaces});
		else
			this.setState({numb:e});
	},

	render()
	{
		return (
			<View style = {{flex:1, backgroundColor: '#FFFFFF'}}>
				<TitleBar
						leftButton = {require('../../res/common/back.png')}
						title = "Enter Line Number"	
						rightText = "Next"
					//	titleImage = {themeColor.windSplash}
					//	rightButton = {require('../res/common/search.png')}
					//	rightButton2 = {require('../res/common/menu.png')}
						onLeftButtonPress={this.backFunction}
					//	onRightButtonPress={this.searchModule}
						onRightButton2Press={this.nextFunction}
					//	subText="last seen at 2:10 PM"
					//	isHome = {false}
				/>

				<View style = {styles.border}>
					<View style = {styles.heading}>
						<Text style={styles.lightText}>
							Enter your new line number
						</Text>
					</View>

					<View style = {styles.inputView}>
						<TextInput
								value = {this.state.numb}
								text = {this.state.numb}
								style = {styles.inText}
								keyboardType = 'phone-pad'
								maxLength = {13}
								underlineColorAndroid = {'#FFFFFF'}
								autoFocus = {true}
								onChangeText = {this.minValue}	
								onSubmitEditing = {this.nextFunction}
							/>
					</View>
				</View>
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	border:
	{
		flex: 1,
		borderWidth: 4,
		borderColor: '#ececec',
		borderTopWidth: 0,
		backgroundColor: '#FFFFFF',
	},

	heading:
	{
		borderColor: '#F2F1EF',
		borderWidth: 0,
		borderBottomWidth: 1,
		marginBottom: 20,
	},

	lightText:
	{
		width: width * 0.65,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 15,
		color: '#666666',
		textAlign: 'center',
		alignSelf: 'center',
		margin: 20,
	},

	inputView:
	{

		borderColor: '#F2F1EF',
		borderWidth: 0,
		borderBottomWidth: 1,
		marginBottom: 15,
		paddingHorizontal: 15,
	},
	
	inText:
	{
		top:10, 
		fontFamily: fnt.regFont[Platform.OS],
		color: '#666',
		textAlign: 'left',
		height: 40,
		fontSize: 15,
	},
});

module.exports = EnterIOTNumber