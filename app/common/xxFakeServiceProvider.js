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
    StatusBar,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Modalbox from 'react-native-modalbox';


import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
import {getCards as getCards} from '../../lib/networkHandler';
import {getOtherUserProfile} from '../../lib/networkHandler';

const {height, width} = Dimensions.get('window');

import SideMenu from './xxSideMenu';
var TitleBar = require('./TitleBar');
var NavBar = require('./NavBar'); 
var ServiceProviderCard = require('./ServiceProviderCard');

var defaultPic = require('../../res/common/emptyPixel.png');
var backButtonImage;
var reducer = 0;
var leftButton;

const PARALLAX_HEADER_HEIGHT = height/6;
const STICKY_HEADER_HEIGHT = height/14;

var dummyCard = [
  { 
    title: 'Title One',
    description: 'Lorem ipsum lorem ipsum',
    type: 'Buy Now',
    price: 599,
    maxQuantity: 5,
    imagesUrl: [
      'http://www.cartoonspot.net/looney-tunes/picture/road-runner-1.jpg'
    ],
    likes: 10,
    shares: 56,
    creatorName: 'John Doe',
  },
  { 
    title: 'Title One',
    description: 'Lorem ipsum lorem ipsum',
    type: 'Subscribe',
    price: 599,
    maxQuantity: 5,
    imagesUrl: [
      'http://www.cartoonspot.net/looney-tunes/picture/road-runner-1.jpg'
    ],
    likes: 10,
    shares: 56,
    creatorName: 'John Doe',
  },
  { 
    title: 'Title One',
    description: 'Lorem ipsum lorem ipsum',
    type: 'Buy Now',
    price: 599,
    maxQuantity: 5,
    imagesUrl: [
      'http://www.cartoonspot.net/looney-tunes/picture/road-runner-1.jpg'
    ],
    likes: 10,
    shares: 56,
    creatorName: 'John Doe',
  },
];

var FakeServiceProvider = React.createClass({
	
	getDefaultProps() {
		return {
			leftButton: backButtonImage,
			rightButton: defaultPic,
			rightButton2: defaultPic,
			titleImage: defaultPic,

            profileImage: require('../../res/common/add_photo.png'),
		};
	},

	getInitialState() {
		return {
			dataSource: new ListView.DataSource( { rowHasChanged: (row1, row2) => row1 !== row2, } ),
            profileInfo: { name: '', title: '', description: '', location: '' },

            profileImageStyle: styles.profileImageStyle,
            profileImage: this.props.profileImage,
            coverpicContainerStyle: styles.coverPicContainerDefault,
			coverPicStyle: styles.abc,
		};
	},

	componentDidMount() {
		if (this.state.profileImage.uri) {
            this.setState({ profileImageStyle: styles.profileImageStyle });
        } else {
            this.setState({ profileImage: require('../../res/common/add_photo.png') });
        }

        // SideMenu.changePic(this.props.ProfilePicFull);
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			this.setState({"token": value});
			return this.fetchCards(1)
		})
        .then((cardsData) => {
            this.setState(
            {
                // dataSource: this.state.dataSource.cloneWithRows(cardsData.cards),
                // totalPages: cardsData.pages,
                dataSource: this.state.dataSource.cloneWithRows(dummyCard),
                pageNumber: 2
            });
        })
        .then(() => {
            return getOtherUserProfile(this.state.token,'00923334726487');
        })
        .then((userProfile) => {
            this.setState({ profileInfo: userProfile });
        })
		.catch((err) => {
			console.log(err);
			Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
		})
	},

	fetchCards(pageNumber) {
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

	buySubRegFunction(cards) {
		if (cards.type === 'REGISTRATION')
			this.props.navigator.push ({id: 12, props: {cards: cards}});	
		else if (cards.type === 'SUBSCRIPTION')
			this.props.navigator.push ({id: 11, props: {cards: cards}});
		else if (cards.type === 'BUY')
			this.props.navigator.push ({id: 10, props: {cards: cards}});
	},

	backFunction() {
		this.props.navigator.pop();
	},

	renderSPCards(cards) {
		// console.log ("cards.creatorName: " + cards.creatorName);
		// console.log ("this.props.cards.creatorName: " + this.props.cards.creatorName);
        console.log('FakeServiceProvider.js -> renderSPCards called!');
		if (cards.creatorName == this.props.cards.creatorName) {
    		return (
    			<View>
    				<ServiceProviderCard
    					navigator = {this.props.navigator}
    					cardTitle = {cards.title}
    					cardDescription = {cards.description}
    					topRightButton = {cards.type}
    					price = {cards.price}
    					maxQuantity = {cards.maxQuantity}
    					cardImage = {{uri: cards.imagesUrl[0]}}
    					// likes = {statuses.user.id.toString().substring(0,2)}
    					likes = {cards.likes}
    					shares = {cards.shares}
    					SP = {cards.creatorName}	
    					buySubReg = {this.buySubRegFunction}
    					cardObj = {cards}
    					profileImage = {null}
                        spopenModal = {this.spopenModal}
    					// users_attending_purchases = {statuses.user.location}
    					// users_attending_purchases_num = {statuses.user.location}
    				/>
    			</View>
    		);
        }
		return (<View/>);
	},

	mainProfileCard() {
		return (
            <View>
                <View style = {styles.profilePictureBox}>
                    <View style={styles.profilePicView}>
                        <View style={styles.profileImageInnerView2}>
                            <Image
                                source = {this.state.profileImage}
                                style ={this.state.profileImageStyle}
                            />
                        </View>
                    </View>
                </View>

    			<View style={[styles.cardView, styles.cardViewwithProfilePicAdjust ]}>					
    				<View style = {styles.lowerContainer}>
    					<View style = {styles.horContainer1}>
    						<Text style = {styles.userNameFont}>
    							{this.state.profileInfo.name}
    						</Text>
    					</View>
    					
    					<Text style = {styles.phoneNumberStyle}>
    						{'+92**********'}
    					</Text>

    					<Text style = {styles.jobTitleStyle}>
    						  {this.state.profileInfo.title}
    					</Text>

    					<View style = {{flex: 2, flexDirection: 'row'}}>
    						<Text style = {styles.tagLineStyle}>
    							 {this.state.profileInfo.description}
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
    									   {this.state.profileInfo.location}
    								</Text>
    							</View>
    							<View style = {{flexDirection: 'row', alignItems: 'center'}}>
    								<Image
    									source = {require('../../res/common/cross.png')}
    									style = {{alignSelf: 'center', marginRight: width/70}}
    									resizeMode = {'contain'}
    								/>
    								<Text style = {styles.webLink}>
    									www.loremipsum.com
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
			</View>
		);
	},

    parallaxHeaderRender() {
        return(
            <View style={styles.cardView}>  
                <View style={styles.profileTopArea}>                
                    
                    <View style = {this.state.coverpicContainerStyle}>               
                        <View style={{ top:-15 }}>
                            <TitleBar
                                color1 = 'transparent'
                                color2 = 'transparent'
                                color3 = 'transparent'
                                leftButton = {require('../../res/common/add_btn.png')}
                                title = ""
                                //  titleImage = {themeColor.windSplash}
                                rightButton = {require('../../res/common/search.png')}
                                rightButton2 = {require('../../res/common/menu.png')}
                                //  onLeftButtonPress={this.searchModule}
                                onRightButtonPress = { this.searchModule }
                                onRightButton2Press={ () => this.setState({modalMenuOpen: !this.state.modalMenuOpen})}
                                //  subText="last seen at 2:10 PM"
                                isHome = {true}
                            />
                        </View>
                        <Image
                            source = {this.state.coverImage}
                            style = {[ this.state.coverPicStyle, { alignSelf: 'center', top: -20 } ]}
                        />
                    </View>

                    <View style = {styles.profilePictureBox}>
                        <View style={styles.profilePicView}>
                            <View style={styles.profileImageInnerView2}>
                                <Image
                                    source = {this.state.profileImage}
                                    style ={this.state.profileImageStyle}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            </View>

        );
    },

    stickyHeaderRender() {
        return(
            <TitleBar
                leftButton = {require('../../res/common/add_btn.png')}
                title = "Servup"
                //  titleImage = {themeColor.windSplash}
                rightButton = {require('../../res/common/search.png')}
                rightButton2 = {require('../../res/common/menu.png')}
                //  onLeftButtonPress={this.searchModule}
                onRightButtonPress={ this.searchModule }
                onRightButton2Press={ () => this.setState({modalMenuOpen: !this.state.modalMenuOpen})}
                //  subText="last seen at 2:10 PM"
                isHome = {true}
            />
        );
    },

	render() {	
        var navigator = this.props.navigator;
        const { onScroll = () => {} } = this.props;

		return(
			<View style = {{flex: 1}}>
                <StatusBar backgroundColor = {themeColor.wind} barStyle="light-content"/>
				
				<ListView
					renderHeader = {this.mainProfileCard}
					bounces = {false}
					dataSource={this.state.dataSource}
					renderRow={this.renderSPCards}
					style={styles.listView}
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
					profileImage = {this.props.ProfilePicFull}
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
			</View>
		);
	}
});

const styles = StyleSheet.create(
{
	listView: 
    {
        backgroundColor: '#D7D7D7',
        flex:1,
    },

    cardView:
	{
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
	},

    cardViewwithProfilePicAdjust:
    { 
        zIndex: -1, 
        paddingTop: 40, 
        paddingBottom: 20, 
        marginTop: -65, 
    },

	profileTopArea:
	{
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	coverPicContainer:
	{
		height: height/6,
		width: width,
		backgroundColor: '#F2F1EF',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},

    coverPicContainerDefault:
    {
        // flex: 1,
        height: height/6,
        width: width,
        backgroundColor: 'rgba(51,51,51,1)',
        borderColor: '#F2F1EF',
        justifyContent: 'center',
        // alignItems: 'center',
    },


	profilePictureBox:
	{
		top: -40,
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
		// top: -40,
	},

	profileImageInnerView:
	{
		borderRadius: 35,
		width: 70,
		height: 70,
		alignSelf: 'center',
		justifyContent: 'center',
	},


    profileImageInnerView2:
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