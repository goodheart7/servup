/**
 * Created by Shoaib on 11/3/2016.
 */
import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  Share,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Style,
} from '../../stylesheet/style';
import {
  getDetailCard,
  getCompanyCards,
  requestSupportOnACard,
  unLikeCard,
  getPaymentMethods,
  saveCard,
  placeOrder,
} from '../../../lib/networkHandler';
import Image from 'react-native-image-progress';
import CardTray from '../CardTray/CardTray';
import Modal from 'react-native-simple-modal';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Modalbox from 'react-native-modalbox';
import * as Animatable from 'react-native-animatable';
import Loader from '../../Loaders/Loader';
var {height, width} = Dimensions.get('window');
import styles from '../Style';
import cardBaseStyle from '../Styles/cardBaseStyle';
import StarRating from  '../StarRating';
import Inputs from '../Inputs';
import Icon from '../../stylesheet/icons'
import Select from '../Select';
import Plans from '../Plans';
import Review from '../Reviews';
import spDetailedCard from '../spDetailedCardStub';
import Swiper from 'react-native-swiper';
var defaultPic = require('../../../res/common/profile.png');
var rightArrow = require('../../../res/common/arrow_right.png');
var save = require('../../../res/common/review_icon.png');
var saveActive = require('../../../res/common/review_icon_active.png');
let orderObject = {};
var cardQuestion = [
  {
    "question": "How Did You know about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
  },
  {
    "question": "Gender",
    "typeOfField": "choice",
    "isAvailable": true,
    "listOfValues": [
      "Male",
      "Female",
      "Other"
    ]
  },
  {
    "question": "Size",
    "typeOfField": "size",
    "isAvailable": true,
    "listOfValues": [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]
  },
  {
    "question": "How sDid You knoww about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
  },
  {
    "question": "Select Your Favourite Color",
    "typeOfField": "color",
    "isAvailable": true,
    "listOfValues": [
      "red",
      "brown",
      "black",
      "orange",
      "red",
      "blue",
    ]
  },
  {
    "question": "How Did You know about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
  },
  {
    "question": "Gender",
    "typeOfField": "choice",
    "isAvailable": true,
    "listOfValues": [
      "Male",
      "Female",
      "Other"
    ]
  },
  {
    "question": "Size",
    "typeOfField": "size",
    "isAvailable": true,
    "listOfValues": [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]
  },
  {
    "question": "How sDid You knoww about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
  },
  {
    "question": "Select Your Favourite Color",
    "typeOfField": "color",
    "isAvailable": true,
    "listOfValues": [
      "red",
      "brown",
      "black",
      "orange",
      "red",
      "blue",
    ]
  },
  {
    "question": "How Did You know about uss?",
    "typeOfField": "text-field",
    "isAvailable": true,
  }
]
import moment from 'moment';
var SpDetaildedCard = React.createClass(
  {
    getDefaultProps: function () {
      return {
        closeButton: defaultPic,
        profileImage: defaultPic,
        height: 150,
        text: spDetailedCard.cardDescription,
      };
    },

    getInitialState() {
      return {
        DataSource: [],
        cardShareModal: false,
        liked: false,
        planIconColor: 'black',
        specsIconColor: 'black',
        inputsIconColor: 'black',
        selectedUsers: [],
        popN: '',
        defaultPrice: this.props.defaultPrice == 0 ? 'Free' : this.props.defaultPrice,
        orderActivated: false,
        relatedCards: [],
        selectedQuestions: [],
        selectedAttributes: [],
        screenTransitionList: [],
        headerStyle: {backgroundColor: 'transparent'},
        iconColor: 'white',
        ModalOpen: false,
        hideTitleBar: false,
        selectModalOpen: false,
        planModalOpen: false,
        selectedPlanId: '',
        inputModalOpen: false,
        modalHeight: height * 0.50,
        loaded: false,
        text: spDetailedCard.cardDescription.substring(0, 120),
        Token: '',
      };
    },

    componentWillUnmount(){
      if (this.props.routedFrom == 'cardTray' || this.props.routedFrom == 'timeLineCard') {
        this.props.onUnmount(this.state.liked);
      }

    },
    componentDidMount() {
      AsyncStorage.getItem("UserToken")
        .then((token) => {
          this.setState({Token: token});

          return getDetailCard(token, this.props.cardId)
        })
        .then((resp) => {
          console.log('@@@@@@ detailedCard Resp', resp);
          //resp.listOfAttributes = cardQuestion;
          //  resp.cardQuestion = [1,2,3];
          this.setState({DataSource: resp, loaded: true, liked: resp.isLiked, CTA: resp.callToAction});
          console.log('@@@@@@@@@@ Plan Length @@@@@@@', resp.plans.length);
          console.log('@@@@@@@@@@ Attributes Length @@@@@@@', resp.listOfAttributes.length);
          console.log('@@@@@@@@@@ Card Question @@@@@@@', resp.cardQuestion.length);
          resp.plans.length > 0 ? this.state.screenTransitionList.push(16) : '';
          resp.listOfAttributes.length > 0 ? this.state.screenTransitionList.push(17) : '';
          resp.cardQuestion.length > 0 ? this.state.screenTransitionList.push(18) : '';
          console.log('@@@@@@@@@@ Screen Ids@@@@@@@@@@@@@@@', this.state.screenTransitionList);

          return getCompanyCards(this.state.Token, this.props.cardId, resp.companyId)
        })
        .then((resp) => {
          this.setState({relatedCards: resp, loaded: true, popN: this.state.screenTransitionList.length});

        })
        .catch((err) => {
          console.log(err);
          Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
        })
    },
    onSubmitCardQuestions(questions){
      console.log('@@@@@@@@@@@@@@@@@card questions', questions);
    },

    toggleView() {
      this.setState({
        showView: !this.state.showView
      })
    },

    screenTransitions(list) {
      if (list[0] == 16) {
        this.onPressHandler('plan', list)
        console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      }
      else if (list[0] == 17) {
        console.log('Trying to render choices');
        this.onPressHandler('choices', list)
      }
      else if (list[0] == 18) {
        this.onPressHandler('inputs', list)
      }
    },

    callToAction()  {
      this.setState({orderActivated: true});
      console.log('@@@@@@@@@@@ Screen Transition List', this.state.screenTransitionList);
      let list = this.state.screenTransitionList;
      if (list.length > 0) {
        console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%QQQQQQQQQQQ');
        //   let x = list.filter((x)=>{return x== 16})
        // ;

        this.screenTransitions(list);

      }
      else {


        var userList = this.state.selectedUsers ? this.state.selectedUsers : [];
        var newList = [];
        console.log('@@@@@@@@@@@@@@@@@ selected List', this.state.selectedUsers);
        console.log('@@@@@@@@@@@@@@@@@ selected XXList', userList);
        if (userList.length > 0) {
          userList.map((user, index) => {
            newList.push(user.publicId);
          });
        }
        console.log('@@@@@@@@@@@@@@@@@ selected XXList', userList);
        var order = {
          cardId: this.props.cardId,
          planId: this.state.selectedPlanId,
          orderAttributes: this.state.selectedAttributes,
          orderQuestions: this.state.selectedQuestions,
          listOfAddresses: [],
          selectedUsers: newList,
          isAutomaticRenewalApplied: true,
          quantity: 0,
        }


        orderObject['cardId'] = this.props.cardId;
        orderObject['selectedUsers'] = newList;
        orderObject['isAutomaticRenewalApplied'] = true;
        orderObject['quantity'] = 0;
        orderObject['planId'] = this.state.selectedPlanId;
        //console.log('@@@@@@@@@@@order Obj', orderObject);
        placeOrder(this.state.Token, order)
          .then((resp) => {
            if (resp.isPaymentApplied) {
              this.props.navigator.push({
                id: 110,
                transactionId: resp.orderId,
                subscriptionId: resp.subscriptionId
              })

            }
            else {
              this.props.navigator.push({
                id: 12,
                transactionId: resp.orderId,
                subscriptionId: resp.subscriptionId,
                routedFrom: 'freeCard'
              })
            }
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
          })
      }

    },

    likeThisCard() {
      if (!this.state.liked) {
        saveCard(this.state.Token, this.props.cardId);
        this.setState({
          liked: !this.state.liked,
          likesCount: this.state.likesCount + 1,
          showRelatedCards: true
        });
      }
      else {
        unLikeCard(this.state.Token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount - 1});
      }
    },

    renderReview(obj, reviewsCount){
      /*obj = {
       profilePicUrl: 'http://networthier.com/wp-content/uploads/2016/04/Sunny-Deol-Net-Worth.jpg',
       name: 'Sunny Deol',
       reviewText: 'I like this service want to buy it for my use.'
       }*/
      let countOfReviews = reviewsCount > 1 ? reviewsCount : '';
      if (obj != null) {
        let userImage = obj.profilePicUrl && obj.profilePicUrl.length > 3 ? {uri: obj.profilePicUrl} : defaultPic;
        return (
          <View >
            <View style={{marginHorizontal:30, marginTop:25}}>
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
                onPress={() => this.props.navigator.push({id: 11, cardId: this.props.cardId})}>
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

    cardShareModalOpen(card) {
      this.setState({cardShareModal: true, card: card});
    },

    cardShareModalClose() {
      this.setState({cardShareModal: false});
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
            <View style={cardBaseStyle.lineSeparator}/>
          </View>
        );
      }
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

    renderRelatedCards(relatedCards) {
      relatedCards = relatedCards ? relatedCards : [];
      if (relatedCards.length > 0) {
        return (
          <View style={{marginHorizontal:15}}>
            <CardTray cards={relatedCards} token={this.state.Token} navigator={this.props.navigator}/>
          </View>);
      }
      else {
        return <View/>;
      }
    },

    imageSwiper() {
      let {DataSource} =this.state;
      return (
        <View>
          <Swiper
            loop={true}
            height={height * 0.35}
            width={width}
            showButtons={true}
            style={{top: 0, left: 0, right: 0, position: 'absolute'}}
          >
            {this.renderImages()}
          </Swiper>
        </View>
      );
    },

    renderImages() {
      let images = [];
      let myObj = this.dataFactory();
      images.push(myObj.primaryImage);
      images = images.concat(this.state.DataSource.additionalMediaUrls);
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
                          onPress={() => {
					if (this.state.orderActivated) {
						Alert.alert(
							'Alert!!!',
							'Do You Want to Discard?',
							[
								{text: 'Yes', onPress: () => this.props.navigator.pop(), style: 'cancel'},
								{text: 'NO', onPress: () => console.log('No Pressed'), style: 'cancel'}
							]
						)
					} else {
						this.props.navigator.pop()
					}
				}}>
          <View style={{alignSelf:'center', marginVertical: 7}}>
            <Icon name={'icon-back_screen_black'} fontSize={18} color={iconColor}/>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 7, marginRight:10}}>
            <TouchableOpacity style={[{paddingHorizontal: 0, flexDirection: 'row'}]}
                              onPress={this.likeThisCard}>
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

    renderNavBar(){
      return (
        <View style={[style.navbar, Style.rowWithSpaceBetween, {marginHorizontal:8}]}>
          <Text style={cardBaseStyle.cardPrice}>
            {this.state.defaultPrice}
          </Text>
          <TouchableOpacity style={cardBaseStyle.actionButton}
                            onPress={() => {
							this.callToAction()
					}}>
            <Text style={[Style.textColorWhite, {fontWeight: '400', fontSize: 18}]}>
              {this.state.CTA}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },

    shareCardInSupport() {
      console.log('Support Called..');
      let spPublicID = {
        spUserId: this.state.DataSource.spPublicId,
      }

      requestSupportOnACard(this.state.DataSource.cardId, spPublicID, this.state.Token)
        .then((value) => {
          console.log('@@@@@@@@@@@@@@@@valueSupport', value);
          // this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj});
          this.props.navigator.push({
            id: 321,
            userName: this.props.spName,
            chatGroupId: value.id,
            card: this.state.DataSource,
            publicId: this.state.DataSource.spPublicId,
          });
        });
      //let name = this.props.spName ? this.props.spNmae : 'Ghost';
      //AsyncStorage.setItem('chatwithUserId', this.props.spPublicId);
      // this.props.navigator.push({id:321, card: this.props.cardObj, publicId: this.props.spPublicId});
      //this.props.navigator.push({id:320, card: this.state.card});
      //this.props.navigator.push({id: 260, userName: this.props.spName, card: this.props.cardObj})
    },

    onPressHandler(type, list) {
      let DataSource = this.state.DataSource;
      let plans = DataSource.plans && DataSource.plans.length > 0;
      let choices = DataSource.listOfAttributes && DataSource.listOfAttributes.length > 0;
      let inputs = DataSource.cardQuestion && DataSource.cardQuestion.length > 0;
      if (type === 'plan' && plans) {
        this.props.navigator.push({
          id: 16,
          plans: DataSource.plans,
          planId: this.state.selectedPlanId,
          screenTransitionList: list ? list : this.state.screenTransitionList,
          popN: this.state.popN,
          attributes: DataSource.listOfAttributes,
          onUnmount: (planId, Users, selectedPrice) => {
            console.log('@@@@@@@@@@@@@SelectedPlanID@@@@@@@@@@XX', planId);
            console.log('@@@@@@@@@@@@@SelectedPlan Price@@@@@@@@@@XX', selectedPrice);
            console.log('@@@@@@@@@@@@@USERS @@@@@@@@@@XX', Users);
            let list = this.state.screenTransitionList;

            planId ? this.setState({
                screenTransitionList: list.filter((x) => {
                  return x != 16
                }),
                selectedUsers: Users
              }) : '';
            list = list.filter((x) => {
              return x != 16
            });
            if (list.length > 0) {
              console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%QQQQQQQQQQQ', list);
              //   let x = list.filter((x)=>{return x== 16});
              this.screenTransitions(list);
            }

            this.setState({
              selectedPlanId: planId,
              selectedUsers: Users,
              defaultPrice: selectedPrice,
              planIconColor: StyleConstants.primary,
              planSelected: true
            });
            console.log('@@@@@@@@@@@@@SelectedPlanID Users@@@@@@@@@@XX', Users);
          }
        })
      }
      else if (type === 'choices' && choices) {
        console.log('@@@@@@@here we go');
        this.props.navigator.push({
          id: 17,
          attributes: DataSource.listOfAttributes,
          selectedAttributes: this.state.selectedAttributes,
          screenTransitionList: list ? list : this.state.screenTransitionList,
          popN: this.state.popN,
          onPressSubmit: (selectedAttributes) => {
            let list = this.state.screenTransitionList;
            this.setState({selectedAttributes: selectedAttributes, specsIconColor: StyleConstants.primary});
            selectedAttributes ? this.setState({
                specsSelected: true,
                screenTransitionList: list.filter((x) => {
                  return x != 17
                })
              }) : '';
            list = list.filter((x) => {
              return x != 17
            });
            if (list.length > 0) {
              console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%QQQQQQQQQQQ', list);
              //   let x = list.filter((x)=>{return x== 16});
              this.screenTransitions(list);
            }

            console.log('@@@@@selectedAttributes', orderObject);
          },
        })
      }
      else if (type === 'inputs' && inputs) {
        this.props.navigator.push({
          id: 18,
          screenTransitionList: list ? list : this.state.screenTransitionList,
          popN: this.state.popN,
          questions: DataSource.cardQuestion,
          selectedQuestions: this.state.selectedQuestions,
          onPressSubmit: (sharedInfo) => {
            let list = this.state.screenTransitionList;
            this.setState({selectedQuestions: sharedInfo, inputsIconColor: StyleConstants.primary});
            sharedInfo ? this.setState({
                inputsSelected: true,
                screenTransitionList: list.filter((x) => {
                  return x != 18
                })
              }) : '';
            list = list.filter((x) => {
              return x != 18
            });
            if (list.length > 0) {
              console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%QQQQQQQQQQQ', list);
              //   let x = list.filter((x)=>{return x== 16});
              this.screenTransitions(list);
            }
            //  orderObject['orderQuestions'] = sharedInfo;
            //console.log('@@@@@shared info', orderObject);
          },
        })
      }
    },

    renderNetworkMessages(networkStatus) {
      if (networkStatus) {
        let freeTrial =
          <View>
            <View style={[styles.descriptionArea, {marginVertical: 20, marginHorizontal:15, flexDirection: 'row'}]}>
              <View style={{ alignSelf:'center'}}>
                <Icon name={'icon-offer_expires_in'} fontSize={16} color={'black'}/>
              </View>
              <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, alignSelf:'center'}]}>
                {networkStatus.freeTrail ? networkStatus.freeTrail + '100 Days Free Trial' : '100 Days Free Trial'}
              </Text>
            </View>
            <View style={Style.lineSeparator}/>
          </View>;

        let startsIn =
          <View>
            <View style={[styles.descriptionArea, {marginVertical: 20, marginHorizontal:15, flexDirection: 'row'}]}>
              <View style={{ alignSelf:'center'}}>
                <Icon name={'icon-offer_starts_in'} fontSize={16} color={'black'}/>
              </View>
              <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, alignSelf:'center'}]}>
                {networkStatus.startsIn ? networkStatus.startsIn : 'Subscription Starts In 1 Days'}
              </Text>
            </View>
            <View style={Style.lineSeparator}/>
          </View>;

        let expiresIn =
          <View>
            <View style={[styles.descriptionArea, {marginVertical: 20, marginHorizontal:15, flexDirection: 'row'}]}>
              <View style={{ alignSelf:'center'}}>
                <Icon name={'icon-offer_expires_in'} fontSize={16} color={'black'}/>
              </View>
              <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, alignSelf:'center'}]}>
                {networkStatus.daysLeft ? networkStatus.daysLeft : 'Offer Expires In 5 Days'}
              </Text>
            </View>
            <View style={Style.lineSeparator}/>
          </View>;

        let quantityLeft =
          <View>
            <View style={[styles.descriptionArea, {marginVertical: 20, marginHorizontal:15, flexDirection: 'row'}]}>
              <View style={{ alignSelf:'center'}}>
                <Icon name={'icon-quantity'} fontSize={18} color={'black'}/>
              </View>
              <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, alignSelf:'center'}]}>
                {networkStatus.quantityLeft ? networkStatus.quantityLeft : 'Only 10 Items Left in Stock'}
              </Text>
            </View>
            <View style={Style.lineSeparator}/>
          </View>;
        return (
          <View style={{marginHorizontal:15}}>
            {startsIn}
            {expiresIn}
            {quantityLeft}
            {freeTrial}

          </View>
        );
      }
    },

    renderTabView (DataSource) {
      let plans = DataSource.plans && DataSource.plans.length > 0;
      let choices = DataSource.listOfAttributes && DataSource.listOfAttributes.length > 0;
      let inputs = DataSource.cardQuestion && DataSource.cardQuestion.length > 0;
      let plansColor = plans ? StyleConstants.primary : 'black';
      let inputsColor = inputs ? StyleConstants.primary : 'black';
      let choicesColor = choices ? StyleConstants.primary : 'black';
      let editIcon = <View style={{position:'absolute', marginLeft: 0, zIndex:2}}>
        <Icon name={'icon-edit-profile'} fontSize={11} color={'#ff9999'}/>
      </View>;
      return (
        <View style={[Style.rowWithSpaceBetween, cardBaseStyle.tabView]}>
          <TouchableOpacity style={[cardBaseStyle.icon]}
                            onPress={() => this.onPressHandler('plan')}>

            <Icon name={'icon-plans'} fontSize={20} color={this.state.planIconColor}/>
            {this.state.planSelected && editIcon}

            <Text
              style={[Style.f17, {marginTop: 9,flexWrap:'wrap', color: plansColor, fontWeight: this.state.planSelected?'500': '200'}]}>
              {DataSource.plans ? DataSource.plans.length + ' ' : ''}Plans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[cardBaseStyle.icon]}
            onPress={() => this.onPressHandler('choices')}>
            <Icon name={'icon-choices'} fontSize={20} color={this.state.specsIconColor}/>
            {this.state.specsSelected && editIcon }
            <Text
              style={[Style.f17, {marginTop: 8, color: choicesColor, fontWeight: this.state.specsSelected ? '500' : '200'}]}>
              {DataSource.listOfAttributes ? DataSource.listOfAttributes.length + ' ' : ''}
              Specs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[cardBaseStyle.icon]}
            onPress={() => this.onPressHandler('inputs')}>
            <Icon name={'icon-input'} fontSize={20} color={this.state.inputsIconColor}/>
            {this.state.inputsSelected && editIcon}
            <Text
              style={[Style.f17, {marginTop: 8, color: inputsColor, flexWrap:'wrap', fontWeight: this.state.inputsSelected ? '500' : '200'}]}>
              {DataSource.cardQuestion ? DataSource.cardQuestion.length + ' ' : ' '}
              Inputs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon]}
                            onPress={() => this.shareCardInSupport()}>
            <Icon name={'icon-support'} fontSize={20} color={StyleConstants.primary}/>
            <Text style={[Style.f17, Style.textColorPrimary, {marginTop: 8}]}>
              More
            </Text>
          </TouchableOpacity>
        </View>
      );
    },

    renderRelatedUser(image) {
      return (
        <View style={{marginLeft: 2}}>
          <Image
            style={styles.shareUser}
            source={image}
            resizeMode={'cover'}
          />
        </View>
      );
    },

    renderNetworkNotification(relatedUsers, networkMessage) {
      let image = relatedUsers[0] && relatedUsers[0].profilePictureURL && relatedUsers[0].profilePictureURL.length > 3 ? {uri: relatedUsers[0].profilePictureURL} : defaultPic;
      let image2 = relatedUsers[1] && relatedUsers[1].profilePictureURL && relatedUsers[1].profilePictureURL.length > 3 ? {uri: relatedUsers[1].profilePictureURL} : false;
      let image3 = relatedUsers[2] && relatedUsers[2].profilePictureURL && relatedUsers[2].profilePictureURL.length > 3 ? {uri: relatedUsers[2].profilePictureURL} : false;
      let Name = this.props.spName ? this.props.spName : '';
      return (
        <View style={{justifyContent:'center', width:width*0.85, borderBottomWidth:0.5}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              style={styles.shareUser}
              source={image}
              resizeMode={'cover'}
            />
            {image2 && this.renderRelatedUser(image2)}
            {image3 && this.renderRelatedUser(image3)}
          </View>
          <Text
            style={[Style.f16, Style.textColorBlack, {justifyContent: 'center',alignSelf:'center',   marginTop: 20}]}>
            {networkMessage}
          </Text>
        </View>

      );
    },

    dataFactory() {
      let {DataSource} = this.state;
      let savedRelatedUsers = this.props.savedRelatedUsers ? this.props.savedRelatedUsers : DataSource.savedRelatedUsers;
      let sharedRelatedUsers = this.props.sharedRelatedUsers ? this.props.sharedRelatedUsers : DataSource.sharedRelatedUsers;
      let subscribedRelatedUsers = this.props.subscribedRelatedUsers ? this.props.subscribedRelatedUsers : DataSource.subscribedRelatedUsers;
      let cardTitle = this.props.cardTitle ? this.props.cardTitle : DataSource.cardTitle;
      let primaryImage = this.props.primaryMediaUrl ? this.props.primaryMediaUrl : DataSource.primaryMediaUrl;
      let spName = this.props.spName ? this.props.spName : DataSource.spName;
      let spLogo = this.props.spLogo ? this.props.spLogo : DataSource.spLogo;
      let spId = this.props.spPublicId ? this.props.spPublicId : DataSource.spPublicId;
      let overallRating = this.props.overallRating ? this.props.overallRating : DataSource.overallRating;
      let numberOfReviews = this.props.numberOfReviews ? this.props.numberOfReviews : DataSource.numberOfReviews;
      let isLiked = this.props.isLiked ? this.props.isLiked : DataSource.isLiked;
      let companyId = this.props.spId ? this.props.spId : DataSource.spId;
      let defaultPrice = this.props.price ? this.props.price : DataSource.price;
      let obj = {
        savedRelatedUsers,
        sharedRelatedUsers,
        subscribedRelatedUsers,
        cardTitle,
        primaryImage,
        spName,
        spLogo,
        spId,
        overallRating,
        numberOfReviews,
        isLiked,
        companyId,
        defaultPrice
      };
      return obj;
    },

    render() {
      let {DataSource} = this.state;
      let myObj = this.dataFactory();
      let savedRelatedUsers = myObj.savedRelatedUsers ? myObj.savedRelatedUsers : [];
      let sharedRelatedUsers = myObj.sharedRelatedUsers ? myObj.sharedRelatedUsers : [];
      let subscribedRelatedUsers = myObj.subscribedRelatedUsers ? myObj.subscribedRelatedUsers : [];
      let flag = savedRelatedUsers.length > 0 || sharedRelatedUsers.length > 0 || subscribedRelatedUsers.length > 0;
      let relatedUsers =
        <ScrollView horizontal={true}
                    style={{ borderBottomWidth:0.5, paddingVertical:10, marginHorizontal:28,height: 150,width:width*0.85}}>
          {savedRelatedUsers.length > 0 && this.renderNetworkNotification(savedRelatedUsers, DataSource.savedNetworkMessage)}
          { sharedRelatedUsers.length > 0 && this.renderNetworkNotification(sharedRelatedUsers, DataSource.sharedNetworkMessage)}
          { subscribedRelatedUsers.length > 0 && this.renderNetworkNotification(subscribedRelatedUsers, DataSource.subscribedNetworkMessage)}
        </ScrollView>


      if (this.state.loaded || 1) {
        let image = myObj.spLogo ? {uri: myObj.spLogo} : defaultPic;
        return (
          <View style={{flex: 1}}>
            {this.renderTitle()}
            <ScrollView onScroll={(e) => {
							e.nativeEvent.contentOffset.y > 145 ? this.setState({
								headerStyle: {backgroundColor: 'white'},
								iconColor: 'black'
							}) : this.setState({headerStyle: {backgroundColor: 'transparent'}, iconColor: 'white'})
						}}>
              <Animatable.View animation="fadeInUpBig">

                {this.imageSwiper()}

                <View style={[cardBaseStyle.spInfo, {marginTop: -14,}]}>
                  <TouchableOpacity activeOpacity={0.7}
                                    style={{
											justifyContent: 'center',
											flexDirection: 'row',
											alignItems: 'center'
										}}
                                    onPress={() =>
											this.props.navigator.push({
												id: 15,
												spPublicId: this.props.spId,
												companyId: this.props.companyId,
											})
										}>
                    <Image
                      style={cardBaseStyle.spImage}
                      source={image}
                      resizeMode={'cover'}
                    />
                    <Text style={cardBaseStyle.spName}>
                      { myObj.spName ? (myObj.spName.length > 24 ? myObj.spName.substring(0, 24) + '...' : myObj.spName) : ' '}
                    </Text>
                  </TouchableOpacity>

                </View>
                <Text style={[cardBaseStyle.cardTitle, {fontSize: Style.f24}]}>
                  {myObj.cardTitle}
                </Text>
                <StarRating
                  numberOfReviews={myObj.numberOfReviews}
                  overallRating={myObj.overallRating}
                  navigator={this.props.navigator}
                  style={{marginLeft: 15, marginTop:5}}
                  cardId={this.props.cardId}
                />
                <View style={cardBaseStyle.lineSeparator}/>
                {this.renderTabView(DataSource)}
                <View style={cardBaseStyle.lineSeparator}/>
                {this.expandableTextView(DataSource.cardDescription)}
                <View style={cardBaseStyle.lineSeparator}/>

                {this.renderNetworkMessages(DataSource.networkStatus)}
                {flag && relatedUsers}

                {this.renderReview(DataSource.topReview, myObj.numberOfReviews)}


                <TouchableOpacity
                  style={{marginVertical: 20, flexDirection:'row', justifyContent:'space-between',marginHorizontal: 30}}
                  onPress={() => this.props.navigator.push({
																		id: 21,
																		title: 'Terms of Service',
																		data: DataSource.termsOfServices,
																	})}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Terms of Service
                  </Text>
                  <Image
                    source={rightArrow}
                    style={{alignSelf:'center'}}
                    resizeMode={'contain'}
                  />

                </TouchableOpacity>
                <View style={cardBaseStyle.lineSeparator}/>
                <TouchableOpacity
                  style={{marginVertical: 20, marginHorizontal: 30,flexDirection:'row', justifyContent:'space-between'}}
                  onPress={() => this.props.navigator.push({
																		id: 21,
																		title: 'Return Policy',
																		data: DataSource.returnPolicy
																	})}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Return Policy
                  </Text>
                  <Image
                    source={rightArrow}
                    style={{alignSelf:'center'}}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <View style={cardBaseStyle.lineSeparator}/>
                {this.renderRelatedCards(this.state.relatedCards)}
              </Animatable.View>

            </ScrollView>
            {this.CardShare()}
            {this.renderNavBar()}
          </View>
        );
      }
      else {
        return (<Loader/>)
      }

    },
  });

export default SpDetaildedCard;

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
  cardImage: {
    resizeMode: 'cover',
    width: width,
    height: height * 0.35,
    // alignSelf: 'center',
    marginBottom: 5,
  },
  relatedImage: {
    width: 170,
    height: 95,
    // alignSelf: 'center',
    // marginBottom: 5,
  },
});