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
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import {themeColor as themeColor} from '../../common/theme';
import {fnt as fnt} from '../../common/fontLib';

import {getUserTelcoPlans as getUserTelcoPlans} from '../../../lib/networkHandler';
const {height, width} = Dimensions.get('window');


circleSize = height/7.6;
var bgWhite = '#FFFFFF';
var fill;

var TelcoPlanSingle = React.createClass(
{
	getInitialState() {
		return {
			backed:  false,
			selectedStyle: '',
			activePlan: '',
			activePlanUsage: '',
			points: 325,
		}
	},

	// greyTopRounded selectPlan selectUnselected bottomContainer greyTop
	// =>
	// greyTopRoundedSelelcted selectPlanSelected selectSelected bottomContainerSelected greyTopSelected
	componentDidMount() {
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			// console.log('TelcoPlanSingle.js->componentDidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			// console.log('TelcoPlanSingle.js->componentDidMount() token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			// console.log('TelcoPlanSingle.js->componentDidMount() UserID is:' + value);
			this.setState({"UserID": value});
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

	addonButton() {
		var analytics = this.state.UserPhoneNumber + " clicked on telco manage add on" + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);
		this.props.navigator.push({id: 1010, props: {profileImage: this.props.profileImage}});
	},

	shopForPlansButton() {
		var analytics = this.state.UserPhoneNumber + " clicked on telco switch plans" + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);
		this.props.navigator.push({id: 13, props: {profileImage: this.props.profileImage}});
	},

	makeCircles(value) {
		var thickness = 6;
 		thickness = parseInt(thickness);
		return (
			<View style = {{top: 10,}}>
				<AnimatedCircularProgress
					size = {circleSize}
					rotation = {180}
					width = {thickness}
					fill = {fill}
					tintColor = {themeColor.wind}
					backgroundColor = "#F2F1EF"
				>
				</AnimatedCircularProgress>
			</View>
		);
	},

	render() {
		fill = this.state.points / 500 * 100;
		return (
			<View style = {styles.container}>

				<View style={styles.cardIntro}>
					<Text style = {styles.planName}>
						My Plan
					</Text>
					<Text style = {styles.planRate}>
						Smartphone Plan ${this.state.activePlanUsage.price}/Month
					</Text>
				</View>


				<View style = {styles.bottomContainer}>
					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>

							{this.makeCircles(this.state.activePlanUsage.voice)}

							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{this.state.activePlanUsage.voice}
								</Text>
								{'\n'}out of{'\n'}
									<Text style = {styles.totalAmount}>
										500 Mins
									</Text>
							</Text>
						</View>

						<View style = {styles.iconText}>

							{this.makeCircles(this.state.activePlanUsage.data)}

							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{this.state.activePlanUsage.data}
								</Text>
								{'\n'}out of{'\n'}
									<Text style = {styles.totalAmount}>
										500 MBs
									</Text>
							</Text>
						</View>

						<View style = {styles.iconText}>

							{this.makeCircles(this.state.activePlanUsage.sms)}

							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{this.state.activePlanUsage.sms}
								</Text>
								{'\n'}out of{'\n'}
									<Text style = {styles.totalAmount}>
										500 SMS
									</Text>
							</Text>
						</View>
					</View>

					<View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-around', top:50}}>
						<TouchableOpacity style = {styles.topUpButton} onPress={this.addonButton}>
							<Text style = {styles.topUpText}>
								Manage Add-ons
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style = {styles.topUpButton} onPress={this.shopForPlansButton}>
							<Text style = {styles.topUpText}>
								Shop For Plans
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
		flex: 1,
		height: height/2.8,
		width: width,
		backgroundColor: bgWhite,
		borderColor: '#F2F1EF',
		borderWidth: 8,
	},

	cardIntro:
	{
		margin: 0,
		marginBottom: 5,
	},

	bottomContainer:
	{
		flex: 1,
		marginHorizontal: 15,
		marginTop: 15,
		backgroundColor: bgWhite,
	//	borderWidth: 1,
	//	borderRightWidth: 0,
	//	borderColor: '#F2F1EF',
		top: -5,
	},

	bottomContainerArea:
	{
		flex: 3,
		flexDirection: 'row',
		backgroundColor: bgWhite,
		justifyContent: 'space-between',
	},

	CircularDial:
	{
	//	resizeMode: 'contain',
		width: circleSize,
		height: circleSize,
	},

	iconText:
	{
	//	backgroundColor: 'blue',
	//	flexDirection: 'row',
		alignItems: 'center',
		padding: 2,
	//	margin: 5,
	//	marginBottom: 5,
	},

	bottomContainerText:
	{
		margin: 10,
	//	marginRight: 5,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 8,
		color: '#999',
		textAlign: 'center',
		alignSelf: 'center',
		top: -75,
	},

	planName:
	{
		fontSize: 16,
		color: '#333',
		marginLeft: 15,
		marginTop: 15,
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'bold',
	},

	planValues:
	{
		fontSize: 16,
	//	alignSelf: 'center',
		textAlign: 'center',
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: '400',
		backgroundColor: 'transparent',
	},

	planRate:
	{
		marginLeft: 15,
		fontSize: 10,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
		backgroundColor: 'transparent',
	},

	totalAmount:
	{
		fontSize: 10,
	//	alignSelf: 'center',
		textAlign: 'center',
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: '400',
		backgroundColor: 'transparent',

	},

	selectUnselected:
	{
	//	width: width/3,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: themeColor.wind,
		padding: 5,
		paddingHorizontal: 20,
	},

	selectSelected:
	{
	//	width: width/3,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: themeColor.wind,
		padding: 5,
		paddingHorizontal: 20,
		backgroundColor: themeColor.wind,
	},

	selectPlan:
	{
		fontSize: 14,
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	//	fontWeight: 'bold',
	},

	selectPlanSelected:
	{
		fontSize: 14,
		color: bgWhite,
		fontFamily: fnt.regFont[Platform.OS],
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
		fontFamily: fnt.regFont[Platform.OS],
	},

	topUpButton:
	{
		paddingVertical: 5,
		paddingHorizontal: 5,
		marginHorizontal: 30,
	//	marginTop: 10,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderRadius: 4,
		alignSelf: 'center',
		top: -50,
	},

});

module.exports = TelcoPlanSingle
