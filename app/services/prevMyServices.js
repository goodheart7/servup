tatimport React, {
	Component,
} from 'react';

import {
	Navigator,
	ScrollView,
	TouchableOpacity,
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

import Modalbox from 'react-native-modalbox';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import TitleBar from '../common/TitleBar';
import SideMenu from '../common/xxSideMenu';
import NavBar from '../common/NavBar';

import {getUserSubscribedCards as getUserSubscribedCards} from '../../lib/networkHandler';

var arrow_right = require('../../res/common/arrow_right.png');
const {height, width} = Dimensions.get('window');
var ds;


var MyServices = React.createClass({

	getInitialState() {

		ds = new ListView.DataSource({
			rowHasChanged: (oldRow, newRow) => {
				// return  oldRow.isActive !== newRow.isActive;
			}
		});

		return {
			modalMenuOpen: false,

			cardsSource: ds,
			activeButtonStyle: styles.topButtonSelectedActive,
			savedButtonStyle: styles.topButton,
			currentRender: "Active",
			activeFont: styles.selectedFontStyle,
			savedFont: styles.unSelectedFontStyle,
		}
	},

	componentDidMount() {
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			this.setState({"token": value});
			console.log('MyServices.js->componentDidMount() token is:' + value);
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('MyServices.js->componentDidMount() UserID is:' + value);
			this.setState({"UserID": value});
			return getUserSubscribedCards(this.state.token, this.state.UserID);
		})
		.then((cards) => {
			console.log("MyServices.js->componentDidMount() User subscribed cards are:" + JSON.stringify(cards.cards));
			this.setState({
				cardsSource: ds.cloneWithRows(cards.cards),
			})
		})
		.catch((err) => {
			console.log(err);
		})
	},

	backFunction() {
		this.props.navigator.pop();
	},

	selectButton(selected) {
		this.setState({currentRender: selected});

		if (selected === "Active")
			this.setState({
				activeButtonStyle: styles.topButtonSelectedActive,
				savedButtonStyle: styles.topButton,
				activeFont: styles.selectedFontStyle,
				savedFont: styles.unSelectedFontStyle,
			});
		else
			this.setState({
				activeButtonStyle: styles.topButton,
				savedButtonStyle: styles.topButtonSelectedSaved,
				activeFont: styles.unSelectedFontStyle,
				savedFont: styles.selectedFontStyle,
			});
	},

	render() {
		return (
			<View style={{flex:1}}>
				<View style = {styles.scrollBox}>
					<TitleBar
						leftButton = {require('../../res/common/back.png')}
						title = "My Services"
						// titleImage = {require('./images/Servup_logo.png')}
						// rightButton = {require('../res/common/menu.png')}
						rightButton2 = {require('../../res/common/menu.png')}
						onLeftButtonPress={this.backFunction}
						onRightButton2Press={() => this.setState({
							modalMenuOpen: !this.state.modalMenuOpen
						}) }
						// onRightButton2Press={this.backFunction}
						// subText="last seen at 2:10 PM"
					/>

					<View style={styles.rowsTitle}>
						<TouchableOpacity style = {this.state.activeButtonStyle} onPress = {this.selectButton.bind(this, "Active")}>
							<Text style = {this.state.activeFont}>
								Active
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style = {this.state.savedButtonStyle} onPress = {this.selectButton.bind(this, "Saved")}>
							<Text style = {this.state.savedFont}>
								Saved
							</Text>
						</TouchableOpacity>
					</View>

					{this.state.currentRender === "Active" ? this.renderActive() : this.renderSaved() }

					<NavBar
						navigator = {this.props.navigator}
						profileImage = {this.props.ProfilePicFull}
					/>
				</View>

				<Modalbox
						isOpen = {this.state.modalMenuOpen}
						isDisabled = {this.state.modalMenuOpen = false}
						entry = {'right'}
						backdrop = {true}
						style = {{ left: width/3 }}
						swipeToClose = {true}
						animationDuration= {400}
				>
						<SideMenu navigator = {this.props.navigator}/>
				</Modalbox>
			</View>
		);

	},

	renderCards(rowData, sectionID, rowID) {
		console.log ("rendering card: " + rowData);
		var descriptionWithoutHashes = rowData.description;
		var hashes = descriptionWithoutHashes.substring(descriptionWithoutHashes.indexOf('#'), descriptionWithoutHashes.length);
		descriptionWithoutHashes = descriptionWithoutHashes.replace(hashes, '');

		if (rowID == 0)
			return (
				<TouchableOpacity style={styles.rowsTop}>
					<Image
						style = {styles.switchArea}
						source = {{uri: rowData.imagesUrl[0]}}
						resizeMode = {'cover'}
					/>

					<View style = {styles.rightNextToIt}>
						<View>
							<Text style = {styles.textStyle}>
								{rowData.title}
							</Text>

							<Text style = {styles.textStyleMini}>
								{descriptionWithoutHashes}
							</Text>
						</View>
					</View>

					<View style = {styles.rightNextToIt}>
						<Image
							style = {styles.arrowArea}
							source = {arrow_right}
						/>
					</View>
				</TouchableOpacity>
			);
		return (
			<TouchableOpacity style={styles.rows}>
				<Image
					style = {styles.switchArea}
					source = {{uri: rowData.imagesUrl[0]}}
					resizeMode = {'cover'}
				/>

				<View style = {styles.rightNextToIt}>
					<View>
						<Text style = {styles.textStyle}>
							{rowData.title}
						</Text>

						<Text style = {styles.textStyleMini}>
							{descriptionWithoutHashes}
						</Text>
					</View>
				</View>

				<View style = {styles.rightNextToIt}>
					<Image
						style = {styles.arrowArea}
						source = {arrow_right}
					/>
				</View>
			</TouchableOpacity>
		);

	},

	renderActive() {
		var navigator = this.props.navigator;
		return (
			<View style = {styles.cols}>
				<View style={styles.container}>
					<ListView
						enableEmptySections = {true}
						dataSource = {this.state.cardsSource}
						renderRow = {this.renderCards}
						bounces = {false}
					/>
				</View>
			</View>
		);
	},

	renderSaved() {
		var navigator = this.props.navigator;
		return (
				<View style = {styles.cols}>

					<View style = {styles.container}>
						<ScrollView style = {{flex:1,}}>
							<View>
								<TouchableOpacity style={styles.rowsTop}>
									<Image
										style = {styles.switchArea}
										source = {{uri: 'http://onebytellc.com/servup/12.Entertainment.jpg'}}
										resizeMode = {'cover'}
									/>

									<View style = {styles.rightNextToIt}>
										<View>
											<Text style = {styles.textStyle}>
												On-Demand TV!
											</Text>

											<Text style = {styles.textStyleMini}>
												Binge watch the hit shows, your favourtie movies and explore collections.
											</Text>
										</View>
									</View>

									<View style = {styles.rightNextToIt}>
										<Image
											style = {styles.arrowArea}
											source = {arrow_right}
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity style={styles.rows}>
									<Image
										style = {styles.switchArea}
										source = {{uri: 'http://onebytellc.com/servup/8.eCommerce.jpg'}}
										resizeMode = {'cover'}
									/>

									<View style = {styles.rightNextToIt}>
										<View>
											<Text style = {styles.textStyle}>
												Exercise Anywhere!
											</Text>

											<Text style = {styles.textStyleMini}>
												Exercise anywhere, anytime with thousands of venues to choose from, in Canada.
											</Text>
										</View>
									</View>

									<View style = {styles.rightNextToIt}>
										<Image
											style = {styles.arrowArea}
											source = {arrow_right}
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity style={styles.rows}>
									<Image
										style = {styles.switchArea}
										source = {{uri: 'http://onebytellc.com/servup/13.Events.jpg'}}
										resizeMode = {'cover'}
									/>

									<View style = {styles.rightNextToIt}>
										<View>
											<Text style = {styles.textStyle}>
												Last-minute tickets!
											</Text>

											<Text style = {styles.textStyleMini}>
												Two front row seats for beyonce show at hershey centre, Mississauga are up for grab!
											</Text>
										</View>
									</View>

									<View style = {styles.rightNextToIt}>
										<Image
											style = {styles.arrowArea}
											source = {arrow_right}
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity style={styles.rows}>
									<Image
										style = {styles.switchArea}
										source = {{uri: 'http://onebytellc.com/servup/11.Delivery.jpg'}}
										resizeMode = {'cover'}
									/>

									<View style = {styles.rightNextToIt}>
										<View>
											<Text style = {styles.textStyle}>
												UberEats Food Deilvery
											</Text>

											<Text style = {styles.textStyleMini}>
												Uber-Eats gets you the food you want from the restaurants you love, faster than anyone else.
											</Text>
										</View>
									</View>

									<View style = {styles.rightNextToIt}>
										<Image
											style = {styles.arrowArea}
											source = {arrow_right}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
		);
	}

});

const styles = StyleSheet.create({
	scrollBox:
	{
		flex:1,
		backgroundColor: 'white',
	},

	cols:
	{
		flex: 1,
	},

	rightNextToIt:
	{
		alignSelf: 'center',
	},

	rowsTitle:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	topButton:
	{
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		borderWidth: 0,
		borderBottomWidth: 4,
		borderBottomColor: 'white',
		borderTopColor: 'transparent',
		borderLeftColor: '#ececec',
		borderRightColor: '#ececec',
		backgroundColor: 'white',
		marginHorizontal: 15,
		marginBottom: -1,
	},

	topButtonSelectedActive:
	{
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		borderWidth: 0,
		borderBottomWidth: 3,
		borderBottomColor: StyleConstants.primary,
		borderTopColor: 'white',
		borderLeftColor: '#ececec',
		borderRightColor: '#ececec',
		backgroundColor: 'white',
		marginLeft: 15,
		marginBottom: -1,
	},

	topButtonSelectedSaved:
	{
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		borderWidth: 0,
		borderBottomWidth: 3,
		borderBottomColor: StyleConstants.primary,
		borderTopColor: 'white',
		borderLeftColor: '#ececec',
		borderRightColor: '#ececec',
		backgroundColor: 'white',
		marginRight: 15,
		marginBottom: -1,
	},

	container:
	{
		flex:1,
		backgroundColor: 'white',
		borderWidth: 4,
		borderTopWidth: 6,
		borderBottomWidth: 0,
		borderColor: '#ececec',
	},

	rowsTop:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 6,
		borderWidth: 4,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		// borderBottomWidth: 0,
		borderTopColor: '#ececec',
		borderLeftColor: '#ececec',
		borderRightColor: '#ececec',
		borderBottomColor: '#ececec',
		backgroundColor: 'white',
	},

	rows:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 6,
		borderWidth: 0,
		borderTopWidth: 1,
		borderBottomWidth: 4,
		borderBottomColor: '#ececec',
		borderTopColor: '#ececec',
		borderLeftColor: '#ececec',
		borderRightColor: '#ececec',
		backgroundColor: 'white',
	},

	textStyle:
	{
		width: width/1.75,
		alignSelf: 'flex-start',
		fontSize: 14,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: Fonts.regFont[Platform.OS],
		marginLeft: 10,
		marginBottom: 5,
	},

	textStyleMini:
	{
		width: width/1.75,
		alignSelf: 'flex-start',
		fontSize: 11,
		color: '#666666',
		fontFamily: Fonts.regFont[Platform.OS],
		marginLeft: 10,
	},

	selectedFontStyle:
	{
		alignSelf: 'center',
		fontSize: 11,
		color: StyleConstants.primary,
		fontFamily: Fonts.regFont[Platform.OS],
		marginLeft: 10,
	},

	unSelectedFontStyle:
	{
		alignSelf: 'center',
		fontSize: 11,
		color: '#666666',
		fontFamily: Fonts.regFont[Platform.OS],
		marginLeft: 10,
	},


	switchArea:
	{
		width: 80,
		height: 80,
		alignSelf: 'center',
	},

	arrowArea:
	{
		marginRight: 15,
	},

	whiteArea:
	{
		flex: 1,
		backgroundColor: 'white',
	},
});

module.exports = MyServices
