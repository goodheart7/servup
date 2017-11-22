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
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import {fnt as fnt} from '../common/fontLib';
import {getCards as getCards} from '../../lib/networkHandler';
import {themeColor as themeColor} from '../common/theme';
import {titleArea as titleArea} from '../common/theme';

var heart = require('../../res/common/heart.png');
var share = require('../../res/common/share.png');
var support = require('../../res/common/support.png');
var bgWhite = '#FFFFFF';
const {height, width} = Dimensions.get('window');
var tick = require('../../res/common/selected_contact_messenger_icon.png');
var Mixpanel = require('react-native-mixpanel');
//Mixpanel.sharedInstanceWithToken('c343f769e6fb158f861f3d66fff3fe02');


var ds;
var imageselectorarray;
var borderFixingValue = height/17;
var SubscribeCard = React.createClass(
{
	getDefaultProps() {
		return {
			cards: {}
		};
	},

	getInitialState() {
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
		this.setState({"UserPhoneNumber": value});
		}).done();

		imageselectorarray = this.props.cards.imagesUrl;

		return({
			currentSelectedImage: 0,
			backed:  false,
			boxStyle: [
				styles.selectedBox,
				styles.unselectedBox
			],
			imager: [
				tick,
				null
			],
			price: 9.99,
			}
		);
	},

	backFunction() {
		var analytics = this.state.UserPhoneNumber + " clicked on back button on card " + this.props.cards.title + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);

		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	switchSelection2() {
		var analytics = this.state.UserPhoneNumber + " clicked on family button on card " + this.props.cards.title + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);

		this.setState({
			boxStyle: [styles.unselectedBox, styles.selectedBox],
			imager: [null, tick],
			price: 14.99,
			membershipType: "Family Membership",
		});
	},

	switchSelection1() {
		var analytics = this.state.UserPhoneNumber + " clicked on individual button on card " + this.props.cards.title + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);

		this.setState({
			boxStyle: [styles.selectedBox, styles.unselectedBox],
			imager: [tick, null],
			price: 9.9,
			membershipType: "Individual Membership",

		});
	},

	agreeFunction() {
		var analytics = this.state.UserPhoneNumber + " clicked on buy button on card " + this.props.cards.title + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);

		this.props.navigator.push({id:110,
			props: {
				cards: this.props.cards,
				profileImage: this.props.profileImage,
				price: this.state.price,
				membershipType: this.state.membershipType,

			}
		});
	},

	renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} dotStyle = {styles.dotStyle} selectedDotStyle = {styles.selectedDotStyle} />;
    },

	render(cards) {
		var descriptionWithoutHashes = this.props.cards.description ? this.props.cards.description : '';
		var hashes = descriptionWithoutHashes.substring(descriptionWithoutHashes.indexOf('#'), descriptionWithoutHashes.length);
		descriptionWithoutHashes = descriptionWithoutHashes.replace(hashes, '');

		return (
			<View style = {styles.scrollcontaner}>
				<ScrollView contentContainerStyle={styles.scrollBox2} bounces = {false} keyboardShouldPersistTaps = {true}>
					<TitleBar
						leftButton = {require('../../res/common/back.png')}
					//	title = {this.props.cards.title}
					//	titleImage = {require('./images/Servup_logo.png')}
					//	rightButton = {require('../res/common/menu.png')}
						rightButton2 = {require('../../res/common/wDots.png')}
					//	onLeftButtonPress = {() => this.props.stateSetter() } SUPER SPECIAL MOVE. PASS PROPS TO PARENET!
						onLeftButtonPress = {this.backFunction}
					//	onRightButtonPress={this.backFunction}
					//	onRightButton2Press={this.backFunction}
					//	subText="last seen at 2:10 PM"
						color1 = {'rgba(0,0,0, 0.65)'}
						color2 = {'rgba(127,127,127, 0.65)'}
						color3 = {'rgba(255,255,255, 0.65)'}
					/>
					<IndicatorViewPager
							style={styles.imageView}
							indicator={this.renderDotIndicator()}
						>
						<View>
							<Image
								source={{uri: 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}}
								style={styles.cardImageWide}
							/>
						</View>
						<View>
							<Image
								source={{uri: 'http://media.gettyimages.com/photos/digital-composite-image-of-human-eye-picture-id550091273'}}
								style={styles.cardImageWide}
							/>
						</View>
						<View>
							<Image
								source={{uri: 'http://i.dailymail.co.uk/i/pix/2016/03/08/22/006F877400000258-3482989-image-a-10_1457476109735.jpg'}}
								style={styles.cardImageWide}
							/>
						</View>
					</IndicatorViewPager>

					<View style = {styles.bottomer}>
						<View style = {{flexDirection: 'row', marginHorizontal: 10,}}>
							<View style = {styles.SPLogoView}>
								<Image
									style = {styles.SPLogoImage}
									source = {require('../../res/common/cross.png')}
									resizeMode = {'contain'}
								/>
							</View>
							<Text style={styles.designer}>
								{this.props.cards.creatorName}{"\n"}
							</Text>
						</View>

						<View style = {styles.borderStyle}>
							<View style = {styles.hor}>
								<View style = {styles.horInternal}>

									<Text style={styles.usernameSubtextRight}>
										{this.props.cards.users_attending_purchases_num}{" "}{this.props.cards.users_attending_purchases}
									</Text>

								</View>
								<View style = {{marginHorizontal: 15,}}>
									<Text style={styles.tweettext}>
										{descriptionWithoutHashes}
										<Text style = {styles.hashText}>
											{"\n"}{hashes}
										</Text>
									</Text>
								</View>
							</View>

							<View style={styles.colorTextViewandColor}>
								<View style={styles.colorTextView}>
									<View style = {{margin: 20, marginVertical: 10}}>
										<Text style={styles.textThatSaysColor}>
											Subscription Plans
										</Text>
									</View>

									<View style = {{flex:1, alignItems: 'center'}}>
										<TouchableOpacity style = {this.state.boxStyle[0]} onPress = {this.switchSelection1}>
											<Text style={styles.textThatSaysColor}>
												Individual Membership{"\n"}$9.99/mo.
											</Text>
											<Image source = {this.state.imager[0]} style = {{flex: 1, marginLeft: 10, resizeMode: 'contain'}}/>
										</TouchableOpacity>

										<TouchableOpacity style = {this.state.boxStyle[1]} onPress = {this.switchSelection2}>
											<Text style={styles.textThatSaysColor}>
												Family Membership{"\n"}$14.9/mo.
											</Text>
											<Image source = {this.state.imager[1]} style = {{flex: 1, marginLeft: 10, resizeMode: 'contain'}}/>
										</TouchableOpacity>
									</View>
								</View>
							</View>


							<View style={styles.horContainer2}>
								<TouchableOpacity style = {styles.favButtons}>
									<Image
										source = {heart}
										style = {styles.favlogos}
									/>

								<Text style={styles.greyTextLight}>
									{this.props.cards.likes}
								</Text>
								</TouchableOpacity>

								<View style = {{marginRight: 10,}}/>

								<TouchableOpacity style = {styles.favButtons}>
									<Image
										source = {share}
										style = {styles.favlogos}
									/>

								<Text style={styles.greyTextLight}>
									{this.props.cards.shares}
								</Text>
								</TouchableOpacity>

								<View style = {{marginRight: 10,}}/>

								<TouchableOpacity style = {styles.favButtons}>
									<Image
										source = {support}
										style = {{resizeMode: 'contain',}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>

				<View style={styles.rowView}>
					<View style = {styles.internalRowView}>
						<View style={styles.NButton}>
							<Text style={styles.YNButtonText}>
								{"$"}{this.state.price}
							</Text>
						</View>

						<TouchableOpacity onPress = {this.agreeFunction} style={styles.YButton}>
							<Text style={styles.YNButtonText}>
								SUBSCRIBE
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
	scrollcontaner:
	{
		flex: 1,
	},

	scrollBox2:
	{
		backgroundColor: '#FFFFFF',
		paddingBottom: -1*borderFixingValue,
	//	paddingBottom: -15,
	},

	imageView:
	{
		height: height*0.6,
		bottom: height/40 + height/14,
		zIndex: 0,
	},

	bottomer:
	{
		bottom: height/40 + height/14,
		paddingBottom: -1*( height/40 + height/14),
	},

	cardImageWide:
	{
		width: width,
		height: height*0.6,
		alignSelf: 'flex-start',
		resizeMode: 'cover',
	},

	dotStyle:
	{
		backgroundColor: 'white',
		borderColor: themeColor.wind,
		borderWidth: 1,
	},

	selectedDotStyle:
	{
		backgroundColor: themeColor.wind,
		borderColor: 'white',
		borderWidth: 1,
		width: 8,
		height: 8,
	},

	borderStyle:
	{
	//	top: -15,
		flex: 1,
		borderWidth: 4,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		borderColor: '#ececec',
		bottom: borderFixingValue,
	},

	hor:
	{
		marginTop: 5,
		flex: 1,
	//	flexDirection: 'row',
	//	justifyContent: 'space-between',
	},

	horInternal:
	{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 15,
	},

	SPLogoView:
	{
		bottom: height/50,
		width: width/10,
		height: width/10,
		borderRadius: width/20,
		borderWidth: 1,
		borderColor: '#FFFFFF',
		marginRight: width/60,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	SPLogoImage:
	{
		width: width/10,
		height: width/10,
		borderRadius: width/20,
	},

	usernameSubtext:
	{
		fontSize: 9,
		color: '#999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	designer:
	{
		color: '#333',
		fontSize: 12,
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

	usernameSubtextRight:
	{
		marginRight: 15,
		fontSize: 11,
		color: '#999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	indicators:
	{
		flex: 1,
		alignItems: 'center',
		position: 'absolute',
		bottom: 10,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
	},

	imageSelectorSelectedStyle:
	{
		alignSelf: 'center',
		margin: 5,
		height: 10,
		width: 10,
		borderColor: themeColor.wind,
		borderRadius: 5,
		borderWidth: 1,
		backgroundColor: '#FFFFFF',
	},

	imageSelectorStyle:
	{
		alignSelf: 'center',
		margin: 5,
		height: 10,
		width: 10,
		borderColor: '#D7D7D7',
		borderRadius: 5,
		borderWidth: 1,
		backgroundColor: '#D7D7D7',
	},

	tweettext:
	{
	//	textAlign: 'flex-start',
	//	marginHorizontal: 15,
		flex: 1,
		fontSize: 16,
		fontWeight: '400',
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	hashText:
	{
		flex: 1,
		color: 'rgba(120, 189, 156, 1)',
		fontSize: 12,
		fontFamily: fnt.regFont[Platform.OS],
	},

	colorTextViewandColor:
	{
		flex: 3,
		borderWidth: 1,
		borderTopColor: '#D7D7D7',
		borderLeftColor:'#FFFFFF',
		borderRightColor: '#FFFFFF',
		borderBottomColor: '#FFFFFF',
		marginVertical: 10,
	},

	colorTextView:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	//	height: height/2.5,
	},

	textThatSaysColor:
	{
		flex: 10,
		fontSize: 13,
		fontFamily: fnt.regFont[Platform.OS],
		color: '#333',
	},

	selectedBox:
	{
	//	flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10,
		borderWidth: 1,
		borderColor: themeColor.wind,
		borderRadius: 10,
		backgroundColor: bgWhite,
		alignItems: 'center',
		marginVertical: 15,
		width: width/2 +40,
	},

	unselectedBox:
	{
	//	flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10,
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderRadius: 10,
		backgroundColor: bgWhite,
		alignItems: 'center',
		marginVertical: 15,
		width: width/2 +40,
	},

	horContainer2:
	{
	//	flex: 1,
		padding: 10,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		marginVertical: 10,
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},

	favButtons:
	{
		flexDirection: 'row',
		marginHorizontal: 5,
	//	marginBottom: 2,
		justifyContent: 'center',
		padding: 5,
	},

	favlogos:
	{
//		top: -5,
	},

	greyTextLight:
	{
		marginLeft: 5,
		alignSelf: 'center',
		textAlign: 'center',
		fontSize: 9,
		color: '#9999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	rowView:
	{
		height: 50,
		paddingVertical: 5,
	//	borderWidth: 1,
	//	borderRightColor: '#FFFFFF',
	//	borderLeftColor: '#FFFFFF',
	//	borderBottomColor: '#333',
	//	borderTopColor: '#D7D7D7',
		backgroundColor: themeColor.wind,
	},

	internalRowView:
	{
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 15,
	},

	YButton:
	{
		padding: 10,
	//	paddingHorizontal: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: themeColor.wind,
	},

	NButton:
	{
		backgroundColor: themeColor.wind,
		alignSelf: 'center',
	},

	YNButtonText:
	{
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},

});

module.exports = SubscribeCard
