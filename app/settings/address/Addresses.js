import React, {
	Component,
} from 'react';

import {
	Navigator,
	ScrollView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
} from 'react-native';

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
	'home_address': require('../../../res/common/home_address_settings_icon.png'),
	'billing_address': require('../../../res/common/office_address_settings_icon.png'),
	'shipping_address': require('../../../res/common/shipping.png'),
};

let EditAddresses = React.createClass({

	onPressBack () {
		// this.props.navigator.pop();
		// this.props.navigator.popToRoute({ id: 101 });
		this.props.navigator.replacePreviousAndPop({ id: 101 })
	},

	onPressAdd () {
		this.props.navigator.push({ id: 131 });
	},

	render () {
		let {navigator} = this.props;

		return (
			<View style = {styles.container}>

				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Address'} // Optional
          leftIcon = {'icon-back_screen_black'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {this.onPressUpdate} // Optional
        />

				<View style={styles.wrapper}>

					<TouchableOpacity
						style={[Style.rowWithSpaceBetween, styles.addressRow]}
						onPress={() => { navigator.push({ id: 140 }) }}
					>
						<View style={styles.row}>
							<View style={styles.icon}>
								<Image style={Style.center} source={images.home_address} />
							</View>
							<Text style={[Style.center, styles.text, Style.f18]}>Home Addresses</Text>
						</View>
						<Image style={Style.center} source={images.right_caret} />
					</TouchableOpacity>

					<View style={styles.border} />

					<TouchableOpacity
						style={[Style.rowWithSpaceBetween, styles.addressRow]}
						onPress={() => { navigator.push({ id: 150 }) }}
					>
						<View style={styles.row}>
							<View style={styles.icon}>
								<Image style={Style.center} source={images.billing_address} />
							</View>
							<Text style={[Style.center, styles.text, Style.f18]}>Billing Addresses</Text>
						</View>
						<Image style={Style.center} source={images.right_caret} />
					</TouchableOpacity>

					<View style={styles.border} />

					<TouchableOpacity
						style={[Style.rowWithSpaceBetween, styles.addressRow]}
						onPress={() => { navigator.push({ id: 160 }) }}
					>
						<View style={styles.row}>
							<View style={styles.icon}>
								<Image style={Style.center} source={images.shipping_address} />
							</View>
							<Text style={[Style.center, styles.text, Style.f18]}>Shipping Addresses</Text>
						</View>
						<Image style={Style.center} source={images.right_caret} />
					</TouchableOpacity>

					<View style={styles.border} />

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

	addressRow: {
		padding: 10,
		paddingVertical:15,
	},

	row: {
		flexDirection: 'row',
	},

	icon: {
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

export default EditAddresses
