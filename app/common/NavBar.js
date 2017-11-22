import React, {
  Component,
} from 'react';

import {
  Navigator,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');
import Icon from '../stylesheet/icons'

var NavBar = React.createClass({

  getInitialState () {
    console.log('@@@@@@@@@@@@@2 inieiie propsssss', this.props.notificationCount);
    return {
      totalNotifications: this.props.notificationCount,
    };
  },

  home() {
    let {navigator, route} = this.props;
    let currentRoute = navigator.getCurrentRoutes();
    // console.log(currentRoute);
    if (currentRoute[currentRoute.length - 1].id != 6) {
      // console.log(currentRoute[1]);
      if (currentRoute[1].id === 6) {
        navigator.popToRoute(currentRoute[1]);
      } else {
        navigator.push({id: 6})
      }
    }
  },

  componentWillMount() {
    this.setState({totalNotifications: this.props.notificationCount});
    console.log('@@@@@@@@@@@@@2 propsssss', this.props.notificationCount);
  },

  chat() {
    let {navigator} = this.props;
    let currentRoute = navigator.getCurrentRoutes();
    if (currentRoute[currentRoute.length - 1].id != 240) {
      navigator.push({id: 240});
    }
  },

  servup() {
    let {navigator} = this.props;
    let currentRoute = navigator.getCurrentRoutes();
    if (currentRoute[currentRoute.length - 1].id != 125) {
      navigator.push({id: 125});
    }
  },

  call() {
    console.log('NavBar.js -- Call() Call Button Being Pressed')
  },

  notifications() {
    let {navigator} = this.props;
    //this.props.onUnmount();
    let currentRoute = navigator.getCurrentRoutes();
    if (currentRoute[currentRoute.length - 1].id != 120) {
      navigator.push({id: 120});
    }
  },

  contacts() {
    let {navigator} = this.props;
    let currentRoute = navigator.getCurrentRoutes();
    if (this.props.showContactsLandingScreen) {
      if (currentRoute[currentRoute.length - 1].id != 220) {
        navigator.push({id: 220});
      }
    }
    else {
      if (currentRoute[currentRoute.length - 1].id != 200) {
        navigator.push({id: 200});
      }
    }
  },

  unreadCount () {
    if (this.props.unreadCount > 0) {
      return (
        <View style={styles.chatCountBubble}>
          <Text style={styles.chatCountText}>{this.props.unreadCount}</Text>
        </View>
      );
    }
  },
  unreadNotifications() {
    console.log('@@@@@@@@@@@@@2 pdsdsropsssss', this.props.notificationCount);
    console.log('@@@@@@@@@@ total notification navbar', this.state.totalNotifications);
    if (this.state.totalNotifications > 0) {
      return (
        <View style={styles.notificationCountBubble}>
          <Text style={styles.chatCountText}>{this.state.totalNotifications}</Text>
        </View>
      );
    }
  },
  render() {
    let {navigator} = this.props;
    let currentRoute = navigator.getCurrentRoutes();
    // console.log('Current Route ', currentRoute[currentRoute.length - 1].id);

    let homeColor = currentRoute[currentRoute.length - 1].id == 6 ? StyleConstants.primary : 'black';
    let inboxColor = currentRoute[currentRoute.length - 1].id == 240 ? StyleConstants.primary : 'black';
    let servicesColor = currentRoute[currentRoute.length - 1].id == 125 ? StyleConstants.primary : 'black';
    let notificationColor = currentRoute[currentRoute.length - 1].id == 120 ? StyleConstants.primary : 'black';

    return (
      <View style={[Style.rowWithSpaceBetween, styles.navbar]}>
        <TouchableOpacity style={styles.iconStyle} onPress={this.home}>
          <Icon name={'icon-discover'} fontSize={20} color={homeColor}/>
          <Text style={[styles.textStyle, {color: homeColor} ]}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconStyle]} onPress={this.chat}>
          <Icon name={'icon-inbox'} fontSize={20} color={inboxColor}/>
          {this.unreadCount()}
          <Text style={[styles.textStyle, {color: inboxColor} ]}>Inbox</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconStyle]} onPress={this.servup}>
          <Icon name={'icon-my_services'} fontSize={20} color={servicesColor}/>
          <Text style={[styles.textStyle, {color: servicesColor} ]}>My Services</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconStyle} onPress={this.contacts}>
          <Icon name={'icon-contacts'} fontSize={20} color={'black'} />
          <Text style={[styles.textStyle, {color:'black'}]}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconStyle} onPress={this.notifications}>
          <Icon name={'icon-notifications'} fontSize={20} color={notificationColor}/>
          {this.unreadNotifications()}
          <Text style={[styles.textStyle, {color: notificationColor} ]}>Notifications</Text>
        </TouchableOpacity>
      </View>

    );
  }

});

const styles = StyleSheet.create({

  navbar: {
    backgroundColor: 'white',
    height: 62,
    borderTopWidth: 0.48,
    borderColor: 'gray'
  },

  iconStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  textStyle: {
    fontSize: 10,
    marginTop: 2,
//		fontFamily: Fonts.regFont[Platform.OS],
  },

  chatCountBubble: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: -25,
    marginBottom: 10,
    marginLeft: 30,
    backgroundColor: '#fd2929',
  },
  notificationCountBubble: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: -25,
    marginBottom: 10,
    marginLeft: 0,
    backgroundColor: '#fd2929',
  },

  chatCountText: {
    color: 'white',
    fontSize: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },

});

module.exports = NavBar
