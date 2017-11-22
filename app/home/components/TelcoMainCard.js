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

const {height, width} = Dimensions.get('window');

var TelcoMainCard = React.createClass(
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

	creditsButton()
	{
		var analytics = this.state.UserPhoneNumber + " clicked on credits full" + " at " + new Date().toUTCString();
		// Mixpanel.track(analytics);
		this.props.navigator.push({id: 1002, props: {previous: "credits"}});
	},

	walletButton()
	{
		var analytics = this.state.UserPhoneNumber + " clicked on wallet full" + " at " + new Date().toUTCString();
		// Mixpanel.track(analytics);
		this.props.navigator.push({id: 1002, props: {previous: "wallet"}});
	},

	creditPressed()
	{
		var analytics = this.state.UserPhoneNumber + " clicked on credits" + " at " + new Date().toUTCString();
		// Mixpanel.track(analytics);
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	walletPressed()
	{
		var analytics = this.state.UserPhoneNumber + " clicked on wallet" + " at " + new Date().toUTCString();
		// Mixpanel.track(analytics);
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	render()
	{
		return (
			<View style = {styles.cardView}>
				<View style = {styles.margin}>
					<View style = {styles.rowWithSpaceBetween}>
						<Text style = {styles.heading}>
							My Balance
						</Text>

						<Text style = {styles.lastUpdated}>
							Last Updated {"2"} min ago
						</Text>
					</View>

					<View style = {styles.internalBox}>
						<View style = {styles.parallelColumn}>
							<TouchableOpacity style = {styles.individualColumn} onPress={this.creditsButton}>
								<View style = {styles.rightNextToIt}>
									<View style = {styles.iconImageHolder}>
										<Image
											source = {require('../../../res/common/balance_icon.png')}
											style = {styles.iconImage}
										/>
									</View>
									<Text style = {styles.dollarText}>
										$
									</Text>
									<Text style = {styles.amountText}>
										250
									</Text>
								</View>

								<Text style = {styles.subText}>
									Credits Available
								</Text>



								<View  style = {{flex:1}}>
									<TouchableOpacity style = {styles.topUpButton} onPress={this.creditPressed}>
										<Text style = {styles.topUpText}>
											Top Up
										</Text>
									</TouchableOpacity>
								</View>

							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	cardView:
	{
		flex: 1,
		height: height/2.8,
		width: width,
		backgroundColor: '#FFFFFF',
		borderColor: '#F2F1EF',
		borderWidth: 8,
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},

	margin:
	{
		flex: 1,
		margin: 15,
	},

	rowWithSpaceBetween:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 15,
	},

	heading:
	{
		fontSize: 16,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',
	},

	lastUpdated:
	{
		fontSize: 10,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',

	},

	internalBox:
	{
		flex: 1,
		marginTop: 15,
		marginBottom: 5,
	//	borderColor: '#D7D7D7',
	//	borderWidth: 1,
	},

	parallelColumn:
	{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		justifyContent: 'center',
	},

	individualColumn:
	{
		// backgroundColor: 'skyblue',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		marginHorizontal: 10,
	},

	btnText:
	{
		// flex:1,
		// backgroundColor: 'violet',
	},

	iconImageHolder:
	{
	//	marginRight: 5,
	},

	iconImage:
	{
		resizeMode: 'contain',
		width: 35,
		height: 30,
	},

	rightNextToIt:
	{
		flex: 2,
		flexDirection: 'row',
		// backgroundColor: 'crimson',
	//	marginBottom: 10,
		alignItems: 'center',
		justifyContent: 'center',
	//	top: -10,
	},

	dollarText:
	{
		top: -8,
		marginLeft: 5,
		fontSize: 20,
		color: '#333',
		fontWeight: '400',
		fontFamily: fnt.regFont[Platform.OS],
	},

	amountText:
	{
		fontSize: 35,
		color: '#333',
		fontWeight: '400',
		fontFamily: fnt.regFont[Platform.OS],
	},

	subText:
	{
		marginBottom: 10,
		width: 100,
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 12,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	topUpButton:
	{
		width: width*0.25,
		// flex: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
		// margin: 10,
		// marginTop: 10,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderRadius: 4,
		alignSelf: 'center',

	},

	topUpText:
	{
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		color: '#666666',
		fontFamily: fnt.regFont[Platform.OS],
	},

});

module.exports = TelcoMainCard
