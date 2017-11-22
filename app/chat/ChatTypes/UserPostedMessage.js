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

export default class UserPostedMessage extends Component {

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

    renderReciever = () => {
      return (
        <View style={styles.container}>

          <View style={{ flexDirection: 'row' }}>
            <View >
              <Image
                style={styles.contactImage}
                source={profileImage}
                resizeMode={'cover'}
              />
            </View>
            <View style={styles.recieverMessages}>
              <Text style={styles.recieverMessagesText}>
                {message.text}
              </Text>
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
          <View style={styles.senderMessages}>
            <Text style={styles.senderMessagesText}>
               {message.text}
             </Text>
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

  senderMessages: {
    width: width*0.4,
    backgroundColor: StyleConstants.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 15,
    marginBottom: 5,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-end',
  },

  senderMessagesText: {
    color: 'white',
  },

  senderDate: {
    alignSelf: 'flex-end',
    marginRight: 35,
    marginBottom: 20,
  },

  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 15,
    alignSelf: 'flex-start',
  },

  recieverMessages: {
    flex: 8,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 15,
    marginLeft: 10,
    marginBottom: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  recieverMessagesText: {
    color: '#333',
  },

  recieverDate: {
    marginLeft: 100,
    marginBottom: 20,
  },

});
