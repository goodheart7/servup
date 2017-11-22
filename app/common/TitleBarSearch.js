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
} from 'react-native';

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';

var TitleBar = React.createClass({
	
	render()
	{
		return(
			<View style = {styles.topBlueBar}>
				<TouchableOpacity onPress = {this.props.onLeftButtonPress}  style = {styles.backButtonContainer}>			        	
					<Image source = {this.props.leftButton}/>
				</TouchableOpacity>
				
				<View style={styles.titleAreaContainer}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>
							 {this.props.title}
						</Text>
						<Text style={styles.subText}>
							{this.props.subText}
						</Text>
					</View>
				</View>

				<TouchableOpacity onPress = {this.props.onRightButtonPress}  style = {styles.backButtonContainer}>
					<Image source = {this.props.rightButton}/>
				</TouchableOpacity>

				<TouchableOpacity onPress = {this.props.onRightButton2Press}  style = {styles.fwdButtonContainer}>
					<Image source = {this.props.rightButton2}/>
				</TouchableOpacity>

			</View>
		)
	}
});

const styles = StyleSheet.create(
{
	topBlueBar:
	{
		height: 50,
		backgroundColor: themeColor.wind,
		flexDirection: 'row',
	},

	backButtonContainer:
	{
		marginLeft: 10,
		alignSelf: 'center',
		padding: 10,
	},

	titleAreaContainer:
	{
		flex:1,		
		flexDirection: 'column',
		alignSelf: 'center',
	},

	titleContainer:
	{		
		alignSelf: 'center',
		left: 20,
	},

	title:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 14,
		color: '#FFFFFF',
	},
	
	subText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 9,
		color: '#FFFFFF',
	},

	fwdButtonContainer:
	{
		marginRight: 10,
		alignSelf: 'center',
		padding: 10,
	},
});

module.exports = TitleBar;