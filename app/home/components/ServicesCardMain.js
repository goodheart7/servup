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

import {fnt as fnt} from '../../common/fontLib';
import {themeColor as themeColor} from '../../common/theme';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../../lib/networkHandler';

const {height, width} = Dimensions.get('window');

var bgWhite = '#FFFFFF';

var ServicesCardMain = React.createClass(
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
			// console.log('ServiceCardMain.js->componentDidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			// console.log('ServiceCardMain.js->componentDidMount() token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			// console.log('ServiceCardMain.js->componentDidMount() UserID is:' + value);
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

	shopForPlansButton() {
		this.props.navigator.push({id: 13, props: {pageTitle: "Topup"}});
	},

	render() {
		return (
			<View style = {styles.container}>

				<View style={styles.cardIntro}>
					<Text style = {styles.planName2}>
						My Services
						<Text style = {styles.greyBracket}> (5)</Text>
					</Text>
				</View>


				<View style = {styles.bottomContainer}>
					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									$ 500.17
								</Text>
								{'\n'}Total Payable Amount
							</Text>
						</View>
					</View>

					<View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
						<TouchableOpacity style = {styles.topUpButton} onPress={this.addonButton}>
							<Text style = {styles.topUpText}>
								View Details
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
		borderLeftWidth: 0,
	},

	bottomContainer:
	{
		flex: 1,
		margin: 15,
		marginTop: 30,
	//	marginBottom: 5,
		backgroundColor: bgWhite,
	//	borderWidth: 1,
	//	borderColor: '#D7D7D7',
	},

	bottomContainerArea:
	{
	//	flex: 1,
		backgroundColor: bgWhite,
		flexDirection: 'row',
		justifyContent: 'center',
		marginHorizontal: 20,
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

	iconText:
	{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		// marginTop: s10,
		marginHorizontal: 30,
	},

	bottomContainerText:
	{
		flex: 1,
		textAlign: 'center',
	//	margin: 10,
	//	width: 90,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 12,
		color: '#999',

	},

	cardIntro:
	{
		margin: 15,
		marginBottom: 5,
	},

	greyBracket:
	{
		fontSize: 16,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
		textAlign: 'center',
		fontWeight: 'normal',
	},

	planName2:
	{
		alignSelf: 'flex-start',
		fontSize: 16,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'bold',
		textAlign: 'center',
	},

	planValues:
	{
		flex: 1,
		textAlign: 'center',
		fontSize: 35,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: '400',
	},

	planRate:
	{
		textAlign: 'center',
		fontSize: 10,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
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
		padding: 3,
		paddingHorizontal: 50,
		marginHorizontal: 15,
		// marginTop: 5,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderRadius: 4,
		alignSelf: 'center',

	},

});

module.exports = ServicesCardMain
