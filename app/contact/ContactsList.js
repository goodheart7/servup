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
  TextInput,
  View,
  Modal,
  Dimensions,
  Platform,
  ListView,
  Image,
  AsyncStorage,
  Switch,
} from 'react-native';


import {
  getRelations,
  unfriendRelation,
  blockUserRelation
} from '../../lib/networkHandler'

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import {ContactsStyle} from './style.js';
import Icon from '../stylesheet/icons'
import LoadingCard from '../home/LoadingCard';
const {height, width} = Dimensions.get('window');
var TitleBar = require('../common/TitleBar');
var NavBar = require('../common/NavBar');
import MenuBar from '../common/MenuBar';
var ds;
var _ = require('lodash');
var arrow_right = require('../../res/common/arrow_right.png');
var defaultProfileImage = require('../../res/common/profile.png');
const dismissKeyboard = require('dismissKeyboard');
var contactsList;
var ContactsList = React.createClass(
  {
    getInitialState() {
      ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
      return {
        contactSource: ds,
        requestedState: 'Nil',
        ContactsList: '',
        modalVisible: false,
        backed: false,
        userPublicId: '',
        token: '',
        rowData: [],
        loaded: false,
      }
    },
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    },
    componentDidMount() {
      AsyncStorage.getItem("UserToken")
        .then((token) => {
          this.setState({token: token});
          return getRelations(token)
        })
        .then((resp) => {
          console.log('@@@@@@@@@@@sadsadsa@resp', resp);
          this.setState({contactSource: ds.cloneWithRows(resp), ContactsList: resp, loaded: true});
        })
        .catch((err) => {
          console.log(err);
        })

    },

    animatedLoader() {
      return (
        <LoadingCard/>
      );
    },

    renderSearchPlate(){
      return (
        <View style={styles.inputContainer}>
          <View style={{marginTop:5,flex:1}}>
            <Icon name={'icon-discover'} fontSize={18} color={'grey'}/>
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
      const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1');
      console.log('@@@@safe', safe);
      const regex = new RegExp(safe, 'i');
      const filter = (row) => {

        if (regex.test(row.name) || regex.test(row.mobileNumber)) {
          console.log('@@@@@@@@@@@@@@@@@sdfsa', regex.test(row.name))
          return row;
        }
      };
      //  let y = _.filter([{"a":32,"b":0}],this.checkme);
      //console.log('@@@@@@@@@@YY', y);
      var out = {};
      for (var sectionID in sections) {
        if (!sections.hasOwnProperty(sectionID)) {
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
    backFunction() {
      if (this.state.backed == false) {
        this.state.backed = true;
        //setTimeout(()=>{this.state.backed = false;}, 1000);
        this.props.navigator.pop()//replacePreviousAndPop({id:6})
      }
    },
    recallList() {
      console.log('++++++++++++++++++++++++Welcome Back+++++++++++++++++++++++')
      AsyncStorage.getItem("UserToken")
        .then((token) => {
          this.setState({token: token});
          return getRelations(token)
        })
        .then((resp) => {
          console.log('@@@@@@@@@@@sadsadsa@resp', resp);
          this.setState({contactSource: ds.cloneWithRows(resp), ContactsList: resp});
        })
        .catch((err) => {
          console.log(err);
        })
    },
    onRightButtonPress() {
      dismissKeyboard();
      this.props.navigator.push({id: 220, onUnmount: () => this.recallList()})
    },

    render() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <MenuBar
            title={"My Contacts"} // Optional
            leftIcon={'icon-back_screen_black'}
            rightIcon={'icon-contacts'} // Optional
            onPressLeftIcon={this.backFunction} // Optional
            onPressRightIcon={this.onRightButtonPress} // Optional
          />

          { this.state.ContactsList.length ? this.renderContacts() : this.renderEmptyView() }

          <NavBar
            navigator={this.props.navigator}
            profileImage={this.props.ProfilePicFull}
          />

          {this.renderSimpleModal()}
        </View>
      );
    },
    renderEmptyView() {
      return (
        <TouchableOpacity
          style={{flex: 1, alignItems:'center',justifyContent: 'center', alignSelf: 'center', marginVertical: 50}}>
          <Text style={{
						fontSize: 20,
						fontFamily: Fonts.regFont[Platform.OS]
					}}>
            You have no Contacts
          </Text>
        </TouchableOpacity>
      );
    },
    updateDataSource(dataSource){
      var arr = dataSource;
      arr[arr.length] = {
        status: 'updated',
      }
      return arr;
    },
    renderButton(rowData)  {
      if (rowData.relation == 'Unfriended' || rowData.relation == 'Blocked') {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
						}}>
              <Text style={styles.blockUserText}>{rowData.relation}</Text>
            </TouchableOpacity>
          </View>
        );
      }
      else {
        console.log('@@@@ row data', rowData);
        let relationshipColor = rowData.groupState != 'Active' ? {color: 'grey'} : {color: 'green'}
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => { this.props.navigator.push({id:205, relationType:rowData.group, userPublicId:rowData.publicId, updateRelation:(type)=>{this.recallList();console.log('@@@@welcome back with', type)}});
						}} style={[ContactsStyle.buttonWhiteSmall]}>
              <Text style={[ContactsStyle.greyText,relationshipColor]}>{rowData.group}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
							this.setModalVisible(true);
							this.setState({modalOpen: true, userPublicId: rowData.publicId, rowData: rowData})
						} } style={[styles.button,{marginTop:0}]}>
              <Icon name={'icon-option_menu_3dots'} fontSize={20} color={'#999999'}/>
            </TouchableOpacity>
          </View>
        );
      }
    },
    onPress(type) {
      var rowData = this.state.rowData;
      var newDataSource = this.updateDataSource(this.state.ContactsList);
      rowData.relation = type;
      newDataSource.pop();
      this.setState({contactSource: ds.cloneWithRows(newDataSource)});
      this.forceUpdate();

    },
    renderContactRow(rowData, sectionID, rowID) {

      return (
        <TouchableOpacity style={Style.listRow} onPress={() => {
        					this.props.navigator.push({id: 310, publicId:rowData.publicId, isFriend:true})
        				}}>
          <View style={[Style.contactsRow, {marginHorizontal:-10}]}>
            <View style={Style.row}>
              <Image
                style={[Style.userImage, {marginRight:5}]}
                source={(rowData.profilePictureURL == null || rowData.profilePictureURL == "" ) ? require('../../res/common/profile.png') : {uri: rowData.profilePictureURL} }
                resizeMode={'cover'}
              />

              <View style={{
        								flexDirection: 'column',
        								marginLeft: 15,
        								flex: 3
        							}}>
                <Text style={[ContactsStyle.textStyle]}>
                  {rowData.name}
                </Text>

                <Text style={ContactsStyle.textStyleMini}>
                  {rowData.mobileNumber}
                </Text>
              </View>
            </View>
            <View >
              {this.renderButton(rowData)}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    renderEmptyResults()  {
      return (
        <View style={{flex:1}}>
          <View style={{height:35}}>
          {this.renderSearchPlate()}
          </View>
          <View
            style={{height:height*0.30, alignItems:'center',width:width, justifyContent:'center', alignSelf:'center', backgroundColor:StyleConstants.primary}}>
            <Text style={{fontSize:16,color:'white',fontFamily: Fonts.regFont[Platform.OS]}}>No Results Found</Text>
          </View>
        </View>
      );
    },
    renderContacts() {
      var navigator = this.props.navigator;
      let contactSource = this.filterDataSource(this.state.query);
      let rowCount = contactSource ? contactSource.getRowCount() : 0;
      console.log('@@@@@@@@ rowcount', rowCount);
      if (this.state.loaded) {
        if (rowCount ) {
          return (
            <View style={ContactsStyle.scrollBox}>
              <View style={ContactsStyle.topGreyLine}/>
              <ListView
                enableEmptySections={true}
                renderHeader={this.renderSearchPlate}
                dataSource={contactSource}
                renderRow={this.renderContactRow}
                bounces={false}
              />
            </View>
          );
        }
        else {
          return (
              this.renderEmptyResults()
          );
        }
      }
      else {
        return this.animatedLoader;
      }

    },
    blockUserRelation() {
      console.log("Block User Relation Called")
      blockUserRelation(this.state.token, this.state.userPublicId)
        .then((resp) => {
          return AsyncStorage.getItem("servupContactCount")
        })
        .then((resp) => {
          resp = JSON.parse(resp);
          resp = resp - 1;
          console.log("%%%%%%%%%%%%%%%%servupContactCount", resp)
          AsyncStorage.setItem("servupContactCount", resp)
        })
      this.simpleModalClose();
    },
    unfriendRelation() {
      console.log("Unfriend Relation Called")
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&&&&&&', this.state.userPublicId)
      unfriendRelation(this.state.token, this.state.userPublicId)
        .then((resp) => {
          console.log(resp)
        })
      this.simpleModalClose();
    },
    simpleModalClose() {
      this.setModalVisible(false)
    },
    renderSimpleModal() {
      return (
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false)}}
        >
          <View style={{ marginTop:height*0.35, }}>
            <View style={styles.greyLine}/>
            <TouchableOpacity style={styles.modalRow} onPress={() => {
							this.unfriendRelation();
							this.onPress('Unfriended')
						}}>
              <Text style={[styles.textStyle, {color:'red'}]}>
                Unfriend
              </Text>
            </TouchableOpacity>
            <View style={styles.greyLine}/>
            <TouchableOpacity style={styles.modalRow} onPress={() => {
								AsyncStorage.setItem('chatwithUserId', this.state.rowData.publicId);
								this.props.navigator.push({ id: 260, userName: this.state.rowData.name })
								this.simpleModalClose()
						}}>
              <Text style={[styles.textStyle]}>
                Send Message
              </Text>
            </TouchableOpacity>
            <View style={styles.greyLine}/>
            <TouchableOpacity style={styles.modalRow} onPress={() => {
							this.blockUserRelation()
						}}>
              <Text style={styles.textStyle}>
                Report
              </Text>
            </TouchableOpacity>
            <View style={styles.greyLine}/>
            <TouchableOpacity style={styles.modalRow} onPress={() => {
							this.blockUserRelation();
							this.onPress('Blocked')
						}}>
              <Text style={styles.textStyle}>
                Block
              </Text>
            </TouchableOpacity>
            <View style={styles.greyLine}/>
            <TouchableOpacity style={styles.modalRow} onPress={()=>this.setModalVisible(false)}>
              <Text style={styles.textStyle}>
                Cancel
              </Text>
            </TouchableOpacity>
            <View style={styles.greyLine}/>
          </View>
        </Modal>
      );
    },

  });

const styles = StyleSheet.create({

  button: {
    marginTop: 7,
    //marginHorizontal:5,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  blockUserText: {
    marginHorizontal: 15,
    marginTop: 10,
    color: 'red',
    fontSize: 14,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  textStyle: {
    //flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
  },

  modalRow: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
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
  greyLine: {

    backgroundColor: '#f2f2f2',
    padding: 1,
  },

  input: {
    height: 35,
    marginHorizontal: 5,
    flex: 9,
    //paddingHorizontal: 20,
    paddingVertical: 6,
    fontFamily: Fonts.regFont[Platform.OS],
  },

});

module.exports = ContactsList;
