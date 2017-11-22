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
	Switch,

} from 'react-native';
import {fnt as fnt} from './fontLib';
const {height, width} = Dimensions.get('window');
import {themeColor as themeColor} from './theme';
var defaultPic = require('../../res/common/white.png');

var NoticeBoardCardBottomArea = React.createClass( 
{
	getDefaultProps: function()
	{
		return {
			closeButton: defaultPic,
			profileImage: defaultPic,
		//	rightButton2: defaultPic,

		};
	},
	
	
	Switch()
	{
		return (
			<View style={styles.horContainer}>
				<Switch

				/>
			</View>
		) 
	},

	OneButton ()
	{
		return(
			<View style={styles.horContainer}>
				<TouchableOpacity style = {styles.cardLeftButton}>
					<Text style={styles.greyText}>
						{this.props.leftButton}
					</Text>
				</TouchableOpacity>
			</View>
		)	
	},

	TwoButton ()
	{
		return(

			<View style={styles.horContainer}>
				<TouchableOpacity style = {styles.cardLeftButton}>
					<Text style={styles.greyText}>
						{this.props.leftButton}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity style = {styles.blueTextArea}>	
					<Text style = {styles.blueText}>
						{this.props.rightButton}
					</Text>
				</TouchableOpacity>
			</View>
		)
	},

	render ()
	{

		if (this.props.cardType === "OneButton")
		{
			return this.OneButton ();
		}

		else if (this.props.cardType === "TwoButton")
		{
			return this.TwoButton ();
		}

		else if (this.props.cardType === "Switch")
		{
			return this.Switch();
		}
	},

});

const styles = StyleSheet.create(
{
	bgColorContainer:
	{
		justifyContent: 'center',
		alignItems: 'center',
		height:height,
		backgroundColor: themeColor.wind,
	},

	bigFont:
	{
		alignSelf: 'center',
		fontSize: 14,
		color: '#ffffff',
		fontFamily: fnt.regFont[Platform.OS],
	},

	listView: 
	{
		backgroundColor: '#D7D7D7',
	},
	
	container:
	{
		height: height/3.5,		
		width: width/1.3,		
		backgroundColor: '#FFFFFF',
		borderColor: '#D7D7D7',
		borderWidth: 5,
		borderRightWidth: 0,
	},

	usernamecontainer:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: '#D358F7',
		margin: 10,
	},

	username:
	{
		fontSize: 20,
		color: '#999',
		fontWeight: 'bold',
	},

	clickable:
	{
		padding: 10,
	},

	horContainer:
	{
		flex:1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 5,
		marginTop: 10,
	},

	cardImage:
	{
		width: 50,
		height: 50,
		margin: 5,
		alignSelf: 'center',
	},

	textArea:
	{
		flex: 1,
		margin:5,
	},

	tweettext:
	{
		flex: 1,
		margin:5,
		alignSelf: 'center',
		textAlign: 'left',
		color: 'white',
		fontSize: 13,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	cardLeftButton:
	{
	//	flex:1,
		alignSelf: 'center',
		borderColor: '#999999',
		borderWidth:1,
		borderRadius: 6,
		margin: 5,
		padding: 6,
		paddingHorizontal: 10,
	},

	greyText:
	{
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 13,
		fontWeight: 'bold',
		color: '#999999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	blueTextArea:
	{
		flex: 1,
		alignSelf: 'center',
		padding: 10,
	},

	blueText:
	{
		flex: 1,
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 13,
		fontWeight: 'bold',
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},
});

module.exports = NoticeBoardCardBottomArea;
	