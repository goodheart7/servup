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
import Drawer from 'react-native-drawer';
import {themeColor as themeColor} from './theme';
import {fnt as fnt} from './fontLib';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../lib/networkHandler';
import SideMenu from './xxSideMenu';
var TitleBar = require('./TitleBar');

const {height, width} = Dimensions.get('window');

var bgWhite = '#FFFFFF';

var TelcoPlan = React.createClass(
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
			plansSource: ds,
			backed:  false,
			selectedStyle: '',
		}
	},

	// greyTopRounded selectPlan selectUnselected bottomContainer greyTop
	// =>
	// greyTopRoundedSelelcted selectPlanSelected selectSelected bottomContainerSelected greyTopSelected
	componentDidMount()
	{
		// SideMenu.changePic(this.props.profileImage);

		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			console.log('TelcoPlan.js->componentDidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			console.log('TelcoPlan.js->componentDidMount()  token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('TelcoPlan.js->componentDidMount() UserID is:' + value);
			this.setState({"UserID": value});
			return getUserTelcoPlans(this.state.UserID, this.state.token, this.state.UserPhoneNumber);
		})
		.then((plans) => {
			console.log("TelcoPlan.js->componentDidMount() User plans is:" + JSON.stringify(plans.activePlan.description));
			this.setState({
				plansSource: this.state.plansSource.cloneWithRows(plans.recommendedPlans),
				activePlan: plans.activePlan.description,
				price: plans.activePlan.price,
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


	agreeFunction()
	{
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	sideMenuScreen()
	{
		// this.props.navigator.push ({id: 100,});
		this._drawer.open();
	},

	selectMe(newSelectedPlan, price)
	{
		this.setState({activePlan: newSelectedPlan, price: price});
	},

	starter()
	{
		return (
			<View style = {{margin: 17,}}>
				<Text style = {styles.planName}>
					Recommended Plans
				</Text>
			</View>
		);
	},

	renderPlans(rowData)
	{
		var currentSelected = false;
		if (rowData.description === this.state.activePlan)
			currentSelected = true;

		console.log("Row Data is:" + JSON.stringify(rowData));
		return (
			<TouchableOpacity style = {styles.container} onPress = {this.selectMe.bind(this, rowData.description, rowData.price)}>
				<View style = { currentSelected ? styles.greyTopRoundedSelelcted : styles.greyTopRounded}>
				</View>

				<View style = { currentSelected ? styles.greyTopSelected: styles.greyTop}>
					<View style={styles.cardIntro}>
						<Text style = {styles.planName}>
							{rowData.description}
						</Text>
						<Text style = {styles.planRate}>
							${rowData.price}/mo
						</Text>
					</View>

					<TouchableOpacity
						style = {currentSelected ? styles.selectSelected : styles.selectUnselected}
						onPress = {this.selectMe.bind(this, rowData.description, rowData.price)}
					>
						<Text style={currentSelected ? styles.selectPlanSelected : styles.selectPlan}>
							{currentSelected ? "  Selected  " : "Select Plan"}
						</Text>
					</TouchableOpacity>
				</View>

				<View style = {currentSelected ? styles.bottomContainerSelected : styles.bottomContainer}>
					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Image  style = {{resizeMode: 'contain'}} source = {require('../../res/common/phone_plan.png')}/>
							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{rowData.voice}
								</Text>
								{'\n'}Min
							</Text>
						</View>

						<View style = {styles.iconText}>
							<Image  style = {{resizeMode: 'contain'}} source = {require('../../res/common/data_plan.png')}/>
							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{rowData.data}
								</Text>
								{'\n'}MB
							</Text>
						</View>

						<View style = {styles.iconText}>
							<Image style = {{resizeMode: 'contain'}} source = {require('../../res/common/sms_plan.png')}/>
							<Text style={styles.bottomContainerText}>
								<Text style = {styles.planValues}>
									{rowData.sms}
								</Text>
								{'\n'}SMS
							</Text>
						</View>
					</View>

					<Text style = {styles.validity}>
						Validity {rowData.validity} Days
					</Text>
				</View>
			</TouchableOpacity>
		);
	},

	render()
	{
		closeControlPanel = () =>
		{
			this._drawer.close()
		}

		openControlPanel = () =>
		{
			this._drawer.open()
		}
		var navigator = this.props.navigator;
		return (
			<Drawer
				ref = {(ref) => {this._drawer = ref; return ref;}}
				type = "overlay"
				content = {<SideMenu navigator = {navigator}/>}
				openDrawerOffset = {0.2}
				side = "right"
				tapToClose = {true}
			>
				<View style = {styles.scrollBox}>
					<TitleBar
						leftButton = {require('../../res/common/back.png')}
						title = "Shop More Plans"
						// titleImage = {require('./images/Servup_logo.png')}
						// rightButton = {require('../res/common/menu.png')}
						rightButton2 = {require('../../res/common/menu.png')}
						onLeftButtonPress={this.backFunction}
						onRightButton2Press= {this.sideMenuScreen}
						// subText="last seen at 2:10 PM"
						// rightText = "Add"
					/>
					<View style = {styles.cols}>
						<ListView
							renderHeader = {this.starter}
							bounces = {false}
							dataSource ={this.state.plansSource}
							renderRow = {this.renderPlans}
						/>
					</View>
					<View style={styles.rowView}>
						<View style={styles.NButton}>
							<Text style={styles.planRate}>
								{"$"} {this.state.price}
							</Text>
						</View>

						<TouchableOpacity onPress = {this.agreeFunction} style={styles.YButton}>
							<Text style={styles.YNButtonText}>
								BUY
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Drawer>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex: 1,
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

	bottomContainer:
	{
		top: -22,
		backgroundColor: bgWhite,
		borderWidth: 1,
		borderTopWidth: 1,
		borderColor: '#D7D7D7',
	},

	bottomContainerSelected:
	{
		top: -22,
		backgroundColor: bgWhite,
		borderWidth: 1,
		borderTopWidth: 1,
		borderColor: themeColor.wind,
		borderTopColor: '#D7D7D7',
	},

	bottomContainerArea:
	{
		backgroundColor: bgWhite,
		flexDirection: 'row',
		justifyContent: 'space-between',
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
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
		marginBottom: 5,
	},

	bottomContainerText:
	{
		margin: 10,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 11,
		color: '#999',

	},

	greyTopRounded:
	{
		marginHorizontal: -1,
		height: height/20,
		borderRadius: 10,
		backgroundColor: '#F2F1EF',
		borderColor: bgWhite,
		borderRadius: 5,
		borderWidth: 1,
	},

	greyTopRoundedSelelcted:
	{
		height: height/20,
		borderRadius: 10,
		backgroundColor: '#F2F1EF',
		borderColor: themeColor.wind,
		borderRadius: 5,
		borderWidth: 1,
	},

	greyTop:
	{
		top: -20,
		height: height/15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		backgroundColor: '#F2F1EF',
		borderWidth: 1,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		borderLeftColor: '#F2F1EF',
		borderRightColor: '#F2F1EF',
	},

	greyTopSelected:
	{
		top: -20,
		height: height/15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		backgroundColor: '#F2F1EF',
		borderWidth: 1,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		borderLeftColor: themeColor.wind,
		borderRightColor: themeColor.wind,

	},

	cardIntro:
	{
		marginHorizontal: 10,
	},

	planName:
	{
		fontSize: 14,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'bold',
	},

	planValues:
	{
		fontSize: 24,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'bold',
	},

	planRate:
	{
		fontSize: 11,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	selectUnselected:
	{
		// width: width/3,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: themeColor.wind,
		padding: 5,
		paddingHorizontal: 20,
	},

	selectSelected:
	{
		// width: width/3,
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
		// fontWeight: 'bold',
	},

	selectPlanSelected:
	{
		fontSize: 14,
		color: bgWhite,
		fontFamily: fnt.regFont[Platform.OS],
		// fontWeight: 'bold',
	},

	rowView:
	{
		// height: 50,
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderWidth: 1,
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderBottomColor: '#333',
		borderBottomWidth: 0,
		borderTopColor: '#F2F1EF',
		backgroundColor: '#FFFFFF',
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

	YNButtonText:
	{
		color: '#ececec',
		fontSize: 13,
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},
});

module.exports = TelcoPlan
