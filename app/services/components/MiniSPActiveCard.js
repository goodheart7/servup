import React, {Component} from 'react';

import {
	StyleSheet,
	Text,
	Platform,
	Alert,
	View,
	Dimensions,
	TouchableOpacity,
	//Image,
} from 'react-native';
import Image from 'react-native-image-progress';
import moment from 'moment';
const {height, width} = Dimensions.get('window');
import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
var defaultPic = require('../../../res/common/profile.png');
let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
};

let MiniSPActiveCard = React.createClass({

	render () {

		let {
			subscriptionId, primaryMediaUrl, serviceName, purchaseDate, renewalDate, amount, invoicingCycle, paymentStatus, spLogo
		} = this.props;
		let dotColor = (paymentStatus!= 'paid' && paymentStatus!= 'free') ? {backgroundColor: 'red'} : {backgroundColor:'green'};
		//  serviceName = 'fjdhjfdskgj jfdsagsdagjdsf jfdsjsfdjgjdsf jfdskhdsfj'
		spLogo = spLogo ? {uri: spLogo} : defaultPic;
		let price = amount && amount.amount != 0 ? amount.currency+" "+ amount.amount:'Free'  ;
		return (
			<TouchableOpacity
				style={[Style.rowWithSpaceBetween, styles.container]}
				onPress={() => this.props.navigator.push({id: 12, subscriptionId: subscriptionId}) }>

				<View style={[Style.rowWithSpaceBetween, {flex: 2, flexDirection: 'column'}]}>
					<View style={{backgroundColor: 'white'}}>
						<Image
							source={{uri: primaryMediaUrl}}
							style={[styles.image]}
							resizeMode="cover"
						/>
						<View style={{flexDirection:'row' }}>
							<Image
								source={spLogo}
								style={{bottom: 1, left: 8, width: 28, height: 28, borderRadius: 14, marginTop: -34, marginLeft:0, borderWidth:2.5, borderColor:'white',  marginHorizontal: 10}}
								resizeMode="cover"
							/>
						</View>
					</View>
					<View style={{alignSelf: 'stretch', paddingHorizontal: 8, flex: 3, marginTop: 5}}>
						<View style={{flexDirection:'row', justifyContent:'space-between'}}>
							<Text style={[{
								fontWeight: '400',
								color: 'black',
								fontSize: 16,
							 // fontFamily: Fonts.regFont[Platform.OS]
								}]}>{serviceName.length > 20 ? 'The Beaming Soul'.substring(0,20) + ' ...' : 'The Beaming Soul'}
							</Text>
							<View style={[{height:10, width:10, borderRadius:7},dotColor]}/>
						</View>
						<View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
							<View style = {{justifyContent: 'flex-end'}}>
								<Text style={[styles.textStyle, {fontSize: 10}]}>Purchased {moment(purchaseDate).startOf('day').fromNow()}</Text>
								<Text
									style={[styles.textStyleA, {paddingTop:5, paddingBottom:5}]}>Renewal {moment.utc(renewalDate).format('MMM DD, YYYY')}</Text>
								<Text style={styles.textStyle}>{price}</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

});

const styles = StyleSheet.create({

	container: {
		marginHorizontal: 5,
		marginVertical: 2,
		marginTop: 5,
		backgroundColor: 'white',
		padding: 5,
		height: height/3,
		width: height/3.5 + 20,
	},
	textStyle: {
		color: 'black',
		fontSize: 15,
		fontFamily: Fonts.regFont[Platform.OS],
	},
	textStyleA: {
		color: 'black',
		fontSize: 13,
		fontFamily: Fonts.regFont[Platform.OS],
	},
	image: {
		alignSelf: 'center',
		width: height/3.5,
		height: height/7,
		marginHorizontal: 5,
		marginVertical: 5,
		borderWidth: 0.5,
		borderColor: 'gainsboro'
	},
});

export default MiniSPActiveCard;
