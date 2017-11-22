import React, {
  Component,
} from 'react';
import {  saveCard,
          requestSupportOnACard } from '../../lib/networkHandler';
import {
  TouchableOpacity,
  Text,
  View,
  //Image,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {
  Style,
} from '../stylesheet/style';
import styles from './Style';
import StarRating from  './StarRating';
import cardBaseStyle from './Styles/cardBaseStyle';
import Icon from '../stylesheet/icons';
var defaultPic = require('../../res/common/profile.png');
var save = require('../../res/common/review.png');
var saveActive = require('../../res/common/review_icon_active.png');
var share = require('../../res/common/share.png');
var support = require('../../res/common/question.png');
var dots = require('../../res/common/3bar.png');
import Image from 'react-native-image-progress';
var Review = React.createClass(
  {
    getDefaultProps: function () {
      return {
        closeButton: defaultPic,
        profileImage: defaultPic,
        token: '',
      };
    },

    getInitialState() {
      return {
        liked: this.props.isLiked,
        likesCount: this.props.likes,
      };
    },

    touchListener()  {
      this.props.spDetailedCard(this.props.cardObj, this.props.profileImage);
    },

    openDetailedCard() {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@cardid bhai bhai', this.props.cardId);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@cardObsj', this.props.cardObj);
      this.props.navigator.push({id: 40, cardId: this.props.cardId})
    },

    renderNetworkNotification() {
      let image = this.props.relatedUsers[0] ? {uri: this.props.relatedUsers[0]} : defaultPic;
      let image2 = this.props.relatedUsers[1] ? {uri: this.props.relatedUsers[1]} : false;
      let image3 = this.props.relatedUsers[0] ? {uri: this.props.relatedUsers[0]} : false;
      let Name = this.props.spName ? this.props.spName : '';
      return (
        <View style={[styles.descriptionArea, {
          marginHorizontal: 25,
          // flexDirection: 'row',
          //marginTop: -5,
          marginBottom: 10
        }]}>
          <View style={{flexDirection: 'row', marginHorizontal: -12, marginTop: 15}}>
            <View>
              <Image
                style={styles.shareUser}
                source={image}
                resizeMode={'cover'}
              />
            </View>
            {image2 && this.renderRelatedUser(image2) }
            {image3 && this.renderRelatedUser(image3) }
            <View style={{justifyContent: 'center', flex: 1, flexWrap: 'wrap', marginLeft: 5}}>
              <Text style={[Style.f14, Style.textColorBlack]}>
                {this.props.networkMessage}
              </Text>
            </View>
          </View>

        </View>

      );
    },

    shareCardInSupport() {
      console.log('Support Called..');
      let spPublicID = {
        spUserId: this.props.spPublicId,
      }
      console.log('@@@@@@@@@@@@@@sp public id', spPublicID);
      requestSupportOnACard(this.props.cardId, spPublicID, this.props.token)
        .then((value) => {
          console.log('@@@@@@@@@@@@@@@@valueSupport', value);
          // this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj});
          this.props.navigator.push({
            id: 321,
            userName: this.props.spName,
            chatGroupId: value._id,
            card: this.props.cardObj,
            publicId: this.props.spPublicId
          });
        });
      //let name = this.props.spName ? this.props.spNmae : 'Ghost';
      //AsyncStorage.setItem('chatwithUserId', this.props.spPublicId);
      // this.props.navigator.push({id:321, card: this.props.cardObj, publicId: this.props.spPublicId});
      //this.props.navigator.push({id:320, card: this.state.card});
      //this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj})
    },

    likeThisCard() {
      if (!this.state.liked) {
        saveCard(this.props.token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount + 1});
      }
      else {
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount - 1});
      }
    },

    render() {
      let image = this.props.spLogo ? {uri: this.props.spLogo} : defaultPic;
      let Name = this.props.spName ? this.props.spName : '';
      let saveEmpty = <Icon name={'icon-save'} fontSize={18} color={'black'}/>;
      let saveFilled = <Icon name={'icon-save-filled'} fontSize={18} color={StyleConstants.primary}/>;
      let expiry = <View style={{marginHorizontal: 10}}>
        <Icon name={'icon-offer_expires_in'} fontSize={12} color={StyleConstants.primary}/>
      </View>
      let subscription = <View style={{marginHorizontal: 10}}>
        <Icon name={'icon-offer_starts_in'} fontSize={12}
              color={StyleConstants.primary}/>
      </View>
      let avialableQuantity = <View style={{marginHorizontal: 10}}>
        <Icon name={'icon-free_trial'} fontSize={12} color={StyleConstants.primary}/>
      </View>
      return (
        <TouchableOpacity style={styles.container} onPress={this.openDetailedCard}>
          <View style={[Style.rowWithSpaceBetween, {flex: 1, padding: 10, paddingBottom: 5,}]}>
            <TouchableOpacity style={{flex: 95}} onPress={this.openDetailedCard}>
              <Text style={[cardBaseStyle.cardTitle, {marginLeft: -10}]}>
                {this.props.cardTitle.substring(0, 85)}
              </Text>
            </TouchableOpacity>

          </View>
          <View style={{flexDirection: 'row'}}>
            <StarRating
              numberOfReviews={this.props.numberOfReviews}
              overallRating={this.props.overallRating}
              navigator={this.props.navigator}
              style={{marginVertical: -5, marginTop: -5}}
              cardId={this.props.cardId}
            />
            {this.props.networkStatus.quantityLeft ? avialableQuantity : <View/>}
            {this.props.networkStatus.daysLeft  ? expiry : <View/>}
            {this.props.networkStatus.freeTrail  ? subscription : <View/>}
            {this.props.networkStatus.startsIn  ? expiry : <View/>}
          </View>
          <TouchableOpacity onPress={this.openDetailedCard}>
            <Image
              source={{uri: this.props.primaryMediaUrl}}
              resizeMode={'cover'}
              style={styles.banner}
            />
          </TouchableOpacity>
          <View style={[styles.spInfo, {marginTop: -15,}]}>
            <View
              style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.SPLogoImage}
                source={image}
                resizeMode={'cover'}
              />
              <Text style={[Style.f16, Style.textColorBlack,]}>
                {(Name.length > 24) ? Name.substring(0, 24) + '...' : Name}
              </Text>
            </View>
            <TouchableOpacity style={[styles.favButtons, {marginTop: 5}]}
                              onPress={this.shareCardInSupport}>
              <Icon name={'icon-support'} fontSize={22} color={StyleConstants.primary}/>
            </TouchableOpacity>
          </View>

          <View style={[Style.rowWithSpaceBetween, {padding: 5, borderTopColor: '#f4f4f4', borderTopWidth: 0.5,marginTop: 5, marginRight: -10}]}>
            <TouchableOpacity style={styles.cardActionButton} onPress={this.touchListener}>

              <Text
                style={[Style.f18, Style.b, Style.textColorPrimary, {
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    // color: '#00833c'
                                  }]}>
                {this.props.price==  0? 'Free' :this.props.price }
              </Text>
            </TouchableOpacity>
            <View style={[{justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row'}]}>
              <TouchableOpacity style={[{paddingHorizontal: 0, flexDirection: 'row'}]} onPress={this.likeThisCard}>
                {this.state.liked ? saveFilled : saveEmpty}
                <Text style={[styles.greyTextLight, {textAlign: 'left'}]}>
                  {this.state.likesCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.favButtons, {marginLeft: 5}]}
                                onPress={() => this.props.CardShare(this.props.cardObj)}>
                <Icon name={'icon-Share'} fontSize={18} color={'black'}/>
                <Text style={[styles.greyTextLight, {textAlign: 'left'}]}>
                  {this.props.shares}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      );
    },
  });

module.exports = Review
