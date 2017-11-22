import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
  Switch,
} from 'react-native';

import {get} from '../../../lib/rest';
import {updateNotificationSetting} from '../../../lib/networkHandler';
var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
import Icon from '../../stylesheet/icons'
const {height, width} = Dimensions.get('window');

import SingleNotification from './components/SingleNotification';

var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

export default class NotificationSettings extends Component {

  constructor (props) {
    super(props);
    this.state = {
			setting1: false,
			notificationList:[],
			options: ds.cloneWithRows([])
		};
		this.renderOptions = this.renderOptions.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
  }

	componentDidMount () {
		AsyncStorage.getItem("UserToken")
    .then((token) => {
			this.setState({ token })
			return token;
		})
		.then((token) => {
      console.log('=================getNotificationSetting url==========', 'Users/Settings/Notifications/consumer');
			return get(token, 'Users/Settings/Notifications/consumer');
		})
		.then((res) => {
			 console.log(res);
			if (!res.Message || !res.Errors) {
        this.setState({
          options: this.state.options.cloneWithRows(res),
					notificationList:res,
        });
      }
		})
    .catch((error) => {
      console.log('Error: ', error);
    });
	}

	handleToggle (obj) {
		console.log('Object Is', obj);
		var options = this.state.notificationList;
		console.log('@@@@ optionList', options );
		options = options.filter((option)=>{return option.id != obj.id});
    console.log('@@@@ optionList', options );
    options= options.concat(obj);
    console.log('@@@@ optionList', options );
    this.setState({notificationList:options});
		updateNotificationSetting(this.state.token, options )
		.then((res) => {
			if (res) {
				console.log('Succesfully Updated', res);
			}
		});
	}

	renderOptions (rowData, sectionID, rowID) {
    let {navigator} = this.props;
    return (
			<SingleNotification key={rowID} {...rowData} onPressToggle={this.handleToggle}/>
    );

	}

  render () {
    let {navigator} = this.props;
    let {options, setting1} = this.state;

    return (
      <View style={styles.container}>
        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Notification Settings'} // Optional
          leftIcon = {'icon-back_screen_black'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {() => { navigator.pop() }} // Optional
        />

				<ListView
          ref = 'list'
          dataSource={options}
          renderRow={this.renderOptions}
          enableEmptySections={true}
          bounces = {false}
        />

        {/* <View style = {Style.listRow}>
          <View style={Style.rowWithSpaceBetween}>
            <Text style = {styles.textStyle}>Enable SMS Notification</Text>
            <Switch
              value = {this.state.setting1}
              onValueChange = {(setting1) => this.setState({setting1})}
            />
          </View>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

});
