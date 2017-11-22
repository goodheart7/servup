import React, {
  Component,
} from 'react';
import Icon from '../stylesheet/icons'
import {uploader} from '../../lib/FileUploader';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Platform,
  View,
  Dimensions,
  Image,
  AsyncStorage,
} from 'react-native';
import AppConstants from '../AppConstants';
import * as Animatable from 'react-native-animatable';
import {
  checkServ as checkServerHealth,
  postDisplayPicture,
  getUserProfile,
} from '../../lib/networkHandler';


import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
var ImagePicker = require('react-native-image-picker');
const {height, width} = Dimensions.get('window');
let userImage = require('../../res/common/profile.png');
var rightArrow = require('../../res/common/arrow_right.png');
var edit = require('../../res/common/edit.png');
var ProfileCard = React.createClass({

  getDefaultProps() {
    return {
      userName: 'User Name',
      jobTitle: 'Job Title',
      Tagline: 'Tag Line',
      location: 'Location',
      webSite: 'www.servup.co',
      memberStatus: '',
      profileOpen: false,
    };
  },

  getInitialState() {
    return {
      contactsCount: '',
      userDetails: [],
    }
  },

  componentDidMount() {
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({token: value});
        return getUserProfile(this.state.token);
      })
      .then((resp) => {
        this.setState({userDetails: resp});
        AsyncStorage.setItem('UserImage', resp.profilePictureURL);
        AsyncStorage.setItem('Name', resp.name);
        console.log('@@@@@@@@@user details resp', resp.name);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  },
  renderExtraSpaceForIOS (){
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  },
  updateView() {
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({token: value});
        return getUserProfile(this.state.token);
      })
      .then((resp) => {
        this.setState({userDetails: resp});
        console.log('@@@@@@@@@user details resp', resp);
        AsyncStorage.setItem('UserImage', resp.profilePictureURL);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  },
  renderTitle () {
    return (
      <TouchableOpacity style={{
				backgroundColor: 'transparent',
				position: 'absolute',
				marginLeft: 20,
				marginTop: 20,
				top: 1,
				zIndex: 1
			}}
                        onPress={() => this.props.navigator.pop()}>
        <Icon name={'icon-back_screen_black'} fontSize={18} color={'white'}/>
      </TouchableOpacity>
    );
  },


  userProfile() {
    //userImage= userDetails.profilePicUrl ? userDetails.profilePicUrl : userImage;

    userImage = this.state.profileImage ? this.state.profileImage : userImage;
    //  console.log('@@@@@@@@@@@@@@@userImage heehhe', userImage);

    //console.log('@@@@@@@@@@@@@@@userImage', userImage);
    let userDetails = this.state.userDetails ? this.state.userDetails : [];
    // console.log('@@@@@@@@@@@@@@@@@104 userDetails',userDetails);
    userImage = userDetails.profilePictureURL ? {uri: userDetails.profilePictureURL} : userImage;
    return (
      <View style={[styles.minProfileContainer, {backgroundColor: 'white'}]}>
        <View style={{backgroundColor: StyleConstants.primary, height: 140, flex: 1}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 20}}>
          <TouchableOpacity
            style={styles.displayPicContainer}
            onPress={() => {
								this.coverImageFunction()
							} }>
            <Image
              source={userImage}
              style={styles.profilePicture}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <TouchableOpacity style={{marginTop: 10, marginHorizontal: 15}}
                              onPress={() => this.props.navigator.push({id: 101})}>
              <Icon name={'icon-settings_profile'} fontSize={25} color={'grey'}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
								borderWidth: 0.5,
								width: 80,
								borderColor: 'black',
								borderRadius: 5,
								marginVertical: 11
							}}
                              onPress={() => {
																	this.props.navigator.push({id: 102, contextId:100, onUnmount:()=>this.updateView()})
																}}>
              <Text style={[Style.f12, {color: 'black', padding: 5, alignSelf: 'center', justifyContent: 'center'}]}>Edit
									Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop:10, marginHorizontal: 25, marginBottom: 5}}>
          <Text style={[Style.textColorBlack, {fontSize: 22, marginBottom:5}]}>
            {userDetails.name ? userDetails.name : 'Name'}
          </Text>
          <Text style={[Style.f16, Style.textColorBlack]}>
            {userDetails.mobileNumber ? userDetails.mobileNumber : 'Contact Number' }
          </Text>
        </View>
        <View style={{flexDirection: 'column', marginBottom: 35, marginTop:15, marginHorizontal: 25}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name={'icon-title_profile'} fontSize={18} color={'black'}/>
            <Text
              style={[Style.f16, Style.textColorBlack, {marginHorizontal: 10, flex:1, flexWrap:'wrap'}]}>
              {userDetails.title ? userDetails.title : 'Title'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon name={'icon-profile_settings'} fontSize={18} color={'black'}/>
            <Text
              style={[Style.f16, Style.textColorBlack, {marginHorizontal: 10, flex:1, flexWrap:'wrap'}]}>
              {userDetails.aboutMe ? userDetails.aboutMe : 'About'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon name={'icon-address_settings'} fontSize={18} color={'black'}/>
            <Text
              style={[Style.f16, Style.textColorBlack, {marginHorizontal: 10, flex:1, flexWrap:'wrap'}]}>
              {userDetails.location && userDetails.location.city ? userDetails.location.city : 'Location'  }
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {
						userDetails.totalContacts ? this.props.navigator.push({id: 200}) : this.props.navigator.push({id: 220})
					}} style={{
						flexDirection: 'row',
						padding: 10,
						paddingVertical: 25,
						marginBottom: 1,
						marginHorizontal:15,
						justifyContent:'space-between',
						borderWidth: 1,
						borderBottomColor: 'white',
						borderTopColor: '#ececec',
						borderLeftColor: 'white',
						borderRightColor: 'white',
						backgroundColor: 'white',
					}}>
          <View style={{flexDirection:'row'}}>
            <Icon name={'icon-contacts_profile'} fontSize={20} color={'black'}/>
            <Text style={{
							alignSelf: 'center',
							marginLeft: 15,
							fontSize: 18,
							color: '#333',
							fontFamily: Fonts.regFont[Platform.OS]
						}}>
              {userDetails.totalContacts ? userDetails.totalContacts + '  Contacts' : 'Add Contacts' }
            </Text>
          </View>

          <Image
            source={rightArrow}
            style={{alignSelf:'center', marginHorizontal:10}}
            resizeMode={'contain'}
          />

        </TouchableOpacity>
      </View>
    );
  },

  renderContacts() {
    return (
      <TouchableOpacity
        style={[Style.rowWithSpaceBetween, styles.contactRow]}
        onPress={() => {
					this.props.navigator.push({id: 200})
				} }>

        <Text style={[Style.f16, Style.textColorWhite]}>
          {this.state.contactsCount} CONTACTS
        </Text>
        <Image
          source={require('../../res/common/arrow_right.png')}
          style={Style.center}
        />
      </TouchableOpacity>
    );
  },

  coverImageFunction(cv) {
    var options = {
      title: 'Select Your Image', //specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take a Photo', //specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Gallery', //specify null or empty string to remove this button

      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      maxWidth: 100000, // photos only
      maxHeight: 100000, // photos only
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
      quality: 1, // 0 to 1, photos only
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response  ', response);
      console.log('@@@@@@@@@@@@@ProfilePicResp@@@@@@@@@@@', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        let source;

        // You can display the image using either data...
        //source = {uri: 'data:image/jpeg;base64,' + response.data};
        //console.log('@@@@@source b4:   @@', source);
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }

        console.log('@@@@@source image@@', source);

        this.setState({
          profileImage: source.uri
        });
        /* checkServerHealth()
         .then((response) => {
         console.log("Respone: ", response);
         if (!response.ok) {
         Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
         }
         })
         .catch( (err) => {
         Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
         });*/
        //this.setState({profileImage: source});

        uploader(
          [
            {
              name: 'file',
              filename: response.fileName,
              filepath: response.origURL,
              filetype: 'image/jpeg',
            }
          ],
          'http://52.72.219.6:44301/Api/v1/Users/Profile/Picture',
          {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + this.state.token
          },
          'PUT'
        );
        // postDisplayPicture(this.state.token, response.data)
        // .then((responseJson) => {
        // 	console.log('@@@@@@@@UpdateUserProfilePictureResp XXXXXXXXXXXXXX', responseJson);


        // 	return responseJson;
        // })
        // .catch((error) => {
        // 	console.log('networkHandler() -- postDisplayPicture() : ', error);
        // });
      }
    });
  },

  render() {
    let {profileOpen} = this.props;
    return (
      <View style={styles.container}>
        {this.renderExtraSpaceForIOS()}
        {this.renderTitle()}
        {this.userProfile()}
      </View>
    );
  },
});

const styles = StyleSheet.create({
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
});

export default ProfileCard;
