/**
 * Created by Shoaib on 11/16/2016.
 */
import React, {Component} from 'react';
import {
  TextInput,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Image,
  View,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import cardStyle from '../card/Style';
import cardBaseStyle from '../card/Styles/cardBaseStyle';
const {height, width} = Dimensions.get('window');
let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'check': require('../../res/common/check.png'),
  'defaultProfileImage': require('../../res/common/profile.png'),
  'empty': require('../../res/common/emptyPixel.png'),
};
let plans = [
  {
    "id": "68d7284396b34861b5e78ff00240147bXX",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
  {
    "id": "68d7284396b34861b5e78ff00240147bYYY",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
  {
    "id": "68d7284396b34861b5e78ff00240147bZZ",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
  {
    "id": "68d7284396b34861b5e78ff00240147bAA",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
  {
    "planId": "68d7284396b34861b5e78ff00240147b",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
  {
    "planId": "68d7284396b34861b5e78ff00240147b",
    price: {
      amount: 1010,
      "currency": "PKR",
      "currencySysmbol": null
    },
    "priceUnit": "string",
    "invoicingCylcle": "Month",
    "unitsPerInvoicingCycle": 0,
    "pricePlanLabel": "Family",
    "eventSchedule": {
      "startDateTime": "2016-11-14T18:58:05.164Z",
      "endDateTime": "2016-11-14T18:58:05.164Z"
    },
    "appliesTo": "string",
    "noOfAllowedUsers": 0,
    "minSubPeriod": {
      "unitOfPeriod": "string",
      "countOfPeriod": 0
    },
    "freeTrialPeriod": {
      "unitOfPeriod": "Days",
      "countOfPeriod": 5
    },
    "signupFee": {
      "amount": 50,
      "currency": "PKR",
      "currencySysmbol": null
    }
  },
]

import MenuBar from '../common/MenuBar';

let TermsOfServices = React.createClass({
  getInitialState() {
    return {
      SwitchState: false,
      rating: 0,
      myIndex: '',
      selectedUsers: [],
      selectedPlanId: this.props.planId,
      selectedState: false,
      plans: this.props.plans,
      cardView: false,

    }
  },

  renderStickyHeader() {
    return (
      <MenuBar
        // color = {'red'} // Optional By Default 'black'
        title={this.props.title} // Optional
        leftIcon={'icon-back_screen_black'}
        onPressLeftIcon={() => this.props.navigator.pop()} // Optional
      />
    );
  },
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        {this.renderStickyHeader()}
        <ScrollView style={{flex: 1}}>
         <Text style={styles.textStyle}>
           {this.props.data}
         </Text>
        </ScrollView>
      </View>
    );
  },
});

const styles = StyleSheet.create({


  textStyle: {
    fontSize: 16,
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
    //paddingVertical: 10
    marginHorizontal:20,
    marginTop:20
  },

});

export default TermsOfServices;
