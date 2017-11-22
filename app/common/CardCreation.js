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

import {fnt as fnt} from './fontLib';
import {getCards as getCards} from '../../lib/networkHandler';
var TitleBar = require('./TitleBar');
import {themeColor as themeColor} from './theme';
var bgWhite = '#FFFFFF';

const {height, width} = Dimensions.get('window');


var CardCreation = React.createClass( 
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

	gotoBuyCard()
	{
	//	this.props.navigator.push({id: 9,})
	},

	gotoSubscribeCard()
	{
	//	this.props.navigator.push({id: 10,})
	},

	gotoRegisterCard()
	{
	//	this.props.navigator.push({id: 11,})
	},


	render()
	{
		return (
			<View style = {styles.cols}>
			<TitleBar
				cancelText = "Cancel"
			//	leftButton = {require('../res/common/contactPlus.png')}
				title = "Create a Card"
			//	titleImage = {require('./images/Servup_logo.png')}
			//	rightButton = {require('../res/common/menu.png')}
			//	rightButton2 = {require('../res/common/menu.png')}
				onLeftButtonPress = {this.backFunction}
			//	onRightButtonPress={this.backFunction}
			//	onRightButton2Press={this.backFunction}
			//	subText="last seen at 2:10 PM"
			/>

				<View style={styles.rows}>
					<Text style = {styles.HeadingTextStyle}>
						Select which card type would you like to create
					</Text>

				</View>

				<TouchableOpacity style={styles.rows} onPress = {this.gotoBuyCard}>
					<Image
						style = {styles.imageStyle}
						source = {require('../../res/common/buy_card_icon.png')}
					/>

					<View style = {styles.textSubtext}>
						<Text style = {styles.titleTextStyle}>
							Buy Card
						</Text>

						<Text style = {styles.textStyle}>
							Use this card to sell items
						</Text>
					</View>

					<Image
						source = {require('../../res/common/arrow_right.png')}
						style = {styles.imageStyle}
					/>
				</TouchableOpacity>

				<TouchableOpacity style={styles.rows} onPress = {this.gotoSubscribeCard}>
					<Image
						style = {styles.imageStyle}
						source = {require('../../res/common/subscribe_card_icon.png')}
					/>

					<View style = {styles.textSubtext}>
						<Text style = {styles.titleTextStyle}>
							Buy Card
						</Text>

						<Text style = {styles.textStyle}>
							Use this card to sell subscription based services
						</Text>
					</View>

					<Image
						source = {require('../../res/common/arrow_right.png')}
						style = {styles.imageStyle}
					/>
				</TouchableOpacity>

				<TouchableOpacity style={styles.rows} onPress = {this.gotoRegisterCard}>
					<Image
						style = {styles.imageStyle}
						source = {require('../../res/common/register_card_icon.png')}
					/>

					<View style = {styles.textSubtext}>
						<Text style = {styles.titleTextStyle}>
							Buy Card
						</Text>

						<Text style = {styles.textStyle}>
							Use this card to have people sign up for an event/service 
						</Text>
					</View>

					<Image
						source = {require('../../res/common/arrow_right.png')}
						style = {styles.imageStyle}
					/>
				</TouchableOpacity>
				

				<View style={styles.whiteArea}>
				</View>
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex:1,
		height: height,
		backgroundColor: '#ececec',
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

	imageStyle:
	{
		alignSelf: 'center',
	},

	textSubtext:
	{
		flex:1,
		marginHorizontal: 10,
	},

	HeadingTextStyle:
	{
		alignSelf: 'flex-start',
		fontSize: 14,
		color: 'grey',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyle:
	{
		flex: 1,
		alignSelf: 'flex-start',
		fontSize: 11,
		color: 'grey',
		fontFamily: fnt.regFont[Platform.OS],
	},

	titleTextStyle:
	{
		alignSelf: 'flex-start',
		fontSize: 14,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	switchArea:
	{
		alignSelf: 'flex-end',
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
		padding: height,
	},
});

module.exports = CardCreation