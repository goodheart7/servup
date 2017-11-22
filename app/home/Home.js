import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ListView,
  Image,
  Share,
  AsyncStorage,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Animated,
  RefreshControl
} from 'react-native';

var Fabric = require('react-native-fabric');
var {Crashlytics} = Fabric;
var {Answers} = Fabric;

import Modal from 'react-native-simple-modal';
import Modalbox from 'react-native-modalbox';
import LoadingCard from './LoadingCard';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var Contacts = require('react-native-contacts')
import * as Animatable from 'react-native-animatable';
import FCM from 'react-native-fcm';
const dismissKeyboard = require('dismissKeyboard');

import {
  checkServ as checkServerHealth,
  syncAddressBook,
  getRelations,
  getUserLines,
  getNotificationCounters,
  getUserProfile,
  postDisplayPicture,
  postCoverPicture,
  getTimelineCards
} from '../../lib/networkHandler';

import MenuBar from '../common/MenuBar';
import Loader from './Loader';
import TitleBar from '../common/TitleBar';
import NavBar from '../common/NavBar';
import SideMenu from '../common/xxSideMenu';
import ProfileCard from '../common/ProfileCard';
import ServiceProviderCard from '../card/ServiceProviderCard';
import ServiceProviderCard2 from '../card/ServiceProviderCard2';
var tick = require('../../res/common/selected_contact_messenger_icon.png');
var share = require('../../res/common/share.png');

const {height, width} = Dimensions.get('window');

// import TelcoCards from './TelcoCards';
import NoticeBoardCard from './NoticeBoardCard';
import styles from './Style';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import AppConstants from '../AppConstants';

import dummyCard from './DummySpCards';

var Home = React.createClass({
  getDefaultProps() {
    return {
      coverImage: require('../../res/common/camera.png'),
      profileImage: require('../../res/common/add_photo.png'),
      profileEditPen: require('../../res/common/edit.png'),
      token: '',
    };
  },

  getInitialState() {
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return ({
      userDetails: '',
      UserPhoneNumber: '',
      token: '',
      cardShareModal: false,
      contactList: null,
      totalNotifications: '',
      spDataSource: ds.cloneWithRows([{}, {}, {}, {}, {}]),
      linesDataSource: ds,
      switchLinesmodalOpen: false,
      spmodalOpen: false,
      currentlSelectedLine: 0,
      unreadCount: 0,
      sideMenuOpen: false,
      contactsCount: '0',
      profileCardView: false,
      userImage: '',
      userDetails: '',
      profileImage: this.props.profileImage,
      coverImage: this.props.coverImage,
      scrollY: new Animated.Value(0),
      notFirstTime: true,
      later: true,
      loaded: false,
      numberOfCards: 20,
    });
  },

  componentWillMount() {
    if (this.props.props) {
      if (this.props.props.notFirstTime) {
        this.setState({notFirstTime: false, later: false});
      }
    }
  },

  componentDidMount() {
    this.loadMainData();
  },

  paginateCards() {
    this.setState({
      numberOfCards: this.state.numberOfCards + 20,
    }, () => {
      console.log('Home - Cards paginated, calling API');
      getTimelineCards(this.state.token, this.state.numberOfCards)
        .then((resp) => {
          console.log('RESPONSE IS', resp);
          var array = resp;
          if (resp.Message)
            array = [];
          // console.log('@@@@@@@@@@@@', array);
          if (!array.errorCode) {
            this.setState({
              spDataSource: this.state.spDataSource.cloneWithRows(array),
            });
          }
          else {
            console.log("Error....");
          }
          // this.setState({loaded: true});
        })
        .catch((err) => {
          console.log('error in pagination', err);
        })

    });
  },

  loadMainData() {
    let localCards = "";
    AsyncStorage.getItem("TimeLineCards")
      .then((res)=>{
      localCards= res ;
      console.log("@@@@ timeline card from storage", res);
                 if(res!= null) {
                    res = JSON.parse(res);
                      console.log("@@@@ timeline card from storage after jason", res);
                      this.setState ({spDataSource:this.state.spDataSource.cloneWithRows(res)})
                 }
      });
    /*setTimeout(() => {
     this.setState({loaded: true},

     )
     }, 2000);*/
    // Crashlytics.setString('organization', 'Acme. Corp');
    // Crashlytics.setUserEmail('user@email.com');
    Answers.logCustom('Performed a custom event', {bigData: true});
    this.setState({loaded: false}),
      AsyncStorage.getItem("UserPhoneNumber")
        .then((value) => {
          this.setState({"UserPhoneNumber": value})
          console.log("My local contact Number", value);
          Crashlytics.setUserName(value);
          Crashlytics.setNumber('UserPhoneNumber', +value);
          // Crashlytics.crash();
          return AsyncStorage.getItem("UserToken")
        })
        .then((value) => {
          this.setState({"token": value});
          console.log('Home.js Token Is: ' + value);

          this.fetchContacts(this.state.UserPhoneNumber);

          AsyncStorage.setItem("logged", 'yes');
          AsyncStorage.getItem("showContactsLandingScreen")
            .then((resp) => {
              if (resp === null) {
                this.setState({showContactsLandingScreen: true});
              }
              else {
                this.setState({showContactsLandingScreen: false});
                AsyncStorage.setItem("showContactsLandingScreen", "No");
              }
            })
            .catch((err) => {
              console.log(err);
              Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage,
                [
                  {text: 'Try again', onPress: () => this.loadMainData()},
                ],
                {cancelable: false}
              );
            })
          /*  return getUserLines(this.state.token);
           })
           .then((userLines) => {
           this.setState({
           linesDataSource: this.state.linesDataSource.cloneWithRows(userLines)
           })*/
          return getRelations(this.state.token)
        })
        .then((resp) => {
          var servupContacts = JSON.stringify(resp);
          let contactsLength = resp.length ? resp.length : 0;
          console.log('@@@@@@@contact resp', resp);
          AsyncStorage.setItem("servupContactBook", servupContacts);
          AsyncStorage.setItem("servupContactCount", JSON.stringify(contactsLength));

          return getNotificationCounters(this.state.token);
          //	this.loadDummyCards()
        })
        .then((resp) => {
          console.log('@@@@@@@@@@ notification counter', resp);
          let totalCount = resp.orderNotificationCounter +
            resp.campaignNotificationCounter +
            resp.userNotificationCounter +
            resp.cardNotificationCounter +
            resp.serviceNotificationCounter +
            resp.companyNotificationCounter +
            resp.subscriptionNotificationCounter;

          this.setState({totalNotifications: totalCount});
          console.log('@@@@@@@@ totalCounter', this.state.totalNotifications);
          getTimelineCards(this.state.token, this.state.numberOfCards)
            .then((resp) => {

              var array;
              if (resp.Message)
                array = [];
              else
                array = resp;
              console.log('@@@@@@@@@@@@timeLineCard', array);
              if (!array.errorCode) {
                  let stringfiedArray = JSON.stringify(array);
                  if (localCards != stringfiedArray) {
                    AsyncStorage.setItem("TimeLineCards", stringfiedArray) ;
                    this.setState ({spDataSource:this.state.spDataSource.cloneWithRows(array)})
                  }
              }
              else {
                console.log("Error....");
              }
              this.setState({loaded: true});
            })
            .catch((err) => {
              console.log(err);
              Alert.alert("Oops...", "There are some issues while getting your timeline Card",
                [
                  {text: 'Try again', onPress: () => this.loadMainData()},
                ],
                {cancelable: false}
              );
            })
          AsyncStorage.getItem("UserImage")
            .then((resp) => {

              console.log('@@@@@@@@@@ userImage', resp);
              this.setState({userImage: resp});
            })
            .catch((err) => {
              console.log(err);

            })
        })


        .catch((err) => {
          console.log(err);
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage,
            [
              {text: 'Try again', onPress: () => this.loadMainData()},
            ],
            {cancelable: false}
          );
        })
    // FCM.requestPermissions(); // for iOS
    // FCM.getFCMToken().then(token => {
    // 	console.log('@@@@@@@@@@@@@Fire Base', token)
    // 	// store fcm token in your server
    // });
    // this.notificationListener = FCM.on(FCMEvent.Notification, (notif) => {
    // 	// there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    // 	if (notif.local_notification) {
    // 		//this is a local notification
    // 	}
    // 	if (notif.opened_from_tray) {
    // 		console.log('@@@@@@@@@@@##############$$$$$$$$%%%%%%%%%%%%Notification opened@@@@@@@@@@@##############$$$$$$$$%%%%%%%%%%%%');
    // 		//app is open/resumed because user clicked banner
    // 	}
    // });
    // this.refreshTokenListener = FCM.on('refreshToken', (token) => {
    // 	console.log(token)
    // 	// fcm token may not be available on first load, catch it here
    // });

  },

  componentWillUnmount() {
    this.setState({loaded: true});
    //this.notificationListener.remove();
    //this.refreshTokenListener.remove();

  },

  fetchUser() {
    getUserProfile(this.state.token)
      .then((res) => {
        console.log('getUserProfile(): ', res)

        this.setState({userDetails: res});
        if (res.profilePictureURL) {
          this.setState({profileImage: {uri: res.profilePictureURL}});
        }
        if (res.coverPictureURL) {
          this.setState({coverImage: {uri: res.coverPictureURL}});
        }
        AsyncStorage.setItem("userDetails", JSON.stringify(res));
        return res;
      })
      .catch((err) => {
        console.log('Fetch User Error,', err);
        Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
      })
  },

  fetchContacts(userNumber) {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        console.log("Contacts.getAll ==> Error", err)
      }
      else {
        var contactList = [];
        contacts.forEach(function (contact, i) {
          contact.phoneNumbers.forEach(function (phoneNumber, i) {
            var contactObj = {
              "mobileNumber": '',
              "name": '',
            }
            let familyName = contact.familyName ? contact.familyName : "";
            contactObj.name = contact.givenName + " " + familyName;
            contactObj.mobileNumber = phoneNumber.number;
            if (userNumber === "00923235029955") {
              if (contactObj.name.includes("Test") || contactObj.name.includes("test") || contactObj.name.includes("servup") || contactObj.name.includes("Servup")) {
                contactList.push(contactObj);
              }
            }
            else {
              contactList.push(contactObj);
            }

          });
        });
        contactList.map((obj, index) => {
          obj.mobileNumber = this.contactNumberValidation(obj.mobileNumber);
        });
        console.log("My local contact List", contactList);
        syncAddressBook(this.state.token, contactList);
        AsyncStorage.setItem("ContactsListLocal", JSON.stringify(contactList));
      }
    })
  },

  contactNumberValidation(contactNumber){
    if (contactNumber.startsWith("0")) {

      if (contactNumber[1] === "0") {
        console.log("ok")
      }
      else {
        contactNumber = contactNumber.replace(contactNumber[0], "0092");
      }
    }
    else if (contactNumber.startsWith("+")) {
      contactNumber = contactNumber.replace(contactNumber[0], "00");
    }
    contactNumber = contactNumber.replace(/\D/g, '');
    return contactNumber;
  },

  loadDummyCards() {
    this.setState({
      spDataSource: this.state.spDataSource.cloneWithRows(dummyCard),
    });
  },

  changeLineFunction(rowId) {
    this.setState({
      currentlSelectedLine: rowId,
      switchLinesmodalOpen: false,
    });
  },

  rendertick(rowId) {
    if (this.state.currentlSelectedLine == rowId)
      return (
        <Image source={tick} style={styles.tickStyle} resizeMode={'contain'}/>
      );
  },

  modalNewLine() {
    this.setState({switchLinesmodalOpen: false});
    this.props.navigator.push({id: 66,});
  },

  openSwitchLineModal() {
    this.setState({switchLinesmodalOpen: true});
  },

  SwitchLinesModalPopup() {
    return (
      <Modal
        open={this.state.switchLinesmodalOpen}
        modalDidOpen={() => console.log('Modal did open')}
        modalDidClose={() => this.setState({switchLinesmodalOpen: false})}
        style={Style.centerItems}
      >
        <View>
          <Text style={[Style.h2, Style.textColorBlack, Style.center]}>
            Switch Line(s)
          </Text>
          <ListView
            dataSource={this.state.linesDataSource}
            renderRow={this.renderUserLines}
          />
          <TouchableOpacity
            style={Style.btnDefault}
            onPress={this.modalNewLine}
          >
            <Text style={Style.p}>
              Add New Line
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  },

  renderUserLines(rowData, sectionID, rowId) {
    let profileURL = this.state.userDetails.profilePictureURL
    let ProfilePic = profileURL ? {uri: profileURL} : {uri: null}
    let {name} = this.state.userDetails;
    let phone = rowData.substring(2, 14);
    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/, '$1-$2-$3-');

    return (
      <TouchableOpacity
        style={[Style.row, Style.centerItems, {marginVertical: 10}]}
        onPress={this.changeLineFunction.bind(this, rowId)}
      >
        <Image
          source={ProfilePic}
          style={[Style.userImage, {marginRight: 10}]}
        />
        <View>
          <View style={[Style.row, Style.centerItems]}>
            <Text style={[Style.h2, Style.textColorBlack]}>
              {name + ' '}
            </Text>
            <Text style={[Style.p, Style.textColorGray]}>
              {phone}
            </Text>
          </View>

          <Text style={[Style.p, Style.textColorGray]}>
            {rowId == 0 ? 'Primary' : 'IOT'}
          </Text>
        </View>
        {this.rendertick(rowId)}
      </TouchableOpacity>
    );
  },

  spopenModal(card) {
    this.setState({spmodalOpen: true, cardObj: card});

  },

  spmodalClose() {
    this.setState({spmodalOpen: false});
  },

  SPCardModalPopup() {
    return (
      <Modal
        open={this.state.spmodalOpen}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({spmodalOpen: false})}
        style={[Style.centerItems, {borderRadius: 20}]}
      >
        <View>
          <TouchableOpacity style={[styles.rowPadding]} onPress={this.spmodalClose}>
            <Text style={styles.redText}>
              Hide Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
            <Text style={styles.blueText}>
              Save Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
            <Text style={styles.blueText}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  },

  cardShareModalOpen(card) {
    this.setState({cardShareModal: true, card: card});
  },

  cardShareModalClose() {
    this.setState({cardShareModal: false});
  },

  SocialShare() {
    Share.share({
      message: 'https://www.servup.co'
    })
      .then(() => {
        console.log('Promise Resolved')
      })
      .catch(err => console.log(err))
  },
  shareInChat () {
    this.props.navigator.push({id: 320, card: this.state.card});
    this.cardShareModalClose();
  },

  CardShare() {
    return (
      <Modal
        open={this.state.cardShareModal}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({cardShareModal: false})}
        style={Style.centerItems}
      >
        <View>
          <TouchableOpacity style={styles.rowPadding} onPress={this.shareInChat}>
            <Text style={styles.blueText}>
              Share In Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.rowPadding,{borderBottomColor:'transparent'}]} onPress={this.SocialShare}>
            <Text style={styles.blueText}>
              Social Share
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  },

  goToSearchPage() {
    this.props.navigator.push({id: 58});
  },

  goToContactPage() {
    this.props.navigator.push({id: 220});
  },

  spDetailedCard(cards) {
    this.props.navigator.push({id: 40});
  },

  handleProfileToggle(toggle) {
    this.setState({profileCardView: !toggle});
  },

  later() {
    console.log('Later called');
    this.setState({later: true, notFirstTime: false});
  },

  renderHeader() {
    let {name, title, tagLine, location, personalURL, rating} = this.state.userDetails;
    let {token} = this.state;
    let {navigator} = this.props;

    let phone = this.state.UserPhoneNumber.substring(2, 14);
    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/, '$1-$2-$3-');
    if (!this.state.later)
      return (
        <View>
          {/* <ProfileCard
           navigator = {this.props.navigator}
           userName = {name ? name : 'Name'}
           phoneNumber = {phone}
           jobTitle = {title ? title : 'Title'}
           Tagline = {tagLine ? tagLine : 'Tagline'}
           location = {location ? location : 'Location'}
           webSite = {personalURL ? personalURL : 'www.servup.co'}
           memberStatus = {rating ? rating : 'Rating'}
           profileOpen = {this.state.profileCardView}
           profileToggle = {this.handleProfileToggle}
           /> */}
          <NoticeBoardCard token={token} navigator={navigator} later={this.later}/>
          {/*<TelcoCards navigator={this.props.navigator} />*/}
        </View>
      );
  },
  updateImage() {
    console.log('@@@@@@@@@@ updating image');
    AsyncStorage.getItem("UserImage")
      .then((resp) => {
        this.setState({userImage: resp});
        console.log('@@@@@@@@@@ userImage', resp);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
      })
  },

  animatedLoader() {
    return (
      <LoadingCard/>
    );
  },

  render() {
    let {loaded} = this.state;

    dismissKeyboard();

    // let renderLoader = () => {
    // 	return (<Loader show={loaded}/>);
    // }

    let renderMain = () => {
      return (
        <View style={{flex: 1}}>

          <StatusBar
            backgroundColor={'black'}
            barStyle="default"
          />

          <MenuBar
            // color = {'red'} // Optional By Default 'black'
            title={''} // Optional
            updateImage={this.updateImage}
            //  leftIcon = {'icon-magnifier-magnifying-glass-reading-glass-search-se'}
            //rightIcon = {'icon-menu'} // Optional
            searchPlate={'icon-discover'}
            rightImage={this.state.userImage ? {uri: this.state.userImage} : require('../../res/common/profile.png')}
            // disableLeftIcon = {true} // Optional By Default false
            // disableRightIcon = {true} // Optional By Default false
            onPressLeftIcon={this.goToSearchPage} // Optional
            onPressRightIcon={() => this.props.navigator.push({id: 100, updateImage:this.updateImage })} // Optional
          />

          <ListView
            ref='ListView'
            style={styles.listView}
            bounces={true}
            removeClippedSubviews={false}
            renderHeader={loaded? this.renderHeader : null}
            dataSource={this.state.spDataSource}
            renderRow={loaded? this.renderSPCards : this.animatedLoader}
            // renderRow={this.animatedLoader}
            onEndReached={this.paginateCards}
            enableEmptySections={true}
            scrollEventThrottle={18}
            onScroll={Animated.event(
							[{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
						)}
            refreshControl={
							<RefreshControl
								enabled = {true}
								refreshing = {!loaded}
								onRefresh = {this.loadMainData}
							/>
						}
          />

          <NavBar
            navigator={this.props.navigator}
            unreadCount={this.props.unreadCount}
            showContactsLandingScreen={this.state.showContactsLandingScreen}
            notificationCount={this.state.totalNotifications}
            onUnmount={() => {
							console.log('2@@@@@@@@@@@@@@@@@@@@@@@');
							this.setState({totalNotifications: 0})
						}}
          />

          <Modalbox
            isOpen={this.state.sideMenuOpen}
            isDisabled={this.state.sideMenuOpen = false}
            entry={'right'}
            backdrop={true}
            style={{left: width / 6}}
            swipeToClose={true}
            animationDuration={400}
          >
            <SideMenu navigator={this.props.navigator}/>
          </Modalbox>

          {this.SwitchLinesModalPopup()}
          {this.SPCardModalPopup()}
          {this.CardShare()}
        </View>
      );
    }

    return renderMain(); // : renderLoader();
  },

  renderSPCards(cards, sectionID, rowID) {
    //console.log('@@@@@@@@@@@', cards);
    if (this.state.spDataSource) {
      if (rowID == 4 && this.state.notFirstTime)
        return (
          <View>
            <NoticeBoardCard
              token={this.state.token}
              navigator={this.props.navigator}
              later={this.later}
            />
            <ServiceProviderCard
              navigator={this.props.navigator}
              {...cards}
              cardObj={cards}
              token={this.state.token}
              spDetailedCard={this.spDetailedCard}
              spopenModal={this.spopenModal}
              CardShare={(card) => this.cardShareModalOpen(card)}
            />
          </View>
        );
      else
        return (
          <ServiceProviderCard
            navigator={this.props.navigator}
            {...cards}
            cardObj={cards}
            token={this.state.token}
            spDetailedCard={this.spDetailedCard}
            spopenModal={this.spopenModal}
            CardShare={(card) => this.cardShareModalOpen(card)}
          />
        );
    }

  },

});

module.exports = Home
