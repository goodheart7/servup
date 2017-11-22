/**
 * Created by Shoaib on 1/24/2017.
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
import Swiper from 'react-native-swiper';
import {
  getRelations,
} from '../../lib/networkHandler';
import Icon from '../stylesheet/icons';
import MenuBar from '../common/MenuBar';
var defaultImage = require('../../res/common/profile.png');
import {ContactsStyle} from '../contact/style.js';
const {height, width} = Dimensions.get('window');
var NavBar = require('../common/NavBar');
var ds2;
var ds;
var bgWhite = '#FFFFFF';

let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'check': require('../../res/common/check.png'),
  'defaultProfileImage': require('../../res/common/profile.png'),
  'empty': require('../../res/common/emptyPixel.png'),
};
var arrow_right = require('../../res/common/arrow_right.png');

var SelectedUsers = React.createClass({

  getInitialState() {
    ds2 = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2
      }
    });
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2
      }
    });
    return {
      selectedUserList: [],
      inviteContactSource: ds,
      friendSuggestionList: '',
      backed: false,
      deletedRowId:'',
      status: true,
      invitationListResp:  this.props.selectedUsers,
    }
  },

  componentDidMount() {
    console.log('@@@@@@@@@@@this.props', this.state.invitationListResp);
    this.setState({
      inviteContactSource: ds.cloneWithRows(this.state.invitationListResp),
    });

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
  onPressSubmit() {
    this.props.onSubmit(this.state.selectedUserList);
    this.props.navigator.pop();
  },
  renderHeader(){
    return (
      <MenuBar
        // color = {'red'} // Optional By Default 'black'
        title={"Selected Members"} // Optional
        leftIcon={'icon-arrow-left2'}
        rightIcon={'icon-done2'}// Optional
        onPressLeftIcon={() => this.props.navigator.pop()} // Optional
        onPressRightIcon={this.onPressSubmit} // Optional
      />
    );
  },

  render() {
    var {navigator} = this.props;
    return (
      <View style={ContactsStyle.scrollBox}>
        {this.renderHeader()}
        {this.renderInvite()}
        <NavBar
          navigator={this.props.navigator}
          profileImage={this.props.ProfilePicFull}
        />
      </View>
    );
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
  AddObjectToSelectedList(obj, state) {
    console.log('@@@@@@@@@ state in addobject function', state);
    let list = this.state.selectedUserList;
    if (state) {
      list.push(obj);
    }
    else {
      list = list.filter((object) => {
        return object != obj;
      })
      this.setState({selectedUserList: list});
    }
    console.log('@@@@@@@@@@@@@@@@ selected list', this.state.selectedUserList);
  },
  renderSelectedMembers(selectedUsers) {
    return selectedUsers.map((User, key) => {
      return (
        <View style={{height: 80}} key={key}>
          <Image
            style={styles.userImage}
            source={images.defaultProfileImage}
            resizeMode={'cover'}
          />
          <Text style={{color: 'black', fontSize: 14, justifyContent: 'center', alignSelf: 'center'}}>
            {User.name}
          </Text>
        </View>
      )
    });
  },
  renderInviteHeader(selectedMembers) {
    return (
      <View style={[ContactsStyle.headerListRow, {alignItems: 'flex-start'}]}>
        <Text style={ContactsStyle.greyText}>
          Selected Members
        </Text>
        <View style={Style.rowWithSpaceBetween}>
          <View style={[Style.row, {flexWrap: 'wrap', marginHorizontal: 5}]}>
            {this.renderSelectedMembers(this.state.selectedInviteList)}
          </View>
        </View>
      </View>
    );
  },

  isContactSelected(rowData) {
    if (rowData.selected) {
      return ( <View style={styles.circleActive}/> );
    }
    else {
      return ( <View style={styles.circle}/> );
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
    console.log('@@@@@@@@ @@ rowData', rowData);

      if(rowData.publicId != this.state.deletedRowId) {
        return ( <SingleRow {...rowData} onPressCross={()=>{
          let list = this.state.invitationListResp;
          list = list.filter((x)=> {return x.public != rowData.publicId})
          list = list ? list :[];
          this.setState({invitationListResp:list, inviteContactSource: ds.cloneWithRows(list), deletedRowId:rowData.publicId});
          this.forceUpdate();
        }}/>);
      }
      else {
        return(<View/>);
      }


    let image = rowData.profilePicUrl ? {uri: rowData.profilePicUrl} : defaultImage;
    return (
      <TouchableOpacity style={[Style.listRow]}>
        <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 10}]}>
          <View style={styles.userInfo}>
            <View style={{flex: 1}}>
              <Image
                style={[styles.userImage]}
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
        </View>
      </TouchableOpacity>
    );
  },

  renderInvite() {
    var navigator = this.props.navigator;
    return (
      <View style={ContactsStyle.scrollBox}>
        <View style={ContactsStyle.cols}>

          {this.renderListView(this.state.invitationListResp, 'Invite')}
        </View>
      </View>
    );
  },

  renderListView(list, type) {
    var list = list;
    if (list.length > 0 && type === 'Invite') {
      return (
        <ListView
          enableEmptySections={true}
          dataSource={this.state.inviteContactSource}
          renderRow={this.renderRowInvite}
          bounces={false}
        />
      );
    }
  },


});

var SingleRow = React.createClass({
  getInitialState(){
    return {
      selectedInviteList: [],
      friendSuggestionList: '',
      backed: false,
      rowPress: false,
      swiperHeight: 100,
      status: true,
      invitationListResp: '',
    }
  },

  render() {
    let swiperHeight = this.state.swiperHeight;
    let rowData = this.props;
    let rowColor = this.state.rowPress ? {backgroundColor: '#ffedcc'} : {backgroundColor: 'white'};
    let image = rowData.profilePicUrl ? {uri: rowData.profilePicUrl} : defaultImage;
    console.log('@@@@@@@@@ state in Feeding', this.state.rowPress);
    return (
      <TouchableOpacity style={[Style.listRow]}>
        <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 10}]}>
          <View style={styles.userInfo}>
            <View style={{flex: 1}}>
              <Image
                style={[styles.userImage]}
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
            <TouchableOpacity style={styles.iconCircle}
                              onPress={() => {
                                this.props.onPressCross();
                                console.log('@@@@@@@ buttonPressed');
                              }}>
              <Icon name={'icon-cross'} fontSize={35} color={'black'}/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
});
const styles = StyleSheet.create({
  swiperContainer: {
    height: height / 2.8,
    backgroundColor: 'orange',
  },
  container: {
    //marginVertical: 3,
    backgroundColor: '#FFFFFF',
    borderColor: '#F2F1EF',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  notificationBubble: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: -25,
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#fd2929',
  },
  iconCircle: {
    borderWidth: 1,
    //backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    padding: 3,
    borderColor: 'black'
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
    alignSelf: 'center',
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 25,
    //  width: 40,
    //height: 40,
    //borderWidth: 0.5,
    //borderRadius: 30,
    // borderColor: 'black',
    // marginVertical:10,
    //marginHorizontal:5,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },

  circleActive: {
    backgroundColor: StyleConstants.primary,
    margin: 10,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: 'darkslategrey',
    borderRadius: 11,
    alignSelf: 'center',
  },
});

export default SelectedUsers;
