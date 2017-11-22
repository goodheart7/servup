import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import moment from 'moment';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
};

let MiniCard = React.createClass({

  render () {

    let {
      cardId,
      spId,
      spName,
      cardTitle,
      cardDescription,
      cardTags,
      location,
      primaryMediaUrl,
      price,
      cardStartDate,
      cardEndDate
    } = this.props;

    let title;
    if (cardTitle) {
      title = cardTitle.length > 20 ? cardTitle.substring(0, 20) + '..' : cardTitle;
    } else {
      title = '';
    }

    let description;
    if (cardDescription) {
      description = cardDescription.length > 30 ? cardDescription.substring(0, 30) + '..' : cardDescription;
    } else {
      description = '';
    }

    return (
			<TouchableOpacity
				style={[Style.rowWithSpaceBetween, styles.container]}
				 onPress = {() => this.props.navigator.push({ id: 40, cardId: this.props.cardId })}
      >

				<View style={{ flexDirection: 'row' }}>
					<Image
						source={{ uri: primaryMediaUrl }}
						style={styles.image}
						resizeMode="cover"
					/>
					<View style={{ alignSelf: 'center', paddingHorizontal: 10, width: width*0.5 }}>
						{/* <Text style={Style.b}>{spName}</Text> */}
						<Text>{title}</Text>
						<Text style={[ styles.description]}>{description}</Text>
						<Text>Date: {moment.utc(cardStartDate).format('MMM Do YYYY')}</Text>
					</View>
				</View>

				<View style={Style.center}>
					<Image
						style={{ width: 15, height: 15 }}
						source={images.right_caret}
					/>
				</View>

			</TouchableOpacity>
		);
  }

});

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    padding: 5
  },

  description: {
    fontSize: 16,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  image: {
    width: 90,
    height: 90,
    borderWidth: 0.5,
    borderColor: 'gainsboro'
  },

});

export default MiniCard;
