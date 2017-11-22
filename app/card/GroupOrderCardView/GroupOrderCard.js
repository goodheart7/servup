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
  Image,
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
  getGroupSubscription,
  getCompanyCards,
  requestSupportOnACard,
  saveCard,
  unLikeCard,
  groupOrder,
} from '../../../lib/networkHandler';
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
var GroupOrderCard = React.createClass(
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
        liked: this.props.isLiked,
        selectedUsers: [],
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
          this.setState({Token: token});
          return getGroupSubscription(token, this.props.subscriptionId)
        })
        .then((resp) => {
          //resp.listOfAttributes = cardQuestion;
          //  resp.cardQuestion = [1,2,3];
          this.setState({DataSource: resp.card, completeData:resp, loaded: true});
          console.log('@@@@@@@@@@ Plan Length @@@@@@@', resp.plans.length);
          console.log('@@@@@@@@@@ Attributes Length @@@@@@@', resp.listOfAttributes.length);
          console.log('@@@@@@@@@@ Card Question @@@@@@@', resp.cardQuestion.length);
          resp.plans.length > 0 ? this.state.screenTransitionList.push(16) : '';
          resp.listOfAttributes.length > 0 ? this.state.screenTransitionList.push(17) : '';
          resp.cardQuestion.length > 0 ? this.state.screenTransitionList.push(18) : '';
          console.log('@@@@@@@@@@ Screen Ids@@@@@@@@@@@@@@@', this.state.screenTransitionList);
          return getCompanyCards(this.state.Token, resp.companyId)
        })
        .then((resp) => {
          this.setState({relatedCards: resp, loaded:true});

        })
        .catch((err) => {
          console.log(err);
     //     Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
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
        //   let x = list.filter((x)=>{return x== 16});
        this.screenTransitions(list);

      }
      else {


        var userList = this.state.selectedUsers ? this.state.selectedUsers : [];
        var newList = [];
        console.log('@@@@@@@@@@@@@@@@@ selected List', this.state.selectedUsers);
        console.log('@@@@@@@@@@@@@@@@@ selected XXList', userList);
        if (userList.length > 0) {
          userList.map((user, index) => {
            newList.push(user.userPublicId);
          });
        }
        var order = {
          cardId: this.state.DataSource.cardId,
          planId: this.state.DataSource.listOfPlans[0].id,
          orderAttributes: this.state.selectedAttributes,
          orderQuestions: orderObject.orderQuestions,
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
        let orderID = this.state.completeData.orderId;
        let subscriptionID = this.props.subscriptionId;
        groupOrder(this.state.Token,orderID, subscriptionID ,order)
          .then((resp) => {
            if (resp.isSubscribed) {
              this.props.navigator.push({id: 12, subscriptionId: this.props.subscriptionId, routedFrom: 'freeCard'})
            } else {
              Alert.alert('Sorry!!!', 'Error in Placing subscription');
            }
          })
          .catch((err) => {
            console.log(err);
           // Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
          })
      }

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
    renderReview(obj){
      /*obj = {
       profilePicUrl: 'http://networthier.com/wp-content/uploads/2016/04/Sunny-Deol-Net-Worth.jpg',
       name: 'Sunny Deol',
       reviewText: 'I like this service want to buy it for my use.'
       }*/
      if (obj != null) {
        return (
          <View >
            <Text style={[Style.f16, {color:'green',marginVertical:10, marginLeft:10}]}> Reviews</Text>
            <TouchableOpacity
              // onPress = {this.openCreator}
              style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 12
              }}>
              <Image
                style={cardBaseStyle.reviewerImage}
                source={{uri: obj.profilePicUrl}}
                resizeMode={'cover'}
              />
              <View style={{flexDirection: 'column',marginHorizontal:10}}>
                <Text style={[Style.f16, Style.textColorPrimary]}>
                  {obj.name}
                </Text>
                <Text style={[Style.f16, Style.textColorBlack]}>
                  {moment.utc(obj.createdAt).format('MMM YYYY')}
                </Text>
              </View>
              <StarRating
                overallRating={obj.rating}
                style={{marginLeft: 30}}
                navigator={this.props.navigator}
                cardId={this.props.cardId}
              />
            </TouchableOpacity>
            <View style={[cardBaseStyle.descriptionArea]}>
              <Text style={[cardBaseStyle.descriptionText]}>
                {obj.reviewText}
              </Text>
            </View>
            <TouchableOpacity style={[Style.rowWithSpaceBetween, {marginHorizontal: 20, marginVertical: 10}]}
                              onPress={() => this.props.navigator.push({id: 11, cardId: this.props.cardId})}>
              <Text style={[Style.f16, Style.textColorPrimary, {alignSelf: 'center', justifyContent: 'center'}]}>
                Read all Reviews
              </Text>
            </TouchableOpacity>
            <View style={Style.lineSeparator}/>
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

          </View>
        );
      }
    },

    renderListofCards (relatedCards) {
      let saveEmpty = <Icon name={'icon-review_unfilled'} fontSize={25} color={'black'}/>;
      let saveFilled = <Icon name={'icon-review_filled'} fontSize={25} color={StyleConstants.primary}/>;

      return relatedCards.map((obj, index) => {
        return (
          <View style={style.relatedCardView} key={index}>
            <TouchableOpacity onPress={() => {
              this.props.navigator.push({id: 40, cardId: obj.cardId})
            }}>
              <Image
                source={{uri: obj.primaryMediaUrl}}
                style={style.relatedImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <View >
              <Text style={[Style.f16, Style.textColorBlack, {
                width: 180,
                marginHorizontal: 5,
                flex: 1,
                flexWrap: 'wrap',
                marginVertical: 3
              }]}>
                {obj.cardTitle}
              </Text>
            </View>
            <View style={Style.rowWithSpaceBetween}>
              <StarRating
                numberOfReviews={obj.numberOfReviews}
                overallRating={4}
                cardId={this.props.cardId}
                style={{marginLeft: 0, marginTop: 3}}
                navigator={this.props.navigator}
              />
              <TouchableOpacity style={[{paddingHorizontal: 0, marginRight: -15, marginTop: 2, flexDirection: 'row'}]}
                                onPress={this.likeThisCard}>
                {this.state.liked ? saveFilled : saveEmpty}
                <Text style={[styles.greyTextLight, {textAlign: 'left'}]}>
                  {this.state.likesCount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
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
      //console.log('@@@@@@@@@@@@@@relatedCards', relatedCards);
      if (relatedCards.length > 0) {
        return (
          <View >
            <View style={Style.lineSeparator}/>
            <Text style={[Style.f18, {marginHorizontal: 20, marginVertical: 10}]}>
              Also from {this.state.DataSource.spName}
            </Text>
            <ScrollView horizontal={true}>
              {this.renderListofCards(relatedCards)}
            </ScrollView>
          </View>);
      }
      else {
        return <View style={{backgroundColor: 'white'}}/>;
      }
    },
    imageSwiper() {
      let {DataSource} =this.state;
      return (
        <View>
          <Swiper
            loop={true}
            height={height * 0.30}
            width={width}
            showButtons={true}
            zIndex={-10}
          >
            {this.renderImages()}
          </Swiper>
        </View>
      );
    },

    renderImages() {
      let images = [];
      images.push(this.state.DataSource.primaryMediaUrl);
      images = images.concat(this.state.DataSource.additionalMediaUrls);
      if (images != null) {
        return images.map((url, index) => {
          return (
            <View key={index}>
              <Image
                key={index}
                source={{uri: url}}
                style={[cardBaseStyle.cardImage]}
              />
            </View>
          );
        })
      }
    },

    renderTitle (){
      let style = this.state.headerStyle;
      let iconColor = this.state.iconColor;
      let saveEmpty = <Icon name={'icon-review_unfilled'} fontSize={28} color={iconColor}/>;
      let saveFilled = <Icon name={'icon-review_filled'} fontSize={28} color={StyleConstants.primary}/>;
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
          <Icon name={'icon-arrow-left2'} fontSize={30} color={iconColor}/>
          <View style={{flexDirection: 'row', marginHorizontal: 10}}>
            <TouchableOpacity style={[{paddingHorizontal: 0, flexDirection: 'row'}]} onPress={this.likeThisCard}>
              {this.state.liked ? saveFilled : saveEmpty}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favButtons, {marginLeft: 5}]}
                              onPress={() => this.cardShareModalOpen(this.state.DataSource)}>
              <Icon name={'icon-Share_icon'} fontSize={32} color={iconColor}/>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

      );
    },

    renderNavBar(){
      return (
        <View style={[style.navbar, Style.rowWithSpaceBetween]}>
          <Text style={cardBaseStyle.cardPrice}>
            {this.state.defaultPrice}
          </Text>
          <TouchableOpacity style={cardBaseStyle.actionButton}
                            onPress={() => {
                              this.callToAction()
                            }}>
            <Text style={[Style.textColorWhite, {fontWeight: '400', fontSize: 18}]}>
              {'Submit'}
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
            userName: this.state.DataSource.spName,
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
      if (type === 'plan') {
        this.props.navigator.push({id: 10.1, data: DataSource.listOfPlans[0], groupOrder:true });
      }
      else if (type === 'choices' && choices) {
        console.log('@@@@@@@here we go');
        this.props.navigator.push({
          id: 17,
          attributes: DataSource.listOfAttributes,
          selectedAttributes: this.state.selectedAttributes,
          screenTransitionList: list ? list : this.state.screenTransitionList,
          popN: this.state.screenTransitionList.length,
          onPressSubmit: (selectedAttributes) => {
            let list = this.state.screenTransitionList;
            this.setState({selectedAttributes: selectedAttributes});
            selectedAttributes ? this.setState({
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
          popN: this.state.screenTransitionList.length,
          screenTransitionList: list ? list : this.state.screenTransitionList,
          questions: DataSource.cardQuestion,
          onPressSubmit: (sharedInfo) => {
            let list = this.state.screenTransitionList;
            this.setState({selectedQuestions: sharedInfo});
            sharedInfo ? this.setState({
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
            orderObject['orderQuestions'] = sharedInfo;
            console.log('@@@@@shared info', orderObject);
          },
        })
      }
    },

    renderNetworkMessages(networkStatus) {
      return (
        <View>
          <View
            style={[styles.descriptionArea, {marginVertical: 15, marginHorizontal: 20, flexDirection: 'row'}]}>
            <Icon name={'icon-paper-plane'} fontSize={16} color={'black'}/>
            <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, marginTop: -5}]}>
              {networkStatus.freeTrail}
            </Text>
          </View>
          <View style={Style.lineSeparator}/>
        </View>
      );
    },
    renderTabView (DataSource) {
      let plans = DataSource.plans && DataSource.plans.length > 0;
      let choices = DataSource.listOfAttributes && DataSource.listOfAttributes.length > 0;
      let inputs = DataSource.cardQuestion && DataSource.cardQuestion.length > 0;
      let plansColor = plans ? StyleConstants.primary : 'black';
      let inputsColor = inputs ? StyleConstants.primary : 'black';
      let choicesColor = choices ? StyleConstants.primary : 'black';
      return (
        <View style={[Style.rowWithSpaceBetween, cardBaseStyle.tabView]}>
          <TouchableOpacity style={[cardBaseStyle.icon, {flexDirection: 'column'}]}
                            onPress={() => this.onPressHandler('plan')}>
            <View style={{marginBottom: -3, marginTop: 2, zIndex: -2}}>
              <Icon name={'icon-communication-connection-content-jigsaw-network-pu'} fontSize={30} color={plansColor}/>
            </View>
            <Text style={[Style.f15, {marginTop: 7, color: plansColor}]}>
              {DataSource.plans ? DataSource.plans.length + ' ' : ''}Plans
            </Text>

          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]}
                            onPress={() => this.onPressHandler('choices')}>
            <Icon name={'icon-attributes'} fontSize={30} color={choicesColor}/>
            <Text style={[Style.f15, {marginTop: 5, color: choicesColor}]}>
              {DataSource.listOfAttributes ? DataSource.listOfAttributes.length + ' ' : ''}Specs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]}
                            onPress={() => this.onPressHandler('inputs')}>
            <Icon name={'icon-inputs-1'} fontSize={30} color={inputsColor}/>
            <Text style={[Style.f15, {marginTop: 5, color: inputsColor}]}>
              {DataSource.cardQuestion ? DataSource.cardQuestion.length + ' ' : ' '}Inputs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]} onPress={() => this.shareCardInSupport()}>
            <Icon name={'icon-inbox2'} fontSize={30} color={StyleConstants.primary}/>
            <Text style={[Style.f15, Style.textColorPrimary, {marginTop: 5}]}>
              Support
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
      let image = relatedUsers[0] ? {uri: relatedUsers[0]} : defaultPic;
      let image2 = relatedUsers[1] ? {uri: relatedUsers[1]} : false;
      let image3 = relatedUsers[0] ? {uri: relatedUsers[0]} : false;
      let Name = this.props.spName ? this.props.spName : '';
      return (
        <View>
          <View style={[styles.descriptionArea, {
            marginVertical: 20, justifyContent: 'center'
          }]}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View>
                <Image
                  style={styles.shareUser}
                  source={image}
                  resizeMode={'cover'}
                />
              </View>
              {image2 && this.renderRelatedUser(image2) }
              {image3 && this.renderRelatedUser(image3) }
            </View>
            <View style={{justifyContent: 'center', marginTop: 10, marginLeft: 30,}}>
              <Text style={[Style.f16, Style.textColorBlack, {justifyContent: 'center'}]}>
                {networkMessage}
              </Text>
            </View>
          </View>
          <View style={Style.lineSeparator}/>
        </View>

      );
    },


    render() {
      let {DataSource} = this.state
      if (this.state.loaded) {
        let image = DataSource.spLogo ? {uri: DataSource.spLogo} : defaultPic;
        return (
          <View style={{flex: 1}}>
            {this.renderExtraSpaceForIOS()}
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
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() =>
                      this.props.navigator.push({
                        id: 310,
                        otherPersonId: DataSource.spPublicId
                      })
                    }>
                    <Image
                      style={cardBaseStyle.spImage}
                      source={image}
                      resizeMode={'cover'}
                    />
                    <Text style={cardBaseStyle.spName}>
                      { DataSource.spName ?
                        (DataSource.spName.length > 24 ? DataSource.spName.substring(0, 24) + '...' : DataSource.spName)
                        : ' '}
                    </Text>
                  </TouchableOpacity>

                </View>
                <Text style={[cardBaseStyle.cardTitle, {fontSize: Style.f24}]}>
                  {DataSource.cardTitle}
                </Text>
                <StarRating
                  numberOfReviews={DataSource.numberOfReviews}
                  overallRating={DataSource.overallRating}
                  navigator={this.props.navigator}
                  style={{marginLeft: 15}}
                  cardId={this.props.cardId}
                />
                <View style={Style.lineSeparator}/>
                {this.renderTabView(DataSource)}
                <View style={Style.lineSeparator}/>
                {this.expandableTextView(this.state.DataSource.cardDescription)}
                <View style={Style.lineSeparator}/>
                {this.renderNetworkMessages(this.state.completeData.networkStatus)}
                {this.renderNetworkNotification(this.state.completeData.relatedUsers, this.state.completeData.networkMessage)}

                {this.renderReview(this.state.DataSource.topReview)}


                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 20}}
                                  onPress={() => this.props.navigator.push({
                                    id: 21,
                                    title: 'Terms of Service',
                                    data: DataSource.termsOfServices,
                                  })}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <View style={Style.lineSeparator}/>
                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 20}}
                                  onPress={() => this.props.navigator.push({
                                    id: 21,
                                    title: 'Return Policy',
                                    data: DataSource.returnPolicy
                                  })}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Return Policy
                  </Text>
                </TouchableOpacity>

                {this.renderRelatedCards(this.state.relatedCards)}
              </Animatable.View>

            </ScrollView>
            {this.CardShare()}
            {this.renderNavBar()}
          </View>
        );
      }
      else {
        return(<Loader/>)
      }

    },
  });

export default GroupOrderCard;

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
  relatedImage: {
    width: 170,
    height: 95,
    // alignSelf: 'center',
    // marginBottom: 5,
  },
});
