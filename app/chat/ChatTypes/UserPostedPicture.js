import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
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

import moment from 'moment';
import Modal from 'react-native-simple-modal';

let images = {
  'icon': require('../../../res/common/link.png')
}

export default class UserPostedPicture extends Component {

  constructor (props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.goto = this.goto.bind(this);
  }

  goto (id, type) {
    if (type === 'appUser') {
      this.props.navigator.push({ id: 310, otherPersonId: id });
    }
  }

  handleModal () {
    this.props.onPressAttachment(this.props.message.image)
    console.log('Ouch You Pressed hard! Nigger');
  }

  render () {
    let {userId, person, message, createdAt, profileImage} = this.props;

    renderReciever = () => {
      return (
        <TouchableOpacity style={styles.container} onPress={this.handleModal}>
          <View style={styles.row}>

            <TouchableOpacity onPress={() => this.goto(userId, 'appUser')}>
              <Image style={styles.contactImage} source={profileImage} resizeMode={'cover'} />
            </TouchableOpacity>

            <View style={styles.recieverMessage}>
              <Image style={styles.icon} source={images.icon} resizeMode={'cover'} />
              <Text style={[Style.f16, styles.text]}>Tap To View</Text>
            </View>
          </View>

          <Text style={styles.recieverDate}>
            {moment.utc(createdAt).format('h:mm A')}
          </Text>
        </TouchableOpacity>
      );
    }

    renderSender = () => {
      return (
        <TouchableOpacity style={styles.container} onPress={this.handleModal}>
          <View style={styles.senderMessages}>
            <View style={styles.row}>
              <Image style={styles.icon} source={images.icon} resizeMode={'cover'} />
              <Text style={[Style.f16, styles.text]}>Tap To View</Text>
            </View>
          </View>

          <Text style={styles.senderDate}>
            {moment.utc(createdAt).format('h:mm A')}
          </Text>
        </TouchableOpacity>
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

  icon: {
    width: 20,
    height: 20,
  },

  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 15,
    alignSelf: 'flex-start',
  },

  recieverMessage: {
    flex: 8,
    flexDirection: 'row',
    // height: 80,

    marginLeft: 10,
    marginRight: 15,
    marginBottom: 5,

    borderWidth: 0.75,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: StyleConstants.gray,
    paddingHorizontal: 20,
    alignItems: 'center',

  },

  senderMessages: {
    // width: width*0.4,
    alignSelf: 'flex-end',
    backgroundColor: 'white',

    paddingVertical: 10,
    paddingHorizontal: 20,

    marginRight: 15,
    marginBottom: 5,

    borderWidth: 1,
    borderColor: StyleConstants.primary,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  senderDate: {
    alignSelf: 'flex-end',
    marginRight: 35,
    marginBottom: 20,
  },

  recieverDate: {
    marginLeft: 100,
    marginBottom: 20,
  },

  text: {
    paddingHorizontal: 10,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },

});
