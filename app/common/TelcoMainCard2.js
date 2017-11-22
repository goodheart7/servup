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
import {themeColor as themeColor} from './theme';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../lib/networkHandler';
var TitleBar = require('./TitleBar');
var bgWhite = '#FFFFFF';
var NavBar = require('./NavBar');

const {height, width} = Dimensions.get('window');


var TelcoMainCard2 = React.createClass( 
{
	getInitialState()
	{
		return {
			backed:  false,
			activePlan: '',
		}
	},

	componentDidMount()
	{
		// SideMenu.changePic(this.props.ProfilePicFull);
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			console.log('TelcoMainCard2.js->componentDidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			console.log('TelcoMainCard2.js->componentDidMount()  token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('TelcoMainCard2.js->componentDidMount() UserID is:' + value);
			this.setState({"UserID": value});
			return getUserTelcoPlans(this.state.UserID, this.state.token, this.state.UserPhoneNumber);
		})
		.then((plans) => {
			console.log("TelcoMainCard2.js->componentDidMount() User plans is:" + JSON.stringify(plans.activePlan));
			this.setState({
				activePlan: plans.activePlan,
				recommendedPlan: plans.recommendedPlan,
			})
			console.log("TelcoMainCard2.js->componentDidMount() User ACTIVE plans is:" + this.state.activePlan.data);
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

	creditPressed()
	{
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	walletPressed()
	{
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	touchListener()
	{
		console.log ( "Profile IMage Recieved in TelcooMain2: " + JSON.stringify(this.props.profileImage));
		this.props.navigator.push({id: 13, props: {profileImage: this.props.profileImage}});
	},

	render()
	{
		return (
			<View style = {styles.cardView}>
				<View style = {styles.margin}>
					<View style = {styles.rowWithSpaceBetween}>
						<Text style = {styles.heading}>
							My Telco
						</Text>

						<TouchableOpacity style = {styles.cardButton} onPress = {this.touchListener}>
							<Text style={styles.greyText}>
								VIEW ALL
							</Text>
						</TouchableOpacity>
					</View>
					
					<View style = {styles.internalBox}>
						<View style = {styles.parallelColumn}>
							<View style = {styles.individualColumn}>
								<Text style = {styles.PackageTypeText}>
									Package Type
								</Text>
								<Text style = {styles.amountText}>
									Postpaid
								</Text>						
								<Text style = {styles.PackageTypeText}>
									Package Plan
								</Text>	
								<Text style = {styles.amountText}>
									Student Talk
								</Text>							
							</View>
								

							<View style = {styles.individualColumn2}>
									<Image
										style = {{resizeMode: 'contain', width: 100, height: 61, top: 20}}
										source = {require('../../res/common/circularDial.png')}
									/>

									<View style = {{alignItems: 'center', top: -20}}>
										<Text style = {styles.currentValue}>
											{this.state.activePlan.data/2} MB
										</Text>
										<Text style = {styles.totalValue}>
											/{this.state.activePlan.data} MB
										</Text>
										<Text style = {styles.elementType}>
											Data
										</Text>
									</View>
							</View>
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
		height: height/2.8,
		width: width* 1.025,
		backgroundColor: '#FFFFFF',
		borderColor: '#F2F1EF',
		borderWidth: 8,
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
	},

	heading:
	{
		fontSize: 16,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	cardButton:
	{
		alignSelf: 'center',
		borderColor: '#999999',
		borderWidth:1,
		borderRadius: 6,
		paddingVertical: 6,
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

	lastUpdated:
	{
		fontSize: 11,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],

	},

	internalBox:
	{
		flex: 1,
		marginTop: 15,
		marginBottom: 5,
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
		flex: 1,
		width: width * 0.4,
		height: height * 0.2,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding: 10,
		marginHorizontal: 10,
		borderColor: '#D7D7D7',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderWidth: 1,
		borderRightWidth: 2,
		borderBottomWidth: 2,
	},

	individualColumn2:
	{
		flex: 1,
		width: width * 0.4,
		height: height * 0.2,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		marginHorizontal: 10,
		borderColor: '#D7D7D7',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderWidth: 1,
		borderRightWidth: 2,
		borderBottomWidth: 2,
	},

	valueBar:
	{
		flex: 1,
	//	margin: 5,
		width: width/12,
		height: height*0.15,
		backgroundColor: '#DDDDDD',
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: themeColor.wind,
		borderWidth: 1,
	},

	innerValueBar:
	{
	//	flex: 1,
		width: width/14,
		height: height*0.075,
		backgroundColor: themeColor.wind,
		borderRadius: 3,
		justifyContent: 'flex-end',
		borderColor: themeColor.wind,
		borderWidth: 1,
	},	

	currentValue:
	{
		fontSize: 15,
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
	},

	totalValue:
	{
		fontSize: 13,
		color: '#6666',
		fontStyle: 'italic',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
	},
	
	elementType:
	{
		fontSize: 12,
		color: themeColor.wind,
		fontStyle: 'italic',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
	},



	iconImageHolder:
	{
	//	width: 30,
	//	height: 30,
	}, 

	iconImage:
	{
		resizeMode: 'contain',
	},


	rightNextToIt:
	{
		flex: 1,
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},

	PackageTypeText:
	{
		fontSize: 13,
		color: '#6666',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'left',
		marginBottom: 3,
	},

	amountText:
	{
		fontSize: 13,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'left',
		marginBottom: 15,
	},

	subText:
	{
	//	width: 80,
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 15,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	topUpText:
	{
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		color: '#666666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	topUpButton:
	{
		padding: 3,
		paddingHorizontal: 10,
		marginTop: 10,
		alignItems: 'center',
		borderWidth: 1,		
		borderColor: '#D7D7D7',
		borderRadius: 4,
		alignSelf: 'center',

	},
});

module.exports = TelcoMainCard2