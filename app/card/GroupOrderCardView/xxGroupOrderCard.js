/**
 * Created by Shoaib on 11/3/2016.
 */
import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  Alert,
  Image,
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
  requestSupportOnACard,
  getRelatedCards,
  placeOrder,
} from '../../../lib/networkHandler';
//import Modal from 'react-native-simple-modal';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Modalbox from 'react-native-modalbox';
import * as Animatable from 'react-native-animatable';
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
        liked: this.props.isLiked,
        DataSource: [],
        cardShareModal: false,
        completeData:[],
        relatedCards: [],
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
      AsyncStorage.getItem("UserToken").then((token) => {
        this.setState({Token: token});
        //     console.log('@@@@@@@@@@@@@@@@@@@@@@@@subcription Id',  this.props.subscriptionId);
        return getGroupSubscription(token, this.props.subscriptionId)
      })
        .then((resp) => {
          //resp.listOfAttributes = cardQuestion;
          // resp.cardQuestion = cardQuestion;
          this.setState({DataSource: resp.card, completeData:resp, loaded: true});
          console.log('@@@@@@@@@@ Plan Length && tuyttyty @@@@@@@', resp.card.listOfPlans.length);
          console.log('@@@@@@@@@@ Attributes Length @@@@@@@', resp.card.listOfAttributes.length);
          console.log('@@@@@@@@@@ Card Question @@@@@@@', resp.card.cardQuestion.length);
          resp.card.listOfAttributes.length > 0 ? this.state.screenTransitionList.push(17) : '';
          resp.card.cardQuestion.length > 0 ? this.state.screenTransitionList.push(18) : '';
          console.log('@@@@@@@@@@ Screen Ids@@@@@@@@@@@@@@@', this.state.screenTransitionList);
          return getRelatedCards(this.state.Token, this.props.subscriptionId)
        })
        .then((resp) => {
          this.setState({relatedCards: resp});
        })
        .catch((err) => {
          console.log(err);
          //Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
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

      if (list[0] == 17) {
        this.onPressHandler('choices')
      }
      else if (list[0] == 18) {
        this.onPressHandler('inputs')
      }
    },
    callToAction()  {
      console.log('@@@@@@@@@@@ Screen Transition List', this.state.screenTransitionList);
      let list = this.state.screenTransitionList;
      if (list.length > 0) {
        console.log('@@@@@@@@@@@@@@@@@@###############%%%%%%%%%%%%%%%%%%%%%%%%%%%QQQQQQQQQQQ');
        //   let x = list.filter((x)=>{return x== 16});
        this.screenTransitions(list);

      }
      else {
        var order = {
          cardId: this.props.cardId,
          planId: this.state.selectedPlanId,
          orderAttributes: [],
          orderQuestions: [],
          listOfAddresses: [],
          selectedUsers: [],
          isAutomaticRenewalApplied: true,
          quantity: 0,
        }
        orderObject['cardId'] = this.props.cardId;
        orderObject['selectedUsers'] = [];
        orderObject['isAutomaticRenewalApplied'] = true;
        orderObject['quantity'] = 0;
        orderObject['planId'] = this.state.selectedPlanId;
        //console.log('@@@@@@@@@@@order Obj', orderObject);
        placeOrder(this.state.Token, order)
          .then((resp) => {
            this.props.navigator.push({id: 110, transactionId: resp.data})
          })
          .catch((err) => {
            console.log(err);
            //Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
          })
      }

    },

    renderReview(obj){
      obj = {
        profilePicUrl: 'http://networthier.com/wp-content/uploads/2016/04/Sunny-Deol-Net-Worth.jpg',
        name: 'Sunny Deol',
        reviewText: 'I like this service want to buy it for my use.'
      }
      if (obj != null) {
        return (
          <View >
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
              <View style={{flexDirection: 'column'}}>
                <Text style={[Style.f16, Style.textColorPrimary]}>
                  {obj.name}
                </Text>
                <Text style={[Style.f16, Style.textColorBlack]}>
                  Nov 2016
                </Text>
              </View>
              <StarRating
                overallRating={4}
                style={{marginLeft: 100}}
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

          </View>
        );
      }
      else {
        return <View/>;
      }

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

    renderRelatedCards(relatedCards) {
      relatedCards = relatedCards ? relatedCards : [];
      //console.log('@@@@@@@@@@@@@@relatedCards', relatedCards);
      if (relatedCards.length > 0) {
        return (
          <View >
            <View style={Style.lineSeparator}/>
            <Text style={[Style.f18, {marginHorizontal: 20, marginVertical: 10}]}>
              Also from {relatedCards[0].spName}
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

    shareCardInSupport() {
      console.log('Support Called..');
      let spPublicID = {
        spUserId: this.state.DataSource.spId,
      }
      requestSupportOnACard(this.state.DataSource.cardId, spPublicID , this.state.Token)
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
      let topMargin = {marginTop:0};
      if (Platform.OS === 'ios') {
        topMargin = Style.marginForIOS;
      }
      //console.log('@@@@@@@@@@@@@Style', style);
      return (
        <TouchableOpacity style={[cardBaseStyle.titleBar, style, topMargin]}
                          onPress={() => this.props.navigator.pop()}>
          <Icon name={'icon-arrow-left2'} fontSize={30} color={iconColor}/>
        </TouchableOpacity>
      );
    },

    renderNavBar(){
      return (
        <View style={[style.navbar, Style.rowWithSpaceBetween]}>
          <Text style={cardBaseStyle.cardPrice}>
            {'PKR 500 / Month'}
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

    onPressHandler(type) {
      let DataSource = this.state.DataSource;
      let plans = DataSource.listOfPlans && DataSource.listOfPlans.length > 0;
      let choices = DataSource.listOfAttributes && DataSource.listOfAttributes.length > 0;
      let inputs = DataSource.cardQuestion && DataSource.cardQuestion.length > 0;
      if (type === 'plan' && plans) {
        this.props.navigator.push({id: 10.1, data: DataSource.listOfPlans[0]});
      }
      else if (type === 'choices' && choices) {
        this.props.navigator.push({
          id: 17,
          attributes: DataSource.listOfAttributes,
          onPressSubmit: (selectedAttributes) => {
            orderObject['orderAttribute'] = selectedAttributes;
            let list = this.state.screenTransitionList;
            this.setState({
              screenTransitionList: list.filter((x) => {
                return x != 17
              })
            });
            console.log('@@@@@selectedAttributes', orderObject);
          },
        })
      }
      else if (type === 'inputs' && inputs) {
        this.props.navigator.push({
          id: 18,
          questions: DataSource.cardQuestion,
          onPressSubmit: (sharedInfo) => {
            let list = this.state.screenTransitionList;
            this.setState({
              screenTransitionList: list.filter((x) => {
                return x != 18
              })
            });
            orderObject['orderQuestions'] = sharedInfo;
            console.log('@@@@@shared info', orderObject);
          },
        })
      }
    },

    renderTabView (DataSource) {
      let plans= DataSource.plans && DataSource.plans.length > 0;
      let choices = DataSource.listOfAttributes && DataSource.listOfAttributes.length > 0;
      let inputs = DataSource.cardQuestion && DataSource.cardQuestion.length >0;
      let plansColor = plans ? StyleConstants.primary : 'black';
      let inputsColor = inputs? StyleConstants.primary : 'black';
      let choicesColor = choices? StyleConstants.primary : 'black';
      return (
        <View style={[Style.rowWithSpaceBetween, cardBaseStyle.tabView]}>
          <TouchableOpacity style={[cardBaseStyle.icon, {flexDirection: 'column'}]}
                            onPress={() => this.onPressHandler('plan')}>
            <View style={{marginBottom: -3, marginTop: 2, zIndex: -2}}>
              <Icon name={'icon-communication-connection-content-jigsaw-network-pu'} fontSize={30} color={plansColor}/>
            </View>
            <Text style={[Style.f15, {marginTop: 7, color:plansColor}]}>
              {DataSource.plans ? DataSource.plans.length + ' ' : ''}Plans
            </Text>

          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]}
                            onPress={() => this.onPressHandler('choices')}>
            <Icon name={'icon-attributes'} fontSize={30} color={choicesColor}/>
            <Text style={[Style.f15, {marginTop: 5, color:choicesColor}]}>
              {DataSource.listOfAttributes ? DataSource.listOfAttributes.length + ' ' : ''}Choices
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]}
                            onPress={() => this.onPressHandler('inputs')}>
            <Icon name={'icon-inputs-1'} fontSize={30} color={inputsColor}/>
            <Text style={[Style.f15, {marginTop: 5, color:inputsColor}]}>
              {DataSource.cardQuestion ? DataSource.cardQuestion.length + ' ' : ' '}Inputs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cardBaseStyle.icon, styles.flexColumn]} onPress={this.shareCardInSupport}>
            <Icon name={'icon-inbox2'} fontSize={30} color={StyleConstants.primary}/>
            <Text style={[Style.f15,Style.textColorPrimary, {marginTop: 5}]}>
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

                <View
                  style={[styles.descriptionArea, {marginVertical: 15, marginHorizontal: 20, flexDirection: 'row'}]}>
                  <Icon name={'icon-paper-plane'} fontSize={16} color={'black'}/>
                  <Text style={[Style.f18, Style.textColorBlack, {marginLeft: 10, marginTop: -5}]}>
                    Offer Expires in 2 Days
                  </Text>
                </View>
                <View style={Style.lineSeparator}/>
                <View style={[styles.descriptionArea, {
                  marginVertical: 20, justifyContent: 'center'
                }]}>
                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.shareUser}
                        source={{uri: 'http://www.deyoungmedia.com/wp-content/uploads/2014/07/steve-jobs-morreu-brasil-153927.jpg'}}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View style={{marginLeft: 2}}>
                      <Image
                        style={styles.shareUser}
                        source={{uri: 'data:image/jpeg;base64,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'}}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View style={{marginLeft: 2}}>
                      <Image
                        style={styles.shareUser}
                        source={image}
                        resizeMode={'cover'}
                      />
                    </View>
                  </View>
                  <View style={{justifyContent: 'center', marginTop: 10, marginLeft: 30,}}>
                    <Text style={[Style.f16, Style.textColorBlack, {justifyContent: 'center'}]}>
                      Rizwan & 90 Others Saved this Card
                    </Text>
                  </View>
                </View>

                <View style={Style.lineSeparator}/>
                <View>
                  {this.renderReview(this.state.DataSource.topReview)}
                </View>
                <View style={Style.lineSeparator}/>
                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 20}}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <View style={Style.lineSeparator}/>
                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 20}}>
                  <Text style={[Style.f18, Style.textColorBlack]}>
                    Retrun Policy
                  </Text>
                </TouchableOpacity>

                {this.renderRelatedCards(this.state.relatedCards)}
              </Animatable.View>
            </ScrollView>
            {this.renderNavBar()}
          </View>
        );
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
