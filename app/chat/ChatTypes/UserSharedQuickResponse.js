import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import moment from 'moment';

export default class UserSharedQuickResponse extends Component {

  constructor (props) {
    super(props);
  }

  goto (id, type) {
    if (type === 'appUser') {
      this.props.navigator.push({ id: 310, otherPersonId: id });
    }
  }

  render () {
    let {userId, person, createdAt, message, profileImage} = this.props;

    renderReciever = () => {
      return (
        <View style={styles.container}>
          <View style={styles.row}>

            <TouchableOpacity onPress={() => this.goto(userId, 'appUser')}>
              <Image style={styles.contactImage} source={profileImage} resizeMode={'cover'} />
            </TouchableOpacity>

            <View style={styles.recieverContainer}>
              <Text style={[styles.recieverText, Style.b]}>{message.title}</Text>
              <View style={styles.HrLine}></View>
              <Text style={styles.recieverText}>{message.text}</Text>
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

  recieverContainer: {
    flex: 8,
    marginRight: 15,
    marginLeft: 10,
    marginBottom: 5,
    backgroundColor: 'transparent',
    borderWidth: 0.75,
    borderColor: StyleConstants.gray,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },

  HrLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: StyleConstants.gray,
  },

  recieverText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  recieverDate: {
    marginLeft: 100,
    marginBottom: 20,
  },

});
