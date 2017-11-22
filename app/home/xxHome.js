import React, {
  Component,
} from 'react';

import {
  Navigator,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,q
  ListView,
  Image,
  AsyncStorage,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';

import Modal from 'react-native-simple-modal';
import Modalbox from 'react-native-modalbox';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var Contacts = require('react-native-contacts')
import * as Animatable from 'react-native-animatable';

const dismissKeyboard = require('dismissKeyboard');

import {
  checkServ as checkServerHealth,
  syncAddressBook,
  getRelations,
  getUserLines,
  getUserProfile,
  postDisplayPicture,
  postCoverPicture,
	getTimelineCards
} from '../../lib/networkHandler';

import Loader from './Loader';
import TitleBar from '../common/TitleBar';
import NavBar from '../common/NavBar';
import SideMenu from '../common/xxSideMenu';
import ProfileCard from '../common/ProfileCard';
import ServiceProviderCard from '../card/ServiceProviderCard';

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

const {TitleParallaxHeight, TitleFixedHeight} = StyleConstants;
const HEADER_MAX_HEIGHT = TitleParallaxHeight;
const HEADER_MIN_HEIGHT = TitleFixedHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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
    return({
			userDetails: '',
			UserPhoneNumber: '',
			token: '',
			contactList:null,
      spDataSource: ds,
			linesDataSource: ds,
			switchLinesmodalOpen: false,
			spmodalOpen: false,
			currentlSelectedLine: 0,
      unreadCount: 0,
      sideMenuOpen: false,
      contactsCount: '0',
      profileCardView: false,

      profileImage: this.props.profileImage,
      coverImage: this.props.coverImage,
      scrollY: new Animated.Value(0),
	  });
	},

  componentWillMount() {
    this.setState({ loaded: false });
  },

	componentDidMount() {
    setTimeout( () => {
      this.setState({loaded: true},
				this.fetchContacts()
      )
    }, 2000);

		AsyncStorage.getItem("UserPhoneNumber")
		.then((value) => {
		  this.setState({"UserPhoneNumber": value})
		  return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
		  this.setState({"token": value});
		  console.log('Home.js Token Is: ' + value);
		  return this.fetchUser();
		})
		.then(() => {
			AsyncStorage.setItem("logged", 'yes');

			return getUserLines(this.state.token);
		})
		.then ((userLines) => {
			this.setState ({
        linesDataSource: this.state.linesDataSource.cloneWithRows(userLines)
      })
			return getRelations(this.state.token)
    })
    .then((resp) => {
       var servupContacts = JSON.stringify(resp);
       let contactsLength = resp.length ? resp.length : 0;
       AsyncStorage.setItem("servupContactBook",servupContacts);
       AsyncStorage.setItem("servupContactCount",JSON.stringify(contactsLength));
       return getTimelineCards(this.state.token);
		//	this.loadDummyCards()
    })
		.then((resp) => {
      var array;
      if (resp.Message)
            array = [];
          else
            array = resp;
			this.setState({
				spDataSource: this.state.spDataSource.cloneWithRows(array),
			});
		})
		.catch((err) => {
			console.log(err);
       //Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
		})
	},

  componentWillUnmount() {
    this.setState({ loaded: true });
  },

	fetchUser() {
		console.log('Home.js->fetchUser() This is the token: ', this.state.token);
		getUserProfile(this.state.token)
		.then((res) => {
      console.log('Home.js fetchUser(): ', res)

      this.setState({ userDetails: res });
      if (res.profilePictureURL) {
        this.setState({ profileImage: {uri: res.profilePictureURL} });
      }
      if (res.coverPictureURL) {
        this.setState({ coverImage: {uri: res.coverPictureURL} });
      }
      AsyncStorage.setItem("userDetails", JSON.stringify(res));
      return res;
		})
		.catch((err) => {
      console.log('Fetch User Error,', err);
      Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
		})
    .done();
	},

	fetchContacts() {
			Contacts.getAll((err, contacts) => {
			if (err && err.type === 'permissionDenied') {
					console.log("Contacts.getAll ==> Error",err)
			}
			else {
				var contactList = [];
					contacts.forEach(function(contact, i) {
						contact.phoneNumbers.forEach(function(phoneNumber, i) {
							var contactObj ={
								"mobileNumber" : '',
								"name" : '',
							}
							contactObj.name = contact.givenName;
							contactObj.mobileNumber = phoneNumber.number;
							contactList.push(contactObj);
						});
					});
				syncAddressBook(this.state.token,contactList)
			}
			})
	},

	loadDummyCards() {
		this.setState({
		  spDataSource: this.state.spDataSource.cloneWithRows(dummyCard),
		});
	},

	paginateCards() {
		this.setState({
      profileCardView: false,
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
			<Image source={tick} style={styles.tickStyle} resizeMode={'contain'} />
		);
	},

	modalNewLine() {
		this.setState({switchLinesmodalOpen: false});
		this.props.navigator.push ({id: 66,});
	},

	openSwitchLineModal() {
		this.setState({ switchLinesmodalOpen: true });
	},

	SwitchLinesModalPopup() {
		return (
			<Modal
  			open = {this.state.switchLinesmodalOpen}
  			modalDidOpen = {() => console.log('Modal did open')}
  			modalDidClose = {() => this.setState({switchLinesmodalOpen: false})}
  			style = {Style.centerItems}
			>
				<View>
					<Text style={[Style.h2, Style.textColorBlack, Style.center]}>
					  Switch Line(s)
					</Text>
					<ListView
  					dataSource = {this.state.linesDataSource}
  					renderRow = {this.renderUserLines}
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
    let phone = rowData.substring(2,14);
    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');

    return(
			<TouchableOpacity
  			style = {[Style.row, Style.centerItems, { marginVertical: 10 }]}
  			onPress = {this.changeLineFunction.bind(this, rowId)}
			>
        <Image
  				source = {ProfilePic}
  				style = {[Style.userImage, { marginRight: 10 }]}
        />
				<View>
					<View style = {[Style.row, Style.centerItems]}>
						<Text style = {[Style.h2, Style.textColorBlack]}>
				      {name + ' '}
						</Text>
						<Text style = {[Style.p, Style.textColorGray]}>
              {phone}
						</Text>
					</View>

					<Text style = {[Style.p, Style.textColorGray]}>
						{rowId == 0 ? 'Primary' : 'IOT'}
					</Text>
				</View>
				{this.rendertick(rowId)}
			</TouchableOpacity>
		);
	},

  spopenModal() {
		this.setState({ spmodalOpen: true });
	},

  spmodalClose() {
		this.setState({ spmodalOpen: false });
	},

  SPCardModalPopup() {
		return (
			<Modal
  			open = {this.state.spmodalOpen}
  			modalDidOpen = {() => console.log('modal did open')}
  			modalDidClose = {() => this.setState({spmodalOpen: false})}
  			style = {[Style.centerItems, {borderRadius: 20}]}
			>
        <View>
					<TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
						<Text style={styles.redText}>
							Hide Post
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
						<Text style = {styles.blueText}>
							Unfollow
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
						<Text style = {styles.blueText}>
							Save Service Card
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.rowPadding} onPress={this.spmodalClose}>
						<Text style = {styles.blueText}>
							Cancel
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	},

	goToSearchPage() {
		this.props.navigator.push ({ id: 58 });
	},

  goToContactPage() {
    this.props.navigator.push ({ id: 220 });
  },

	spDetailedCard(cards) {
		this.props.navigator.push ({ id: 40 });
	},

  handleProfileToggle(toggle) {
    this.setState({ profileCardView: !toggle });
  },

	renderHeader() {
    let {name, title, tagLine, location, personalURL, rating} = this.state.userDetails;
    let {token} = this.state;
    let {navigator} = this.props;

    let phone = this.state.UserPhoneNumber.substring(2,14);
    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');
		return (
			<View style={{ marginTop: HEADER_MAX_HEIGHT}}>
				<ProfileCard
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
        />
        <NoticeBoardCard token={token} navigator={navigator} />
        {/*<TelcoCards navigator={this.props.navigator} />*/}
			</View>
		);
	},

  coverImageFunction(cv) {
    var options = {
        title: 'Select Your Image', //specify null or empty string to remove the title
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Take a Photo', //specify null or empty string to remove this button
        chooseFromLibraryButtonTitle: 'Choose from Phone Library...', //specify null or empty string to remove this button

        cameraType: 'back', // 'front' or 'back'
        mediaType: 'photo', // 'photo' or 'video'
        maxWidth: 100000, // photos only
        maxHeight: 100000, // photos only
        allowsEditing: true, // Built in functionality to resize/reposition the image after selection
        quality: 1, // 0 to 1, photos only
    };

    ImagePickerManager.showImagePicker(options, (response) => {
      // console.log('Response  ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        var source;
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }
        checkServerHealth()
        .then((response) => {
          console.log("Respone: ", response);
          if (!response.ok) {
            Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
          }
        })
        .catch( (err) => {
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        });

        if (cv === 'c') {
          this.setState({ coverImage: source });
          postCoverPicture(this.state.token, response.data);
        }
        else {
          // SideMenu.changePic(this.state.profileImage);
          this.setState({ profileImage: source });
          postDisplayPicture(this.state.token, response.data);
        }
      }
    });
  },

  yoBeqaarTitleTranparent () {
    let top = Platform.OS === 'ios' ? 10: 0;
    return (
      <View style={{ top: top, zIndex: 1 }}>
        <TitleBar
          color1 = 'transparent'
          color2 = 'transparent'
          color3 = 'transparent'
          leftButton = {require('../../res/common/add_btn.png')}
          title = ""
          //  titleImage = {themeColor.windSplash}
          rightButton = {require('../../res/common/search.png')}
          rightButton2 = {require('../../res/common/menu.png')}
          onLeftButtonPress = {this.goToContactPage}
          onRightButtonPress = {this.goToSearchPage}
          onRightButton2Press = {() => this.setState({
            sideMenuOpen: !this.state.sideMenuOpen
          }) }
        />
      </View>
    );
  },

  renderTransparentTitle () {
    let {sideMenuOpen} = this.state;
    return (
      <View style={[Style.rowWithSpaceBetween, styles.transparentTitle]}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={this.goToSearchPage}
        >
          <Image source={require('../../res/common/search.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => this.setState({
            sideMenuOpen: !this.state.sideMenuOpen
          })}
        >
          <Image source={require('../../res/common/menu.png')} />
        </TouchableOpacity>
      </View>
    )
  },

  renderCoverImageOrCameraIcon () {
    if(this.state.coverImage.uri) {
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={this.coverImageFunction.bind(this, 'c')} >
          <Image
            source = {this.state.coverImage}
            style = {{ height: 100, width: width }}
            resizeMode = "cover"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={this.coverImageFunction.bind(this, 'c')} >
            <Image
              source = {this.props.coverImage}
              style = {{ height: 100, width: width }}
              resizeMode = "contain"
            />
        </TouchableOpacity>
      );
    }
  },

  renderParallaxHeader() {
    return(
      <View style={{ backgroundColor: 'white' }}>

        <View style={styles.coverPicContainer}>
          {this.renderTransparentTitle()}
          {this.renderCoverImageOrCameraIcon()}
        </View>

        <View style={[Style.rowWithSpaceBetween, { top: -20 }]}>

          <Animatable.View animation="bounceInLeft" style={styles.profileImagePlaceholder}>
            <TouchableOpacity onPress={this.coverImageFunction.bind(this, 'p')}>
              <Image
                source = {this.state.profileImage}
                style = {styles.profileImageStyle}
              />
            </TouchableOpacity>
          </Animatable.View>

          <View style = {[Style.rowWithSpaceBetween, styles.penAndSwitch]}>

            <TouchableOpacity
              style={[Style.btnDefault, {marginRight: 10}]}
              onPress={() => { this.props.navigator.push({id: 102}); }}
            >
							<Text style = {[Style.p, Style.textColorGray]}>
								Edit
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
              style={[Style.btnDefault, {marginRight: 10}]}
              onPress = {this.openSwitchLineModal}
            >
							<Image
								source= {require('../../res/common/sim.png')}
								style = {{alignSelf: 'center'}}
								resizeMode =  {'contain'}
							/>
						</TouchableOpacity>
					</View>
        </View>

      </View>
    );
  },

  renderStickyHeader() {
    return(
      <View>
        <TitleBar
            leftButton = {require('../../res/common/search.png')}
            title = "Servup"
            // rightButton = {require('../../res/common/search.png')}
            rightButton2 = {require('../../res/common/menu.png')}
            onLeftButtonPress={ this.goToSearchPage }
            // onRightButtonPress={ this.goToSearchPage }
            onRightButton2Press={() => this.setState({
              sideMenuOpen: !this.state.sideMenuOpen
            })}
            //  subText="last seen at 2:10 PM"
            isHome = {true}
        />
      </View>
    );
  },

	render() {
    let {loaded} = this.state;

		dismissKeyboard();
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });
    const parallaxTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });
    const stickyTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [-HEADER_MIN_HEIGHT, 0],
      extrapolate: 'clamp',
    });

    let renderLoader = () => {
  		return (<Loader show={loaded} />);
  	}

    let renderMain = () => {
      return (
  			<View style = {styles.container}>

          <StatusBar
            backgroundColor = {'black'}
            barStyle="default"
          />

          <ListView
            ref = 'ListView'
            style={styles.listView}
            bounces = {false}
            removeClippedSubviews={false}
            renderHeader = {this.renderHeader}
            dataSource={this.state.spDataSource}
            renderRow={this.renderSPCards}
  					onEndReached = {this.paginateCards}
            enableEmptySections ={true}
            scrollEventThrottle={18}
            onScroll={Animated.event(
              [{ nativeEvent: {contentOffset: {y: this.state.scrollY}} }]
            )}
  				/>

          <Animated.View style={[styles.header, {height: headerHeight}]}>
            <Animated.View
              style={[
                styles.parallax,
                {transform: [{ translateY: parallaxTranslate }] }
              ]} >
              {this.renderParallaxHeader()}
            </Animated.View>
            <Animated.View
              style={[
                styles.sticky,
                {transform: [{ translateY: stickyTranslate }] }
              ]} >
              {this.renderStickyHeader()}
            </Animated.View>
          </Animated.View>

  				<NavBar
  					navigator = {this.props.navigator}
            unreadCount={this.props.unreadCount}
          />

          <Modalbox
              isOpen = {this.state.sideMenuOpen}
              isDisabled = {this.state.sideMenuOpen = false}
              entry = {'right'}
              backdrop = {true}
              style = {{ left: width/3 }}
              swipeToClose = {true}
              animationDuration= {400}
          >
              <SideMenu navigator = {this.props.navigator}/>
          </Modalbox>

          {this.SwitchLinesModalPopup()}
          {this.SPCardModalPopup()}
  			</View>
  		);
    }

		return loaded ? renderMain() : renderLoader();
	},

	renderSPCards(cards) {
		return (
			<ServiceProviderCard
				navigator = {this.props.navigator}
				{...cards}
				token ={this.state.token}
				spDetailedCard = {this.spDetailedCard}
				spopenModal = {this.spopenModal}
			/>
		);
	},

});

module.exports = Home
