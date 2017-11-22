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
import Drawer from 'react-native-drawer';
import {themeColor as themeColor} from './theme';
import {fnt as fnt} from './fontLib';
import {getUserTelcoPlans as getUserTelcoPlans} from '../../lib/networkHandler';
import SideMenu from './xxSideMenu';
var TitleBar = require('./TitleBar');

const {height, width} = Dimensions.get('window');

var bgWhite = '#FFFFFF';

var TelcoAddons = React.createClass(
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
			switchStates: [false, true, false],
			price: 100,
		}
	},

	componentDidMount()
	{
		// SideMenu.changePic(this.props.profileImage);

		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			console.log('TelcoAddons.js->componentDidMount() UserPhoneNumber is:' + value);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			console.log('TelcoAddons.js->componentDidMount() token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('TelcoAddons.js->componentDidMount() UserID is:' + value);
			this.setState({"UserID": value});
			return getUserTelcoPlans(this.state.UserID, this.state.token, this.state.UserPhoneNumber);
		})
		.then((plans) => {
			console.log("User plans is:" + JSON.stringify(plans.activePlan));
			this.setState({
				plansSource: this.state.plansSource.cloneWithRows(plans.recommendedPlans),
				activePlan: plans.activePlan.description,
			//	price: plans.activePlan.price,
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

	sideMenuScreen()
	{
	//	this.props.navigator.push ({id: 100,});
		this._drawer.open();
	},

	selectMe(newSelectedPlan, price)
	{
		this.setState({activePlan: newSelectedPlan});
	},

	agreeFunction()
	{
		this.props.navigator.push({id: 111, props: {pageTitle: "Topup"}});
	},

	switched(rowID)
	{
		console.log ("RowID is: " + rowID);
		var prevState = this.state.switchStates;
		prevState[rowID] = !prevState[rowID];
		this.setState({switchStates: prevState});

		if (rowID == 0)
		{
			if (this.state.switchStates[0])
				this.setState({price : this.state.price += 50});
			else
				this.setState({price : this.state.price -= 50});
			return;
		}

		if (rowID == 1)
		{
			if (this.state.switchStates[1])
				this.setState({price : this.state.price += 100});
			else
				this.setState({price : this.state.price -= 100});
			return;
		}

		if (rowID == 2)
		{
			if (this.state.switchStates[2])
				this.setState({price : this.state.price += 150});
			else
				this.setState({price : this.state.price -= 150});
			return;
		}
	},

	renderPlans(rowData, sectionID, rowID)
	{
		//console.log("Row Data is:" + JSON.stringify(rowData));
	//	console.log("Row ID is:" + rowID);
	//	console.log("switch Data is:" + this.state.switchStates[rowID]);
		return (
			<View style = {styles.container}>
				<View style = {styles.greyTopRounded}>
				</View>

				<View style = {styles.greyTop}>
					<View style={styles.cardIntro}>
						<Text style = {styles.planName}>
							{rowData.description}
						</Text>
						<Text style = {styles.planRate}>
							${rowData.price}/mo
						</Text>
					</View>

					<Switch
						style = {{left: -15}}
						value = {this.state.switchStates[rowID]}
						onValueChange = {this.switched.bind(this, rowID)}
						thumbTintColor = {bgWhite}
						onTintColor = {themeColor.wind}
						tintColor = "#e5e5e5"
					/>
				</View>

				<View style = {styles.bottomContainer}>
					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Image  style = {{resizeMode: 'contain'}} source = {require('../../res/common/phone_plan.png')}/>
							<Text style = {styles.planValues}>
								Voice
							</Text>
						</View>
						<View style = {styles.iconText}>
							<Text style = {styles.planValuesRight}>
								250 of 250 Mins
							</Text>
						</View>
					</View>
					<View style = {styles.bar}>
						<View style = {styles.innerBar}/>
					</View>

					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Image  style = {{resizeMode: 'contain'}} source = {require('../../res/common/data_plan.png')}/>
							<Text style = {styles.planValues}>
								Data
							</Text>
						</View>
						<View style = {styles.iconText}>
							<Text style = {styles.planValuesRight}>
								250 of 250 MBs
							</Text>
						</View>
					</View>
					<View style = {styles.bar}>
						<View style = {styles.innerBar}/>
					</View>

					<View style = {styles.bottomContainerArea}>
						<View style = {styles.iconText}>
							<Image style = {{resizeMode: 'contain'}} source = {require('../../res/common/sms_plan.png')}/>
							<Text style = {styles.planValues}>
								SMS
							</Text>
						</View>
						<View style = {styles.iconText}>
							<Text style = {styles.planValuesRight}>
								250 of 250 SMS
							</Text>
						</View>
					</View>
					<View style = {styles.bar}>
						<View style = {styles.innerBar}/>
					</View>

					<Text style = {styles.validity}>
						Validity {rowData.validity} Days
					</Text>
				</View>
			</View>
		);
	},

	starter()
	{
		return(
			<View style = {{margin: 15}}>
				<Text style = {styles.planValues}>
					Recommended Plans
				</Text>
			</View>
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
						title = "Add On"
					//	titleImage = {require('./images/Servup_logo.png')}
					//	rightButton = {require('../res/common/menu.png')}
						rightButton2 = {require('../../res/common/menu.png')}
						onLeftButtonPress={this.backFunction}
						onRightButton2Press= {this.sideMenuScreen}
					//	subText="last seen at 2:10 PM"
					//	rightText = "Add"
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
									Activate
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
		flex:1,
		backgroundColor: bgWhite,
	},

	cols:
	{
		flex: 1,
		backgroundColor: bgWhite,
		borderColor: "#F2F1EF",
		borderWidth: 4,
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
		top: -20,
		backgroundColor: bgWhite,
		borderWidth: 1,
		borderColor: '#F2F1EF',
	},

	bottomContainerSelected:
	{
		top: -20,
		backgroundColor: bgWhite,
		borderWidth: 1,
		borderColor: themeColor.wind,
	},

	bottomContainerArea:
	{
		backgroundColor: bgWhite,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	bar:
	{
		margin: 5,
		marginHorizontal: 15,
		width: width*0.85,
		height: height*0.01,
		backgroundColor: '#e9e9e9',
		borderRadius: 15,
		alignItems: 'flex-start',
		justifyContent: 'center',
		borderColor: themeColor.wind,
		borderWidth: 1,
	},

	innerBar:
	{
		width:width*0.85,
		height: height*0.0075,
		backgroundColor: themeColor.wind,
		borderRadius: 3,
		justifyContent: 'flex-end',
		borderColor: themeColor.wind,
		borderWidth: 1,
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
		backgroundColor: '#eeeeee',

		borderColor: bgWhite,
		borderRadius: 5,
		borderWidth: 1,
	},

	greyTopRoundedSelelcted:
	{
		height: height/20,
		borderRadius: 10,
		backgroundColor: '#eeeeee',

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
		backgroundColor: '#eeeeee',

		borderWidth: 1,
		borderTopColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: '#eeeeee',
		borderRightColor: '#eeeeee',
	},

	greyTopSelected:
	{
		top: -20,
		height: height/15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		backgroundColor: '#eeeeee',
		borderWidth: 1,

		borderTopColor: 'transparent',
		borderBottomColor: 'transparent',
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
		marginHorizontal: 5,
		fontSize: 13,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'normal',
	},

	planValuesRight:
	{
		textAlign: 'right',
		marginHorizontal: 5,
		fontSize: 13,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
		fontWeight: 'normal',
	},

	planRate:
	{
		fontSize: 11,
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
		// height: 50,
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderWidth: 1,
		borderRightColor: '#FFFFFF',
		borderLeftColor: '#FFFFFF',
		borderBottomColor: '#333',
		borderTopColor: '#D7D7D7',
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

module.exports = TelcoAddons
