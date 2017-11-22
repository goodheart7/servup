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


const {height, width} = Dimensions.get('window');
var defaultPic = require('../../res/common/white.png');
var starEmpty = require('../../res/common/star_stroke.png');
var starFilled = require('../../res/common/star_filled.png');
var heart = require('../../res/common/review_icon.png');
var redHeart = require('../../res/common/review_icon_active.png');
var share = require('../../res/common/Share_icon.png');
var support = require('../../res/common/support.png');
var dots = require('../../res/common/3bar.png');
var bgWhite = '#FFFFFF';

var Mixpanel = require('react-native-mixpanel');
//Mixpanel.sharedInstanceWithToken('c343f769e6fb158f861f3d66fff3fe02');


var ServiceProviderCard = React.createClass(
{
	getDefaultProps: function() {
		return {
			closeButton: defaultPic,
			profileImage: defaultPic,
		//	rightButton2: defaultPic,
		};
	},

	getInitialState() {
		return {
			liked: false,
		};
	},

	componentDidMount() {
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
		this.setState({"UserPhoneNumber": value});
		}).done();
	},

	touchListener()	{
		var analytics = this.state.UserPhoneNumber + " clicked on " + this.props.cardTitle + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);
		this.props.buySubReg(this.props.cardObj, this.props.profileImage);
	},

	openCreator() {
		this.props.navigator.push ({id: 44, props: {
				cards: this.props.cardObj,
				profileImage: this.props.ProfilePicFull,
				buySubReg: this.props.buySubReg(this.props.cardObj, this.props.profileImage),
		}});
	},

	likeThisCard() {
		this.setState ({liked: !this.state.liked});
	},

	render() {
		var descriptionWithoutHashes = this.props.cardDescription;
		var hashes = descriptionWithoutHashes.substring(descriptionWithoutHashes.indexOf('#'), descriptionWithoutHashes.length);
		descriptionWithoutHashes = descriptionWithoutHashes.replace(hashes, '');

		if(descriptionWithoutHashes.length > 85)
		{
			descriptionWithoutHashes = descriptionWithoutHashes.substring(0,85);
			descriptionWithoutHashes = descriptionWithoutHashes.substring(0, descriptionWithoutHashes.lastIndexOf(' '));
			descriptionWithoutHashes = descriptionWithoutHashes + '...';
		}

		return (
			<View style={styles.container}>
				<View style={styles.usernamecontainer}>
					<View style={styles.vert}>
						<Text style={styles.username}>
							{this.props.cardTitle.substring(0,100)}
						</Text>
					</View>

					<TouchableOpacity style = {styles.Dots3} onPress = {this.props.spopenModal}>
						<Image
							source = {dots}
							style = {{resizeMode: 'contain', alignSelf: 'center'}}
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.star}>
					<View style={styles.starFakeValue}>
						<Image
							source= {starFilled}
						/>
						<Image
							source= {starFilled}
						/>
						<Image
							source= {starFilled}
						/>
						<Image
							source= {starEmpty}
						/>
						<Image
							source= {starEmpty}
						/>
					</View>
					<Text style={styles.usernameSubtext}>
						{" ( "}{this.props.maxQuantity}{" )"}
					</Text>
				</View>

					<TouchableOpacity style={styles.bannerBox} onPress = {this.touchListener}>
						<Image
							source= {this.props.cardImage}
							style={styles.banner}
						/>
					</TouchableOpacity>

					<View style = {[ styles.hor, {height: 60, marginTop: -30} ]}>
						<TouchableOpacity
							onPress = {this.openCreator}
							style = {{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

							<Image
								style = {styles.SPLogoImage}
								source = {{ uri: this.props.profileImage }}
								resizeMode = {'cover'}
							/>
							<Text style={styles.designer}>
								{this.props.cardObj.creatorName}
							</Text>

						</TouchableOpacity>

						<Text style={styles.usernameSubtextRight}>
							${this.props.price}
							{this.props.topRightButton === "SUBSCRIPTION"? " / Mo" : this.props.topRightButton === "REGISTRATION"? " / Person" : " / Item"}
						</Text>
					</View>

					<View style={{ flex: 2, marginTop: -35 }}>
						<Text style={styles.tweettext}>
							{descriptionWithoutHashes}
							<Text style = {styles.hashText}>
								{"\n"}{hashes}
							</Text>
						</Text>
					</View>


				<View style={styles.horContainer}>
					<View style = {{flexDirection: 'row', marginHorizontal: 10,}}>
						<TouchableOpacity style = {styles.favButtons} onPress = {this.likeThisCard}>
							<Image
								source = {this.state.liked? redHeart : heart}
								style = {styles.favlogos}
							/>
							<Text style={styles.greyTextLight}>
								{this.props.likes}K
							</Text>
						</TouchableOpacity>

						<View style = {{marginRight: 10,}}/>

						<TouchableOpacity style = {styles.favButtons}>
							<Image
								source = {share}
								style = {styles.favlogos}
							/>
							<Text style={styles.greyTextLight}>
								{this.props.shares}K
							</Text>
						</TouchableOpacity>

						<View style = {{marginRight: 10,}}/>

						<TouchableOpacity style = {styles.favButtons}>
							<Image
								source = {support}
								tyle = {styles.favlogos}
							/>
							<Text style={styles.greyTextLight}>
								{' '}
							</Text>
						</TouchableOpacity>
					</View>

					<View style = {{flexDirection: 'row', alignItems: 'center'}}>
						<TouchableOpacity style = {styles.cardLeftButton} onPress = {this.touchListener}>
							<Text style={styles.greyText}>
								{this.props.topRightButton === "SUBSCRIPTION"? "SUBSCRIBE" : this.props.topRightButton === "REGISTRATION"? "REGISTER": "BUY"}
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
	container:
	{
		height: height*0.62,
		width: width,
		backgroundColor: '#FFFFFF',
		borderColor: '#F2F1EF',
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderBottomWidth: 5,
		borderTopWidth: 5,
	},

	vert:
	{
		flex:1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: 'center',
	//	marginHorizontal: 15,
	},

	bigFont:
	{
		alignSelf: 'center',
		fontSize: 14,
		color: '#ffffff',
		fontFamily: fnt.regFont[Platform.OS],
	},

	up3:
	{
		flex: 1,
		marginTop: 3,
		flexDirection: 'row',
		alignItems: 'center',
	//	marginHorizontal: 15,
	},

	star:
	{
		flexDirection: 'row',
		alignItems: 'flex-start',
		alignSelf: 'flex-start',
		marginLeft: 15,
		marginVertical: 5,
	},

	starFakeValue:
	{
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
	//	top: -2,
	},

	usernamecontainer:
	{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 10,
		marginBottom: 0,
		marginHorizontal: 10,
		padding: 5,
		paddingBottom: 0,
	},

	// SPLogoView:
	// {
	// 	width: 60,
	// 	height: 80,
	// 	// alignItems: 'center',
	// 	justifyContent: 'center',
	// 	// borderRadius: 30,
	// 	borderWidth: 1,
	// 	borderColor: 'red',
	// 	// marginRight: width/60,
	// 	// alignItems: 'center',
	// 	// justifyContent: 'center',
	// 	// backgroundColor: '#FFFFFF',
	// },

	SPLogoImage:
	{
		width: 60,
		height: 60,
		borderWidth: 1,
		borderRadius: 30,
		borderColor: 'white',
		marginRight: width/60,
		alignItems: 'center',
		justifyContent: 'center',
	},

	username:
	{
		fontSize: 15,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	usernameSubtext:
	{
		fontSize: 10,
		color: '#999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	usernameSubtextRight:
	{
		fontSize: 12,
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},

	usernameSubtextDark:
	{
	//	marginLeft: 15,
		fontSize: 12,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	hor:
	{
		top: -10,
		flex: 1.3,
		marginHorizontal: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	designer:
	{
		color: '#333',
		fontSize: 10,
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	clickable:
	{
		padding: 10,
	},

	horContainer:
	{
		flex: 1,
		borderWidth: 1,
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		borderBottomColor: bgWhite,
		padding: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},

	favButtons:
	{
		flexDirection: 'row',
		marginRight: 5,
		marginBottom: 2,
		justifyContent: 'flex-end',
	},

	favButtonsEnd:
	{
		marginHorizontal: 10,
		marginBottom: 2,
		justifyContent: 'flex-end',
		alignSelf: 'flex-end',
	},

	favlogos:
	{
		resizeMode: 'contain',
//		top: -5,
	},

	Dots3:
	{
		justifyContent: 'center',
		alignSelf: 'center',
		marginRight: 10,
	//	alignItems: 'flex-end',
	},

	bannerBox:
	{
	//	borderColor: '#D7D7D7',
	//	borderWidth: 1,
	},

	banner:
	{
		resizeMode: 'cover',
		width: width-12,
		height: width*0.45,
		alignSelf: 'center',
	},

	tweettext:
	{
		flex: 1,
		marginHorizontal: 15,
		marginVertical: 5,
		color: 'white',
		fontSize: 11,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	hashText:
	{
		// color: 'rgba(120, 189, 156, 1)',
		fontSize: 11,
		fontFamily: fnt.regFont[Platform.OS],
	},

	cardLeftButton:
	{
		alignSelf: 'center',
		borderColor: themeColor.wind,
		borderWidth:1,
		borderRadius: 4,
		paddingVertical: 3,
		paddingHorizontal: 10,
	},

	greyText:
	{
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 13,
	//	fontWeight: 'bold',
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},

	greyTextLight:
	{
		width: 40,
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 9,
		color: '#999',
		fontWeight: '400',
		fontFamily: fnt.regFont[Platform.OS],
	},

	blueTextArea:
	{
		flex: 1,
		alignSelf: 'flex-end',
		padding: 10,
	},

	blueText:
	{
		alignSelf: 'flex-end',
		fontSize: 13,
		fontWeight: 'bold',
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},
});

module.exports = ServiceProviderCard
