import React, {
    Component,
} from 'react';
import ProfileCard from '../common/ProfileCard';
import {
    Navigator,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    Image,
    AsyncStorage,
    Switch,
    StatusBar,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
var settings = require('../../res/common/cog_settings.png');
var gifts = require('../../res/common/gift_icon.png');
var rewards = require('../../res/common/reward_settings_icon.png');
var interests = require('../../res/common/interest_settings.png');

let defaultProfileImage = require('../../res/common/add_photo.png');

const {height, width} = Dimensions.get('window');

// var self;
var topMover = Platform.OS === 'ios' ? 10 : -10;


var SideMenu = React.createClass({
    // statics: {
    //     changePic: (pic) => {
    //         self.setState({profileImage: pic});
    //     }
    // },
    handleProfileToggle(toggle) {
      this.setState({ profileCardView: !toggle });
    },

    getInitialState() {
        // self = this;
      return {
        userDetails: '',
        profileImage: null,
      }
    },

/*    componentDidMount() {
      AsyncStorage.getItem("userDetails")
      .then((value) => {
        console.log('@@@@@@@@@@@@@@@Detailsssssss', value);
        if (!value) { value = ''; }
        else { value = JSON.parse(value); }

        this.setState({ "userDetails": value });
      })
      .done();
    },

    giftCard() {
        this.props.navigator.push({id: 80, props: {backScreen: 6 }});
    },*/

    logout() {
        AsyncStorage.setItem("logged", 'no');
        AsyncStorage.setItem("UserToken", '');
        // this.props.disconnectSocket('Please work');
        this.props.navigator.push({id: 1});
    },

    TOS() {
        this.props.navigator.push({id: 4,});
    },

    PP() {
        this.props.navigator.push({id: 4, props: {PP: true}});
    },

    render() {
        let {navigator} = this.props;

        let {...User } = this.state.userDetails;
        name = User.name ? User.name : 'User Name';
        let phone = User.mobileNumber ? User.mobileNumber.substring(2,14): '';
        phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');

        profilePicture =  User.profilePictureURL !== null ?
        { uri: User.profilePictureURL } : defaultProfileImage;


        // console.log(this.state.userDetails);

        return (
            <ScrollView style={[styles.container, {flex:1}]}>
                    <ProfileCard
                      navigator = {this.props.navigator}
                      userName = {User.name ? User.name : 'Name'}
                      phoneNumber = {phone}
                      jobTitle = {User.title ? User.title : 'Title'}
                      Tagline = {User.tagLine ? User.tagLine : 'Tagline'}
                      location = {User.location ? User.location : 'Location'}
                      webSite = {User.personalURL ? User.personalURL : 'Website'}
                      memberStatus = {User.rating ? User.rating : 'Rating'}
                      profileOpen = {this.state.profileCardView}
                      profileToggle = {this.handleProfileToggle}
                  />
                <View>
                    <TouchableOpacity style={styles.rows} onPress = {() => this.props.navigator.push({id: 138})}>

                        <Image
                          style = {styles.imageArea}
                          source = {interests}
                        />
                        <Text style = {styles.textStyle}>
                            Interests
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rows, {borderBottomColor: 'white'}]} onPress = {() => this.props.navigator.push({id: 270})}>
                        <Image
                          style = {styles.imageArea}
                          source = {rewards}
                        />
                        <Text style = {styles.textStyle}>
                            Help
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rows} onPress={()=>this.props.navigator.push({id:1254})}>
                        <Text style = {styles.textStyle2}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rows, {borderBottomColor: 'white'}]} onPress={()=>this.props.navigator.push({id:1254})}>
                        <Text style = {styles.textStyle2}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rows} onPress = {this.logout}>
                        <Text style = {[styles.textStyle2, {color: 'red'}]}>
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({

    container: {
    //  height: height,
      //width:width/3,
      flex:1,
    },

    blueBox: {
        backgroundColor: StyleConstants.primary,
         paddingTop: 10,
         paddingBottom: 20,
         paddingHorizontal: 20,
    },

    displayPicContainer: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#FFFFFF',
        //marginLeft:130,
        alignSelf:'center',
        marginTop:10,
        //zIndex:2,
        backgroundColor:'#DDDDDD',
        marginBottom: 5,
    },

    profilePicture: {
        alignSelf: 'center',
        // justifyContent: 'center',
        width: 55,
        height: 55,
        borderRadius: 30,
        borderWidth: 0,
    },

    title: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '400',
        fontFamily: Fonts.regFont[Platform.OS],
    },

    subheading: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#ddd',
        fontFamily: Fonts.lhtFont[Platform.OS],
    },

    cols:
    {

    },

    rows:
    {
        flexDirection: 'row',
        padding: 10,
        paddingVertical: 15,
        marginBottom: 1,
        borderWidth: 1,
        borderBottomColor: 'white',
        borderTopColor: '#ececec',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        backgroundColor: 'white',
    },

    imageArea:
    {
        alignSelf: 'flex-start',
    },

    textStyle:
    {
        alignSelf: 'center',
        marginLeft: 15,
        fontSize: 18,
        color: '#333',
        fontFamily: Fonts.regFont[Platform.OS],
    },

    textStyle2:
    {
        alignSelf: 'center',
        // marginLeft: 10,
        fontSize: 18,
        color: '#333',
        fontFamily: Fonts.regFont[Platform.OS],
    },

    greyArea:
    {
        backgroundColor: '#ececec',
        padding: 0,
    },

    whiteArea:
    {
        backgroundColor: 'white',
        padding: height,
    },

    redTextStyle:
    {
        alignSelf: 'center',
        marginLeft: 10,
        fontSize: 14,
        color: 'red',
        fontFamily: Fonts.regFont[Platform.OS],
    },
});

module.exports = SideMenu
