import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import moment from 'moment';

let images = {
  'icon': require('../../../res/common/card_search_icon.png')
}

export default class UserSharedCard extends Component {

  constructor (props) {
    super(props);
    this.goto = this.goto.bind(this);
  }

  goto (id, type) {
    if (type === 'appUser') {
      this.props.navigator.push({ id: 310, otherPersonId: id });
    }
  }

  render () {
    let {userId, person, message, createdAt, profileImage} = this.props;

    let title = '';
    if(message.title) {
      title = message.title.length > 20 ? (message.title.substring(0, 19) + '..') : message.title;
    }

    renderReciever = () => {
      return (
        <View style={styles.container}>
          <View style={styles.row}>

            <TouchableOpacity onPress={() => this.goto(userId, 'appUser')}>
              <Image style={styles.contactImage} source={profileImage} resizeMode={'cover'} />
            </TouchableOpacity>

            <View style={styles.recieverMessagesForCard}>

              <View style={styles.cardImageContainer}>
                <Image style={styles.cardImage} source={{ uri: message.image }} resizeMode={'cover'} />
              </View>

              <View style={{ width: width*.48, paddingLeft: 10, paddingVertical: 5 }}>
                <Text style={[Style.f16, Style.b]}>{title}</Text>
                <Text style={[Style.f12]}>{message.company}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.recieverDate}>
            {moment.utc(createdAt).format('h:mm A')}
          </Text>
        </View>
      );
    }

    renderSender = () => {
      return (
        <View style={styles.container}>
          <View style={styles.xxrow}>

            <View style={styles.senderMessagesForCard}>

              <View style={styles.cardImageContainer}>
                <Image style={styles.cardImage} source={{ uri: message.image }} resizeMode={'cover'} />
              </View>

              <View style={{ width: width*.48, paddingLeft: 10, paddingVertical: 5, backgroundColor: StyleConstants.primary }}>
                <Text style={[Style.f16, Style.b, { color: 'white' } ]}>{title}</Text>
                <Text style={[Style.f12, { color: 'white' } ]}>{message.company}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.senderDate}>
            {moment.utc(createdAt).format('h:mm A')}
          </Text>
        </View>
      );
    }

    return person == "sender" ? renderSender() : renderReciever();
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },

  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 15,
    alignSelf: 'flex-start',
  },

  recieverMessagesForCard: {
    flex: 8,
    flexDirection: 'row',
    height: 80,

    marginLeft: 10,
    marginRight: 15,
    marginBottom: 5,

    borderWidth: 0.75,
    borderRadius: 15,
    borderColor: StyleConstants.gray,
  },

  senderMessagesForCard: {
    width: width*0.75,
    alignSelf: 'flex-end',
    // flex: 8,
    flexDirection: 'row',
    height: 80,
    backgroundColor: StyleConstants.primary,
    marginLeft: 10,
    marginRight: 15,
    marginBottom: 5,

    borderWidth: 0.75,
    borderRadius: 15,
    borderColor: StyleConstants.primary,
  },

  recieverDate: {
    marginLeft: 100,
    marginBottom: 20,
  },

  senderDate: {
    alignSelf: 'flex-end',
    marginRight: 35,
    marginBottom: 20,
  },

  cardImageContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },

  cardImage: {
    width: 80,
    height: 80,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },

});
