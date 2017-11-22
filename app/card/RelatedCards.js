/**
 * Created by Shoaib on 12/20/2016.
 */
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
  Dimensions,
  Platform,
  ListView,
  Image,
  AsyncStorage,
  Switch,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import {
  getRelations,
} from '../../lib/networkHandler';

import { ContactsStyle } from '../contact/style.js';


const {height, width} = Dimensions.get('window');
var NavBar = require('../common/NavBar');
var ds2;
var ds;
var bgWhite = '#FFFFFF';
let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'check': require('../../res/common/check.png'),
  'defaultProfileImage' : require('../../res/common/profile.png'),
  'empty': require('../../res/common/emptyPixel.png'),
};
var arrow_right = require('../../res/common/arrow_right.png');

var RelatedCards = React.createClass({

  getInitialState() {
    ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2 ) => { r1 !== r2 } });
    ds = new ListView.DataSource({ rowHasChanged: (r1, r2 ) => { r1 !== r2 } });
    return {
      selectedInviteList: [],
      inviteContactSource: ds,
      friendSuggestionList:'',
      backed:  false,
      status: true,
      invitationListResp: '',
    }
  },

  componentDidMount() {
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({"token": value});
        console.log('chooseMembers.js->componentDidMount() token is:' + value);
        return getRelations(this.state.token);
      })
      .then((resp) => {
        if (resp.length > 0) {
          this.setState({ inviteContactSource: ds.cloneWithRows(resp), invitationListResp: resp });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  },

  backFunction() {
    if (this.state.backed == false) {
      this.state.backed = true;
      setTimeout(()=>{this.state.backed = false;}, 1000);
      this.props.navigator.pop();
    }
  },
  onPressSubmit() {
    console.log('@@@@@@@@@@@@Invite List', this.state.selectedInviteList);
    AsyncStorage.setItem('selectedUsers',JSON.stringify(this.state.selectedInviteList));
  },
  renderHeader(){
    return(
      <TitleBar
        leftButton = {require('../../res/common/back.png')}
        title = "Choose Members"
        rightButton2 = {require('../../res/common/check.png')}
        onLeftButtonPress={this.backFunction}
        onRightButton2Press = {this.onPressSubmit}
      />
    );
  },

  render() {
    var {navigator} = this.props;
    return(
      <View style = {ContactsStyle.scrollBox}>
        {this.renderHeader()}
        {this.renderInvite()}
        <NavBar
          navigator = {this.props.navigator}
          profileImage = {this.props.ProfilePicFull}
        />
      </View>
    );
  },

  updateList() {
    var list =this.state.selectedInviteList;
    list.forEach(function(item,i){
      item.invitationStatus = 'Invited'
    });
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    newDataSource.pop();
    this.setState({ inviteContactSource: ds2.cloneWithRows(newDataSource)});
  },

  renderSelectedMembers(selectedUsers) {
    return selectedUsers.map((User,key)=>{
      return(
        <View style={{height:80}} key = {key}>
          <Image
            style = {styles.userImage}
            source = {images.defaultProfileImage}
            resizeMode = {'cover'}
          />
          <Text style={{color:'black',fontSize:14, justifyContent:'center',alignSelf:'center'}}>
            {User.name}
          </Text>
        </View>
      )
    });
  },
  renderInviteHeader(selectedMembers) {
    return (
      <View style = {[ContactsStyle.headerListRow,{alignItems:'flex-start'}]}>
        <Text style = {ContactsStyle.greyText}>
          Selected Members
        </Text>
        <View style={Style.rowWithSpaceBetween}>
          <View style = {[Style.row,{ flexWrap: 'wrap', marginHorizontal:5}]}>
            {this.renderSelectedMembers(this.state.selectedInviteList)}
          </View>
        </View>
      </View>
    );
  },

  isContactSelected(rowData) {
    if (rowData.selected) {
      return( <View style={styles.circleActive} /> );
    }
    else {
      return( <View style={styles.circle} /> );
    }
  },

  updateDataSource(dataSource){
    var arr = dataSource;
    arr[arr.length] = {
      status: 'updated',
    }
    return arr;
  },

  checkContactItem(rowData) {
    var inviteList=this.state.selectedInviteList;

    if (rowData.selected) {
      rowData.selected = false;
      var index=inviteList.indexOf(rowData);
      inviteList.splice(index,1)
    }
    else {
      rowData.selected = true;
      inviteList.push(rowData);
    }
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    newDataSource.pop();
    this.setState({ inviteContactSource: ds2.cloneWithRows(newDataSource), selectedInviteList: inviteList});

  },

  renderRowInvite(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={ () => {this.checkContactItem(rowData)}} style={Style.listRow}>
        <View style = {Style.row}>
          {this.isContactSelected(rowData)}
          <Image
            style = {[ContactsStyle.userImage, {marginRight: 10}]}
            source = {(rowData.profilePicUrl == null) ?
              require('../../res/common/profile.png') :
              { url: rowData.profilePicUrl } }
            resizeMode = {'cover'}
          />
          <View >
            <Text style = {ContactsStyle.textStyle}>
              {rowData.name}
            </Text>
            <Text style = {ContactsStyle.textStyleMini}>
              {rowData.mobileNumber}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderInvite() {
    var navigator = this.props.navigator;
    return (
      <View style = {ContactsStyle.scrollBox}>
        <View style = {ContactsStyle.cols}>

          {this.renderListView(this.state.invitationListResp, 'Invite')}
        </View>
      </View>
    );
  },

  renderListView(list, type) {
    var list = list
    if (list.length > 0 && type === 'Invite') {
      return (
        <ListView
          renderHeader = {this.renderInviteHeader}
          enableEmptySections = {true}
          dataSource = {this.state.inviteContactSource}
          renderRow = {this.renderRowInvite}
          bounces = {false}
        />
      );
    }
  },



});

const styles = StyleSheet.create({
  notificationBubble: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: -25,
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#fd2929',
  },

  notificationTextCount: {
    color: 'white',
    fontSize: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  circle:
    {
      backgroundColor: 'white',
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: 'lightgrey',
      borderRadius: 11,
      margin : 10,
      alignSelf: 'center',
    },
  userImage:
    {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: 'black',
      marginVertical:10,
      marginHorizontal:5,
      alignItems: 'center',
      justifyContent: 'center',
    },

  circleActive:
    {
      backgroundColor: StyleConstants.primary,
      margin : 10,
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: 'darkslategrey',
      borderRadius: 11,
      alignSelf: 'center',
    },
});

export default RelatedCards;
