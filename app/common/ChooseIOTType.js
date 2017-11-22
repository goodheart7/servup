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

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
var TitleBar = require('./TitleBar');
var tick = require('../../res/common/selected_contact_messenger_icon.png');
const {height, width} = Dimensions.get('window');


var ChooseIOTType = React.createClass( 
{
	getInitialState()
	{
		return {
			optionSelected: 1,

			styleArr: [
				styles.selectedBox,
				styles.box,
				styles.box,
			],

			img: [
				tick,
				null,
				null,
			],
		}
	},

	tapped(selected)
	{
		var X = this.state.styleArr;
		X[0] = styles.box;
		X[1] = styles.box;
		X[2] = styles.box;

		var Y = this.state.img;
		Y[0] = null;
		Y[1] = null;
		Y[2] = null;

		this.setState({
			optionSelected: selected,
			styleArr: X,
			img: Y,
		}, function (){
			
			var A = this.state.styleArr;
			A[selected] = styles.selectedBox;

			var B = this.state.img;
			B[selected] = tick;

			this.setState({styleArr: A, img: B });
		});
	},

	backFunction()
	{
		this.props.navigator.pop();
	},

	nextFunction()
	{
		this.props.navigator.push({id: 67, props: {deviceType: this.state.optionSelected, addingIOT: true }});
	},


	render()
	{
		return (
			<View style = {{flex:1, backgroundColor: '#FFFFFF',}}>
				<TitleBar
						leftButton = {require('../../res/common/back.png')}
						title = "Choose Type"
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
							Select the type of your new line number
						</Text>
					</View>

					<View style = {styles.boxesContainer}>
						<TouchableOpacity style = {this.state.styleArr[0]} onPress = {this.tapped.bind(this, 0)}>
							<Text style = {styles.options}>
								Voice
							</Text>
							
							<Image
								source = {this.state.img[0]}
								style = {{resizeMode: 'contain'}}
							/>
						</TouchableOpacity>

						<TouchableOpacity style = {this.state.styleArr[1]} onPress = {this.tapped.bind(this, 1)}>
							<Text style = {styles.options}>
								Device
							</Text>
							
							<Image
								source = {this.state.img[1]}
								style = {{resizeMode: 'contain'}}
							/>
						</TouchableOpacity>

						<TouchableOpacity style = {this.state.styleArr[2]} onPress = {this.tapped.bind(this, 2)}>
							<Text style = {styles.options}>
								Machine
							</Text>
							
							<Image
								source = {this.state.img[2]}
								style = {{resizeMode: 'contain'}}
							/>
						</TouchableOpacity>

					</View>
				</View>

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
		backgroundColor: '#FFFFFF',
	},

	heading:
	{
		borderColor: '#F2F1EF',
		borderWidth: 0,
		borderBottomWidth: 1,
		marginBottom: 20,
		backgroundColor: '#FFFFFF',
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
		backgroundColor: '#FFFFFF',
	},

	boxesContainer:
	{
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},

	box:
	{
		width: width * 0.65,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#6666',
		justifyContent: 'space-between',
		marginVertical: 10,
		borderRadius: 5,
		padding: 15,
		backgroundColor: '#FFFFFF',
	},

	selectedBox:
	{
		width: width * 0.65,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: themeColor.wind,
		justifyContent: 'space-between',
		marginVertical: 10,
		borderRadius: 5,
		padding: 15,
		backgroundColor: '#FFFFFF',
	},

	options:
	{
		alignSelf: 'flex-start',
		fontSize: 14,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
		marginRight: 50,
		backgroundColor: '#FFFFFF',
	},

});

module.exports = ChooseIOTType