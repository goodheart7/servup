import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	Platform,
} from 'react-native';

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
import {titleArea as titleArea} from './theme';
import LinearGradient from 'react-native-linear-gradient';
const {height, width} = Dimensions.get('window');
var defaultPic = require('../../res/common/emptyPixel.png');
var backButtonImage;
var reducer = 0;
var leftButton;

var TitleBar = React.createClass({

	getDefaultProps() {
		return {
			leftButton: backButtonImage,
			rightButton: defaultPic,
			rightButton2: defaultPic,
			titleImage: defaultPic,
			color1: themeColor.wind,
			color2: themeColor.wind,
			color3: themeColor.wind,
		};
	},

	getInitialState()
	{
		if (this.props.isHome)
			reducer = -2;
		else
			reducer = 0;
		return {

		};
	},

	render()
	{
    // console.log('TitleBar.js->render() this.props.leftButton Value is: ' + this.props.leftButton);

		if (!this.props.leftButton)
			leftButton = defaultPic;
		else
			leftButton = this.props.leftButton;

		if (this.props.titleImage==null)
			titleImage = defaultPic;
		else
			titleImage = this.props.titleImage;

		if (!this.props.rightButton==null)
			rightButton = defaultPic;
		else
			rightButton = this.props.rightButton;

		if (!this.props.rightButton2==null)
			rightButton2 = defaultPic;
		else
			rightButton2 = this.props.rightButton2;

		return(
			<View style = {{zIndex: 9}}>
				<LinearGradient colors={[this.props.color1, this.props.color2, this.props.color3]} style={styles.extraArea}>
				</LinearGradient>
				<LinearGradient style = {styles.topBlueBar} colors = {[this.props.color1, this.props.color2, this.props.color3]}>
					<TouchableOpacity onPress = {this.props.onLeftButtonPress}  style = {styles.backButtonContainer}>
						<Image source = {leftButton}  resizeMode = 'contain' style={{width: 18, height: 18}}/>
						<Text style={styles.rightTextStyle}>
							 {this.props.cancelText}
						</Text>
					</TouchableOpacity>

					<View style={styles.titleAreaContainer}>
						<Image source = {titleImage} style = {this.props.titleImage ? styles.titleImageStyle : styles.titleImageStyleNull } resizeMode = 'contain'/>
						<Text style={styles.title}>
							 {this.props.title}
						</Text>
					</View>


					<View style = {styles.fwdButtonContainer}>
						<TouchableOpacity onPress = {this.props.onRightButtonPress} style = {styles.buttonsStyle}>
							<Image source = {rightButton} resizeMode = 'contain'/>
						</TouchableOpacity>

						<TouchableOpacity onPress = {this.props.onRightButton2Press} style = {styles.buttonsStyle}>
							<Image source = {rightButton2} resizeMode = 'contain' style={{width: 18, height: 18}}/>
							<Text style={styles.rightTextStyle}>
								{this.props.rightText}
							</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>
		)
	}
});

const styles = StyleSheet.create(
{
	extraArea:
	{
		height: height/ titleArea[Platform.OS],
	//	backgroundColor: themeColor.wind,
	},

	topBlueBar:
	{
		height: height/14,
	//	backgroundColor: themeColor.wind,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: reducer,
	},

	backButtonContainer:
	{
		marginLeft: 5,
		justifyContent: 'flex-start',
		alignSelf: 'center',
		padding: 15,
		flexDirection: 'row',
		flex: 1,
		// backgroundColor: 'yellow',
	},

	titleAreaContainer:
	{
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		padding: 10,
		flex: 3,
		// backgroundColor: 'crimson',
	},

	rightTextStyle:
	{
		alignSelf: 'center',
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 18,
		color: '#FFFFFF',
	},

	titleContainer:
	{
		alignSelf: 'center',
	},

	title:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 22,
		color: '#FFFFFF',
		alignSelf: 'center',
		fontWeight: '400',
		textAlign: 'center',
		paddingRight: 18
	},

	titleImageStyle:
	{
		marginBottom: 20,
		height: height/16,
		// width: width/2,
		alignSelf: 'center',
	},

	titleImageStyleNull:
	{
		marginBottom: 20,
		alignSelf: 'center',
	},

	subText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 9,
		color: '#FFFFFF',
	},

	fwdButtonContainer:
	{
		marginRight: 5,
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
		// backgroundColor: 'green',

	},

	buttonsStyle:
	{
		padding: 15,
		flexDirection: 'row',
		alignSelf: 'center',
	//	marginHorizontal: 10,
	},
});

module.exports = TitleBar;
