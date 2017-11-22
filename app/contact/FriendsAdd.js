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
  Alert,
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

import LoadingCardContacts from '../home/LoadingCardContacts';
import Icon from '../stylesheet/icons';


var NavBar = require('../common/NavBar');
var bgWhite = '#FFFFFF';
var ds;
var ds2;
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
      ds, ds2,
      loaded: false,
      selectedInviteList: [],
      inviteContactSource: ds.cloneWithRows([{}]),
      suggestionSource: ds2.cloneWithRows([{}]),
      suggestionList: [],
      inviteAll: false,
      backed: false,
      invite: 'Invite',
      invited: 'Invited',
      color: 'red',
      status: true,
      currentRender: "Invite",
      invitationListResp: '',
      isSuggestionListLoaded: false,
      isInvitationListLoaded: false,
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

        getSuggestionList(value)
          .then((resp) => {
            console.log(" suggestion List Resp", resp);
            this.setState({isSuggestionListLoaded: true});
            if (resp.length > 0) {
              this.setState({
                suggestionSource: ds2.cloneWithRows(resp),
                suggestionList: resp,
                isSuggestionListLoaded: true
              });
            }

          })
          .catch((err) => {
            this.setState({isSuggestionListLoaded: true});
            Alert.alert("Opsss...", "There is Somthing Wrong while loading Your Suggestion List ");
          });

        // AsyncStorage.getItem("ContactsListLocal")
        getInvitationList(value)
          .then((resp) => {
            console.log('@@@@@@@@@ invitationList', resp);
            //if(resp != null) {
            // resp = resp.JSON();
            this.setState({isInvitationListLoaded: true});
            if (resp.length > 0) {
              this.setState({
                inviteContactSource: ds.cloneWithRows(resp),
                invitationListResp: resp,
                isInvitationListLoaded: true
              });
            }
            // }
          })
          .catch((err) => {
            this.setState({isInvitationListLoaded: true});
            Alert.alert("Opsss...", "There is Somthing Wrong while loading Your Invitation List ");
          });

      })
      .catch((err) => {
        Alert.alert("Opsss...", "There is Somthing Wrong ... Reload Your App ");
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

  renderEmptyView() {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: 50}}>
        <Text
          style={{fontSize: 20, justifyContent: 'center', alignSelf: 'center', fontFamily: Fonts.regFont[Platform.OS]}}>
          You have no Data to Display
        </Text>
      </TouchableOpacity>
    );
  },

  inviteView () {
    if (this.state.isInvitationListLoaded) {
      return this.state.invitationListResp.length > 0 ? this.renderInvite() : this.renderEmptyView()
    }
    else {
      return this.animatedLoader()
    }
  },
  suggestionView(){
    if (this.state.isSuggestionListLoaded) {
    return  this.state.suggestionList.length > 0 ? this.renderSuggestion() : this.renderEmptyView()
    } else {
     return this.animatedLoader()
    }
  },

  render() {
    var navigator = this.props.navigator;

    return (
      <View style={ContactsStyle.scrollBox}>
        <MenuBar
          title={'Add Contacts'} // Optional
          leftIcon={'icon-back_screen_black'}
          rightIcon={'icon-friend-request'} // Optional
          onPressLeftIcon={this.backFunction} // Optional
          onPressRightIcon={() => {
						this.props.navigator.push({id: 210})
					}} // Optional
        />
        <ScrollableTabView
          tabBarBackgroundColor={'white'}
          style={{marginVertical:10}}
          tabBarActiveTextColor={StyleConstants.primary}
          tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize: 18, paddingTop: 5}}
          tabBarUnderlineStyle={{backgroundColor: StyleConstants.primary, height: 2.5, marginBottom: 2}}
          renderTabBar={() => <DefaultTabBar />}
        >
          <ScrollView tabLabel='Invite'>
            {this.inviteView()}
          </ScrollView>
          <ScrollView tabLabel='Suggestion'>
            {this.suggestionView()}
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
    this.setState({invite: 'Invited'});
    AsyncStorage.setItem("showContactsLandingScreen", "No");
    this.setState({inviteAll: true});
    inviteFriend(this.state.token, this.state.invitationListResp)
      .then((resp) => {
        console.log(resp)
      })
    let list = this.state.invitationListResp;
    this.setState({inviteContactSource: ds.cloneWithRows(list)});
    this.forceUpdate();
  },

  inviteSingle(contact) {
    AsyncStorage.setItem("showContactsLandingScreen", "No");
    let user = {
      mobileNumber: contact.mobileNumber,
      name: contact.name
    }
    let userList = [];
    userList.push(user);
    inviteFriend(this.state.token, userList)
      .then((resp) => {
        console.log(resp)
      })
  },

  ignoreRelation(contactNumber) {
    console.log('@@@@@@ contactNumber', contactNumber);
    ignoreSuggestionList(this.state.token, contactNumber)
      .then((resp) => {
        console.log(resp)
      })
  },

  addRelation(publicId) {
    AsyncStorage.setItem("showContactsLandingScreen", "No");
    var contact = {
      destinationPublicId: publicId,
      relation: 'Friend',
      group: 'Friend'
    };
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

  renderInviteHeader(){
    return this.renderHeader('Invite to Servup')
  },

  renderSuggestionHeader(){
    return this.renderHeader('Already on Servup')
  },

  renderHeader(heading) {
    let button = <View style={ContactsStyle.buttonParentView}>
      <TouchableOpacity onPress={() => {
				this.inviteAll();
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
          {(heading == 'Invite to Servup'  && this.state.invitationListResp.length > 1) && button}
        </View>
      </View>
    );
  },

  toggleInviteStatus(rowData){
    var newDataSource = this.updateDataSource(this.state.invitationListResp);
    rowData.invitationStatus = 'Invited'
    newDataSource.pop();
    this.setState({inviteContactSource: ds2.cloneWithRows(newDataSource)});
    this.renderInviteButtons(rowData);
  },

  updateDataSource(dataSource){
    var arr = dataSource;
    arr[arr.length] = {
      status: 'updated',
    }
    return arr;
  },

  renderInviteButtons(rowData){
    // console.log('@ @@@@@@@@@@@@ Invite All State', this.state.inviteAll)
    if (this.state.inviteAll) {

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
        <InviteRow inviteAll={this.state.inviteAll} onInvite={()=>{this.inviteSingle(rowData)}}/>
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

  renderRowInvite(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={Style.listRow}>
        <View style={Style.contactsRow}>
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
    console.log('@@@@@@@@@@rowData', rowData);
    let image = rowData.profilePicUrl ? {uri: rowData.profilePicUrl} : defaultImage;
    return (
      <TouchableOpacity style={Style.listRow} onPress={() => this.props.navigator.push({id: 310, publicId:rowData.userPublicId, routedFrom:'Suggestions', onUnmount:()=>{this.updateSuggestionSource(rowID)}})}>
        <View style={Style.contactsRow}>
          <View style={styles.userInfo}>
            <View style={{flex: 1}}>
              <Image
                style={Style.contactsUserImage}
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
            <TouchableOpacity style={[styles.iconCircle, {marginRight: 5}]}
                              onPress={() => {
																this.updateSuggestionSource(rowID);
																this.addRelation(rowData.userPublicId);
															}}>
              <Icon name={'icon-accept'} fontSize={28} color={'black'}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}
                              onPress={() => {
																this.updateSuggestionSource(rowID);
																this.ignoreRelation(rowData.mobileNumber)
															}}>
              <Icon name={'icon-reject'} fontSize={28} color={'black'}/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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

  animatedLoader() {
    return (
      <LoadingCardContacts/>
    );
  },

  renderInvite() {
    let inviteSource = this.state.inviteContactSource;
    // if (inviteSource )
    return (
      <View style={ContactsStyle.scrollBox}>
        <ListView
          renderHeader={this.renderInviteHeader}
          enableEmptySections={true}
          dataSource={inviteSource}
          renderRow={this.renderRowInvite }
          bounces={false}
        />
      </View>
    );

  },

  renderSuggestion() {
    let suggestionSource = this.state.suggestionSource;
    // if (suggestionSource)
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

});

var InviteRow = React.createClass({

  getInitialState() {
    return {
      inviteAll: this.props.inviteAll,
      // status : 'invite',
      singleInvite: false,
      buttonsStyle: ContactsStyle.buttonWhiteSmall,
    }
  },

  render(){
    // console.log('@@@@@@@@@@@@@@@@@@InviteAllllllllllll', this.props.inviteAll);
    var buttonText = (this.state.singleInvite || this.state.inviteAll) ? 'Invited' : 'Invite';
    var backgroundColor = (this.state.singleInvite || this.state.inviteAll) ? {
        backgroundColor: StyleConstants.primary,
        borderColor: StyleConstants.primary
      } : '';
    var textColor = (this.state.singleInvite || this.state.inviteAll) ? {color: 'white'} : '';
    // buttonText = this.state.inviteAll ? 'Invited' : 'Invite';
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
						this.setState({singleInvite: true});
						this.props.onInvite();
					}} style={[ContactsStyle.buttonWhiteSmall, backgroundColor]}>
          <Text style={[ContactsStyle.greyText, textColor]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
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
    //borderWidth: 1,
    //backgroundColor: 'red',
    //borderRadius: 30,
    justifyContent: 'center',
    padding: 3,
    //borderColor: 'black'
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