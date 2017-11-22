import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import Modal from 'react-native-simple-modal';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../../stylesheet/style';
import Icon from '../../../stylesheet/icons'
const {height, width} = Dimensions.get('window');

import {deleteAddress, setDefaultAddress} from '../../../../lib/networkHandler';



let images = {
	'cancel': require('../../../../res/common/cancel.png'),
	'edit': require('../../../../res/common/edit.png'),
};

let SingleAddress = React.createClass({

  getInitialState () {
    return {
      rowDeleted: false,
    };
  },

  onPressEdit () {
    let {
      addressId, addressType, isDefault, name,
      address1, address2, zipCode, city, state, country
    } = this.props;

    let object = {
      addressId, addressType, isDefault,
      name, address1, address2, zipCode, city, state, country
    };

    this.props.navigator.push({ id: 170, object });
  },

  onPressDelete () {
    let { addressId } = this.props;
    deleteAddress(this.props.token, addressId)
    .then((value) => {
      this.setState({ rowDeleted: true });
    })
    .catch((error) => {
      console.log('Setting/Components/SingleAddress onDelete Error', error);
    });
  },

  onPressAddress () {
    let { addressId, addressType, onPressUpdateList } = this.props;
    let object = {addressId, addressType};
    // console.log(object);
    setDefaultAddress(this.props.token, object)
    .then((value) => {
      console.log('@@@@@@@@@@2 set default', value);
      onPressUpdateList();
    })
    .catch((error) => {
      console.log('Setting/Components/SingleAddress onPressAddress', error);
    });

  },

  render () {
    let {
      addressId,
      name,
      address1,
      address2,
      zipCode,
      city,
      state,
      country,
      isDefault,
    } = this.props;

    renderDot = () => {
      return (
        <View style={styles.dotOutline}>
          <View style={styles.dot} />
        </View>
      );
    }

    renderAddress = () => {
      return (
        <TouchableOpacity
          onPress={this.onPressAddress}
          style={[styles.container, Style.rowWithSpaceBetween]}
        >
          <View>
            <Text>{name}</Text>
            <Text style={{ width: width-100 }}>{address1}</Text>
            <Text style={{ width: width-100 }}>{address2}</Text>
            <Text style={{ width: width-100 }}>{zipCode}, {city}, {state}, {country}</Text>
          </View>

          <View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onPressEdit}
              >
                <Icon name={'icon-edit-profile'} fontSize={18} color={'grey'}/>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={this.onPressDelete}
              >
                <Icon name={'icon-reject'} fontSize={18} color={'grey'}/>
              </TouchableOpacity>
            </View>

              {isDefault ? renderDot() : <View></View>}
          </View>


        </TouchableOpacity>
      );
    }

    return this.state.rowDeleted ? <View></View> : renderAddress();

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

  button: {
    paddingHorizontal: 5,
  },

  icon: {
    width: 15,
    height: 15,
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

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: StyleConstants.primary,
  },

});


export default SingleAddress;
