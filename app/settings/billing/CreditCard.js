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
	Image,
	AsyncStorage,
	ListView,
 } from 'react-native';

var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';

import SingleCreditCard from './components/SingleCreditCard';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import get from '../../../lib/get';

let images = {
	'left_caret': require('../../../res/common/back.png'),
	'plus': require('../../../res/common/add.png'),
};

let CreditCard = React.createClass({

	getInitialState () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      payments: ds,
      show: false,
    };
  },

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({ token: value });
      // This get method will get all payment methods
      return get(value, 'Users/Settings/PaymentMethods');
    })
    .then((value) => {
      this.setState({
        payments: this.state.payments.cloneWithRows(value),
        show: true,
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  },

  onPressBack () {
    this.props.navigator.pop();
  },

	onPressAdd () {
		this.props.navigator.push({ id: 190 })
	},

	onPressUpdateList () {
		get(this.state.token, 'ProfileCard/GetCustomerPaymentMethods')
		.then((value) => {
      this.setState({
        payments: this.state.payments.cloneWithRows(value),
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
	},


	renderPayments (rowData, sectionID, rowID) {
		 console.log(rowData);
		// let additionalParams = rowData.addtionalParameters;
		let {id, name, isDefault} = rowData;
		let {
			brand, country, exp_month, exp_year, funding, last4
		} = rowData.addtionalParameters;
     console.log('@@@@@@@@@@@@ methodId', id);
    return (
			<SingleCreditCard
				key = {rowID}
				navigator = {navigator}
        appToken = {this.state.token}
				id = {id}
				name = {name}
				isDefault = {isDefault}
				{...rowData.addtionalParameters}
				onPressUpdateList = {this.onPressUpdateList}
			/>
    );
  },


  render () {
		let {payments} = this.state;
		let {navigator} = this.props;

		renderEmpty = () => {
      if (this.state.show) {
        return (
          <View style={styles.emptyContainer}>
            <Text
              style={[Style.center, Style.f16]}>
              You Don't Have Any Addresses Added Yet
            </Text>
          </View>
        );
      }
    }

		renderList = () => {
      return (
        <ListView
          ref = 'list'
          dataSource={payments}
          renderRow={this.renderPayments}
          enableEmptySections={true}
          bounces = {false}
        />
      );
    }

    return (
      <View style={styles.container}>
				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Credit Card'} // Optional
          leftIcon = {'icon-back_screen_black'}
          rightIcon = {'+'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          onPressRightIcon = {this.onPressAdd} // Optional
        />

				<View style={styles.wrapper}>
          {payments.getRowCount() == 0 ? renderEmpty() : renderList()}
        </View>

      </View>
    );
  }
});

const styles = StyleSheet.create({

	container: {
		flex:1,
		backgroundColor: StyleConstants.lightGray,
	},

	wrapper: {
		marginTop: 5,
		marginHorizontal: 5,
		flex: 1,
		// backgroundColor: 'white'
	},

	emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

	payment: {
		padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: StyleConstants.lightGray,
	}

});

export default CreditCard;
