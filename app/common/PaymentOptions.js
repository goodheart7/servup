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
var TitleBar = require('./TitleBar');
import {themeColor as themeColor} from './theme';
var bgWhite = '#FFFFFF';
var NavBar = require('./NavBar');

const {height, width} = Dimensions.get('window');
var tick = require('../../res/common/selected_contact_messenger_icon.png');


var paymentCards  = [
	{image: require('../../res/common/credit_debit_card.png'), text: 'Credit/Debit Card', isActive: true},
	{image: require('../../res/common/bill_payment.png'), text: 'Bill', isActive: false},
	{image: require('../../res/common/wallet.png'), text: 'Wallet', isActive: false},
	{image: require('../../res/common/gift_icon.png'), text: 'Gift Card', isActive: false},
	{image: require('../../res/common/rewards_icon.png'), text: 'Redeem Rewards', isActive: false},
	{image: require('../../res/common/scratch_card_icon.png'), text: 'Scratch Cards', isActive: false},
	{image: require('../../res/common/promo_code_icon.png'), text: 'Promo Code', isActive: false},
];

var PaymentOptions = React.createClass( 
{
	getInitialState()
	{
		var ds = new ListView.DataSource(
		{
			rowHasChanged: (oldRow, newRow) => {
				// return  oldRow.isActive !== newRow.isActive;
				return true;
			}
		});
		return {
			cardDataSource: ds.cloneWithRows(this.onPaymentMethodTouch()),
			backed:  false,
			currentPaymentMethodIndex: 0,
		}
	},

	renderPaymentMethod(rowData, sectionID, rowID)
	{
		var style = rowData.isActive === true ? styles.selectedRow : styles.rows;
		
		return (
			<View style = {styles.listBorder}>
				<TouchableOpacity style={style} onPress= {this.onPaymentMethodTouch.bind(this, rowID)}>
					<View style = {{flexDirection: 'row', alignItems: 'center'}}>
						<Image
							source = {rowData.image}
							style = {{ marginRight: 10,}}
						/>
						<Text style = {styles.textStyle}>
							{rowData.text}
						</Text>
					</View>
					<Image source = {rowData.isActive == true? tick : null} />
				</TouchableOpacity>
			</View>
		);
	},

	onPaymentMethodTouch(id)
	{
		if (!id)
		{
			var newRows = paymentCards.map( (row) => {row.isActive = false; return row; } );
			newRows[0].isActive = true;
			return newRows;
		}

		this.setState ({currentPaymentMethodIndex: id,});
		console.log("Curret Payent Method number is " + this.state.currentPaymentMethodIndex);

		var newRows = paymentCards.map( (r, ind, arr) => {
			if (ind !== id)
			{
				r.isActive = false;	
			}
			return r;
		});

		newRows[id].isActive = true;
		this.setState({
			cardDataSource: this.state.cardDataSource.cloneWithRows(newRows)
		});
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

	nextFunction()
	{
		var numtoCheck = parseInt(this.state.currentPaymentMethodIndex);
		if (numtoCheck === 0)
			this.props.navigator.push({id: 999, props: {cards: this.props.cards, paymentVia: 'ChargeToCreditCard', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 1)
			this.props.navigator.push({id: 999, props: {cards: this.props.cards, paymentVia: 'ChargeToBill', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 2)
			this.props.navigator.push({id: 999, props: {cards: this.props.cards, paymentVia: 'ChargeToWallet', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 3)
			this.props.navigator.push({id: 80, props: {cards: this.props.cards, backScreen: 999, paymentVia: 'ChargeToGiftCard', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 4)
			this.props.navigator.push({id: 999, props: {cards: this.props.cards, paymentVia: 'ChargeToRewardPoints', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 5)
			this.props.navigator.push({id: 70, props: {cards: this.props.cards, backScreen: 999, paymentVia: 'ChargeToScratchCard', price: this.props.price, membershipType: this.props.membershipType}});
		if (numtoCheck === 6)
			this.props.navigator.push({id: 999, props: {cards: this.props.cards, paymentVia: 'ChargeToPromoCard', price: this.props.price, membershipType: this.props.membershipType}});

	},

	render()
	{
		return (
			<View style = {styles.scrollBox}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Payments"
				//	titleImage = {require('./images/Servup_logo.png')}
				//	rightButton = {require('../res/common/menu.png')}
				//	rightButton2 = {require('../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButtonPress={this.backFunction}
					onRightButton2Press={this.nextFunction}
				//	subText="last seen at 2:10 PM"
					rightText = "Next"
				/>
				<View style = {styles.heading}>
					<Text style = {styles.headingFont}>
						Select Payment Option
					</Text>
				</View>

				<ListView
					dataSource ={this.state.cardDataSource}
					renderRow = {this.renderPaymentMethod}
				/>
				
				<NavBar
					navigator = {this.props.navigator}
					profileImage = {this.props.profileImage}
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
		// height: height,
		backgroundColor: bgWhite,
	},

	contentContainer:
	{
		backgroundColor: bgWhite,
	},

	cols:
	{
	//	flex: 1,
	},

	listBorder:
	{
		borderColor: '#ececec',
		borderWidth: 4,
		borderTopWidth: 0,
		borderBottomWidth: 0,
	},

	rows:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
		marginHorizontal: 60,
		marginVertical: 10,
		borderWidth: 1,
		borderColor: '#6666',
		borderRadius: 10,
		backgroundColor: bgWhite,
		alignItems: 'center',
	},
	
	selectedRow:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 60,
		marginVertical: 10,
		padding: 15,
		borderWidth: 1,
		borderColor: themeColor.wind,
		borderRadius: 10,
		backgroundColor: bgWhite,
		alignItems: 'center',
	},

	heading:
	{
		padding: 30,
		backgroundColor: bgWhite,
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 1,
		borderBottomColor: '#3333',
		justifyContent: 'center',
		alignItems: 'center',
	},

	headingFont:
	{
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyle:
	{
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',
		fontSize: 14,
		color: '#666',
	},

	switchArea:
	{
		alignSelf: 'flex-end',
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
	//	padding: height,
	},
});

module.exports = PaymentOptions