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
	Switch,


} from 'react-native';
import {fnt as fnt} from '../../common/fontLib';
var TitleBar = require('../../common/TitleBar');
import {themeColor as themeColor} from '../../common/theme';
var bgWhite = '#FFFFFF';
var arrow_right = require('../../../res/common/arrow_right.png');
var NavBar = require('../../common/NavBar');
const {height, width} = Dimensions.get('window');


var AddWallet = React.createClass(
{
	getInitialState()
	{
		return {backed:  false}
	},

	backFunction()
	{
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	firstField()
	{

	},

	secondField()
	{

	},

	thirdField()
	{

	},

	forthField()
	{

	},



	render()
	{
		return (
			<View style = {styles.scrollBox}>
				<TitleBar
					leftButton = {require('../../../res/common/back.png')}
					title = "Add Wallet"
				//	titleImage = {require('./images/Servup_logo.png')}
				//	rightButton = {require('../res/common/menu.png')}
				//	rightButton2 = {require('../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.backFunction}
				//	onRightButton2Press={this.backFunction}
				//	subText="last seen at 2:10 PM"
				/>


			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex:1,
		backgroundColor: bgWhite,
	},

	cols:
	{

	},

	rows:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
		borderWidth: 1,
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	rightNextToIt:
	{
		flexDirection: 'row',
	},

	textStyle:
	{
	//	alignSelf: 'flex-end',
		marginHorizontal: 10,
		alignSelf: 'center',
		fontSize: 14,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	switchArea:
	{
		alignSelf: 'center',
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
	},
});

module.exports = AddWallet
