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
	Alert,
	Image,
	Dimensions,
	Platform,
	ListView,
	AsyncStorage,
} from 'react-native';

import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
const {height, width} = Dimensions.get('window');
import {getCards as getCards} from '../../lib/networkHandler';
var MenuBar = require('./MenuBar');
var NavBar = require('./NavBar'); 
var ServiceProviderCard = require('./ServiceProviderCard');
var defaultPic = require('../../res/common/emptyPixel.png');
var backButtonImage;
var reducer = 0;
var leftButton;

var FakeServiceProvider = React.createClass({
	
	getDefaultProps: function()
	{
		return {
			leftButton: backButtonImage,
			rightButton: defaultPic,
			rightButton2: defaultPic,
			titleImage: defaultPic,

		};
	},

	getInitialState()
	{
		return {
			dataSource: new ListView.DataSource( { rowHasChanged: (row1, row2) => row1 !== row2, } ),
			profileImageStyle: styles.profileImageStyle,
			coverPicStyle: styles.abc,
		};
	},

	componentDidMount()
	{
		// SideMenu.changePic(this.props.ProfilePicFull);
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			this.setState({"token": value});
			return this.fetchCards(1)
		})
		.then((cardsData) => {
			this.setState(
			{
				dataSource: this.state.dataSource.cloneWithRows(cardsData.cards),
				totalPages: cardsData.pages,
				pageNumber: 2
			});
		})
		.catch((err) => {
			console.log(err);
			Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
		})
	},

	fetchCards(pageNumber)
	{
		console.log ("Total pages: " + this.state.totalPages + " Current Page Number: " + pageNumber);
		pageNumber = pageNumber || 1;
		if (this.state.totalPages && pageNumber > this.state.totalPages) {
			return Promise.resolve(null);
		}
		return getCards(pageNumber , this.state.token)
		.then((DataFromCompletePackage) =>
		{
			if  (this.state.lastLoadedPage === pageNumber) {
				return Promise.resolve(null);
			}
			this.setState({
				lastLoadedPage: pageNumber
			});
		//	console.log('Got ', DataFromCompletePackage.cards.length, 'cards');
			return Promise.resolve(DataFromCompletePackage);
		})
		.catch((err) => {
			console.log(err);
			Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
		})
	},

	buySubRegFunction(cards)
	{
		if (cards.type === 'REGISTRATION')
			this.props.navigator.push ({id: 12, props: {cards: cards}});	
		else if (cards.type === 'SUBSCRIPTION')
			this.props.navigator.push ({id: 11, props: {cards: cards}});
		else if (cards.type === 'BUY')
			this.props.navigator.push ({id: 10, props: {cards: cards}});
	},

	backFunction()
	{
		this.props.navigator.pop();
	},

	renderSPCards(cards)
	{
		console.log ("cards.creatorName: " + cards.creatorName);
		console.log ("this.props.cards.creatorName: " + this.props.cards.creatorName);
		if (cards.creatorName == this.props.cards.creatorName)
		return (
				<View style = {{flex:1}}>
				<StatusBar backgroundColor = {themeColor.wind} barStyle="light-content"/>   
			     <ListView
                    ref = 'ListView'
                    renderHeader = {this.starter}
                    //  renderFooter = {this.modalFooter}
                    bounces = {false}
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource2}
                    renderRow={this.renderSPCards}
                    style={styles.listView}
					// onEndReached={this.fetchCards.bind(this, this.state.pageNumber)}
					onEndReached = {this.paginateCards}
					renderScrollComponent={props => (
						<ParallaxScrollView
							onScroll={onScroll}

							headerBackgroundColor = { themeColor.wind }
							stickyHeaderHeight = { STICKY_HEADER_HEIGHT }
							parallaxHeaderHeight = { PARALLAX_HEADER_HEIGHT }
							backgroundSpeed = { 10 }

							renderBackground={() => (
							  <View key="background"> 
                              </View>
							)}

							renderForeground={() => (
								<View key="parallax-header" style={ styles.parallaxHeader}>
                                    {this.parallaxHeaderRender()}
								</View>
							)}

							renderStickyHeader={() => (
								<View key="sticky-header" style={styles.stickySection}>
									{this.stickyHeaderRender()}
								</View>
							)}
						/>
					)}
				/>
				
				<NavBar
					navigator = {this.props.navigator}
					profileImage = {ProfilePicFull}
                />

                <Modalbox
                    isOpen = {this.state.modalMenuOpen}
                    entry = {'right'}
                    backdrop = {true}
                    style = {{ left: width/3 }}
                    swipeToClose = {true}
                    animationDuration= {400}
                >                    
                    <SideMenu navigator = {this.props.navigator}/>
                </Modalbox>

                {this.modalFooter()}
                {this.modalFooterSP()}
			</View>
		);
		return (<View/>);
	},

	mainProfileCard()
	{
		return (
			<View style={styles.cardView}>					
				<View style={styles.profileTopArea}>				
					<View style = {styles.coverPicContainer}>
						<Image
							source = {{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sp-logo-ohne-slogan.svg/709px-Sp-logo-ohne-slogan.svg.png'}}
							resizeMode = {'cover'}
							style = {styles.coverPicContainer}
						/>
					</View>

					<View style = {styles.profilePictureBox}>
						<View style={styles.profilePicView}>
							<View style={styles.profileImageInnerView}>
								<View>
									<Image
										source = {{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sp-logo-ohne-slogan.svg/709px-Sp-logo-ohne-slogan.svg.png'}}
										style ={this.state.profileImageStyle}
										resizeMode = {'contain'}
									/>
								</View>
							</View>
						</View>
					</View>
				</View>

				<View style = {styles.lowerContainer}>
					<View style = {styles.horContainer1}>
						<Text style = {styles.userNameFont}>
							{this.props.cards.creatorName}
						</Text>
					</View>
					
					<Text style = {styles.phoneNumberStyle}>
						{'+92**********'}
					</Text>

					<Text style = {styles.jobTitleStyle}>
						Service Provider
					</Text>

					<View style = {{flex: 2, flexDirection: 'row'}}>
						<Text style = {styles.tagLineStyle}>
							{'We Provide the best services there are!'}
						</Text>	
					</View>

					<View style = {{flex: 1}}>
						<View style = {styles.urlAndLogo}>
							<View style = {{flexDirection: 'row', alignItems: 'center'}}>
								<Image
									source = {require('../../res/common/cross.png')}
									style = {{alignSelf: 'center', marginRight: width/70}}
									resizeMode = {'contain'}
								/>
								<Text style = {styles.location}>
									{'East London, UK'}
								</Text>
							</View>
							<View style = {{flexDirection: 'row', alignItems: 'center'}}>
								<Image
									source = {require('../../res/common/cross.png')}
									style = {{alignSelf: 'center', marginRight: width/70}}
									resizeMode = {'contain'}
								/>
								<Text style = {styles.webLink}>
									www.{this.props.cards.creatorName.substring(this.props.cards.creatorName.lastIndexOf('/')+1, this.props.cards.creatorName.length)}.com
								</Text>
							</View>
						</View>							
					</View>							

					<View style = {styles.horContainer3}>
						<View style = {{alignSelf: 'center', alignItems: 'center', marginLeft: 15}}>
							<Text style = {styles.blackFont}>
								{"  "}
								<Text style = {styles.contactFont}>
									{' '}
								</Text>
							</Text>
						</View>
					</View>	
				</View>
			</View>
		);
	},

	render()
	{			
		return(
			<View style = {{flex: 1}}>
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {'My Services'} // Optional
					leftIcon = {'icon-arrow-left2'}
					rightIcon = {'icon-menu'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => navigator.popToRoute(currentRoute[1])} // Optional
					onPressRightIcon = {() => this.setState({
            sideMenuOpen: !this.state.sideMenuOpen
          })} // Optional
				/>
				<ListView
					renderHeader = {this.mainProfileCard}
					bounces = {false}
					dataSource={this.state.dataSource}
					renderRow={this.renderSPCards}
					style={{backgroundColor: '#D7D7D7',}}
				/>
				<NavBar
					navigator = {this.props.navigator}
					profileImage = {this.props.ProfilePicFull}
				/>	
			</View>
		);
	}
});

const styles = StyleSheet.create(
{
	cardView:
	{
	//	flex: 1,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
	},

	profileTopArea:
	{
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	coverPicContainerDefault:
	{
	//	flex: 1,
		height: height/6,
		width: width,
		backgroundColor: '#DDDDDD',
		borderColor: '#F2F1EF',
		justifyContent: 'center',
		alignItems: 'center',
	},

	coverPicContainer:
	{
		height: height/6,
		width: width,
		backgroundColor: '#F2F1EF',
		alignItems: 'center',
	//	borderColor: '#DDDDDD',
		justifyContent: 'center',
		alignSelf: 'center',
	},

	profilePictureBox:
	{
		top: -40,
	//	borderWidth: 5,
	//	borderColor: '#F2F1EF',
	//	borderTopColor: 'rgba(0,0,0,0)',
	//	borderBottomColor: 'rgba(0,0,0,0)',
	},

	profilePicView:
	{
		margin: 10,
		marginHorizontal: 20,
		alignSelf: 'flex-start',
		backgroundColor: '#F2F1EF',
		borderRadius: 100,
		borderColor: '#FFFFFF',
		borderWidth: 1,
	//	top: -40,
	},

	profileImageInnerView:
	{
		borderRadius: 35,
		width: 70,
		height: 70,
		alignSelf: 'center',
		justifyContent: 'center',
	},

	profileImageStyle:
	{
		borderRadius: 35,
		alignSelf: 'center',
		justifyContent: 'center',
		width: 70,
		height: 70,
	},

	penAndSwitch:
	{
		top: -35,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		flexDirection: 'row',
	},

	lowerContainer:
	{
	//	borderWidth: 5,
	//	borderColor: 'rgba(0,0,0,0)',
	//	borderBottomColor: '#F2F1EF',
		flex: 1,
		top: 10,
		marginBottom: -20,
	},

	horContainer1:
	{
	//	backgroundColor: 'blue',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	profileEditPenStyle:
	{
	//	top: -2,
		alignSelf: 'flex-end',
		padding: 10,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: '#9999',
		borderRadius: 5,
		marginRight: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},

	profileEditPenStyle2:
	{
	//	top: -2,
		alignSelf: 'flex-end',
		padding: 10,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: '#9999',
		borderRadius: 5,
		marginRight: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},

	editStyle:
	{
		alignSelf: 'center',
		fontSize: 13,
		fontWeight: '500',
		color: 'rgba(153, 153, 153, 1)',
		fontFamily: fnt.regFont[Platform.OS],
	},

	userNameFont:
	{
		top: -20,
		marginTop: 10,
		marginHorizontal: 15,
		color: '#333',
		fontSize: 15,
		fontWeight: 'bold',
		fontFamily: fnt.regFont[Platform.OS],
	},
	
	phoneNumberStyle:
	{
		top: -20,
	//	marginVertical: 5,
		marginTop: 3,
		marginHorizontal: 15,
		alignSelf: 'flex-start',
		fontSize: 12,
	//	fontWeight: 'bold',
		color: 'rgba(153, 153, 153, 1)',
		fontFamily: fnt.regFont[Platform.OS],
	},


	jobTitleStyle:
	{
		top: -20,
		flex:1,
	//	marginBottom: 3,
		marginHorizontal: 15,
		alignSelf: 'flex-start',
		fontSize: 12,
	//	fontStyle: 'italic',
		color: 'rgba(153, 153, 153, 1)',
		fontFamily: fnt.regFont[Platform.OS],
	},

	tagLineStyle:
	{
		top: -20,
	//	width: width/1.5,
		marginBottom: 3,
		marginHorizontal: 15,
		alignSelf: 'flex-start',
		fontSize: 14,
	//	fontStyle: 'italic',
		color: '#666666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	urlAndLogo:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		top: -20,
		marginHorizontal: 15,
		marginBottom: 5,
	},

	location:
	{
		fontSize: 11,
		color: '#666666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	webLink:
	{
		fontSize: 11,
		color: themeColor.wind,
		fontFamily: fnt.regFont[Platform.OS],
	},

	horContainer2:
	{
	//	flex: 1,
	//	margin: 10,
		flexDirection: 'row',
	},

	innerLeftContainer:
	{
		flexDirection: 'row',
		alignSelf: 'center',
		marginLeft: 15,
	},

	rightMargin:
	{
		marginRight: 5,
		resizeMode: 'contain',
	},

	innerRightContainer:
	{
		flex: 1,
		marginRight: 15,
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'flex-end',
	},
	
	horContainer3:
	{
		top: -20,
		flex: 1,
		backgroundColor: '#FFFFFF',
	//	marginTop: 5,
		marginBottom: -25,
	//	paddingVertical: 15,
		flexDirection: 'row',
		borderBottomColor: '#F5F6F2',
		borderBottomWidth: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	blackFont:
	{
		alignSelf: 'center',
		fontSize: 16,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	bigFont:
	{
	//	alignSelf: 'flex-start',
		fontSize: 15,
		color: '#9999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	contactFont:
	{
	//	alignSelf: 'flex-start',
		fontSize: 12,
		color: '#9999',
		fontFamily: fnt.regFont[Platform.OS],
	},

	famDefine:
	{
	//	marginRight: 10,
		alignItems: 'center',
		alignSelf: 'center',
		fontSize: 11,
		fontStyle: 'italic',
		color: '#9999',
		fontFamily: fnt.regFont[Platform.OS],
	},
});

module.exports = FakeServiceProvider;