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
  addUserRelation,
  spFollowers,
} from '../../../lib/networkHandler'

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';

import {ContactsStyle} from './style.js';
import Icon from '../../stylesheet/icons'
import LoadingCard from '../../home/LoadingCard';
const {height, width} = Dimensions.get('window');
var TitleBar = require('../../common/TitleBar');
var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';
var ds;
var _ = require('lodash');
var arrow_right = require('../../../res/common/arrow_right.png');
var defaultProfileImage = require('../../../res/common/profile.png');
var contactsList;
var SpFollowers = React.createClass(
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
          return spFollowers(token, this.props.spId, 20, 0)
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

    render() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <MenuBar
            title={"Followers"} // Optional
            leftIcon={'icon-back_screen_black'}// Optional
            onPressLeftIcon={this.backFunction} // Optional
            // Optional
          />

          { this.state.ContactsList.length ? this.renderFollowers() : this.renderEmptyView() }

          <NavBar
            navigator={this.props.navigator}
            profileImage={this.props.ProfilePicFull}
          />

        </View>
      );
    },
    renderEmptyView() {
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: 50}}>
          <Text style={{
						fontSize: 20,
						justifyContent: 'center',
						alignSelf: 'center',
						fontFamily: Fonts.regFont[Platform.OS]
					}}>
            You have no Data to Display
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

    onPress(type) {
      var rowData = this.state.rowData;
      var newDataSource = this.updateDataSource(this.state.ContactsList);
      rowData.relation = type;
      newDataSource.pop();
      this.setState({contactSource: ds.cloneWithRows(newDataSource)});
      this.forceUpdate();

    },
    renderSingleFollower(rowData, sectionID, rowID) {
      return (
        <SingleFollower rowData={rowData} navigator={this.props.navigator} token={this.state.token}/>
      );

    },
    renderFollowers() {
      var navigator = this.props.navigator;
      return (
        <View style={ContactsStyle.scrollBox}>
          <View style={ContactsStyle.topGreyLine}/>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.contactSource}
            renderRow={this.state.loaded? this.renderSingleFollower : this.animatedLoader}
            bounces={false}
          />
        </View>
      );
    },


  });
var SingleFollower = React.createClass(
  {
    getInitialState() {
      return {
        isRequested: false,
      };
    },
    render(){
      let rowData = this.props.rowData;
      return (
        <TouchableOpacity style={[Style.listRow]} onPress={() => {
				this.props.navigator.push({id: 310,onUnmount:(value)=>{this.setState({isRequested:value})}, publicId:rowData.userId, isFriend:rowData.isFriend, isRequested: (rowData.isRequested || this.state.isRequested), routedFrom:'spFollowers'})
			}}>
          <View style={[Style.contactsRow]}>
            <View style={[Style.row, {alignSelf:'center'}]}>
              <Image
                style={[Style.userImage, {marginRight: 10}]}
                source={(rowData.profilePictureURL == null || rowData.profilePictureURL == "" ) ? require('../../../res/common/profile.png') : {uri: rowData.profilePictureURL} }
                resizeMode={'cover'}
              />

              <View style={{
		          alignSelf:'center',
							marginLeft: 15,
							flex: 3
						}}>
                <Text style={[ContactsStyle.textStyle]}>
                  {rowData.name}
                </Text>
              </View>
            </View>
            <View style={ {alignSelf:'center'}}>
              {this.renderButton(rowData)}
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    renderButton(rowData)  {
      if (rowData.isFriend) {
        return (
          <View style={styles.buttonWhiteSmall}>
            <Text style={[ContactsStyle.greyText,{color:'black'}]}> Friend </Text>
          </View>
        );
      }
      else {
        if (rowData.isRequested || this.state.isRequested) {
          return (
            <View style={{flexDirection: 'row'}}>
              <View style={Style.activeButton}>
                <Text style={[ContactsStyle.greyText,{color:'white'}]}>Pending</Text>
              </View>
            </View>
          );
        }
        else {
          return (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => {this.setState({isRequested:true}); addUserRelation(this.props.token,   {
    						    "destinationPublicId": rowData.userId ,
    						    "relation": "Friend",
    						    "group": "Friend"
    						  });}}
                                style={[styles.buttonWhiteSmall]}>
                <Text style={[ContactsStyle.greyText,{color:'black'}]}>Connect</Text>
              </TouchableOpacity>
            </View>
          );
        }

      }
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

  buttonWhiteSmall: {
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#9999',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
    justifyContent: 'center',
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

export default SpFollowers;
