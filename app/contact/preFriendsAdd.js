import React, {
  Component,
} from 'react';
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
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
  getSuggestionList,
  ignoreSuggestionList,
  getInvitationList,
  addUserRelation,
  inviteFriend,
} from '../../lib/networkHandler';
import MenuBar from '../common/MenuBar';
import {ContactsStyle} from './style.js';

import Icon from '../stylesheet/icons';


var NavBar = require('../common/NavBar');
var ds;
var bgWhite = '#FFFFFF';

var defaultImage = require('../../res/common/profile.png');
var FriendsAdd = React.createClass({

  getInitialState() {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2
      }
    });
    ds2 = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2
      }
    });
    return {
      selectedInviteList: [],
      inviteContactSource: ds,
      suggestionSource: ds2,
      suggestionList: [],
      backed: false,
      color: 'red',
      status: true,
      currentRender: "Invite",
      invitationListResp: '',
      activeButtonStyle: ContactsStyle.topButtonSelectedActive,
      savedButtonStyle: ContactsStyle.topButton,
      activeFont: ContactsStyle.selectedFontStyle,
      savedFont: ContactsStyle.unSelectedFontStyle,
    }
  },

  componentDidMount() {

    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({"token": value});
        console.log('FriendsAdd.js->componentDidMount() token is:' + value);
        return AsyncStorage.getItem("UserID")
      })
      .then((value) => {
        console.log('FriendsAdd.js->componentDidMount() UserID is:' + value);
        this.setState({UserID: value});
        return getSuggestionList(this.state.token);
      })
      .then((resp) => {
        if (resp.length > 0) {
          this.setState({suggestionSource: ds2.cloneWithRows(resp), suggestionList: resp});
        }
        return getInvitationList(this.state.token);
      })
      .then((resp) => {
        // resp = DummyData;
        if (resp.length > 0) {
          this.setState({inviteContactSource: ds.cloneWithRows(resp), invitationListResp: resp});
        }

      })
      .catch((err) => {
        console.log(err);
      })
  },
  backFunction() {
    if (this.state.backed == false) {
      this.state.backed = true;
      setTimeout(() => {
        this.state.backed = false;
      }, 1000);
      this.props.navigator.pop();
    }
  },
  selectButton(selected) {
    this.setState({currentRender: selected});

    if (selected === "Invite")
      this.setState({
        activeButtonStyle: ContactsStyle.topButtonSelectedActive,
        savedButtonStyle: ContactsStyle.topButton,
        activeFont: ContactsStyle.selectedFontStyle,
        savedFont: ContactsStyle.unSelectedFontStyle,
      });
    else
      this.setState({
        activeButtonStyle: ContactsStyle.topButton,
        savedButtonStyle: ContactsStyle.topButtonSelectedSaved,
        activeFont: ContactsStyle.unSelectedFontStyle,
        savedFont: ContactsStyle.selectedFontStyle,
      });
  },

  render() {
    var navigator = this.props.navigator;

    return (
      <View style={ContactsStyle.scrollBox}>
        <MenuBar
          title={'Add Contacts'} // Optional
          leftIcon={'icon-arrow-left2'}
          rightIcon={'icon-add-contacts'} // Optional
          onPressLeftIcon={this.backFunction} // Optional
          onPressRightIcon={() => {
            this.props.navigator.push({id: 210})
          }} // Optional
        />
        <ScrollableTabView
          tabBarBackgroundColor={'white'}
          tabBarActiveTextColor={StyleConstants.primary}
          tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize: 18, paddingTop: 5}}
          tabBarUnderlineStyle={{backgroundColor: StyleConstants.primary, height: 2.5, marginBottom: 2}}
          renderTabBar={() => <DefaultTabBar />}
        >
          <ScrollView tabLabel='Invite'>
            {this.state.currentRender === "Invite" ? this.renderInvite() : this.renderSuggestion()}
          </ScrollView>
          <ScrollView tabLabel='Suggestion'>
            {this.state.currentRender === "Suggestion" ? this.renderInvite() : this.renderSuggestion() }
          </ScrollView>
        </ScrollableTabView>

        <NavBar
          navigator={this.props.navigator}
          profileImage={this.props.ProfilePicFull}
        />
      </View>
    );
  },
  inviteAll(contacts) {
    inviteFriend(this.state.token, contacts)
      .then((resp) => {
        console.log(resp)
      })
  },

  ignoreContact(contact) {
    ignoreSuggestionList(this.state.token, contact)
      .then((resp) => {
        console.log(resp)
      })
  },

  addUserRelation(contact) {
    addUserRelation(this.state.token, contact)
      .then((resp) => {
        console.log(resp)
      })

  },

  updateList() {
    var list = this.state.selectedInviteList;
    list.forEach(function (item, i) {
      item.invitationStatus = 'Invited'
    });
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    newDataSource.pop();
    this.setState({inviteContactSource: ds2.cloneWithRows(newDataSource)});
  },
  renderInviteHeader()
  {
    return this.renderHeader('Invite to Servup')
  },
  renderSuggestionHeader()
  {
    return this.renderHeader('Already on Servup')
  },

  renderHeader(heading) {
    let button = <View style={ContactsStyle.buttonParentView}>
      <TouchableOpacity onPress={() => {
        this.updateList();
        this.inviteAll(this.state.selectedInviteList)
      }} style={[ContactsStyle.buttonWhiteHeader]}>
        <Text style={ContactsStyle.greyText}>Invite All</Text>
      </TouchableOpacity>
    </View>;
    return (
      <View style={ContactsStyle.headerListRow}>
        <View style={Style.rowWithSpaceBetween}>
          <View style={[Style.row, {marginLeft: 15}]}>
            <Text style={[Style.f18, {color: 'black'}]}>{heading}</Text>
          </View>
          {(heading == 'Invite to Servup') && button}
        </View>
      </View>
    );
  },

  isContactSelected(rowData) {
    if (rowData.selected) {
      return ( <View/> );
    }
    else {
      return ( <View /> );
    }
  },

  toggleAddStatus(rowData){
    var newDataSource = this.updateDataSource(this.state.friendSuggestionList);
    rowData.friendshipStatus = 'Added'
    newDataSource.pop();
    this.setState({suggestionContacts: ds2.cloneWithRows(newDataSource)});
    this.renderSuggestionButtons(rowData);
  },

  toggleIgnoreStatus(rowData){
    var newDataSource = this.updateDataSource(this.state.friendSuggestionList);
    rowData.friendshipStatus = 'Ignored'
    newDataSource.pop();
    this.setState({suggestionContacts: ds2.cloneWithRows(newDataSource)});
    this.renderSuggestionButtons(rowData);
  },

  toggleInviteStatus(rowData){
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    rowData.invitationStatus = 'Invited'
    newDataSource.pop();
    this.setState({inviteContactSource: ds2.cloneWithRows(newDataSource)});
    this.renderInviteButtons(rowData);
  },

  renderSuggestionButtons(rowData){
    if (rowData.friendshipStatus == 'Added') {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
          }} style={ContactsStyle.buttonWhiteLarge}>
            <Text style={ContactsStyle.greyText}> Friend Request Sent </Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (rowData.friendshipStatus == 'Ignored') {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
          }} style={ContactsStyle.buttonWhiteLarge}>
            <Text style={ContactsStyle.greyText}> Request Ignored </Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
            this.toggleAddStatus(rowData);
            this.addUserRelation([{destinationPublicId: rowData.userPublicId, relation: 'Friend', group: 'Friend'}])
          }} style={ContactsStyle.buttonBlue}>
            <Text style={ContactsStyle.buttonBlueText}> Add Friend </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.toggleIgnoreStatus(rowData);
            this.ignoreContact(rowData.mobileNumber)
          }} style={ContactsStyle.buttonWhiteSmall}>
            <Text style={ContactsStyle.greyText}>Ignore</Text>
          </TouchableOpacity>
        </View>
      );

    }

  },

  updateDataSource(dataSource){
    var arr = dataSource;
    arr[arr.length] = {
      status: 'updated',
    }
    return arr;
  },

  renderInviteButtons(rowData){
    if (rowData.invitationStatus == 'Invited') {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
          }} style={[ContactsStyle.buttonBlue]}>
            <Text style={ContactsStyle.buttonBlueText}>Invited</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this.toggleInviteStatus(rowData);
              this.inviteAll([{mobileNumber: rowData.mobileNumber, name: rowData.name}])
            }} style={[ContactsStyle.buttonWhiteSmall]}>
            <Text style={ContactsStyle.greyText}>Invite</Text>
          </TouchableOpacity>
        </View>
      );
    }
  },
  updateSuggestionSource(id) {
    let suggestionList = this.state.suggestionList;
    if (suggestionList != null) {
      suggestionList.splice(id, 1);
      this.setState({
        suggestionSource: ds2.cloneWithRows(suggestionList), suggestionList
      });
    }
  },
  checkContactItem(rowData) {
    var inviteList = this.state.selectedInviteList;

    if (rowData.selected) {
      rowData.selected = false;
      var index = inviteList.indexOf(rowData);
      inviteList.splice(index, 1)
    }
    else {
      rowData.selected = true;
      inviteList.push(rowData);
    }
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    newDataSource.pop();
    this.setState({inviteContactSource: ds2.cloneWithRows(newDataSource), selectedInviteList: inviteList});
  },

  renderRowInvite(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={Style.listRow}>
        <View style={[Style.rowWithSpaceBetween]}>
          <View style={styles.inviteRow}>

            <Text style={[ContactsStyle.textStyle, {flex: 1, flexWrap: 'wrap'}]}>
              {rowData.name}
            </Text>
            <Text style={ContactsStyle.textStyleMini}>
              {rowData.mobileNumber}
            </Text>
          </View>
          <View style={[ContactsStyle.buttonParentView, {flex: 1}]}>
            {this.renderInviteButtons(rowData, sectionID, rowID)}
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderRowSuggestion(rowData, sectionID, rowID) {
    let image = rowData.profilePicUrl ? {uri: rowData.profilePicUrl} : defaultImage;
    return (
      <View style={Style.listRow}>
        <View style={[Style.rowWithSpaceBetween]}>
          <View style={styles.userInfo}>
            <View style={{flex: 1}}>
              <Image
                style={[Style.userImage]}
                source={image}
                resizeMode={'cover'}
              />
            </View>
            <View style={{flex: 3}}>
              <Text style={ContactsStyle.textStyle}>
                {rowData.name}
              </Text>
              <Text style={ContactsStyle.textStyleMini}>
                {rowData.mobileNumber}
              </Text>
            </View>
          </View>
          <View style={styles.Buttons}>
            <TouchableOpacity style={[styles.iconCircle, {marginRight: 5}]} onPress={() => {
              this.updateSuggestionSource(rowID)
            }}>
              <Icon name={'icon-check3'} fontSize={35} color={'black'}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Icon name={'icon-cross'} fontSize={35} color={'black'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },

  receivedCount () {
    if (1 > 0) {
      return (
        <View style={styles.notificationBubble}>
          <Text style={styles.notificationTextCount}>{'5'}</Text>
        </View>
      );
    }
  },

  renderInvite() {
    let inviteSource = this.state.inviteContactSource;
    if (inviteSource) {
      return (
        <View style={ContactsStyle.scrollBox}>
          <ListView
            renderHeader={this.renderInviteHeader}
            enableEmptySections={true}
            dataSource={inviteSource}
            renderRow={this.renderRowInvite}
            bounces={false}
          />
        </View>
      );
    }
  },

  renderSuggestion() {
    let suggestionSource = this.state.suggestionSource;
    if (suggestionSource) {
      return (
        <View style={ContactsStyle.scrollBox}>
          <ListView
            key={suggestionSource}
            renderHeader={this.renderSuggestionHeader}
            enableEmptySections={true}
            dataSource={suggestionSource}
            renderRow={this.renderRowSuggestion}
            bounces={false}
          />
        </View>
      );
    }
  }

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
  inviteRow: {
    flexDirection: 'column',
    marginLeft: 15,
    flex: 3
  },
  Buttons: {
    //backgroundColor: 'blue',
    //marginHorizontal: 5,
    //paddingLeft:5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  iconCircle: {
    borderWidth: 1,
    //backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    padding: 3,
    borderColor: 'black'
  },
  container: {
    flex: 1,
    backgroundColor: StyleConstants.lightGray,
  },
  notificationTextCount: {
    color: 'white',
    fontSize: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  circle: {
    backgroundColor: 'white',
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 11,
    margin: 10,
    marginRight: 15,
    alignSelf: 'center',
  },
  circleActive: {
    backgroundColor: StyleConstants.primary,
    margin: 10,
    width: 22,
    height: 22,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'darkslategrey',
    borderRadius: 11,
    alignSelf: 'center',
  },
});

module.exports = FriendsAdd