import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
  AsyncStorage,
} from 'react-native';
import Icon from '../stylesheet/icons';
import * as Animatable from 'react-native-animatable';
import {
  getOtherUserProfile,
  addUserRelation,
  acceptUserRelation,
} from '../../lib/networkHandler';
import MenuBar from '../common/MenuBar';
var userDetails = {
  name: 'Ehtisham Rao',
  mobileNumber: "0092323502955",
  title: "Software Engineer",
  aboutMe: "I am the best",
  location: {city: 'Lahore'},
  totalContacts: '190  ',
};
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');
import Communications from 'react-native-communications';
let userImage = require('../../res/common/profile.png');
var contacts = require('../../res/common/cog_settings.png');
var call = require('../../res/common/call.png');
var chat = require('../../res/common/chat.png');
var burgerMenu = require('../../res/common/3bar.png');
var edit = require('../../res/common/edit.png');

export default class OtherUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      otherPersonId: this.props.otherPersonId,
      isRequested: this.props.isRequested,
      info: [],
    }
  }

  componentDidMount() {
    // console.log('@@@@@@@@@@@@@ ###', this.state.otherPersonId);
    AsyncStorage.getItem("UserToken")
      .then((token) => {
        this.setState({token});
        return getOtherUserProfile(token, this.props.publicId);
      })
      .then((res) => {
        if (res === 'Not Found') {
          console.log('@@@@@@@@@@@@ Not Found');
        }
        if (!res.Message && !res.Errors) {
          console.log(res);

          this.setState({
            info: res,
          });
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }

  renderExtraSpaceForIOS() {
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  }

  componentWillUnmount() {
    console.log('@@@@@ unmounting the component');
    if (this.props.routedFrom === 'spFollowers') {

      this.props.onUnmount(this.state.isRequested)
    }
    else if (this.props.routedFrom === 'Suggestions' && this.state.isRequested) {
      this.props.onUnmount();
    }
    else if (this.props.routedFrom === 'receivedRequests' && this.state.isRequested) {
      this.props.onUnmount();
    }

  }

  addFriend() {
    if (this.state.isRequested) {
      return (
        <View style={{flexDirection: 'row',  marginTop: 5}}>
          <View style={Style.activeButton}>
            <Text style={{   fontSize: 15,
                       color:'white',
                       fontFamily: Fonts.regFont[Platform.OS]}}>Pending</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={{flexDirection: 'row',  marginTop: 5}}>
          <TouchableOpacity onPress={() => { this.setState({isRequested:true});
          if(this.props.routedFrom === "receivedRequests") {
            var list =[];
                list.push(this.props.publicId);
            acceptUserRelation(this.state.token, list);
          }
          else {
          addUserRelation(this.state.token,   {
     						    "destinationPublicId": this.props.publicId ,
     						    "relation": "Friend",
     						    "group": "Friend"
     						  });}}
          }
                            style={[styles.buttonWhiteSmall]}>
            <Text style={{   fontSize: 15,
                       color:'black',
                       fontFamily: Fonts.regFont[Platform.OS]}}>Connect</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  callButtonPressed(phone) {
    console.log('Testing Calling Feature');
    let phoneString = phone.toString();
    // this.setState({ callModalOpen: true });
    Communications.phonecall(phoneString, true);
  }

  renderTitle() {
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
  }

  renderCallAndMessage(phone) {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{marginTop: 12, marginHorizontal: 15}}
                          onPress={()=>this.callButtonPressed(phone)}>
          <View style={styles.imageArea}>
            <Icon name={'icon-call_support'} color={'black'} fontSize={18}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 12, marginHorizontal: 15}}
                          onPress={() => {
                            AsyncStorage.setItem('chatwithUserId', this.props.spPublicId);
                            this.props.navigator.push({id: 260, userName: userDetails.publicId})
                          }}>
          <View style={styles.imageArea}>
            <Icon name={'icon-inbox'} color={'black'} fontSize={18}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let {navigator} = this.props;
    let {info} = this.state;
    userDetails = info;
    let image = userDetails.profilePictureURL ? {uri: userDetails.profilePictureURL} : userImage;
    let name = info.name ? info.name : 'Username';
    let type = 'AppUser   ';
    let contactNumber = <Text style={[Style.f16, Style.textColorBlack]}>
      {userDetails.mobileNumber ? userDetails.mobileNumber : 'Contact Number' }
    </Text>;

    //image = info.profileUrl ? {uri: info.profileUrl} : images.profileImage;

    title = info.title ? info.title : 'Not Provided';
    description = info.description ? info.description : 'Not Provided';
    location = info.location ? info.location : 'Not Provided';
    personalUrl = info.personalUrl ? info.personalUrl : 'Not Provided';

    phone = userDetails.mobileNumber ? userDetails.mobileNumber.substring(2, 14) : 'xxxxxxxxxx';
    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/, '$1-$2-$3-');


    return (

      <View style={[styles.minProfileContainer, {backgroundColor: 'white'}]}>
        {this.renderTitle()}
        <View style={{backgroundColor: StyleConstants.primary, height: 140}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 20}}>
          <TouchableOpacity
            style={styles.displayPicContainer}>
            <Image
              source={image}
              style={styles.profilePicture}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {this.props.isFriend && this.renderCallAndMessage(userDetails.mobileNumber) }
          {!this.props.isFriend && this.addFriend() }
        </View>

        <View style={{marginTop:10, marginHorizontal: 25, marginBottom: 5}}>
          <Text style={[Style.textColorBlack, {fontSize: 22, marginBottom:5}]}>
            {userDetails.name ? userDetails.name : 'Name'}
          </Text>
          {this.props.isFriend && contactNumber}
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

        <View style={{
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
          <Icon name={'icon-contacts_profile'} fontSize={20} color={'black'}/>
          <Text style={{
              alignSelf: 'center',
              marginLeft: 15,
              fontSize: 18,
              flex: 1,
              flexWrap: 'wrap',
              color: '#333',
              fontFamily: Fonts.regFont[Platform.OS]
            }}>
            {userDetails.totalContacts ? userDetails.totalContacts + 'Contacts' : 'No Contacts' }
          </Text>
        </View>
      </View>
    )


  }

}

const styles = StyleSheet.create({
  minProfileContainer: {
    //width: width*0.80,
    //paddingVertical: -1,
    // paddingHorizontal: 20,

    //paddingBottom: 0,
  },
  displayPicContainer: {
    zIndex: 2,
    marginTop: -25,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  buttonWhiteSmall: {
    //marginTop: 9,
    height: 30,//height*0.042,
    width: 100,//width*0.22,
    marginHorizontal: 3,
    alignItems: 'center',
    borderRadius: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    //paddingVertical: 10,
    //paddingHorizontal: 10,

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
  }
});
