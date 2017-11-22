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
import {subscribeToCard as subscribeToCard} from '../../lib/networkHandler';
import {themeColor as themeColor} from './theme';
var TitleBar = require('./TitleBar');
var bgWhite = '#FFFFFF';
var arrow_right = require('../../res/common/arrow_right.png');
const {height, width} = Dimensions.get('window');
var NavBar = require('./NavBar');
var image;


var SPCardConfirmation = React.createClass( 
{
	getInitialState()
	{
		console.log(this.props.cards);
		return {
			backed:  false,
			tax: 10,
			delivery: 10,

		}
	},

	getDefaultProps: function()
	{
		return {
			cards: {
			//	imageUrl: themeColor.windLogo,
			},
			price: 0,
		};
	},



	componentDidMount()
	{
		AsyncStorage.getItem("userTpin")
		.then((value) => {	
			this.setState({"userTpin": value});
			this.setState({"cardID": this.props.cards.id});
			console.log(this.state.cardID);
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
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
			this.props.navigator.pop();
		}
	},

	firstField()
	{
		
	},

	secondField()
	{

	},

	thirdField()
	{

	},

	forthField()
	{

	},

	editButton()
	{
		
	},

	doneButton()
	{
		console.log ("CARD IS: "+ JSON.stringify(this.props.cards));
		var obj;

		if (this.props.cards.type === "BUY")
			obj = {
				"tpin": null,
				"paymentMethod": this.props.paymentVia,
				"quantity": 10,
				"size": "s",
				"colors": ["#99cc00"]
			};
		else
			obj = {
				"tpin": null,
				"paymentMethod": this.props.paymentVia,
			};
		
		AsyncStorage.getItem("userTpin")
		.then ((tpin) => {
			obj.tpin = tpin;
			return AsyncStorage.getItem("UserToken")					
		})
		.then((value) => {
			this.setState({"UserToken": value});
			return subscribeToCard(this.state.UserToken, this.props.cards.id, obj);
		})
		.then((response) => {
			this.props.navigator.push({id: 6});				
		})
		.catch((err) => {
			console.log(err);
		})
	}, 



	render()
	{
	//	console.log ("card image is: " + this.props.cards.imagesUrl[0]);
		if (this.props.cards.imagesUrl)
			image = {uri: this.props.cards.imagesUrl[0]};
		else
			image = themeColor.windLogo;
		return (
			<View style = {{flex: 1}}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Order Confirmation"
				//	titleImage = {require('./images/Servup_logo.png')}
				//	rightButton = {require('../res/common/menu.png')}
				//	rightButton2 = {require('../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
					onRightButton2Press= {this.doneButton}
				//	subText="last seen at 2:10 PM"
					rightText = "Done"
				/>
				<ScrollView bounces = {false} contentContainerStyle = {styles.scrollBox}>
					<View style = {styles.cols}>
						<View style = {styles.rows}>
							<Image
								source = {image}
								style = {styles.imageStyle}
								resizeMode = {'cover'}
							/>

							<View style = {{flex: 2,}}>
								<Text style = {styles.textStyleHeading}>
									{this.props.cards.title}
								</Text>
								
								<Text style = {styles.textStyle3}>
									{this.props.cards.type !== "BUY" ? this.props.membershipType : this.props.cards.measuringScale}
								</Text>
								
								<Text style = {styles.textStyle3}>
									{this.props.cards.type !== "BUY" ? "" : "Color: black"}
								</Text>
							</View>

							<View style = {{flex: 1}}>
								<View style = {{flex: 2, flexDirection: 'row', justifyContent: 'flex-end'}}>
									<Text style = {styles.textStyle4}>
										${this.props.price}
									</Text>
									<Image
										source = {require('../../res/common/arrow_right.png')}
										style = {styles.arrowStyleInvisible}
									/>
								</View>
							</View>
						</View>

						<View style = {styles.rows}>
							<Text style = {styles.textStyle}>
								{this.props.cards.type !== "BUY" ? "Subscribe By" : "Arrive By"}
							</Text>
							
							<View style = {{flexDirection: 'row',}}>
								<Text style = {styles.textStyle}>
									{new Date().toDateString()}
								</Text>
								<Image
									source = {require('../../res/common/arrow_right.png')}
									style = {styles.arrowStyle}
								/>
							</View>
						</View>

						<View style = {styles.rows}>
							<Text style = {styles.textStyle}>
								Payment
							</Text>
							
							<View style = {{flexDirection: 'row',}}>
								<Text style = {styles.textStyle}>
									345***********121
								</Text>
								<Image
									source = {require('../../res/common/arrow_right.png')}
									style = {styles.arrowStyle}
								/>
							</View>
						</View>

						<View style = {styles.rows}>
							<Text style = {styles.textStyle}>
								Address
							</Text>
							
							<View style = {{flexDirection: 'row',}}>
								<Text style = {styles.textStyle}>
									Room 123{"\n"}North-Master Building{"\n"}North Central Road{"\n"}NY, USA {" "}
								</Text>
								<Image
									source = {require('../../res/common/arrow_right.png')}
									style = {styles.arrowStyle}
								/>
							</View>
						</View>

						<View style = {styles.rows2}>
							<Text style = {styles.textStyle}>
								Summary
							</Text>						
							
							<Text style = {styles.textStyle}>
								Subtotal{"\n"}
								Tax{"\n"}
								Delivery
							</Text>

							<View style = {{flexDirection: 'row'}}>
								<Text style = {styles.textStyle}>
									${this.props.price}{"\n"}
									${this.state.tax}{"\n"}
									${this.state.delivery}
								</Text>
								<Image
									source = {require('../../res/common/arrow_right.png')}
									style = {styles.arrowStyleInvisible}
								/>
							</View>
							
						</View>

						<View style = {{flex: 1, flexDirection: 'row'}}>
							<View style = {{flex: 3.5,}}/>
							<View style = {styles.extraLine}/>
						</View>

						<View style = {styles.rows2}>
							<Text style = {styles.textStyle2}>
								{"       "}
							</Text>						
							
							<Text style = {styles.textStyle2}>
								{"   "}Total
							</Text>

							<View style = {{flexDirection: 'row'}}>
								<Text style = {styles.textStyle2}>
									${Math.ceil(this.props.price + this.state.tax + this.state.delivery)}{" "}
								</Text>
								<Image
									source = {require('../../res/common/arrow_right.png')}
									style = {styles.arrowStyleInvisible}
								/>
							</View>

						</View>
					</View>	  
				<View style={styles.whiteArea}/>
				</ScrollView>
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex:1,
	//	height: height,
		backgroundColor: bgWhite,
		borderWidth: 4,
		borderColor: '#ececec',		
	},

	cols:
	{

	},

	rows:
	{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
		borderWidth: 1, 
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	rows2:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
	//	borderWidth: 1, 
	//	borderBottomColor: '#ececec',
	//	borderTopColor: bgWhite,
	//	borderLeftColor: bgWhite,
	//	borderRightColor: bgWhite,
	//	backgroundColor: bgWhite,
	},

	lastRow:
	{
	//	flexDirection: 'row',
	//	justifyContent: 'space-between',
	//	marginBottom: 1,
		flex: 1,
		paddingTop: 10,
		borderTopWidth: 1, 
		borderTopColor: '#ececec',
		backgroundColor: 'red',
	},

	extraLine:
	{
		flex: 4,
		borderTopColor: '#ececec',
		borderWidth: 0,
		borderTopWidth: 1,
		marginRight: 25,
		alignSelf: 'flex-end',
		paddingLeft: -30,
	},

	imageStyle:
	{
		// flex:1,
		width: 100,
		height: 100,
	//	alignSelf: 'flex-start',
		marginRight: 10,
	},

	textStyle:
	{
		marginBottom: 5,
		alignSelf: 'center',
		fontSize: 14,
		textAlign: 'right',
		color: 'grey',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyle2:
	{
		marginBottom: 5,
		// left: -2,
		alignSelf: 'flex-start',
		fontSize: 14,
		fontWeight: 'bold',
		color: 'black',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyle3:
	{
		flex: 1,
		marginBottom: 5,
		alignSelf: 'flex-start',
		textAlign: 'center',
		fontSize: 14,
		color: 'grey',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyle4:
	{
		marginBottom: 5,
		alignSelf: 'flex-start',
		textAlign: 'right',
		fontSize: 14,
		color: 'black',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyleHeading:
	{
		flex: 1,
		marginBottom: 5,
		alignSelf: 'flex-start',
		textAlign: 'left',
		fontSize: 18,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	arrowStyle:
	{
		alignSelf: 'center',
		marginLeft: 10,
		opacity: 1,
	},

	arrowStyleInvisible:
	{
		alignSelf: 'center',
		marginLeft: 10,
		opacity: 0,
	},


	switchArea:
	{
		alignSelf: 'flex-end',
	},

	whiteArea:
	{
		flex: 1,
		backgroundColor: bgWhite,
		padding: 5,
	},
});

module.exports = SPCardConfirmation