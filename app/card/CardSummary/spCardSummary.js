/**
 * Created by Shoaib on 11/3/2016.
 */
var defaultPic = require('../../../res/common/profile.png');
import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Text,
  ToastAndroid,
  View,
  Alert,
  Switch,
  Share,
  //Image,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Style,
  Fonts
} from '../../stylesheet/style';
import {
  getServiceCard,
  saveCard,
  unLikeCard,
  refundOrder,
  requestSupportOnACard,
  makePurchasePrivate,
  getCompanyCards,
} from '../../../lib/networkHandler';
import AppConstants from '../../AppConstants';
var {height, width} = Dimensions.get('window');
import styles from '../Style';
import styles2 from './Style';
import StarRating from  '../StarRating';
import Review from '../Reviews';
//import spDetailedCard from '../spDetailedCardStub';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
var rightArrow = require('../../../res/common/arrow_right.png');
import Modal from 'react-native-simple-modal';
import Icon from '../../stylesheet/icons'
import Image from 'react-native-image-progress';
var support = require('../../../res/common/support.png');
import cardBaseStyle from '../Styles/cardBaseStyle';
import moment from 'moment';
import CardTray from '../CardTray/CardTray';

var SpCardSummary = React.createClass(
  {
    getDefaultProps: function () {
      return {
        closeButton: defaultPic,
        profileImage: defaultPic,
        height: 150,
        SwitchState: false,
      };
    },

    getInitialState() {
      return {
        liked: this.props.isLiked,
        cardShareModal: false,
        DataSource: [],
        headerStyle: {backgroundColor: 'transparent'},
        iconColor: 'white',
        token: '',
        relatedCards: [],
        spDetailedCard: [],
        SwitchState: false,
        //text: spDetailedCard.cardDescription.substring(0,120),
      };
    },
    renderExtraSpaceForIOS (){
      if (Platform.OS === 'ios') {
        return (<View style={Style.extraSpaceForIOS}/>)
      } else {
        return (<View/>)
      }
    },
    componentDidMount() {
      AsyncStorage.getItem("UserToken")
        .then((token) => {
          this.setState({token: token});
          let id = this.props.subscriptionId ? this.props.subscriptionId : this.props.orderId;
          console.log('@@@@@@@@@@@ id', id);
          return getServiceCard(token, id)
        })
        .then((resp) => {
          console.log('@@@@@@@@@@@@@@@@@', resp)
          this.setState({DataSource: resp, SwitchState: resp.isPurchasePrivate});
          //(paymentStatus!= 'paid' && paymentStatus!= 'free')
          if (resp.paymentStatus != 'paid' && resp.paymentStatus != 'free') {
            ToastAndroid.show('Click on order to Reattempt Payment', ToastAndroid.SHORT);
            /*   Alert.alert(
             'Payement Failure',
             'Do you want to Complete Purchase ?',
             [
             {text: 'Yes', onPress: () => this.props.navigator.push({id: 110, transactionId: subscriptionId}), style: 'yes'},
             ]
             )*/
          }
          return getCompanyCards(this.state.token, resp.cardId, resp.companyId)
        })
        .then((resp) => {
          console.log('@@@@ company Cards Resp', resp);
          this.setState({relatedCards: resp});
        })
        .catch((err) => {
          console.log('service card api error,', err);
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        })
    },
    shareCardInSupport() {
      console.log('Support Called..');
      let spPublicID = {
        spUserId: this.state.DataSource.spId,
      }
      requestSupportOnACard(this.state.DataSource.cardId, spPublicID, this.state.token)
        .then((value) => {
          console.log('@@@@@@@@@@@@@@@@valueSupport', value)
          // this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj});
          this.props.navigator.push({
            id: 321,
            userName: this.state.DataSource.spName,
            chatGroupId: value.id,
            card: this.state.DataSource,
            publicId: this.state.DataSource.spId,
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
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount + 1, showRelatedCards: true});
      }
      else {
        unLikeCard(this.props.token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount - 1});
      }
    },
    renderWriteReview() {
      let {DataSource} = this.state;
      return (
        <View>
          <TouchableOpacity style={style.tab} onPress={() => {
            this.props.navigator.push({
              id: 10.3, cardId: DataSource.cardId
            })
          } }>
            <View style={Style.rowWithSpaceBetween}>
              <View style={{ marginRight: 25}}>
                <Icon name={'icon-interests_profile'} fontSize={20} color={'black'}/>
              </View>
              <Text style={[Style.f18, Style.textColorBlack]}>
                Write a review
              </Text>
            </View>
            <Image
              source={rightArrow}
              resizeMode={'cover'}
              style={{alignSelf: 'center', justifyContent: 'center'}}
            />
          </TouchableOpacity>
          <View style={cardBaseStyle.lineSeparator}/>
        </View>
      )
    },
    toggleView() {
      this.setState({
        showView: !this.state.showView
      })
    },
    renderReview(obj, cardId, reviewsCount){

      /* obj = {
       profilePicUrl: 'http://networthier.com/wp-content/uploads/2016/04/Sunny-Deol-Net-Worth.jpg',
       name: 'Sunny Deol',
       reviewText: 'I like this service want to buy it for my use.'
       }*/
      let countOfReviews = reviewsCount > 1 ? reviewsCount : '';
      if (obj != null && obj.length != 0) {
        obj = obj[0];
        let userImage = obj.profilePicUrl ? {uri: obj.profilePicUrl} : defaultPic;
        // obj.name = 'jkdfdjskfds kjfdshfdsk jkfdsjkdsf'
        return (
          <View style={{marginTop:25}}>
            <View style={{marginHorizontal:30}}>
              <Text style={{color:'green', fontSize:16}}>Reviews</Text>
              <TouchableOpacity
                // onPress = {this.openCreator}
                style={{
      							flex: 1,
      							justifyContent: 'flex-start',
      							flexDirection: 'row',
      							alignItems: 'center',
      							marginTop: 12
      						}}>
                <Image
                  style={cardBaseStyle.reviewerImage}
                  source={ userImage}
                  resizeMode={'cover'}
                />
                <View style={{flex: 1, flexDirection: 'column', marginHorizontal:10}}>
                  <Text style={[Style.textColorBlack, {fontSize: 18, fontWeight: '500'}]}>
                    {obj.name && obj.name.length > 15 ? obj.name.substring(0, 18) + '...' : obj.name }
                  </Text>
                  <Text style={[Style.textColorBlack, {fontSize: 14}]}>
                    {moment.utc(obj.createdAt).format('MMM YYYY')}
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <StarRating
                    overallRating={obj.rating}
                    style={{alignSelf: 'flex-end', marginRight:-5}}
                    navigator={this.props.navigator}
                    cardId={this.props.cardId}
                  />
                </View>
              </TouchableOpacity>

              <Text style={[cardBaseStyle.descriptionText, {textAlign: 'left', marginVertical:15}]}>
                {obj.reviewText}
              </Text>

              <TouchableOpacity
                style={[Style.rowWithSpaceBetween, { marginTop: 5, marginBottom:25}]}
                onPress={() => this.props.navigator.push({id: 11, cardId: cardId})}>
                <Text
                  style={[Style.f16, Style.textColorPrimary, {alignSelf: 'center', justifyContent: 'center'}]}>
                  Read all Reviews {countOfReviews && '[' + countOfReviews + ']'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={cardBaseStyle.lineSeparator}/>
          </View>
        );
      }
      else {
        return <View/>;
      }

    },

    callToAction()  {
      this.props.this.state.DataSource(this.props.cardObj, this.props.profileImage);
    },

    openCreator() {
      this.props.navigator.push({id: 44});
    },

    expandableTextView(description) {
      if (description != null) {
        let seemore = (description.length > 125) ? '...See More' : '';
        var fullDescription = <Text style={[cardBaseStyle.descriptionText]}
                                    onPress={this.toggleView}>{description}</Text>
        var lessDescription = <Text onPress={this.toggleView}>{description.substring(0, 125) + seemore}</Text>
        return (
          <View style={[cardBaseStyle.descriptionArea]}>
            <Text style={[cardBaseStyle.descriptionText]}>
              {!this.state.showView && lessDescription}
              {this.state.showView && fullDescription}
            </Text>

          </View>
        );
      }
    },

    renderRelatedCards(relatedCards) {
      if (relatedCards != null) {
        return (
          <View style={{marginHorizontal:15}}>
          <CardTray cards={relatedCards} token={this.state.token} navigator={this.props.navigator}/>
          </View>
        );
      }
      else {
        return <View/>;
      }
    },

    renderLineSeparator() {
      return (
        <View style={{height: 0.7, backgroundColor: 'black', marginHorizontal: 15}}/>
      );
    },
    renderImages() {
      let images = [];
      images.push(this.state.DataSource.primaryMediaUrl);
      images = images.concat(this.state.DataSource.additionalMediaUrls);
      console.log('@@@@@@@@@@@@@', images);
      if (images != null) {
        return images.map((url, index) => {
          return (
            <View key={index}>
              <Image
                key={index}
                source={{uri: url}}
                style={style.cardImage}
              />
            </View>
          );
        })
      }
    },
    imageSwiper() {
      let {DataSource} = this.state;
      return (
        <View>
          <Swiper
            loop={true}
            height={height * 0.35}
            width={width}
            //autoplay ={true}
            showButtons={true}
            style={{top: 0, left: 0, right: 0, position: 'absolute'}}>

            {this.renderImages()}
          </Swiper>
        </View>
      );
    },

    renderTitle (){
      let style = this.state.headerStyle;
      let iconColor = this.state.iconColor;
      let saveEmpty = <Icon name={'icon-save'} fontSize={28} color={iconColor}/>;
      let saveFilled = <Icon name={'icon-save-filled'} fontSize={28} color={StyleConstants.primary}/>;
      let topMargin = {marginTop: 0};
      if (Platform.OS === 'ios') {
        topMargin = Style.marginForIOS;
      }
      //console.log('@@@@@@@@@@@@@Style', style);
      return (
        <TouchableOpacity style={[cardBaseStyle.titleBar, style, topMargin, Style.rowWithSpaceBetween]}
                          onPress={() => this.props.routedFrom ? (this.props.routedFrom == 'freeCard' ? this.props.navigator.popN(2) : this.props.navigator.popN(3) ) : this.props.navigator.pop()}>
          <View style={{alignSelf:'center', marginVertical: 7}}>
            <Icon name={'icon-back_screen_black'} fontSize={18} color={iconColor}/>
          </View>
          <View style={{flexDirection: 'row', marginTop:7 , marginBottom:7,marginHorizontal: 10}}>
            <TouchableOpacity style={[{paddingHorizontal: 0, flexDirection: 'row'}]} onPress={this.likeThisCard}>
              {this.state.liked ? saveFilled : saveEmpty}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favButtons, {marginLeft: 15}]}
                              onPress={() => this.cardShareModalOpen(this.state.DataSource)}>
              <Icon name={'icon-Share'} fontSize={28} color={iconColor}/>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },

    onRefundPress() {
      let {token, DataSource} = this.state;
      console.log('@@@@@@@@@@ orderId', DataSource.orderId);
      refundOrder(token, DataSource.orderId)
        .then((resp) => {
          Alert.alert('Sorry for Inconvenience', 'Our Support Team Will Get Back to You Soon');
        })
        .catch((err) => {
          console.log('refund api error,', err);
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        })
    },

    cardShareModalOpen(card) {
      this.setState({cardShareModal: true, card: card});
    },
    cardShareModalClose() {
      this.setState({cardShareModal: false});
    },
    shareInChat () {
      this.props.navigator.push({id: 320, card: this.state.card});
      this.cardShareModalClose();
    },
    SocialShare() {
      Share.share({
        message: 'https://www.servup.co'
      })
        .then(() => {
          console.log('Promise Resolved')
        })
        .catch(err => console.log(err))
    },
    CardShare() {
      return (
        <Modal
          open={this.state.cardShareModal}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => this.setState({cardShareModal: false})}
          style={[Style.centerItems, {borderRadius: 20}]}
        >
          <View>
            <TouchableOpacity style={styles.rowPadding} onPress={this.shareInChat}>
              <Text style={styles.blueText}>
                Share In Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rowPadding} onPress={this.SocialShare}>
              <Text style={styles.blueText}>
                Social Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rowPadding} onPress={this.cardShareModalClose}>
              <Text style={styles.blueText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    },
    renderNavBar(){
      return (
        <View style={[style.navbar, {alignItems: 'center', justifyContent: 'center'}]}>
          <TouchableOpacity style={styles.actButton} onPress={() => this.onRefundPress()}>
            <Text style={[Style.f18, Style.textColorWhite]}>
              Refund
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    onPressHandler(type, DataSource) {

      let plans = DataSource.listOfPlans ? true : false;
      let choices = DataSource.orderAttributes && DataSource.orderAttributes.length > 0;
      let inputs = DataSource.orderQuestions && DataSource.orderQuestions.length > 0;
      if (type === 'myPlan') {
        this.props.navigator.push({
          id: 10.1,
          data: DataSource.listOfPlans,
          subscriptionId: DataSource.subscriptionId,
          token: this.state.token,
          subscriptionStatus: DataSource.subscriptionStatus,
        });
      }
      else if (type === 'details' && (choices || inputs)) {
        console.log('@@@@@@@@,jdsajkdas', DataSource.orderAttributes);
        this.props.navigator.push({
          id: 9,
          orderQuestions: DataSource.orderQuestions,
          orderAttributes: DataSource.orderAttributes,
        })
      }
      else if (type === 'orderDetails') {
        this.props.navigator.push({
          id: 10.2,
          orderDetails: DataSource
        })
      }
    },
    onPrivatePurchasePress() {
      let {token, DataSource} = this.state;
      this.setState({SwitchState: !this.state.SwitchState});
      let flag = !this.state.SwitchState;
      console.log('@@@@@@@@@@@ flag', flag);
      makePurchasePrivate(token, DataSource.subscriptionId, flag)
        .then((resp) => {
          if (flag) {
            Alert.alert('Alert', 'Purchase is no more Public');
          }
          else {
            Alert.alert('Alert', 'Purchase is no more Private');
          }
        })
        .catch((err) => {
          console.log('service card api error,', err);
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        })
    },
    renderTabView (DataSource) {
      let choices = DataSource.orderAttributes && DataSource.orderAttributes.length > 0;
      let inputs = DataSource.orderQuestions && DataSource.orderQuestions.length > 0;
      let activeColor = (choices || inputs) ? 'black' : '#d7d7d7';
      // let plansColor = DataSource.plans ? DataSource.plans.length > 0
      return (
        <View style={[Style.rowWithSpaceBetween, cardBaseStyle.tabView]}>
          <TouchableOpacity style={[cardBaseStyle.icon]}
                            onPress={() => this.onPressHandler('myPlan', DataSource)}>
            <View style={{marginBottom: -3, marginTop: 2, zIndex: -2}}>
              <Icon name={'icon-plans'} fontSize={20}
                    color={'black'}/>
            </View>
            <Text style={[Style.f15,{marginTop: 10, color:'black'}]}>
              {DataSource.plans ? ' ' : ''}My Plan
            </Text>

          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]} disabled={!(choices || inputs)}
                            onPress={() => this.onPressHandler('details', DataSource)}>
            <Icon name={'icon-choices'} fontSize={20} color={activeColor}/>
            <Text style={[Style.f15, {marginTop: 10, color: activeColor}]}>
              {DataSource.listOfAttributes ? '' + ' ' : ''}Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]}
                            onPress={() => this.onPressHandler('orderDetails', DataSource)}>
            <Icon name={'icon-input'} fontSize={20} color={'black'}/>
            <Text style={[Style.f15, {marginTop: 10, color:'black'}]}>
              {DataSource.cardQuestion ? '' + ' ' : ' '}Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]} onPress={() => this.shareCardInSupport()}>
            <Icon name={'icon-support'} fontSize={20} color={'black'}/>
            <Text style={[Style.f15, {marginTop: 10, color:'black'}]}>
              Support
            </Text>
          </TouchableOpacity>
        </View>

      );
    },
    render() {
      let {DataSource} = this.state;
      if (DataSource != null) {
        let image = DataSource.spLogo ? {uri: DataSource.spLogo} : defaultPic;
        return (
          <View style={{flex: 1}}>
            {this.renderExtraSpaceForIOS()}
            {this.renderTitle()}
            <ScrollView style={ {flex: 1}} onScroll={(e) => {
              e.nativeEvent.contentOffset.y > 145 ? this.setState({
                headerStyle: {backgroundColor: 'white'},
                iconColor: 'black'
              }) : this.setState({headerStyle: {backgroundColor: 'transparent'}, iconColor: 'white'})
            }}>
              <Animatable.View animation="fadeInUpBig">
                {this.imageSwiper()}
                <View style={[cardBaseStyle.spInfo, {marginTop: -14,}]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigator.push({
                        id: 15,
                        spPublicId: DataSource.spPublicId,
                        companyId: DataSource.companyId,
                      })}
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                    <Image
                      style={cardBaseStyle.spImage}
                      source={image}
                      resizeMode={'cover'}
                    />
                    <Text style={cardBaseStyle.spName}>
                      {DataSource.spName}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[cardBaseStyle.cardTitle, {fontSize: Style.f24}]}>
                  {DataSource.cardTitle}
                </Text>
                <StarRating
                  numberOfreviews={DataSource.numberOfreviews}
                  overallRating={DataSource.overallRating}
                  navigator={this.props.navigator}
                  style={{marginLeft: 15, marginTop:5}}
                  cardId={this.props.subscriptionId}
                />
                <View style={cardBaseStyle.lineSeparator}/>
                {this.renderTabView(DataSource)}
                <View style={cardBaseStyle.lineSeparator}/>
                {this.expandableTextView(DataSource.cardDescription)}
                <View style={cardBaseStyle.lineSeparator}/>

                <TouchableOpacity style={style.tab}
                                  onPress={() => this.props.navigator.push({id: 10.6})}>
                  <View style={Style.rowWithSpaceBetween}>
                    <View style={{ marginRight: 25,}}>
                      <Icon name={'icon-Payment_history'} fontSize={20} color={'black'}/>
                    </View>
                    <Text  style={[Style.f18, Style.textColorBlack]}>
                      Payment History
                    </Text>
                  </View>
                  <Image
                    source={rightArrow}
                    resizeMode={'cover'}
                    style={{alignSelf: 'center', justifyContent: 'center'}}
                  />
                </TouchableOpacity>
                <View style={cardBaseStyle.lineSeparator}/>
                {!DataSource.isReviewed || this.renderWriteReview()}
                {this.renderReview(DataSource.listOfUserreviews, DataSource.cardId, DataSource.numberOfreviews)}
                <View style={style.tab}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Keep Purchase Private
                  </Text>
                  <Switch
                    style={{justifyContent: 'center',}}
                    onValueChange={(value) => this.onPrivatePurchasePress()}
                    value={this.state.SwitchState}
                    onTintColor="orange"
                    thumbTintColor="green"
                    tintColor="#d7d7d7"
                  />
                </View>
                <View style={cardBaseStyle.lineSeparator}/>
                <TouchableOpacity style={style.tab}
                                  onPress={() => this.props.navigator.push({
                                      id: 21,
                                      title: 'Terms of Service',
                                      data: DataSource.termsOfServiceUrl,
                                    })}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Terms of Services
                  </Text>
                  <Image
                    source={rightArrow}
                    resizeMode={'cover'}
                    style={{alignSelf: 'center', justifyContent: 'center'}}
                  />
                </TouchableOpacity>
                <View style={cardBaseStyle.lineSeparator}/>
                <TouchableOpacity style={style.tab}
                                                  onPress={() => this.onRefundPress()}>
                                  <Text style={[Style.f18, Style.textColorBlack]}>
                                    Refund Policy
                                  </Text>
                                  <Image
                                    source={rightArrow}
                                    resizeMode={'cover'}
                                    style={{alignSelf: 'center', justifyContent: 'center'}}
                                  />
                                </TouchableOpacity>
                <View style={cardBaseStyle.lineSeparator}/>
                {this.renderRelatedCards(this.state.relatedCards)}
                <View>
                </View>
              </Animatable.View>

            </ScrollView>
            {this.CardShare()}
          </View>
        );
      }
    },
  });

module.exports = SpCardSummary;

const style = StyleSheet.create({
  spInfo: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 5,
    // padding: 10,
    // borderTopColor: 'black',
    // borderTopWidth: 0.5,
  },
  titleBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 1,
    zIndex: 10
  },

  relatedCardView: {
    //  height: 120,
    marginHorizontal: 10,
    marginVertical: 15,
    //backgroundColor:'red',
  },
  textStyle: {
    fontSize: 20,
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  navbar: {
    backgroundColor: '#FCFFF5',
    height: 60,
    paddingHorizontal: 15,
    borderTopWidth: 0.5,
    borderColor: 'black'
  },
  cardImage: {
    resizeMode: 'cover',
    width: width,
    height: height * 0.35,
    // alignSelf: 'center',
    marginBottom: 5,
  },
  margins: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  tab:{
    marginVertical: 20,
    marginHorizontal: 30,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  relatedImage: {
    width: 170,
    height: 95,
    // alignSelf: 'center',
    // marginBottom: 5,
  },
});
