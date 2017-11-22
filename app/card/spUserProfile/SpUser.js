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
  //Image,
  Dimensions,
  Platform,
  ListView,
  AsyncStorage,
} from 'react-native';
import Image from 'react-native-image-progress';

import {
  Style,
  Fonts,
  StyleConstants,
} from '../../stylesheet/style';
import {
  getBusinessProfile,
  followSP,
  unfollowSP,
  spFollowers,
} from '../../../lib/networkHandler';
import Icon from '../../stylesheet/icons';
const {height, width} = Dimensions.get('window');
import MenuBar from '../../common/MenuBar';
import cardBaseStyle from '../Styles/cardBaseStyle';
import NavBar from '../../common/NavBar';
import ServiceProviderCardOnProfile from '../ServiceProviderCardsOnProfile';
import Communications from 'react-native-communications';

var backButtonImage;
var reducer = 0;
var leftButton;
let userImage = require('../../../res/common/profile.png');
var contacts = require('../../../res/common/cog_settings.png');
var call = require('../../../res/common/call.png');
var chat = require('../../../res/common/chat.png');
var burgerMenu = require('../../../res/common/3bar.png');
var edit = require('../../../res/common/edit.png');
var SpUser = React.createClass({
//Let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),

  getInitialState()
  {
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      spData: [],
      following: false,
      dataSource: ds,
      headerStyle: {backgroundColor: 'transparent'},
      iconColor: 'white',

    };
  },

  componentDidMount()
  {
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({"token": value});
        return getBusinessProfile(value, this.props.companyId)
      })
      .then((resp) => {
        console.log('@@@@@@@@@@@@@@Service Cards', resp.serviceCards);
        this.setState({
          spData: resp,
          dataSource: this.state.dataSource.cloneWithRows(resp.serviceCards),
          following: resp.isFollowed,
        });
      })
      .catch((err) => {
        console.log(err);
        //Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
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

  backFunction()
  {
    this.props.navigator.pop();
  },
  callButtonPressed(phoneNumber) {
    let phone = phoneNumber.toString();
    Communications.phonecall(phone, true);
  },
  renderSPCards(cards) {
    //console.log('@@@@@@@@@@@&&&&', cards);
    return (
      <ServiceProviderCardOnProfile
        navigator={this.props.navigator}
        {...cards}
        cardObj={cards}
        token={this.state.token}
        spDetailedCard={this.spDetailedCard}
        spopenModal={this.spopenModal}
        CardShare={(card) => this.cardShareModalOpen(card)}
      />
    );
  },
  shareCardInSupport() {
    console.log('Support Called..');
    let spPublicID = {
      spUserId: this.props.spPublicId,
    }

    requestSupportOnACard(this.state.DataSource.cardId, spPublicID, this.state.Token)
      .then((value) => {
        console.log('@@@@@@@@@@@@@@@@valueSupport', value);
        // this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj});
        this.props.navigator.push({
          id: 321,
          userName: this.state.DataSource.spName,
          chatGroupId: value.id,
          card: this.state.DataSource,
          publicId: this.state.DataSource.spPublicId,
        });
      });
    //let name = this.props.spName ? this.props.spNmae : 'Ghost';
    //AsyncStorage.setItem('chatwithUserId', this.props.spPublicId);
    // this.props.navigator.push({id:321, card: this.props.cardObj, publicId: this.props.spPublicId});
    //this.props.navigator.push({id:320, card: this.state.card});
    //this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj})
  },
  renderExtraSpaceForIOS() {
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  },

  renderTitle (){
    let style = this.state.headerStyle;
    let iconColor = this.state.iconColor;
    let topMargin = {marginTop: 0};
    if (Platform.OS === 'ios') {
      topMargin = Style.marginForIOS;
    }
    //console.log('@@@@@@@@@@@@@Style', style);
    return (
      <TouchableOpacity style={[cardBaseStyle.titleBar, style, {padding:12}]}
                        onPress={() => this.props.navigator.pop()}>
        <Icon name={'icon-back_screen_black'} fontSize={18} color={iconColor}/>
      </TouchableOpacity>
    );
  },


  mainProfileCard() {
    let spData = this.state.spData;
    console.log('@@@@@@@@@@@@@@@@spDa', this.state.spData);
    let followButtonStyle = this.state.following ? styles.unfollowButton : styles.followButton;

    if (spData != null) {

      let spPhoneNumber = spData.helpline && spData.helpline.phoneNumber ? spData.helpline.phoneNumber : '';

      userImage = spData.logoUrl ? {uri: spData.logoUrl} : userImage;
      let coverImage = spData.coverPictureUrl ? {uri: spData.coverPictureUrl} : require('../../../res/common/defaultCover.jpg');
      let helpline = <Text style={[Style.f16, Style.textColorBlack,{marginTop:5}]}>
        {spData.helpline && spData.helpline.phoneNumber ? spData.helpline.phoneNumber : 'HelpLine : - '}
      </Text>;


      let businessDescription = <View style={{flexDirection: 'row', marginBottom:5}}>
        <Text style={styles.userDetailsText}>
          {spData.businessDescription ? spData.businessDescription : 'Business Description: - '}
        </Text>
      </View>;

      return (

        <View style={[styles.minProfileContainer, {backgroundColor: 'white'}]}>
          <View style={styles.coverPicContainer}>
            <Image
              source={coverImage}
              resizeMode={'cover'}
              style={styles.coverPicture}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 20}}>
            <TouchableOpacity
              style={styles.displayPicContainer}>
              <Image
                source={userImage}
                style={styles.profilePicture}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{padding:5, marginRight:15}}
                                onPress={(spPhoneNumber)=>{
                if(spPhoneNumber.length < 2 ) {
                  Alert.alert('Sorry!!!', spData.businessName && 0 ? spData.businessName : 'This Service Provider'+ ' has not Provided any Helpline yet.');
                }
                else {
                  this.callButtonPressed(spPhoneNumber)
                }

              }}>


                <Icon name={'icon-call_support'} fontSize={18} color={'black'}/>
              </TouchableOpacity>
              <TouchableOpacity style={followButtonStyle}
                                onPress={() => {

                                  if (this.state.following) {
                                    unfollowSP(this.state.token, this.props.companyId)
                                      .then((resp) => {
                                      console.log('@@@@@resp');
                                        this.setState({following: !this.state.following});
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        //Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
                                      })
                                  }
                                  else {
                                    followSP(this.state.token, this.props.companyId)
                                      .then((resp) => {
                                      console.log('follow sp resp');
                                        this.setState({following: !this.state.following});
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        //Alert.alert("Error", 'Unable to connect to server. Please check your internet connection and/or try again later.');
                                      })
                                  }
                                }}>
                <Text style={[Style.f12, {
                  color: this.state.following ? 'white': 'black',
                  alignSelf: 'center',
                  paddingVertical: 3,
                  justifyContent: 'center',
                  fontWeight:this.state.following ?'500':'300',
                }]}>
                  {this.state.following ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          <View style={{marginTop: 20, marginHorizontal: 20}}>
            <Text style={[Style.textColorBlack, {fontSize: 22}]}>
              {spData.businessName ? spData.businessName : 'Name'}
            </Text>
          </View>
          <View style={{flexDirection: 'column', marginVertical: 15, marginHorizontal: 10}}>
            { businessDescription}
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 8}}>
              <Text style={styles.userDetailsText}>
                {spData.businessAddress ? spData.businessAddress : 'Location: - '}
              </Text>
              <Text style={[styles.userDetailsText,{color:'blue'} ]}>
                {spData.companyWebSite ? spData.companyWebSite : 'Web: - '}
              </Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            padding: 10,
            paddingVertical: 5,
            marginBottom: 1,
            borderWidth: 1,
            justifyContent: 'space-between',
            marginHorizontal: 15,
            borderBottomColor: 'white',
            borderTopColor: '#ececec',
            borderLeftColor: 'white',
            borderRightColor: 'white',
            backgroundColor: 'white',
          }}>
            <TouchableOpacity style={   {alignSelf: 'center', flex:1, justifyContent:'center'}}
                              onPress={()=>{this.props.navigator.push({id:23, spId:this.props.companyId})}}>
              <Text style={{
alignSelf: 'center',
                     // marginLeft: 15,
                      fontSize: 14,
                      color: '#333',
                      fontFamily: Fonts.regFont[Platform.OS]
                    }}>
                {spData.totalFollowers ? spData.totalFollowers : ' ' }
              </Text>
              <Text style={{
                                 alignSelf: 'center',
                                // marginLeft: 15,
                                //fontWeight:'500',
                                 fontSize: 14,
                                 color: '#333',
                                 fontFamily: Fonts.regFont[Platform.OS]
                               }}>
                Followers
              </Text>
            </TouchableOpacity>

            <View style={{backgroundColor:'#ececec', marginVertical:0, width:1}}/>

            <View style={   {alignSelf: 'center',flex:1, justifyContent:'center'}}>
              <Text style={{
            alignSelf: 'center',
                                 // marginLeft: 15,
                                  fontSize: 14,
                                  color: '#333',
                                  fontFamily: Fonts.regFont[Platform.OS]
                                }}>
                {spData.totalCards ? spData.totalCards : ' ' }
              </Text>
              <Text style={{
                                             alignSelf: 'center',
                                            // marginLeft: 15,
                                             fontSize: 14,
                                             color: '#333',
                                             fontFamily: Fonts.regFont[Platform.OS]
                                           }}>
                Service Cards
              </Text>
            </View>
          </View>
        </View>
      );
    }

  },

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderExtraSpaceForIOS()}
        {this.renderTitle()}
        <ListView
          ref='ListView'
          style={styles.listView}
          bounces={false}
          removeClippedSubviews={false}
          renderHeader={this.mainProfileCard}
          dataSource={this.state.dataSource}
          renderRow={this.renderSPCards}
          onEndReached={this.paginateCards}
          enableEmptySections={true}
          scrollEventThrottle={18}
          onScroll={(e) => {
            console.log('@@@@@@@@@@ e evebebenbnbe', e.nativeEvent.contentOffset.y);
            e.nativeEvent.contentOffset.y > 125 ? this.setState({
              headerStyle: {backgroundColor: 'white'},
              iconColor: 'black'
            }) : this.setState({headerStyle: {backgroundColor: 'transparent'}, iconColor: 'white'})
          }}
        />

      </View>
    );
  }
});

const styles = StyleSheet.create(
  {
    minProfileContainer: {
      //width: width*0.80,
      paddingVertical: -1,
      // paddingHorizontal: 20,
      paddingBottom: 0,
    },
    displayPicContainer: {
      zIndex: 2,
      marginTop: -25,
      marginHorizontal: 20,
      marginBottom: 5,
    },
    profilePicture: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 0,
    },
    contactRow: {
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    userDetailsText: {
      fontSize: 16,
      color: 'black',
      marginHorizontal: 10,
      flex: 1,
      flexWrap: 'wrap',
      marginVertical: 2,
      fontFamily: Fonts.regFont[Platform.OS],
    },
    coverPicContainer: {
      height: 140,
      width: width,
      backgroundColor: '#F2F1EF',
      alignItems: 'center',
      //	borderColor: '#DDDDDD',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    coverPicture: {
      height: 140,
      width: width,
    },
    followButton: {
      borderWidth: 0.5,
      width: 80,

      borderColor: 'black',
      borderRadius: 5,
      height: 25,
      marginVertical: 5
    },
    unfollowButton: {
      borderWidth: 0.5,
      width: 80,
      backgroundColor: StyleConstants.primary,
      borderColor: StyleConstants.primary,
      borderRadius: 5,
      height: 25,
      marginVertical: 5
    }
  });

export default SpUser;