import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let images = {
  'icon': require('../../../res/common/card_search_icon.png')
}

export default class UserUnsubscribedCard extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    let {person, user, message, profileImage} = this.props;

    renderReciever = () => {
      return (
        <View style={styles.container}>
          <Image style={styles.icon} source={images.icon} />
          <Text style={styles.text}>{user.name} Unsubscribed {message.text} Service</Text>
        </View>
      );
    }

    renderSender = () => {
      return (
        <View style={styles.container}>
          <Image style={styles.icon} source={images.icon} />
          <Text style={styles.text}>{user.name} Unsubscribed {message.text} Service</Text>
        </View>
      );
    }

    return person == "sender" ? renderSender() : renderReciever();
  }

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 20,
  },

  icon: {
    width: 20,
    height: 20
  },

  text: {
    alignSelf: 'center',
    paddingHorizontal: 10
  },

});
