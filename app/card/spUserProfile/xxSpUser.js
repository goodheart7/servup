import React, {
  Component,
} from 'react';

import {
  Navigator,
  ScrollView,
  Animated,
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
import {
  Style,
  Fonts,
  StyleConstants,
} from '../../stylesheet/style';
import {
  getOtherUserProfile,
} from '../../../lib/networkHandler';
import Icon from '../../stylesheet/icons';
const {height, width} = Dimensions.get('window');
import MenuBar from '../../common/MenuBar';

import NavBar from '../../common/NavBar';
import ServiceProviderCardOnProfile from '../ServiceProviderCardsOnProfile';
var backButtonImage;
var reducer = 0;
var leftButton;
var defaultPic = require('../../../res/common/profile.png');
var FakeServiceProvider = React.createClass({
//Let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
  getDefaultProps: function () {
    return {
      leftButton: backButtonImage,
      rightButton: defaultPic,
      rightButton2: defaultPic,
      titleImage: defaultPic,

    };
  },

  getInitialState()
  {
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      spData: [],
      dataSource: ds,
      scrollY: new Animated.Value(0),
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
        return getOtherUserProfile(value, this.props.publicId)
      })
      .then((resp) => {
        console.log('@@@@@@@@@@@@@@Service Cards', resp.data.serviceCards);
        this.setState({
          spData: resp.data,
          dataSource: this.state.dataSource.cloneWithRows(resp.data.serviceCards),
        });
        console.log('@@@@@@@@@@@@@@SPDATA', this.state.spData);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
      })
  },

  fetchCards(pageNumber)
  {
    console.log("Total pages: " + this.state.totalPages + " Current Page Number: " + pageNumber);
    pageNumber = pageNumber || 1;
    if (this.state.totalPages && pageNumber > this.state.totalPages) {
      return Promise.resolve(null);
    }
    return getCards(pageNumber, this.state.token)
      .then((DataFromCompletePackage) => {
        if (this.state.lastLoadedPage === pageNumber) {
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
      this.props.navigator.push({id: 12, props: {cards: cards}});
    else if (cards.type === 'SUBSCRIPTION')
      this.props.navigator.push({id: 11, props: {cards: cards}});
    else if (cards.type === 'BUY')
      this.props.navigator.push({id: 10, props: {cards: cards}});
  },

  backFunction()
  {
    this.props.navigator.pop();
  },

  renderSPCards(cards) {
    console.log('@@@@@@@@@@@&&&&', cards);
    return (
      <ServiceProviderCardOnProfile
        navigator = {this.props.navigator}
        {...cards}
        cardObj = {cards}
        token ={this.state.token}
        spDetailedCard = {this.spDetailedCard}
        spopenModal = {this.spopenModal}
        CardShare = {(card)=>this.cardShareModalOpen(card)}
      />
    );
  },


  mainProfileCard() {
    let spData = this.state.spData;
    console.log('@@@@@@@@@@@@@@@@spDa', this.state.spData)
    if (spData != null) {
      let profileImageUrl = spData.avatarProfilePictureLink ? {uri: spData.avatarProfilePictureLink} : defaultPic;
      let coverImageUrl = spData.avtarCoverPictureLink ? {uri: spData.avtarCoverPictureLink} : {uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sp-logo-ohne-slogan.svg/709px-Sp-logo-ohne-slogan.svg.png'};
      return (
        <View style={[styles.cardView, {flex:1}]}>
          <View style={styles.coverPicContainer}>
            <Image
              source={coverImageUrl}
              resizeMode={'cover'}
              style={coverImageUrl}
            />
          </View>
          <View style={[styles.spInfo, {marginTop: -15,}]}>
            <TouchableOpacity
              style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.SPLogoImage}
                source={profileImageUrl}
                resizeMode={'cover'}
              />
              <Text style={[Style.f16, Style.textColorBlack,]}>
                {(spData.name) ? spData.name.substring(0, 24) + '...' : spData.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lowerContainer}>

            <Text style={styles.jobTitleStyle}>
              Service Provider
            </Text>

            <View style={{flex: 2, flexDirection: 'row'}}>
              <Text style={styles.tagLineStyle}>
                {'We Provide the best services there are!'}
              </Text>
            </View>

            <View style={{flex: 1}}>
              <View style={styles.urlAndLogo}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../res/common/cross.png')}
                    style={{alignSelf: 'center', marginRight: width / 70}}
                    resizeMode={'contain'}
                  />
                  <Text style={styles.location}>
                    {'East London, UK'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../res/common/cross.png')}
                    style={{alignSelf: 'center', marginRight: width / 70}}
                    resizeMode={'contain'}
                  />
                  <Text style={styles.webLink}>
                    {'sss'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.horContainer3}>
              <View style={{alignSelf: 'center', alignItems: 'center', marginLeft: 15}}>
                <Text style={styles.blackFont}>
                  {"  "}
                  <Text style={styles.contactFont}>
                    {' '}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

  },

  render() {
    return (
      <View style={{flex: 1}}>
        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Service Provider'} // Optional
          leftIcon = {'icon-arrow-left2'}// Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => this.props.navigator.pop()} // Optional
        />
        <ListView
          ref = 'ListView'
          style={styles.listView}
          bounces = {false}
          removeClippedSubviews={false}
          renderHeader={this.mainProfileCard}
          dataSource={this.state.dataSource}
          renderRow={this.renderSPCards}
          onEndReached = {this.paginateCards}
          enableEmptySections ={true}
          scrollEventThrottle={18}
          onScroll={Animated.event(
            [{ nativeEvent: {contentOffset: {y: this.state.scrollY}} }]
          )}
        />

      </View>
    );
  }
});

const styles = StyleSheet.create(
  {
    SPLogoImage:
      {
        width: 53,
        height: 53,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: 'white',
        marginRight: width/60,
        alignItems: 'center',
        justifyContent: 'center',
      },
    SPLogoImageLarge:
      {
        width: 65,
        height: 65,
        borderWidth: 1,
        borderRadius: 40,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
    spInfo:
      {
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    cardView: {
      //	flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
    },

    profileTopArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },

    coverPicContainerDefault: {
      //	flex: 1,
      height: height / 6,
      width: width,
      backgroundColor: '#DDDDDD',
      borderColor: '#F2F1EF',
      justifyContent: 'center',
      alignItems: 'center',
    },

    coverPicContainer: {
      height: height / 6,
      width: width,
      backgroundColor: '#F2F1EF',
      alignItems: 'center',
      //	borderColor: '#DDDDDD',
      justifyContent: 'center',
      alignSelf: 'center',
    },

    profilePictureBox: {
      top: -40,
      //	borderWidth: 5,
      //	borderColor: '#F2F1EF',
      //	borderTopColor: 'rgba(0,0,0,0)',
      //	borderBottomColor: 'rgba(0,0,0,0)',
    },

    profilePicView: {
      margin: 10,
      marginHorizontal: 20,
      alignSelf: 'flex-start',
      backgroundColor: '#F2F1EF',
      borderRadius: 100,
      borderColor: '#FFFFFF',
      borderWidth: 1,
      //	top: -40,
    },

    profileImageInnerView: {
      borderRadius: 35,
      width: 70,
      height: 70,
      alignSelf: 'center',
      justifyContent: 'center',
    },

    profileImageStyle: {
      borderRadius: 35,
      alignSelf: 'center',
      justifyContent: 'center',
      width: 70,
      height: 70,
    },

    penAndSwitch: {
      top: -35,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'row',
    },

    lowerContainer: {
      //	borderWidth: 5,
      //	borderColor: 'rgba(0,0,0,0)',
      //	borderBottomColor: '#F2F1EF',
      flex: 1,
      marginTop: 25,
      //marginBottom: -20,
    },

    horContainer1: {
      //	backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    profileEditPenStyle: {
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

    profileEditPenStyle2: {
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

    editStyle: {
      alignSelf: 'center',
      fontSize: 13,
      fontWeight: '500',
      color: 'rgba(153, 153, 153, 1)',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    userNameFont: {
      top: -20,
      marginTop: 10,
      marginHorizontal: 15,
      color: '#333',
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    phoneNumberStyle: {
      top: -20,
      //	marginVertical: 5,
      marginTop: 3,
      marginHorizontal: 15,
      alignSelf: 'flex-start',
      fontSize: 12,
      //	fontWeight: 'bold',
      color: 'rgba(153, 153, 153, 1)',
      fontFamily: Fonts.regFont[Platform.OS],
    },


    jobTitleStyle: {
      top: -20,
      flex: 1,
      //	marginBottom: 3,
      marginHorizontal: 15,
      alignSelf: 'flex-start',
      fontSize: 12,
      //	fontStyle: 'italic',
      color: 'rgba(153, 153, 153, 1)',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    tagLineStyle: {
      top: -20,
      //	width: width/1.5,
      marginBottom: 3,
      marginHorizontal: 15,
      alignSelf: 'flex-start',
      fontSize: 14,
      //	fontStyle: 'italic',
      color: '#666666',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    urlAndLogo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      top: -20,
      marginHorizontal: 15,
      marginBottom: 5,
    },

    location: {
      fontSize: 11,
      color: '#666666',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    webLink: {
      fontSize: 11,
      color: StyleConstants.primary,
      fontFamily: Fonts.regFont[Platform.OS],
    },

    horContainer2: {
      //	flex: 1,
      //	margin: 10,
      flexDirection: 'row',
    },

    innerLeftContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginLeft: 15,
    },

    rightMargin: {
      marginRight: 5,
      resizeMode: 'contain',
    },

    innerRightContainer: {
      flex: 1,
      marginRight: 15,
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'flex-end',
    },

    horContainer3: {
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

    blackFont: {
      alignSelf: 'center',
      fontSize: 16,
      color: '#333',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    bigFont: {
      //	alignSelf: 'flex-start',
      fontSize: 15,
      color: '#9999',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    contactFont: {
      //	alignSelf: 'flex-start',
      fontSize: 12,
      color: '#9999',
      fontFamily: Fonts.regFont[Platform.OS],
    },

    famDefine: {
      //	marginRight: 10,
      alignItems: 'center',
      alignSelf: 'center',
      fontSize: 11,
      fontStyle: 'italic',
      color: '#9999',
      fontFamily: Fonts.regFont[Platform.OS],
    },
  });

module.exports = FakeServiceProvider;