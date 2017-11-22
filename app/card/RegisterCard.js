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
import {fnt as fnt} from '../common/fontLib';
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import {themeColor as themeColor} from '../common/theme';
import {titleArea as titleArea} from '../common/theme';
var heart = require('../../res/common/heart.png');
var share = require('../../res/common/share.png');
var support = require('../../res/common/support.png');
var bgWhite = '#FFFFFF';

const {height, width} = Dimensions.get('window');
var Mixpanel = require('react-native-mixpanel');
//Mixpanel.sharedInstanceWithToken('c343f769e6fb158f861f3d66fff3fe02');

var ds;
var imageselectorarray;
var borderFixingValue = height/17;

var RegisterCard = React.createClass(
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

		// imageselectorarray = this.props.cards.imagesUrl;

		return({
			currentSelectedImage: 0,
			backed:  false,
		});
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

	agreeFunction() {
		var analytics = this.state.UserPhoneNumber + " clicked on buy button on card " + this.props.cards.title + " at " + new Date().toUTCString();
	//	Mixpanel.track(analytics);

		this.props.navigator.push({id:110,
			props: {
				cards: this.props.cards,
				profileImage: this.props.profileImage,
				price: this.props.cards.unitPrice,
			}
		});
	},

	renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} dotStyle = {styles.dotStyle} selectedDotStyle = {styles.selectedDotStyle} />;
    },

	render(cards) {
	//	Image.getSize(this.props.cards.imageUrl, (width, height) => {
	//		console.log ("Image Size is: " + width + " " + height);
	//	});
		var descriptionWithoutHashes = this.props.cards.description ? this.props.cards.description : '';
		var hashes = descriptionWithoutHashes.substring(descriptionWithoutHashes.indexOf('#'), descriptionWithoutHashes.length);
		descriptionWithoutHashes = descriptionWithoutHashes.replace(hashes, '');

		return (
			<View style = {styles.scrollcontaner}>
				<ScrollView style={styles.scrollBox2} bounces = {false} keyboardShouldPersistTaps = {true}>
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
							<View style = {{top: borderFixingValue/2}}>
								<View style = {styles.hor}>

									<Text style={styles.usernameSubtextRight}>
										{this.props.users_attending_purchases_num}{" "}{this.props.users_attending_purchases}
									</Text>
								</View>

								<Text style={styles.tweettext}>
									{descriptionWithoutHashes}
									<Text style = {styles.hashText}>
										{"\n"}{hashes}
									</Text>
								</Text>

								<View style={styles.colorTextViewandColor}>
									<View style={styles.colorTextView}>
										<Text style={styles.centerText}>
											Register for this service
										</Text>
										<View style={styles.horContainerName}>
											<Text style={styles.sideText}>
												Name
											</Text>
										</View>
										<Text style={styles.sideText}>
											Event Date
										</Text>

									</View>
								</View>

								<View style={styles.horContainer2}>
									<TouchableOpacity style = {styles.favButtons}>
										<Image
											source = {heart}
											style = {styles.favlogos}
										/>
									</TouchableOpacity>

									<Text style={styles.greyTextLight}>
										{this.props.cards.likes}
									</Text>

									<View style = {{marginRight: 10,}}/>

									<TouchableOpacity style = {styles.favButtons}>
										<Image
											source = {share}
											style = {styles.favlogos}
										/>
									</TouchableOpacity>

									<Text style={styles.greyTextLight}>
										{this.props.cards.shares}
									</Text>

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
					</View>
				</ScrollView>

				<View style={styles.rowView}>
					<View style = {styles.internalRowView}>
						<View style={styles.NButton}>
							<Text style={styles.YNButtonText}>
								{"$"}{this.props.cards.unitPrice}
							</Text>
						</View>

						<TouchableOpacity onPress = {this.agreeFunction} style={styles.YButton}>
							<Text style={styles.YNButtonText}>
								REGISTER
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
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingBottom: -1*borderFixingValue,
	//	paddingBottom: -45,
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
		borderWidth: 4,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		borderColor: '#ececec',
		bottom: borderFixingValue,
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

	hor:
	{
		marginHorizontal: 15,
		marginTop: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	usernameSubtext:
	{
		fontSize: 9,
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
		marginHorizontal: 5,
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
		marginHorizontal: 5,
		height: 10,
		width: 10,
		borderColor: '#D7D7D7',
		borderRadius: 5,
		borderWidth: 1,
		backgroundColor: '#D7D7D7',
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
		fontSize: 9,
		color: '#999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	tweettext:
	{
	//	textAlign: 'flex-start',
		marginHorizontal: 15,
		marginVertical: 5,
		fontSize: 16,
		color: '#333',
		fontWeight: '400',
		fontFamily: fnt.regFont[Platform.OS],
	},

	hashText:
	{
		color: 'rgba(120, 189, 156, 1)',
		fontSize: 12,
		fontFamily: fnt.regFont[Platform.OS],
	},

	colorTextViewandColor:
	{
		borderWidth: 1,
		borderTopColor: '#D7D7D7',
		borderLeftColor:'#FFFFFF',
		borderRightColor: '#FFFFFF',
		borderBottomColor: '#FFFFFF',
		marginVertical: 10,
	},

	colorTextView:
	{
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	},

	textThatSaysColor:
	{
		fontSize: 11,
		fontFamily: fnt.regFont[Platform.OS],
	},

	horContainer3:
	{

		justifyContent: 'center',
		flexDirection: 'row',
	},

	greyCircle:
	{
		alignItems: 'center',
		justifyContent: 'center',
		margin: 10,
		backgroundColor: '#D7D7D7',
		borderRadius: 100,
		borderColor: '#D7D7D7',
		borderWidth: 1,
		padding: 5,
	},

	colorCircle1:
	{
		margin: 10,
		backgroundColor: 'red',
		borderRadius: 100,
		borderColor: 'red',
		borderWidth: 1,
		padding: 10,
	},

	colorCircle2:
	{
		margin: 10,
		backgroundColor: 'blue',
		borderRadius: 100,
		borderColor: 'blue',
		borderWidth: 1,
		padding: 10,
	},

	colorCircle3:
	{
		margin: 10,
		backgroundColor: 'pink',
		borderRadius: 100,
		borderColor: 'pink',
		borderWidth: 1,
		padding: 10,
	},

	colorCircle4:
	{
		margin: 10,
		backgroundColor: 'green',
		borderRadius: 100,
		borderColor: 'green',
		borderWidth: 1,
		padding: 10,
	},

	colorCircle5:
	{
		margin: 10,
		backgroundColor: 'orange',
		borderRadius: 100,
		borderColor: 'orange',
		borderWidth: 1,
		padding: 10,
	},

	colorCircle6:
	{
		margin: 10,
		backgroundColor: 'yellow',
		borderRadius: 100,
		borderColor: 'yellow',
		borderWidth: 1,
		padding: 10,
	},

	centerText:
	{
		fontSize: 13,
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'center',
		color: '#333',
		marginHorizontal: 15,
		marginVertical: 5,
	},

	sideText:
	{
		fontSize: 13,
		fontFamily: fnt.regFont[Platform.OS],
		alignSelf: 'flex-start',
		color: '#333',
		marginHorizontal: 15,
		marginVertical: 5,
	},

	horContainer2:
	{
		padding: 10,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		marginVertical: 10,
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderLeftColor:'#FFFFFF',
		borderRightColor: '#FFFFFF',
	},

	horContainerName:
	{
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 10,
		marginVertical: 10,
		alignSelf: 'stretch',
		borderWidth: 1,
		borderColor: '#D7D7D7',
		borderTopColor: '#FFFFFF',
		borderLeftColor:'#FFFFFF',
		borderRightColor: '#FFFFFF',
	},


	favButtons:
	{
		marginHorizontal: 5,
		marginBottom: 2,
		justifyContent: 'flex-end',
		padding: 5,
	},

	favlogos:
	{
//		top: -5,
	},

	greyTextLight:
	{
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

module.exports = RegisterCard
