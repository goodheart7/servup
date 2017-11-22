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
	TextInput,
	Alert,

} from 'react-native';

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
var TitleBar = require('./TitleBar');
import Modal from 'react-native-simple-modal';
const dismissKeyboard = require('dismissKeyboard');
import {registerNum as registerNumb} from '../../lib/networkHandler';
import {postUserLine} from '../../lib/networkHandler';
const {height, width} = Dimensions.get('window');


var EnterIOTDevice = React.createClass( 
{
	getInitialState()
	{
		console.log ("EnterIOTDevice.js->getInitialState() Numb: " + this.props.numb);
		console.log ("EnterIOTDevice.js->getInitialState() addingIOT: " + this.props.addingIOT);
		return {
			modalOpen: false,
		}
	},

	backFunction()
	{
		this.props.navigator.pop();
	},

	nextFunction()
	{
		dismissKeyboard();
		this.setState({modalOpen: true });
	},

	openModal()
	{
		this.setState({modalOpen: true });
	},

	addLine()
	{
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			console.log('token IS:' + value);
			this.setState({"token": value});
			return AsyncStorage.getItem("UserID")
		})
		.then((value) => {
			console.log('ID IS:' + value);
			this.setState({"UserID": value});
			return AsyncStorage.getItem("userTpin")
		})
		.then ((pin) => {
			console.log('pin IS:' + pin);
			this.setState({"pin": pin});
			return registerNumb('00' + this.props.numb)
		})
		.then ((resp) => {
			console.log("\n\n\nresponse is: "+ resp);
			return postUserLine(this.state.token, '00' + this.props.numb)
		})
		.then ((resp) => {
			this.setState({modalOpen: false });
			this.props.navigator.push({id: 69, props: {addingIOT: true} });	
		})	
		.catch( (err) => {
			console.log("\n\n\nerror is: "+ err);
			Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
		})
	},

	modalOpener()
	{
		return (
			<Modal
				offset = {this.state.offset}
				open = {this.state.modalOpen}
				modalDidOpen = {() => console.log('modal did open')}
				modalDidClose = {() => this.setState({modalOpen: false})}
				style = {{alignItems: 'center'}}
			>
				<View style = {{flex: 1}}>
					<Text style={styles.mondalHeadingFont}>
						Activate Line
					</Text>
					<Text style={styles.modalBodyStyle}>
						Do you want to activate this line to your profile ?
					</Text>
					
					<View style = {styles.lowerButtons}>
						<TouchableOpacity onPress={this.addLine}>
							<Text style = {styles.skipActivateText}>
								Skip
							</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={this.addLine}>
							<Text style = {styles.skipActivateText}>
								Activate
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	},

	render()
	{
		return (
			<View style = {{flex:1, backgroundColor: '#FFFFFF'}}>
				<TitleBar
						leftButton = {require('../../res/common/back.png')}
						title = "Device Name"	
						rightText = "Next"
					//	titleImage = {themeColor.windSplash}
					//	rightButton = {require('../res/common/search.png')}
					//	rightButton2 = {require('../res/common/menu.png')}
						onLeftButtonPress={this.backFunction}
					//	onRightButtonPress={this.searchModule}
						onRightButton2Press={this.nextFunction}
					//	subText="last seen at 2:10 PM"
					//	isHome = {false}
				/>

				<View style = {styles.border}>
					<View style = {styles.heading}>
						<Text style={styles.lightText}>
							What do you want this device to be called ?
						</Text>
					</View>

					<View style = {styles.inputView}>
						<TextInput
							//	value = {this.state.name}
							//	text = {this.state.numb}
								placeholder = {"Your device name"}
								placeholderTextColor = {"#6666"}
								style = {styles.inText}
							//	keyboardType = 'phone-pad'
								maxLength = {13}
								underlineColorAndroid = {'#FFFFFF'}
								autoFocus = {true}
								onChangeText = {this.minValue}	
								onSubmitEditing = {this.nextFunction}
							/>
					</View>
				</View>
				{this.modalOpener()}
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	border:
	{
		flex: 1,
		borderWidth: 4,
		borderColor: '#ececec',
		borderTopWidth: 0,
	},

	heading:
	{
		borderColor: '#F2F1EF',
		borderWidth: 0,
		borderBottomWidth: 1,
		marginBottom: 20,
	},

	lightText:
	{
		width: width * 0.65,
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 15,
		color: '#666666',
		textAlign: 'center',
		alignSelf: 'center',
		margin: 20,
	},

	inputView:
	{
		borderColor: '#F2F1EF',
		borderWidth: 0,
		borderBottomWidth: 1,
		marginBottom: 15,
		paddingHorizontal: 15, 
	},
	
	inText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		color: '#666',
		textAlign: 'left',
		height: 40,
		fontSize: 15,
	},

	mondalHeadingFont:
	{
		color: '#333',
		fontSize: 20, 
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',
		marginVertical: 20,
	},

	modalBodyStyle:
	{
		color: '#333',
		fontSize: 18,
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',
		textAlign: 'center',
		marginHorizontal: 10,
	},

	lowerButtons:
	{
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: 20,
	},

	skipActivateText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 18,
		fontWeight: 'bold',
		color: themeColor.wind,
	},

});

module.exports = EnterIOTDevice