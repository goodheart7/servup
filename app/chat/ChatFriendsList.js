import React, {
  Component,
} from 'react';

import {
  Navigator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  Platform,
  ListView,
  Image,
  AsyncStorage,
} from 'react-native';

import {
  getPublicIdAgaintUserToken,
  getRelations,
} from '../../lib/networkHandler'

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
var _ = require('lodash');
import Icon from '../stylesheet/icons'
import MenuBar from '../common/MenuBar';
var NavBar = require('../common/NavBar');
const {height, width} = Dimensions.get('window');

var ds;
var ChatFriendsList = React.createClass({

  getInitialState () {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    return {
      contactSource: ds,
      ContactsList: '',
      rowData: [],
    }
  },
  renderSearchPlate(){
    return (
      <View style={styles.inputContainer}>
        <View style={{marginTop:5,flex:1}}>
          <Icon name={'icon-discover'} fontSize={20} color={fontColor}/>
        </View>
        <TextInput
          ref="query"
          autoFocus={true}
          placeholderStyle={[Style.f16, styles.input]}
          placeholderTextColor={StyleConstants.textColorGray}
          placeholder="Search Contacts"
          keyboardType="default"
          value={this.state.query}
          underlineColorAndroid="transparent"
          style={[Style.f16, styles.input]}
          onChangeText={(query) => {
            this.setState({query});

          }}
        />
      </View>
    );
  },
  filterDataSource(text) {
    console.log('@@@@@@', text);
    //var ages = [{"a":32}, {a:33}, {a:16}, {a:40}];
    let sections = this.state.ContactsList;
    const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g,'\\$1');
    console.log('@@@@safe', safe);
    const regex = new RegExp(safe, 'i');
    const filter =  (row) => {

      if( regex.test(row.name) || regex.test(row.mobileNumber)) {
        console.log('@@@@@@@@@@@@@@@@@sdfsa', regex.test(row.name))
        return row;
      }
    };
    //  let y = _.filter([{"a":32,"b":0}],this.checkme);
    //console.log('@@@@@@@@@@YY', y);
    var out = {};
    for(var sectionID in sections){
      if(!sections.hasOwnProperty(sectionID)){
        continue;
      }
      //
      //console.log('@@@@@@@@@sectionID', sectionID);
      //   console.log('@@@@@@@@@sectionData', sections[sectionID]);
      //console.log('@@@@@@@@@arra', sections[sectionID]);
      var x = [];
      x.push(sections[sectionID]);
      out[sectionID] = _.filter(x, filter);
    }
    console.log('out', out);
    return ds.cloneWithRowsAndSections(out);
  },
  componentDidMount() {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({token: value});
      return getPublicIdAgaintUserToken(value);
    })
    .then((value) => {
      console.log('ChatFriendsList.js->componentDidMount() UserID is:' , value);
      this.setState({ UserID: value });
      return getRelations(this.state.token)
    })
    .then((resp) => {

      if (resp.length > 0) {
        this.setState({ contactSource: ds.cloneWithRows(resp), ContactsList:resp });
      }
    })
    .catch((err) => {
      console.log(err);
      Alert.alert(err.errorCode, err.data);
    })
  },

  backFunction () {
    this.props.navigator.pop();
  },

  render () {
    let {navigator} = this.props;

    return(
      <View style = {styles.scrollBox}>

        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Chat Friends List'} // Optional
          leftIcon = {'icon-back_screen_black'}
          // rightIcon = {'icon-menu'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {() => {}} // Optional
        />

        {this.renderRecievedRequest()}

        <NavBar
          navigator = {this.props.navigator}
          profileImage = {this.props.ProfilePicFull}
        />
      </View>
    );
  },

  renderRowRecieved(rowData, sectionID, rowID) {
    console.log('@@@@@@dsh ',rowData);
    // console.log('@@@@@@@@@@@@@@ Public Id Of Other Person',bfe76707bd3f4eb98702a2c664ef5b74);

    // set default profile picture of a user if he/she has no profile image
    if(rowData.profilePictureURL !== null && rowData.profilePictureURL != '' ) {
      personImg = { uri: rowData.profilePictureURL };
    } else {
      personImg = require('../../res/common/profile.png')
    }

    return (
      <TouchableOpacity
        style={Style.listRow}
        onPress={() => {
          AsyncStorage.setItem('chatwithUserId', rowData.publicId);
          this.props.navigator.push({ id: 260, userName: rowData.name })
        }}
      >
          <View style={Style.row}>
            <Image
              style={[Style.userImage, {marginRight: 10}]}
              source = {personImg}
              resizeMode = {'cover'}
            />
            <View style={{
              flexDirection: 'column',
              marginLeft: 15,
              flex: 3
            }}>
              <Text style = {styles.textStyle}>
                  {rowData.name}
              </Text>

              <Text style = {styles.textStyleMini}>
                  {rowData.mobileNumber}
              </Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  },

  renderRecievedRequest() {
    var navigator = this.props.navigator;
    let contactSource= this.filterDataSource(this.state.query);
    return (
      <View style = {styles.scrollBox}>
        <ListView
          enableEmptySections = {true}
          renderHeader={this.renderSearchPlate}
          dataSource = {contactSource}
          renderRow = {this.renderRowRecieved}
          bounces = {false}
        />
      </View>
    );
  },

});

const styles = StyleSheet.create({

  scrollBox: {
    flex:1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  rows: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 6,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 4,
    borderBottomColor: '#ececec',
    borderTopColor: '#ececec',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: 'white',
  },

  contactImage:
  {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
  },

  rightNextToIt: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  textStyle: {

    // width: width*.26,
    alignSelf: 'flex-start',
    fontSize: 18,//width*0.035,
    color: 'black',
    //  flex:0.1,
    flexWrap:'wrap',
    // flex:1,
    //flexWrap:'wrap',
    fontWeight: '400',
    fontFamily: Fonts.regFont[Platform.OS],
    //marginLeft: 10,
    marginBottom: 5,
  },

  textStyleMini: {
    //width: width*.29,
    alignSelf: 'flex-start',
    fontSize: 15,//width*0.03,
    color: '#666666',
    fontFamily: Fonts.regFont[Platform.OS],
    //marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    alignSelf: 'center',
    //borderRadius: 4,
    //borderWidth: 0.75,
    backgroundColor: '#f2f2f2',

    //borderColor: 'gray',
    //marginLeft: 5,
  },

  input: {
    height: 35,
    marginHorizontal:5,
    flex:9,
    //paddingHorizontal: 20,
    paddingVertical: 6,
    fontFamily: Fonts.regFont[Platform.OS],
  },
});

module.exports = ChatFriendsList;
