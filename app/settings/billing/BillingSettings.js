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
} from 'react-native';

var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');


let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
	'left_caret': require('../../../res/common/back.png'),
	'credit_card': require('../../../res/common/billing_settings_icon.png'),
	'wallet': require('../../../res/common/wallet.png'),
};

var BillingSettings = React.createClass({

	onPressBack () {
		this.props.navigator.pop();
	},

	onPressCreditCard () {
		this.props.navigator.push ({ id: 180 });
	},

	render() {
		let {navigator} = this.props;
		return (
			<View style = {styles.container}>

				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Billing'} // Optional
          leftIcon = {'icon-back_screen_black'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {this.onPressSubmit} // Optional
        />

				<View style={styles.wrapper}>

					<TouchableOpacity
						style={[Style.rowWithSpaceBetween, styles.billingRow]}
						onPress={this.onPressCreditCard}
					>
						<View style={styles.row}>
							<View style={styles.icon}>
								<Image
									style={Style.center}
									source={images.credit_card}
									resizeMode="contain"
								/>
							</View>
							<Text style={[Style.center, styles.text, Style.f18]}>Credit/Debit Card</Text>
						</View>
						<Image style={Style.center} source={images.right_caret} />
					</TouchableOpacity>

					<View style={styles.border} />

					{/* <TouchableOpacity
						style={[Style.rowWithSpaceBetween, styles.billingRow]}
						onPress={this.onPressWallet}
					>
						<View style={styles.row}>
							<View style={styles.icon}>
								<Image style={Style.center} source={images.wallet} />
							</View>
							<Text style={[Style.center, styles.text, Style.f18]}>Wallet</Text>
						</View>
						<Image style={Style.center} source={images.right_caret} />
					</TouchableOpacity>

					<View style={styles.border} /> */}

				</View>

			</View>
		);
	},
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
		backgroundColor: 'white'
	},

	billingRow: {
		padding: 10,
	},

	row: {
		flexDirection: 'row',
	},

	icon: {
		justifyContent: 'center',
		width: 30,
		height: 30,
	},

	text: {
		alignSelf: 'center',
		paddingHorizontal: 20,
	},

	border: {
		width: width,
		height: 2,
		backgroundColor: StyleConstants.lightGray,
	},

});

module.exports = BillingSettings
