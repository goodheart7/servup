import React, {
  Component,
} from 'react';
import {
  saveCard,
  hideCard,
  unLikeCard,
  requestSupportOnACard,
  getRelatedCards,
} from '../../lib/networkHandler';
var {height, width} = Dimensions.get('window');
import {
  TouchableOpacity,
  TouchableHighlight,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  View,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import styles from './Style';
import CardTray from './CardTray/CardTray';
import Modal from 'react-native-simple-modal';
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
import moment from 'moment';
import ProgressBar from 'react-native-progress/Bar';
var ServiceProviderCard = React.createClass(
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
        relatedCards: [],
        liked: this.props.isLiked,
        hideCard: false,
        spmodalOpen: false,
        showRelatedCards: false,
        likesCount: this.props.likes,
      };
    },

    spopenModal(card) {
      this.setState({spmodalOpen: true, cardObj: card});

    },
    updateLike(status){
      this.setState({liked: status});
    },

    spmodalClose() {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@ closing modal');
      this.setState({spmodalOpen: false});
    },

    SPCardModalPopup() {
      return (
        <Modal
          open={this.state.spmodalOpen}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => this.setState({spmodalOpen: false})}
          style={[Style.centerItems, {borderRadius: 20}]}
        >
          <View>
            <TouchableOpacity style={[styles.rowPadding]} onPress={ () => {
							this.spmodalClose();
							this.hideThisCard();
						}}>
              <Text style={styles.redText}>
                Hide Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.rowPadding, {borderBottomColor:'transparent'}]} onPress={ () => {
							this.spmodalClose();
							this.likeThisCard();
						}}>
              <Text style={styles.blueText}>
                Save Card
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    },
    renderRelatedUser(image) {
      console.log('@@@@@@@related user image', image);
      return (
        <View style={{marginLeft: -12}}>
          <Image
            style={styles.shareUser}
            source={image}
            resizeMode={'cover'}
          />
        </View>
      );
    },

    renderNetworkNotification() {

      let image = this.props.relatedUsers[0] ? {uri: this.props.relatedUsers[0].profilePictureURL} : defaultPic;
      let image2 = this.props.relatedUsers[1] ? {uri: this.props.relatedUsers[1].profilePictureURL} : defaultPic;
      let image3 = this.props.relatedUsers[2] ? {uri: this.props.relatedUsers[2].profilePictureURL} : defaultPic;
      let Name = this.props.spName ? this.props.spName : '';
      return (
        <View style={[styles.descriptionArea, {
					marginHorizontal: 23,
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

    touchListener()  {
      this.props.spDetailedCard(this.props.cardObj, this.props.profileImage);
    },
    openDetailedCard() {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@cardid', this.props.cardId);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@cardObsj', this.props.cardObj);
      this.props.navigator.push({
        id: 40,
        cardId: this.props.cardId,
        cardTitle: this.props.cardTitle,
        primaryImage: this.props.primaryMediaUrl,
        spName: this.props.spName,
        spLogo: this.props.spLogo,
        cta: this.props.callToAction,
        spId: this.props.spPublicId,
        overallRating: this.props.overallRating,
        numberOfReviews: this.props.numberOfReviews,
        isLiked: this.props.isLiked,
        relatedUsers: this.props.relatedUsers,
        companyId: this.props.spId,
        routedFrom:'timeLineCard',
        defaultPrice: this.props.price,
        onUnmount: (status)=>{this.setState({liked: status})},
      });
      //this.props.navigator.push({id: 19, cardId: this.props.cardId})
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

    relatedCards() {
      let relatedCards = this.state.relatedCards ? this.state.relatedCards : [];
      if (relatedCards.length > 0) {
        console.log("@@@@@@@ related  cards", relatedCards);
        return (
          <CardTray cards={relatedCards} token={this.props.token} navigator={this.props.navigator}/>
        );
      }
      else {
        return <View/>;
      }
    },

    likeThisCard() {

      getRelatedCards(this.props.token, this.props.cardId)
        .then((resp) => {
          console.log('@@@@@@@related cards on like', resp);
          this.setState({relatedCards: resp});
        })
        .catch((err) => {
          console.log(err);
          //Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        })

      if (!this.state.liked) {
        saveCard(this.props.token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount + 1, showRelatedCards: true});
      }
      else {
        unLikeCard(this.props.token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount - 1});
      }
    },
    hideThisCard() {
      hideCard(this.props.token, this.props.cardId)
        .then((resp) => {
          this.setState({hideCard: true, loader: false});
        })
        .catch((err) => {
          console.log(err);
        })

    },

    render() {
      let datex = moment().startOf('day').fromNow;
      console.log(datex);
      let image = this.props.spLogo ? {uri: this.props.spLogo} : defaultPic;
      let Name = this.props.spName ? this.props.spName : '';
      Name = Name.length > 22 ? Name.substring(0, 18) + ' ...' : Name;
      let saveEmpty = <Icon name={'icon-save'} fontSize={25} color={'white'}/>;
      let saveFilled = <Icon name={'icon-save_filled'} fontSize={25} color={StyleConstants.primary}/>;
      let expiry = <View style={{marginHorizontal: 3, marginVertical:5}}>
        <Icon name={'icon-offer_expires_in'} fontSize={12} color={'black'}/>
      </View>
      let freeTrial = <View style={{marginHorizontal: 3, marginVertical:5}}>
        <Icon name={'icon-free_trial'} fontSize={12} color={'black'}/>
      </View>
      let avialableQuantity = <View style={{marginHorizontal: 3, marginVertical:5}}>
        <Icon name={'icon-quantity'} fontSize={12} color={'black'}/>
      </View>
      let startsIn = <View style={{marginHorizontal: 3, marginVertical:5}}>
        <Icon name={'icon-offer_starts_in'} fontSize={12} color={'black'}/>
      </View>
      if (!this.state.hideCard) {
        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={this.openDetailedCard}>
              <View style={[Style.rowWithSpaceBetween, {flex: 1, padding: 10, paddingBottom: 5,}]}>
                <TouchableOpacity style={{flex: 95}} onPress={this.openDetailedCard}>
                  <Text style={[cardBaseStyle.cardTitle, {marginLeft: -10}]}>
                    {this.props.cardTitle.substring(0, 85) }
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dots,{marginRight:-5}]}
                  onPress={this.spopenModal}>
                  <Icon name={'icon-option_menu_3dots'} fontSize={20} color={'black'}/>
                </TouchableOpacity>
              </View>

              <StarRating
                numberOfReviews={this.props.numberOfReviews}
                overallRating={this.props.overallRating}
                navigator={this.props.navigator}
                style={{marginVertical: -5,}}
                cardId={this.props.cardId}
              />


              <View style={style.likeShareIcon}>

                <TouchableOpacity style={[styles.favButtons,{marginRight:7}]}
                                  onPress={this.likeThisCard}>
                  {this.state.liked ? saveFilled : saveEmpty}
                </TouchableOpacity>
                <TouchableOpacity style={styles.favButtons}
                                  onPress={() => this.props.CardShare(this.props.cardObj)}>
                  <Icon name={'icon-Share'} fontSize={25} color={'white'}/>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={this.openDetailedCard}>
                <Image
                  source={{uri: this.props.primaryMediaUrl}}
                  resizeMode={'cover'}
                  style={style.timeLineCardImage}
                />
              </TouchableOpacity>

              <View style={style.spNameLogo}>
                <TouchableOpacity
                  onPress={() => this.props.navigator.push({
					                  id: 15,
					                  spPublicId: this.props.spPublicId,
					                  companyId: this.props.spId,
						                })}
                  style={{ flexDirection: 'row', alignItems: 'center',  marginTop: 5,
                      marginHorizontal: 10,
                      justifyContent: 'space-between',
                     }}>
                  <Image
                    style={style.SPLogoImage}
                    source={image}
                    resizeMode={'cover'}
                  />
                  <View style={{flex:1, flexWrap:'wrap', flexDirection:'row'}}>
                    <Text style={[Style.textColorBlack, {fontSize: 16}]}>
                      {Name} <Text style={[Style.textColorBlack, Style.f14]}>{' added this Service Card ' + moment(this.props.addedAt).startOf('day').fromNow()} </Text>
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>

              <View style={{
				marginTop: 5,
				marginHorizontal: 15,
				paddingVertical:15,
				justifyContent:'space-between'
					}}>
                <View
                  style={[{justifyContent: 'space-between',flexDirection: 'row'}]}>
                  <Text style={[
                                  Style.textColorBlack, {
              						                  	justifyContent: 'center',
              							                  fontSize:17,
              							                  fontWeight:'500',
              						                  	alignSelf: 'center',
              							                  // color: '#00833c'
              					                    }]}>
                    {this.props.price == 0 ? 'Free' : this.props.price }
                  </Text>
                  <View style={{flex:1, flexDirection:'row', alignSelf:'center', marginHorizontal:5}}>
                    {this.props.networkStatus.quantityLeft || 1 ? avialableQuantity : <View/>}
                    {this.props.networkStatus.daysLeft || 1 ? expiry : <View/>}
                    {this.props.networkStatus.freeTrial || 1 ? freeTrial : <View/>}
                    {this.props.networkStatus.startsIn || 1 ? startsIn : <View/>}
                  </View>
                  <TouchableOpacity style={[styles.favButtons]}
                                    onPress={this.shareCardInSupport}>
                    <Icon name={'icon-support'} fontSize={20} color={StyleConstants.primary}/>
                  </TouchableOpacity>
                </View>
              </View>

            </TouchableOpacity>
            {this.state.showRelatedCards && this.relatedCards()}
            {this.SPCardModalPopup()}
          </View>
        );
      }
      else {
        return (<View/>);
      }

    },
  });

export default ServiceProviderCard;


const style = StyleSheet.create({


  relatedCardView: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  navbar: {
    backgroundColor: 'transparent',
    height: 60,
    paddingHorizontal: 15,
    borderTopWidth: 0.5,
    borderColor: 'black'
  },
  margins: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  SPLogoImage: {
    width: 35,
    height: 35,
 //   borderWidth: 1.5,
    borderRadius: 17,
   // borderColor: 'white',
    marginRight: 10,
    // marginRight: width / 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeShareIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
    marginTop: 7,
    marginBottom: -38,
    marginRight: 17
  },
  spNameLogo: {
    marginTop: 5,
    marginHorizontal: 10,
    marginLeft:3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLineCardImage: {
    width: width * 0.92,
    height: height * 0.32,
    alignSelf: 'center',
    marginBottom: 3,
    //marginHorizontal:10,
    zIndex: -5,
  },
  relatedImage: {
    width: 170,
    height: 95,
    // alignSelf: 'center',
    // marginBottom: 5,
  },
});