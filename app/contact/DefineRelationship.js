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

import {getRelations,updateRelationship} from '../../lib/networkHandler'

const {height, width} = Dimensions.get('window');
var TitleBar = require('../common/TitleBar');
var NavBar = require('../common/NavBar');
import MenuBar from '../common/MenuBar';

var ds;
var bgWhite = '#FFFFFF';
var friends = require('../../res/common/redHeart.png');
var selectionTick = require('../../res/common/selected_contact_messenger_icon.png');
var family = require('../../res/common/redHeart.png');
var coworker = require('../../res/common/redHeart.png');

var phoneContacts = [
  {
    name: 'Adeel Imran',
    number: '092333472645487',
    relationship: 'Friends',
    image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
  },
  {
    name: 'Shoaib Riaz',
    number: '092333472645487',
    relationship: 'Friends',
    image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
  },
  {
    name: 'Adeel Imran',
    number: '092333472645487',
    relationship: 'Friends',
    image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
  },
  {
    name: 'Shoaib Riaz',
    number: '092333472645487',
    relationship: 'Family',
    image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
  },
  {
    name: 'Adeel Imran',
    number: '092333472645487',
    relationship: 'Friends',
    image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
  },
  {
    name: 'Shoaib Riaz',
    number: '092333472645487',
    relationship: 'Family',
    image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
  },
  {
    name: 'Adeel Imran',
    number: '092333472645487',
    relationship: 'Family',
    image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
  },
  {
    name: 'Shoaib Riaz',
    number: '092333472645487',
    relationship: 'Family',
    image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
  },
]

var DefineRelationship = React.createClass(
  {
    getInitialState() {
      ds = new ListView.DataSource({
        rowHasChanged: (oldRow, newRow) => {
        }
      });
      return {
        contactSource: ds,
        backed: false,
        modalOpen: false,
        rowID:this.props.relationType,
        currentRender: "Recieved",
        activeButtonStyle: styles.topButtonSelectedActive,
        savedButtonStyle: styles.topButton,
        activeFont: styles.selectedFontStyle,
        savedFont: styles.unSelectedFontStyle,
      }
    },

    componentDidMount() {
      AsyncStorage.getItem("UserToken")
        .then((value) => {
          this.setState({"token": value});
          console.log('DefineRelationship.js->componentDidMount() token is:' + value);
          return AsyncStorage.getItem("UserID")
        })
        /*.then((value) => {
          console.log('DefineRelationship.js->componentDidMount() UserID is:' + value);
          this.setState({UserID: value});
          this.setState({contactSource: ds.cloneWithRows(phoneContacts)});
          return getRelations(this.state.token);
          //return AsyncStorage.getItem("serupContactBook");
          // return getUserSubscribedCards(this.state.token, this.state.UserID);
        })
        .then((resp) => {
          resp = phoneContacts;
          this.setState({contactSource: ds.cloneWithRows(resp)});
          //console.log('DefineRelationship' , this.state.contactSource);
          //  return getRelations(this.state.token)
          // return getUserSubscribedCards(this.state.token, this.state.UserID);
        })*/
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
    renderTick() {
      return(
        <View style={styles.rightNextToIt}>
          <View style={{flexDirection: 'row'}}>
              <Image source={selectionTick} style={{marginVertical:13}}/>
          </View>
        </View>
      )
    },
    renderRelationRow(type) {
      return (
        <TouchableOpacity style={styles.rows} onPress={()=>{this.setState({rowID: type});
         console.log('@@@@@@ tick rendered', type); this.props.navigator.pop(); this.props.updateRelation(type); updateRelationship(this.props.userPublicId, type,this.state.token)}}>
          <View style={styles.relationshipInnerRow}>
            <Image
              style={styles.contactImage}
              source={{uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRUONXaNwMCUh9Wcv-VO55XzyjPIsgBD_iJPuXhhoeW1r_suyEAWw'}}
              resizeMode={'cover'}
            />
            <Text style={styles.textStyle}>
              {type}
            </Text>
          </View>
          {this.state.rowID === type && this.renderTick()}
        </TouchableOpacity>
      );
    },
    render() {
      var navigator = this.props.navigator;
      return (
        <View style={{flex: 1}}>
          <MenuBar
            title={"Define Relationship"} // Optional
            leftIcon={'icon-back_screen_black'}
           // rightIcon={'icon-account-avatar-find-man-profile-search-user'} // Optional
            onPressLeftIcon={this.backFunction} // Optional
            //onPressRightIcon={this.onRightButtonPress} // Optional
          />
          <ScrollView style={{flex: 1}}>
            {this.renderRelationRow('Friends')}
            <View style={styles.categoryArea}/>
            {this.renderRelationRow('Family')}
            <View style={styles.categoryArea}/>
            {this.renderRelationRow('Coworker')}

          </ScrollView>
          <NavBar
            navigator={this.props.navigator}
            profileImage={this.props.ProfilePicFull}
          />
        </View>
      );
    },

  });

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginLeft: 30,
    color: '#666666',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderWidth: 0,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    borderTopColor: '#ececec',
    borderLeftColor: '#ececec',
    borderRightColor: '#ececec',
    backgroundColor: bgWhite,
  },
  categoryText: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    fontSize: 20,
    marginLeft: 10,
    color: '#666666',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  relationshipInnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  categoryArea: {
    backgroundColor: '#f2f1ef',
    marginHorizontal: 5,
    paddingVertical: 1,//5,
    paddingHorizontal: 10,
  },
  contactImage: {
    width: 45,
    height: 45,
    borderRadius: 30,
    alignSelf: 'center',
  },
});

module.exports = DefineRelationship