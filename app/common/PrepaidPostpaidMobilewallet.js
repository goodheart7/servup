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
	ActivityIndicator,
} from 'react-native';
import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
import {getUserWalletsBalance as getUserWalletsBalance} from '../../lib/networkHandler';
import {getUserLineCreditInformation as getUserLineCreditInformation} from '../../lib/networkHandler';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../lib/networkHandler';
import SideMenu from './xxSideMenu';
var TitleBar = require('./TitleBar');

var coins = require('../../res/common/available_balance.png');
var wallet = require('../../res/common/wallet_icon.png');
var scroll = require('../../res/common/outstanding_balance.png');
var picture = require('../../res/common/emptyPixel.png');

var connectionType =  "prepaid";

const {height, width} = Dimensions.get('window');

var bgWhite = '#FFFFFF';

var PrepaidPostpaidMobilewallet = React.createClass( 
{

	getInitialState()
	{
		var ds = new ListView.DataSource(
		{
			rowHasChanged: (oldRow, newRow) => {
				// return  oldRow.isActive !== newRow.isActive;
			}
		});

		var ds2 = new ListView.DataSource(
		{
			rowHasChanged: (oldRow, newRow) => {
				// return  oldRow.isActive !== newRow.isActive;
			}
		});

		var defaultCredit = {
			"availableBalance": "Loading...",
			"transactionsFromDate": "Loading...",
			"transactions": [
				{
				  "transactionDescription": "Loading...",
				  "transactionDate": "Loading...",
				  "transactionAmount": "Loading...",
				  "transactionType": "Loading...",
				},
			],
		};

		return {
			credit: ds,
			walletCredit: ds2,
			creditVal: '',
			walletCreditVal: '',
			backed:  false,
			selectedStyle: 'Loading...',
			activePlanValidity: 'Loading...',
		}
	},

	componentDidMount()
	{
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			console.log('PrepaidPostpaidMobilewallet->componentdidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			console.log('PrepaidPostpaidMobilewallet->componentdidMount() token is:' + value);
			return AsyncStorage.getItem("userDetails")
		})
		.then((userDetails) => {
			console.log('PrepaidPostpaidMobilewallet->componentdidMount() User Details are:' + userDetails);
			this.setState({"userDetails": JSON.parse(userDetails)}, function(){
				if (this.props.previous !== "wallet") {
					if (this.state.userDetails.lineType === "prepaid") {
						picture = coins;
                    }
					else {
						picture = scroll;
                    }
				} else {
					picture = wallet;
                }
			});
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('PrepaidPostpaidMobilewallet->componentdidMount() UserID is:' + value);
			this.setState({"UserID": value});
			return getUserLineCreditInformation(this.state.UserID, this.state.token, this.state.UserPhoneNumber, connectionType)
		})
		.then((credit) => {
			console.log("PrepaidPostpaidMobilewallet->componentdidMount() User line Credit is:" + JSON.stringify(credit));
			this.setState({creditVal: credit, credit: this.state.credit.cloneWithRows(credit.transactions)});
			return getUserWalletsBalance(this.state.UserID, this.state.token, this.state.UserPhoneNumber)
		})
		.then ((walletCredit) => {
			console.log("PrepaidPostpaidMobilewallet->componentdidMount() User getUserWalletsBalance is:" + JSON.stringify(walletCredit));
			this.setState({walletCreditVal: walletCredit, walletCredit: this.state.walletCredit.cloneWithRows(walletCredit.transactions)});
			return getUserTelcoPlans(this.state.UserID, this.state.token, this.state.UserPhoneNumber)
		})
		.then((plans) => {
			console.log("PrepaidPostpaidMobilewallet->componentdidMount() User plans is:" + JSON.stringify(plans.activePlanUsage));
			this.setState({
				activePlanValidity: plans.activePlanUsage.validity,
			})
		})
		.catch((err) => {
			console.log(err);
		})

	},

	backFunction()
	{
		picture = require('../../res/common/emptyPixel.png');
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	selectMe(newSelectedPlan, price)
	{
		this.setState({activePlan: newSelectedPlan, price: price});
	},

	topupFunction()
	{
		this.props.previous === "wallet" ? 
			this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}}) :
			this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	expiryText()
	{
		if (picture === coins)
			return (
				<Text style={styles.expiryText}>
					Expires in {this.state.activePlanValidity} days
				</Text>
			);
		return (<View/>);
	},

	renderRows(rowData)
	{
		return(
			<View style={styles.rowView}>
				<View style = {{marginHorizontal: 17,}}>
					<Text style = {styles.transactionDetail}>
						{rowData.transactionDescription} 
					</Text>
					<Text style = {styles.transactionDate}>
						{rowData.transactionDate} 
					</Text>
				</View>
				<View style = {{marginHorizontal: 17,}}>
					<Text style = {rowData.transactionType === 'Debit' ? styles.transactionAmountRed : styles.transactionAmountGreen}>
						{rowData.transactionType === 'Debit' ? "-" : '+'}${rowData.transactionAmount} 
					</Text> 
				</View>
			</View>
		);
	},

	render()
	{
		var navigator = this.props.navigator;
		var phone = '' + this.state.UserPhoneNumber; 
		var phoneNo = '+' + phone.substring(0, 2) + " " + phone.substring(2, 5) + " " + phone.substring(5, 8) + " " + phone.substring(8, 13);
		return (		 	
			<View style = {styles.scrollBox}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = {phoneNo} 
				//	titleImage = {require('./images/Servup_logo.png')}
				//	rightButton = {require('../res/common/menu.png')}
				//	rightButton2 = {require('../../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButton2Press= {this.sideMenuScreen}
				//	subText="last seen at 2:10 PM"
				//	rightText = "Add"
				/>
				<View style = {styles.cols}>
					<View>
						<View style = {styles.rightNextToIt}>
							<View style = {styles.iconImageHolder}>
								<Image
									source = {picture}
									style = {{resizeMode: 'contain'}}
								/>
							</View>

							<View style = {styles.dollarAmountandCredits}>
								<View style = {{flexDirection: 'row', height: height/12,}}>
									<Text style = {styles.dollarText}>
										$
									</Text>
									<Text style = {styles.amountText}>
										{ this.props.previous === "wallet"?
											this.state.walletCreditVal.availableBalance : this.state.creditVal.availableBalance}{"\n"}						
									</Text>							
								</View>
								<View style = {styles.dollarAmountandCredits2}>
									<Text style={styles.creditsText}>
										Available Credit
									</Text>
								</View>
						</View>
					</View>
				</View>

				{this.expiryText()}

				<TouchableOpacity onPress = {this.topupFunction} style={styles.topUpButton}>
					<Text style={styles.topUpText}>
						Topup
					</Text>
				</TouchableOpacity>	


				<View style={styles.rowView2}>
					<Text style = {styles.recentTransactions}>
						Recent Transactions 
					</Text>
					<Text style = {styles.recentTransactionsDate}>
						Since Dec 05, 2005
					</Text>
				</View>

				<ListView
					bounces = {false}
					dataSource = { this.props.previous === "wallet" ? this.state.walletCredit : this.state.credit}
					renderRow = {this.renderRows}
					renderFooter = {this.ender}

				>					 
				</ListView>

				<View style={styles.rowView}>
					<TouchableOpacity style={styles.reqDetailsButton}>
						<Text style={styles.planRate}>
							Request Details
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.chatWithSupportButton}>
						<Text style={styles.YNButtonText}>
							Chat with Support ?
						</Text>
					</TouchableOpacity>
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
		backgroundColor: bgWhite,
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 0,
	},

	rightNextToIt:
	{
	//	flex: 1,
		flexDirection: 'row',
		marginTop: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},

	iconImageHolder:
	{
		marginRight: 10,
	//	top: -5,
		alignItems: 'center',
	},

	dollarAmountandCredits:
	{
		alignItems: 'center',
		justifyContent: 'center',		
	//	backgroundColor: 'red',
	//	marginLeft: 10,
	},

	dollarAmountandCredits2:
	{
		alignItems: 'center',
		justifyContent: 'center',		
	//	backgroundColor: 'pink',
	//	marginLeft: 10,
	},

	dollarText:
	{
		top: 8,
		fontSize: 20,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
	},

	amountText:
	{
		fontSize: 40,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
	},

	creditsText:
	{
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
	//	top: -15,
		color: '#666666',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	expiryText:
	{
		marginTop: 5,
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 15,
		color: '#666666',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	topUpText:
	{
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		fontWeight: 'normal',
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},

	recentTransactions:
	{
		marginHorizontal: 17,
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	recentTransactionsDate:
	{
		marginHorizontal: 17,
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		color: '#666666',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	transactionDetail:
	{
		textAlign: 'left',
		fontSize: 13,
		color: '#333',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	transactionDate:
	{
		textAlign: 'left',
		fontSize: 11,
		color: '#666666',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	transactionAmountRed:
	{
		textAlign: 'center',
		fontSize: 13,
		color: 'red',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	transactionAmountGreen:
	{
		textAlign: 'center',
		fontSize: 13,
		color: 'green',
		fontWeight: 'normal',
		fontFamily: fnt.regFont[Platform.OS],
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
	},

	mainView:
	{
		backgroundColor: bgWhite,
	},
	
	container:
	{
		backgroundColor: bgWhite,
		margin: 10,
		paddingBottom: -20,
	},

	validity:
	{
		alignSelf: 'flex-start', 
		margin: 10,
		marginTop: 5,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 11,
		color: '#999',
	},

	bottomContainerText:
	{
		margin: 10,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 11,
		color: '#999',

	},

	cardIntro:
	{
		marginHorizontal: 10,
	},
	
	planRate:
	{
		fontSize: 11,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},	

	rowView:
	{
		// height: 50,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		borderWidth: 1,
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderBottomColor: '#FFFFFF',
		borderTopColor: '#D7D7D7',
		backgroundColor: '#FFFFFF',
	},

	rowView2:
	{
		flexDirection: 'row',
		height: 50,
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		borderWidth: 0,
		borderTopWidth: 6,
		// borderBottomWidth: 1,
		borderTopColor: '#ececec',
		borderBottomColor: '#333',
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
	},

	topUpButton:
	{
		padding: 3,
		paddingHorizontal: 20,
		margin: 20,
		alignItems: 'center',
		borderWidth: 1,		
		borderColor: themeColor.wind,
		borderRadius: 4,
		alignSelf: 'center',
	},

	reqDetailsButton:
	{
		padding: 10,
		paddingHorizontal: 20,
		margin: 15,
		alignItems: 'center',
		borderWidth: 1,		
		borderColor: '#6666',
		borderRadius: 4,
		alignSelf: 'center',
	},

	YButton:
	{
		margin: 15,
		padding: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		backgroundColor: themeColor.wind,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	
	NButton:
	{
		margin: 15,
		backgroundColor: '#FFFFFF',
		alignSelf: 'center',
	},

	chatWithSupportButton:
	{
		padding: 5,
		margin: 15,
	},

	YNButtonText:
	{
		color: themeColor.wind,
		fontSize: 13,
		fontFamily: fnt.regFont[Platform.OS],
	},
	
});

module.exports = PrepaidPostpaidMobilewallet