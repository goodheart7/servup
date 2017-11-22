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

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../../lib/networkHandler';

const {height, width} = Dimensions.get('window');

var MyDeviceCard = React.createClass(
{
	getInitialState() {
		return {
			backed:  false,
			selectedStyle: '',
			activePlan: '',
		}
	},

	// greyTopRounded selectPlan selectUnselected bottomContainer greyTop
	// =>
	// greyTopRoundedSelelcted selectPlanSelected selectSelected bottomContainerSelected greyTopSelected
	componentDidMount() {
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			// console.log('MYDeviceCard->componentdidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			// console.log('MYDeviceCard->componentdidMount() token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			// console.log('MYDeviceCard->componentdidMount() UserID is:' + value);
			this.setState({"UserID": value});
		//	return getUserTelcoPlans(this.state.UserID, this.state.token, this.state.UserPhoneNumber);
		//})
		//.then((plans) => {
		//	console.log("MYDeviceCard->componentdidMount() User plans is:" + JSON.stringify(plans.activePlan));
		//	this.setState({
		//		activePlan: plans.activePlan,
		//	})
		})
		.catch((err) => {
			console.log(err);
		})
	},

	backFunction() {
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	shopForPlansButton() {
		this.props.navigator.push({id: 13, props: {pageTitle: "Topup"}});
	},

	render() {
		return (
			<View style = {styles.container}>

					<View style={styles.cardIntro}>
						<Text style = {styles.planName2}>
							My Device
						</Text>
					</View>


				<View style = {styles.bottomContainer}>
					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Image
								style = {{alignSelf: 'center', marginHorizontal: 30, height:height/10, width:width/10 }}
								source = {require('../../../res/common/iphone6s.png')}
								resizeMode = {"contain"}
							/>
							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									iPhone 6s
								</Text>
								{'\n'}Contract Expiry:{" "}
									<Text style = {styles.expDate}>
										{new Date().toDateString()}
									</Text>
							</Text>
						</View>
					</View>

					<View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
						<TouchableOpacity style = {styles.topUpButton} onPress={this.addonButton}>
							<Text style = {styles.topUpText}>
								{"    Upgrade   "}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style = {styles.topUpButton} onPress={this.addonButton}>
							<Text style = {styles.topUpText}>
								Replace Device
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
		backgroundColor: 'white',
	},

	cols:
	{
		flex: 1,
		backgroundColor: 'white',
	},

	whiteArea:
	{
		backgroundColor: 'white',
	},

	mainView:
	{
		backgroundColor: 'white',
	},

	container:
	{
		flex: 1,
		height: height/2.8,
		width: width,
		backgroundColor: 'white',
		borderColor: '#F2F1EF',
		borderWidth: 8,
		borderLeftWidth: 0,
	},

	bottomContainer:
	{
		flex: 1,
	//	margin: 15,
		backgroundColor: 'white',
	//	borderWidth: 1,
	//	borderColor: '#D7D7D7',
	},

	bottomContainerArea:
	{
		flex: 1,
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'center',
	//	marginHorizontal: 20,
	},

	validity:
	{
		alignSelf: 'flex-start',
		margin: 10,
		marginTop: 5,
		fontFamily: Fonts.regFont[Platform.OS],
		fontSize: 11,
		color: '#999',
	},

	iconText:
	{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		marginHorizontal: 30,
	},

	bottomContainerText:
	{
	//	textAlign: 'center',
		fontFamily: Fonts.regFont[Platform.OS],
		fontSize: 12,
		color: '#999',
	},

	cardIntro:
	{
		margin: 15,
	},

	greyBracket:
	{
		fontSize: 16,
		color: '#6666',
		fontFamily: Fonts.regFont[Platform.OS],
		textAlign: 'center',
		fontWeight: 'normal',
	},

	planName2:
	{
		alignSelf: 'flex-start',
		fontSize: 16,
		color: '#333',
		fontFamily: Fonts.regFont[Platform.OS],
		fontWeight: 'bold',
		textAlign: 'center',
	},

	planValues:
	{
		textAlign: 'center',
		fontSize: 36,
		color: '#333',
		fontFamily: Fonts.regFont[Platform.OS],
		fontWeight: '400',
	},

	planRate:
	{
		textAlign: 'center',
		fontSize: 10,
		color: '#333',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	expDate:
	{
		textAlign: 'center',
		fontSize: 12,
		color: '#333',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	selectUnselected:
	{
	//	width: width/3,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: StyleConstants.primary,
		padding: 5,
		paddingHorizontal: 20,
	},

	selectSelected:
	{
	//	width: width/3,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: StyleConstants.primary,
		padding: 5,
		paddingHorizontal: 20,

		backgroundColor: StyleConstants.primary,
	},

	selectPlan:
	{
		fontSize: 14,
		color: StyleConstants.primary,
		fontFamily: Fonts.regFont[Platform.OS],
	//	fontWeight: 'bold',
	},

	selectPlanSelected:
	{
		fontSize: 14,
		color: 'white',
		fontFamily: Fonts.regFont[Platform.OS],
	//	fontWeight: 'bold',
	},

	rowView:
	{
		height: 50,
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderWidth: 1,
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderBottomColor: '#333',
		borderTopColor: '#D7D7D7',
		backgroundColor: '#FFFFFF',
	},

	topUpText:
	{
		alignItems: 'center',
		textAlign: 'center',
		fontSize: 13,
		color: '#666666',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	topUpButton:
	{
		padding: 3,
		paddingHorizontal: 20,
		marginHorizontal: 15,
		marginTop: 5,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderRadius: 4,
		alignSelf: 'center',

	},

});

module.exports = MyDeviceCard
