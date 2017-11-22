/**
 * Created by Shoaib on 2/16/2017.
 */
import React, {
  Component,
} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  View,
 // Image,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
import {
  saveCard,
  hideCard,
  unLikeCard,
  requestSupportOnACard,
  getRelatedCards,
} from '../../../lib/networkHandler';
import Icon from '../../stylesheet/icons';
import StarRating from  '../StarRating';
import Image from 'react-native-image-progress';

var CardTray = React.createClass(
  {
    getInitialState() {
      return {
        relatedCards: this.props.cards,
        likesCount: this.props.likes,
      };
    },

    renderListofCards (relatedCards) {
      return relatedCards.map((card, index) => {
        return (
          <Card card={card} token={this.props.token} key= {index} navigator={this.props.navigator}/>
        )
      })
    },

    render() {
      let relatedCards = this.props.cards ? this.props.cards : [];
      if (relatedCards.length > 0) {
        return (
          <View >

            <Text style={[Style.f18, {marginHorizontal: 14, marginVertical: 10, color:'green', fontWeight:'400'}]}>
              Related Services
            </Text>
            <ScrollView horizontal={true}>
              {this.renderListofCards(relatedCards)}
            </ScrollView>
          </View>);
      }
      else {
        return <View/>;
      }
    },

  });
export default CardTray;

var Card = React.createClass(
  {


    getInitialState() {
      return {
        card: this.props.card,
        liked: this.props.card.isLiked,
        likesCount: this.props.card.likes,
      };
    },

    likeThisCard() {
      if (!this.state.liked) {
        saveCard(this.props.token, this.props.card.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount + 1});
      }
      else {
        unLikeCard(this.props.token, this.props.cardId);
        this.setState({liked: !this.state.liked, likesCount: this.state.likesCount - 1});
      }
    },
    openDetailedCard(){
      let card = this.props.card;
      this.props.navigator.push({
   				id: 40,
   				cardId: card.cardId,
   				cardTitle: card.cardTitle,
   				primaryImage: card.primaryMediaUrl,
   				spName:card.spName,
   				spLogo:card.spLogo,
   				cta: card.callToAction,
   				spId:card.spPublicId,
   				overallRating:card.overallRating,
   				numberOfReviews:card.numberOfReviews,
   				isLiked:card.isLiked,
   				relatedUsers:card.relatedUsers,
          routedFrom:'cardTray',
   				companyId: card.spId,
   				defaultPrice: card.price,
          onUnmount: (status)=>{this.setState({liked: status})},
   			})
    },
    render() {
      let card = this.props.card;
     // console.log('@@@@@@@@@@@@@ card', card);
      let saveEmpty = <Icon name={'icon-save'} fontSize={22} color={'white'}/>;
      let saveFilled = <Icon name={'icon-save-filled'} fontSize={22} color={StyleConstants.primary}/>;
      return (
        <View style={style.relatedCardView}>
          <TouchableOpacity style={{position:'absolute',zIndex:5, marginLeft:150, marginTop:2,}}
                                       onPress={this.likeThisCard}>
                       {this.state.liked ? saveFilled : saveEmpty}
                     </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openDetailedCard()}>

            <Image
              source={{uri: card.primaryMediaUrl}}
              style={style.relatedImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>

            <Text style={[Style.f16, Style.textColorBlack, {
              width: 180,
              //marginHorizontal: ,
              flex: 1,
              flexWrap: 'wrap',
              marginVertical: 3,
              marginBottom:10,
            }]}>
              {card.cardTitle}
            </Text>

            <StarRating
              numberOfReviews={card.numberOfReviews}
              overallRating={card.overallRating}
              cardId={card.cardId}
              style={{marginLeft: -5}}
              navigator={this.props.navigator}
            />
        </View>
      );
    }
  });

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
    width: 180,
    height: 105,
    // alignSelf: 'center',
    // marginBottom: 5,
  },
  countsText : {
    width: 40,
    alignSelf: 'center',
    marginTop:-20,
    marginLeft:4,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: 'black',
    fontWeight: '400',
    fontFamily: Fonts.regFont[Platform.OS],
  },
});