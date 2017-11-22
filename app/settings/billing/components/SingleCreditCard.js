import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../../stylesheet/style';

import {setDefaultPaymentMethod, removePayementMethod} from '../../../../lib/networkHandler';
let images = {
  'right_caret': require('../../../../res/common/arrow_right.png'),
  'left_caret': require('../../../../res/common/back.png'),
  'cancel': require('../../../../res/common/cancel.png'),
  'credit_card': require('../../../../res/common/billing_settings_icon.png'),
  'wallet': require('../../../../res/common/wallet.png'),
};
let SingleCreditCard = React.createClass({
  getInitialState () {
    return {
      rowDeleted: false,
    };
  },
  onPressCreditCard () {
    let { id, appToken, onPressUpdateList } = this.props;
    setDefaultPaymentMethod(appToken, id)
    .then(() => {
      onPressUpdateList();
    })
    .catch((error) => {
      console.log('Setting/Components/SingleCreditCard onPressAddress', error);
    });

  },
  render () {
    let {
			name, isDefault, brand, country, exp_month, exp_year, funding, last4
		} = this.props;

    renderDot = () => {
      return (
          <View style={styles.dot} />
      );
    }
    removeMethod = () => {
    //  let { id, appToken} = this.props;
      removePayementMethod(this.props.appToken, this.props.id)
      .then((value) => {
        this.setState({ rowDeleted: true });
      })
      .catch((error) => {
        console.log('Setting/Components/SingleAddress onDelete Error', error);
      });
    },
    renderAddress = () => {
      return (
        <TouchableOpacity
          onPress={this.onPressCreditCard}
          style={[styles.container, Style.rowWithSpaceBetween]}
        >
            <Text style={Style.f18}>
              {last4}
            </Text>
            <Text style={Style.f18}>
              {name}
            </Text>
            <Text style={Style.f18}>
              {exp_month}/{exp_year}
            </Text>
            <View style={styles.icon}>
              <Image
                style={Style.center}
                source={images.credit_card}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity style={styles.icon} onPress={()=> removeMethod()}>
            <Image
              style={Style.center}
              source={images.cancel}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return  this.state.rowDeleted ? <View></View> : renderAddress();

  }
});

const styles = StyleSheet.create({

  container: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: StyleConstants.lightGray,
  },

  row: {
    flexDirection: 'row',
  },

  dotOutline: {
    width: 20,
    height: 20,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 0.75,
    borderColor: StyleConstants.primary,

    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    width: 30,
    height: 30,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: StyleConstants.primary,
  },

});


export default SingleCreditCard;
