import React, {
  Component,
} from 'react';
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import Icon from '../stylesheet/icons';
import MenuBar from '../common/MenuBar';
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
  getFriendRequests,
  cancelSentRequest,
  acceptUserRelation,
  rejectUserRelation,
  getInviteList,
  inviteFriend,
  getSentFriendRequests,
} from '../../lib/networkHandler';
var defaultImage = require('../../res/common/profile.png');
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';


import {ContactsStyle} from './style.js';


const {height, width} = Dimensions.get('window');
var TitleBar = require('../common/TitleBar');
var NavBar = require('../common/NavBar');

var ds;
var ds2;

var FriendsRequests = React.createClass(
  {
    getInitialState() {
      ds = new ListView.DataSource({
        rowHasChanged: (oldRow, newRow) => {
        }
      });
      ds2 = new ListView.DataSource({
        rowHasChanged: (oldRow, newRow) => {
        }
      });
      ds3 = new ListView.DataSource({
        rowHasChanged: (oldRow, newRow) => {
        }
      });
      return {
        receivedSource: ds,
        sentSource: ds2,
        inviteSource: ds3,
        sentRequestList: [],
        backed: false,
        currentRender: "Received",
        receivedRequestList: [],
        inviteList: '',
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
          console.log('FriendsRequests->componentDidMount() token is:' + value);
          return AsyncStorage.getItem("UserID")
        })
        .then((value) => {
          console.log('FriendsRequests->componentDidMount() UserID is:' + value);
          this.setState({UserID: value});
          return getFriendRequests(this.state.token);
        })
        .then((resp) => {
          // resp = DummyData;
          this.setState({receivedSource: ds.cloneWithRows(resp), receivedRequestList: resp});
          return getInviteList(this.state.token);
        })
        .then((resp) => {
          //  resp = DummyData;
          if (resp.length > 0) {

            this.setState({inviteSource: ds2.cloneWithRows(resp), inviteList: resp});

          }
          return getSentFriendRequests(this.state.token);
        })
        .then((resp) => {
          // resp = DummyData;
          if (resp.length > 0) {
            this.setState({sentSource: ds2.cloneWithRows(resp), sentRequestList: resp});
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
    updateDataSource(id, type) {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', id);
      if(type == 'received') {
        let receivedRequestList= this.state.receivedRequestList;
        if (receivedRequestList!= null) {
          receivedRequestList.splice(id, 1);
          this.setState({
            receivedSource: ds.cloneWithRows(receivedRequestList), receivedRequestList
          });
        }
      }
      else {
        let sentRequestList= this.state.sentRequestList;
        console.log('@@@@@ sent Req List', sentRequestList);
        if (sentRequestList!= null) {
          sentRequestList.splice(id, 1);
          this.setState({
            sentSource: ds2.cloneWithRows(sentRequestList), sentRequestList
          });
        }
      }

    },
    acceptUserRelationFunc(publicId) {
      AsyncStorage.setItem("showContactsLandingScreen", "No");
      /* AsyncStorage.getItem("servupContactBook")
       .then((value) => {
       var list = JSON.parse(value);
       console.log('@@@@@@@@@@@@@@@@@@@@@@@ LIST', list)
       list = list.concat(publicId);
       console.log('@@@@@@@@@@@@@@@@@@@@@@@ Updated LIST', list)
       AsyncStorage.setItem("servupContactBook", JSON.stringify(list))
       AsyncStorage.setItem("servupContactCount", JSON.stringify(list.length))
       })
       .catch((err) => {
       console.log(err);
       })*/

    var list =[];
    list.push(publicId);
      acceptUserRelation(this.state.token, list)
        .then((resp) => {
          console.log(resp)
        })

    },
    renderEmptyView() {
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: 50}}>
          <Text style={{fontSize: 20,   justifyContent: 'center', alignSelf: 'center',  fontFamily: Fonts.regFont[Platform.OS]}}>
            You have no Data to Display
          </Text>
        </TouchableOpacity>
      );
    },
    rejectUserRelationFunc(publicId) {
      rejectUserRelation(this.state.token, publicId)
        .then((resp) => {
          console.log(resp)
        })
    },

    cancelSentRequest(publicId) {
      cancelSentRequest(this.state.token, publicId)
        .then((resp) => {
          console.log(resp)
        })
    },

    reinviteFriend(contactObj) {
      AsyncStorage.setItem("showContactsLandingScreen", "No");
      inviteFriend(this.state.token, contactObj)
        .then((resp) => {
          console.log(resp)
        })
    },

    renderReceivedHeader(){
      return this.renderHeader('Accept Request to Connect')
    },

    renderSentHeader(){
      return this.renderHeader('Connection Request by You')
    },

    renderHeader(heading) {
      return (
        <View style={ContactsStyle.headerListRow}>
          <View style={Style.rowWithSpaceBetween}>
            <View style={[Style.row, {marginLeft: 15}]}>
              <Text style={[Style.f18, {color: 'black'}]}>{heading}</Text>
            </View>
          </View>
        </View>
      );
    },

    renderRowReceived(rowData, sectionID, rowID) {
      let image = rowData.profilePicUrl ? {uri: rowData.profilePicUrl} : defaultImage;
      return (
        <TouchableOpacity style={Style.listRow} onPress={()=>{this.props.navigator.push({id:310, publicId:rowData.publicId, routedFrom:'receivedRequests', onUnmount:()=>{this.updateDataSource(rowID, 'received')}})}}>
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
                                  this.updateDataSource(rowID, 'received');
                                  this.acceptUserRelationFunc(rowData.publicId);
                                }}>
                <Icon name={'icon-accept'} fontSize={28} color={'black'}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}
                                onPress={() => {
                                  this.updateDataSource(rowID, 'received');
                                  this.rejectUserRelationFunc(rowData.publicId);
                                }}>
                <Icon name={'icon-reject'} fontSize={28} color={'black'}/>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },

    renderRowSent(rowData, sectionID, rowID) {
      console.log('@@@@@@@@ rowDataSent', rowData);
      return (
        <SingleRow type={"Sent"} rowID={rowID} updateDataSource={(rowID)=>this.updateDataSource(rowID, 'sent')} cancelRequest={(id)=>this.cancelSentRequest(id)} {...rowData} navigator={this.props.navigator}/>
      );
    },

    renderReceivedButton(rowData)  {
      if (rowData.status == 'Added') {
        return (

          <TouchableOpacity onPress={() => {
          }} style={{flexDirection: 'row'}}>
            <View>
              <Text style={ContactsStyle.stateGreyText}> Friend Added</Text>
            </View>
            <View style={ContactsStyle.buttonWhiteSmall}>
              <Text style={ContactsStyle.greyText}>Friends</Text>
            </View>
          </TouchableOpacity>
        );
      }
      else if (rowData.status == 'Canceled' && rowData.status != 'Added') {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
            }} style={ContactsStyle.buttonWhiteSmall}>
              <Text style={ContactsStyle.greyText}>Canceled</Text>
            </TouchableOpacity>
          </View>
        );
      }
      else {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
              this.onPress(rowData, 'Confirm');
              this.acceptUserRelation([{
                publicId: rowData.publicId,
                mobileNumber: rowData.mobileNumber,
                coverPictureURL: rowData.coverPictureURL,
                name: rowData.name,
                relation: rowData.relation,
                group: rowData.group
              }])
            }} style={ContactsStyle.buttonBlue}>
              <Text style={ContactsStyle.buttonBlueText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.onPress(rowData, 'cancelRecievedRequest');
              this.rejectUserRelation([{publicId: rowData.publicId}])
            }} style={ContactsStyle.buttonWhiteSmall}>
              <Text style={ContactsStyle.greyText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        );
      }
    },

    renderReinviteButton(rowData)  {
      if (rowData.status == 'Reinvited') {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
            }} style={styles.buttonChanged}>
              <Text style={ContactsStyle.stateGreyText}>Reinvited</Text>
            </TouchableOpacity>
          </View>
        );
      }
      else {
        return (
          <View style={Style.rowWithSpaceBetween}>
            <View style={Style.row}>
              <Text style={ContactsStyle.greyText}>Invitation Sent</Text>
            </View>
            <View style={ContactsStyle.buttonParentView}>
              <TouchableOpacity onPress={() => {
                this.onPress(rowData, 'Reinvite');
                this.reinviteFriend([{mobileNumber: rowData.mobileNumber, name: rowData.name}])
              }} style={ContactsStyle.buttonWhiteSmall}>
                <Text style={ContactsStyle.greyText}>Reinvite</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    },

    onPress(rowData, type)  {
      if (type === 'cancelSentRequest') {
        console.log('@@@@ sent list', this.state.sentRequestList);
        var newDataSource = this.updateDataSource(this.state.sentRequestList);
        rowData.status = 'Canceled'
        newDataSource.pop();
       // this.setState({sentSource: ds2.cloneWithRows(newDataSource)});
        this.forceUpdate();
      }
      else if (type == 'cancelRecievedRequest') {
        var newDataSource = this.updateDataSource(this.state.recievedRequestList);
        rowData.status = 'Canceled'
        newDataSource.pop();
        this.setState({receivedSource: ds2.cloneWithRows(newDataSource)});
        this.forceUpdate();
      }
      else if (type == 'Reinvite') {
        var newDataSource = this.updateDataSource(this.state.inviteList);
        rowData.status = 'Reinvited'
        newDataSource.pop();
        this.setState({inviteSource: ds2.cloneWithRows(newDataSource)});
        this.forceUpdate();
      }
      else if (type == 'Confirm') {
        var newDataSource = this.updateDataSource(this.state.recievedRequestList);
        rowData.status = 'Added';
        newDataSource.pop();
        this.setState({receivedSource: ds2.cloneWithRows(newDataSource)});
        this.forceUpdate();
      }
    },
    updateList(list, type){
      list.forEach(function (item, i) {
        if ((type === 'ignoreAll' || type === 'cancelAll') && (item.status != 'Added')) {
          item.status = 'Canceled'
        }
        else if (type === 'confirmAll' && item.status != 'Canceled') {
          item.status = 'Added'
        }
      });

      var newDataSource = (type == 'cancelAll') ? this.updateDataSource(this.state.sentRequestList) : this.updateDataSource(this.state.recievedRequestList);
      newDataSource.pop();
      if (type === 'cancelAll') {
        this.setState({sentSource: ds2.cloneWithRows(newDataSource)});
      }
      else {
        this.setState({receivedSource: ds2.cloneWithRows(newDataSource)});
      }
      this.forceUpdate();

    },
    renderRowInvite(rowData, sectionID, rowID) {
      return (
          <SingleRow type={'Invite'} {...rowData} navigator={this.props.navigator}/>

      );
    },
    renderEmptyList() {
      return (
        <View style={ContactsStyle.topGreyLine}/>
      );
    },
    renderSentFooter() {
      return (
        <View>
          {this.renderHeader('Invited by You')}

          <View>
            <ListView
              enableEmptySections={true}
              dataSource={this.state.inviteSource}
              renderRow={this.renderRowInvite}
              bounces={false}
            />
          </View>
        </View>
      );
    },
    renderRecievedRequest() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <View style={ContactsStyle.cols}>
            <ListView
              renderHeader={this.renderReceivedHeader}
              enableEmptySections={true}
              dataSource={this.state.receivedSource}
              renderRow={this.renderRowReceived}
              bounces={false}
            />
          </View>
        </View>
      );
    },
    renderSentListView() {
      var inviteList = this.state.inviteList;
      var sentList = this.state.sentRequestList;


      if (inviteList.length > 0 && sentList.length > 0) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Rendering this view 1");
        return (
          <ListView
            renderHeader={this.renderSentHeader}
            enableEmptySections={true}
            dataSource={this.state.sentSource}
            renderRow={this.renderRowSent}
            bounces={false}
            renderFooter={this.renderSentFooter}
          />
        );
      }
      else if (inviteList.length > 0 && sentList.length <= 0) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Rendering this view 2");
        return (
          <View>
            <View style={ContactsStyle.topGreyLine}/>
            {this.renderHeader('Invited by You')}
            <ListView
              enableEmptySections={true}
              dataSource={this.state.inviteSource}
              renderRow={this.renderRowInvite}
              bounces={false}
            />
          </View>
        );
      }
      else if (inviteList.length <= 0 && sentList.length > 0) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Rendering this view 3");
        return (
          <ListView
            renderHeader={this.renderSentHeader}
            enableEmptySections={true}
            dataSource={this.state.sentSource}
            renderRow={this.renderRowSent}
            bounces={false}
          />

        );
      }
    },
    renderSentRequest() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <View style={ContactsStyle.cols}>
            {this.renderSentListView()}
          </View>
        </View>
      );
    },

    render() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <MenuBar
            title={"Friends Requests"} // Optional
            leftIcon={'icon-back_screen_black'}
            //rightIcon = {'icon-add-contacts'} // Optional
            onPressLeftIcon={()=>this.props.navigator.pop()} // Optional
            //onPressRightIcon = {() => {this.props.navigator.push({ id: 210 })}} // Optional
          />
          <ScrollableTabView
            tabBarBackgroundColor={'white'}
            style={{marginVertical:10}}
            tabBarActiveTextColor={StyleConstants.primary}
            tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize: 18, paddingTop: 5}}
            tabBarUnderlineStyle={{backgroundColor: StyleConstants.primary, height: 2.5, marginBottom: 2}}
            renderTabBar={() => <DefaultTabBar />}
          >
            <ScrollView tabLabel='Received'>
              {this.state.receivedRequestList.length ? this.renderRecievedRequest() : this.renderEmptyView()}
            </ScrollView>
            <ScrollView tabLabel='Sent'>
              {(this.state.sentRequestList.length || this.state.inviteList.length) ?  this.renderSentRequest() : this.renderEmptyView()}
            </ScrollView>
          </ScrollableTabView>

          <NavBar
            navigator={this.props.navigator}
            profileImage={this.props.ProfilePicFull}
          />
        </View>
      );
    },

  });
var SingleRow = React.createClass({

  getInitialState() {
    return {
      //inviteAll: this.props.inviteAll,
      // status : 'invite',
      singleInvite:false,
      buttonsStyle:ContactsStyle.buttonWhiteSmall,
    }
  },

  render() {
    var buttonText = this.state.singleInvite ? 'Reinvited' : 'Reinvite';
    if(this.props.type == 'Sent') {
      return (
        <TouchableOpacity style={Style.listRow} onPress={()=>{this.props.navigator.push({id:310, isRequested:true, publicId:this.props.publicId})}}>
          <View style={Style.contactsRow}>
            <Image
              style={Style.contactsUserImage}
              source={this.props.profilePictureURL ? {uri: this.props.profilePictureURL} : require('../../res/common/profile.png')  }
              resizeMode={'cover'}
            />
            <View style={styles.inviteRow}>

              <Text style={[ContactsStyle.textStyle, {flex: 1, flexWrap: 'wrap'}]}>
                {this.props.name}
              </Text>
              <Text style={ContactsStyle.textStyleMini}>
                {this.props.mobileNumber}
              </Text>
            </View>
            <View style={{    flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'}}>
            <TouchableOpacity style={styles.iconCircle}
                              onPress={() => {
                                this.props.cancelRequest(this.props.publicId);
                                this.props.updateDataSource(this.props.rowID);
                                console.log('@@@@@@@ buttonPressed');
                              }}>
              <Icon name={'icon-reject'} fontSize={28} color={'black'}/>
            </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity style={Style.listRow}>
          <View style={Style.contactsRow}>

            <View style={styles.inviteRow}>

              <Text style={[ContactsStyle.textStyle, {flex: 1, flexWrap: 'wrap'}]}>
                {this.props.name}
              </Text>
              <Text style={ContactsStyle.textStyleMini}>
                {this.props.mobileNumber}
              </Text>
            </View>
            <View style={[ContactsStyle.buttonParentView, {flex: 1}]}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({singleInvite:true});
                  }} style={[ContactsStyle.buttonWhiteSmall]}>
                  <Text style={ContactsStyle.greyText}>{buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    // buttonText = this.state.inviteAll ? 'Invited' : 'Invite';

  }
});
const styles = StyleSheet.create({

  buttonChanged: {
    marginLeft: width * 0.30,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  sentInvite: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sentInvitesText: {
    fontSize: 14,
    alignSelf: 'flex-start',
    justifyContent: 'center',
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
   // borderRadius: 30,
    justifyContent: 'center',
    padding: 3,
   // borderColor: 'black'
  },

});

module.exports = FriendsRequests