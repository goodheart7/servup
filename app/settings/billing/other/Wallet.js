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
import {themeColor as themeColor} from '../../common/theme';
import {getUserWallets as getUserWallets} from '../../../lib/networkHandler';
var TitleBar = require('../../common/TitleBar');
var bgWhite = '#FFFFFF';
var arrow_right = require('../../../res/common/arrow_right.png');
var NavBar = require('../../common/NavBar');
const {height, width} = Dimensions.get('window');


var Wallet = React.createClass(
{
	getInitialState()
	{
		var ds = new ListView.DataSource(
		{
			rowHasChanged: (oldRow, newRow) => {
				// return  oldRow.isActive !== newRow.isActive;
			}
		});
		return {
			walletDataSource: ds,
			backed:  false,
		}
	},

	componentDidMount()
	{
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			console.log('UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			console.log('token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('UserID is:' + value);
			this.setState({"UserID": value});
			return getUserWallets(this.state.UserID, this.state.token, this.state.UserPhoneNumber);
		})
		.then((wallets) => {
			console.log("User wallets are:" + JSON.stringify(wallets));
			var walletArray = [wallets];
			this.setState({
				walletDataSource: this.state.walletDataSource.cloneWithRows(walletArray),
			})
		})
		.catch((err) => {
			console.log(err);
		})
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

	addPressed()
	{
		this.props.navigator.push({id: 136});
	},

	renderWallets(rowData)
	{
		return (
			<TouchableOpacity style={styles.rows} onPress={this.thirdField}>
				<View style = {styles.rightNextToIt}>
					<Image
						style = {styles.switchArea}
						source = {require('../../../res/common/wallet.png')}
					/>

					<Text style = {styles.textStyle}>
						{rowData.name}{"\n"}
							<Text style = {styles.subTextStyle}>
								{rowData.msisdn}
							</Text>
					</Text>
				</View>

				<View style = {styles.rightNextToIt}>
					<Image
						style = {styles.switchArea}
						source = {require('../../../res/common/selected_contact_messenger_icon.png')}
					/>
				</View>
			</TouchableOpacity>
		);
	},

	render()
	{
		return (
			<View style = {styles.scrollBox}>
				<TitleBar
					leftButton = {require('../../../res/common/back.png')}
					title = "Wallet"
					// titleImage = {require('./images/Servup_logo.png')}
					// rightButton = {require('../res/common/menu.png')}
					rightButton2 = {require('../../../res/common/add.png')}
					onLeftButtonPress={this.backFunction}
					onRightButton2Press={this.addPressed}
					// subText="last seen at 2:10 PM"
					// rightText = "Add"
				/>

				<View style = {styles.cols}>
					<ListView
					dataSource = {this.state.walletDataSource}
					renderRow = {this.renderWallets}
					bounces = {false}
					/>

					<View style={styles.whiteArea}>
					</View>
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
		backgroundColor: bgWhite,
	},

	cols:
	{
		flex: 1,
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 0,
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
	subTextStyle:
	{
	//	alignSelf: 'flex-end',
		marginHorizontal: 10,
		alignSelf: 'center',
		fontSize: 11,
		color: '#6666',
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

module.exports = Wallet
