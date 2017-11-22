import React, {Component} from 'react';
import {
	Text,
	View,
	Platform,
	ListView,
	ScrollView,
	Image,
	Alert,
	TextInput,
	StyleSheet,
	Dimensions,
	AsyncStorage,
	TouchableOpacity,
} from 'react-native';
import Loader from '../../Loaders/Loader';
var KeyboardSet = require('../../common/KeyboardSet');
import {
	Style,
	Fonts
} from '../../stylesheet/style';

import MenuBar from '../../common/MenuBar';
import Icon from '../../stylesheet/icons';
import SelectList from '../SelectList';
import _ from 'lodash';
import Swiper from 'react-native-swiper';
let images = {
	'defaultProfileImage': require('../../../res/common/profile.png'),
	'card': require('../../../res/common/credit_debit_card.png'),
	'billing': require('../../../res/common/office_address_settings_icon.png'),
	'shipping': require('../../../res/common/shipping.png'),
	'left_caret': require('../../../res/common/back.png'),
	'check': require('../../../res/common/check.png'),
};
import get from '../../../lib/get';
import {
	getPaymentMethods,
	orderPayment,
	AddCustomerPaymentMethod,
} from '../../../lib/networkHandler';

import {createCardToken} from '../../settings/billing/api/createCardToken';
import Errors from '../../settings/billing/ErrorMessages';

let creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;


var {height, width} = Dimensions.get('window');

let PaymentHistory = React.createClass({
	getInitialState() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			SwitchState: false,
			addresses: ds,
			billingAddress: [],
			shippingAddress: [],
			item: "Select Item",
			Token: '',
			show: false,
			emptyViewString: '',
			billingAddressTabView: true,
			shippingAddressTabView: true,
			isShippingRequired: true,
			transactionId: '',
			updated: false,
			DataSource: [],
			isVisible: false,
		}
	},
	initCapital(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	},

	componentDidMount() {
		AsyncStorage.getItem("UserToken")
		.then((token) => {
			this.setState({Token: token});
			return getPaymentMethods(token)
		})
		.then((resp) => {
			// console.log('@@@@@@@@@@@@@@payment Methods', resp);
			//console.log('@@@@@@@@@@@@2 props', this.props.transactionId);
			this.setState({DataSource: resp, transactionId: this.props.transactionId});
			return get(this.state.Token, 'Users/Profile/Addresses/billing');
		})
		.then((value) => {
			// console.log('@@@@@@@@billing Address', value);
			if (!value.errorCode) {
				value = value.filter((address, index) => {
					return address.isDefault == true
				});
				console.log('defaultAdd billing', value)
				this.setState({
					billingAddress: value[0],
					show: true,
				});
				console.log('defaultAdd billing', this.state.billingAddress)
			}

			return get(this.state.Token, 'Users/Profile/Addresses/shipping');
		})
		.then((value) => {
			//console.log('@@@@@@@@shipping Address', value);
			if (!value.errorCode) {
				value = value.filter((address, index) => {
					return address.isDefault == true
				});
				console.log('defaultAdd shippinhg', value)
				this.setState({
					shippingAddress: value[0],
					show: true,
				});
				console.log('defaultAdd shippingAddress', this.state.shippingAddress)
			}


		})
		.catch((err) => {
			console.log(err);
			//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
		})
	},
	// 3047f3f601ec48d589e001a87197ccef
	renderPaymentMethods(){
		console.log('rendering agiain');
		let {DataSource} = this.state;
		let viewsList =[];
		console.log('@@@@@ DataSource Length', DataSource.length);
		viewsList = DataSource.map((obj, key) => {
			console.log('@@@@@ key', key);
				return (
					<ScrollView key={key} style={{flex: 1}}>
						{this.renderStickyHeader(obj.id)}
						<View style = {{
							// flex: 1,
							// marginHorizontal: 20,
							// minHeight: 100,
							margin: 20,
							borderRadius: 10,
							borderColor: StyleConstants.primary,
							borderWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
							<View style={{paddingVertical: 10, marginHorizontal: 15}}>
								<Text style={{fontSize: 20, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
									{this.initCapital(obj.addtionalParameters.funding) + ' ' + 'Card'}
								</Text>
							</View>
							<View style={{paddingVertical: 10, marginHorizontal: 20}}>
								<Image
									source={images.card}
									resizeMode={'contain'}
									style={{alignSelf: 'center', justifyContent: 'center', padding: 10, width: 30, height: 30}}
								/>
							</View>
						</View>
						{this.renderPaymentAttributes(obj)}
					</ScrollView>
				);
		})

		viewsList.push(this.renderEmptyView())
		return viewsList;
	},
	renderDefaultAddress(address) {
		console.log('@@@@@@@@@@@@@@@@@@', address)
		return (
			<View>
				<Text style={[styles.textStyle, {marginHorizontal: 15, marginVertical: 15}]}>
					{address.name + '\n' + address.city + '\n' + address.state + '\n' + address.country + '\n' + address.address1 + '\n'  }
				</Text>
				<View style={Style.lineSeparator}/>
			</View>
		);
	},
	onPressListItem(methodId) {
		let DataSource = this.state.DataSource;
		let object = DataSource.filter((obj) => {
			return obj.methodId === methodId
		})[0];
		DataSource = DataSource.filter((o) => {
			return o.methodId != methodId
		});
		DataSource.unshift(object);
		this.setState({updated: true, DataSource: DataSource});
	},
	renderBillingAddressTab() {
		return (
			<TouchableOpacity
				style={[styles.billingAndShipping, {borderColor: '#FFF000', backgroundColor: '#FFF000'}]}
				onPress={() => this.setState({
					billingAddressTabView: !this.state.billingAddressTabView
			})}>
				<View style = {{flex: 2}}>
					<Image
						source={images.billing}
						resizeMode={'contain'}
						style={{alignSelf: 'center', justifyContent: 'center', padding: 10}}
					/>
				</View>
				<View style = {{flex: 5}}>
					<Text style={[styles.textStyle, {color: 'white', padding: 10}]}>
						Billing Address
					</Text>
				</View>
			</TouchableOpacity>
		);
	},
	renderShippingAddressTab() {
		return (
			<TouchableOpacity
				style={[styles.billingAndShipping, {borderColor: 'dodgerblue', backgroundColor: 'dodgerblue'}]}
				onPress={() => this.setState({
					shippingAddressTabView: !this.state.shippingAddressTabView
			})}>
				<View style = {{flex: 2}}>
					<Image
						source={images.shipping}
						resizeMode={'contain'}
						style={{alignSelf: 'center', justifyContent: 'center', padding: 10}}
					/>
				</View>
				<View style = {{flex: 5}}>
					<Text style={[styles.textStyle, {color: 'white', padding: 10}]}>
						Shipping Address
					</Text>
				</View>
			</TouchableOpacity>
		);
	},
	renderBillingAddress() {
		return (
			<View>
				<View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15, marginVertical: 15, marginRight: 30}]}>
					<Image
						source={images.billing}
						resizeMode={'contain'}
						style={{alignSelf: 'center', justifyContent: 'center', padding: 10}}
					/>
					<Text style={[styles.textStyle, {padding: 10}]}>
						Billing Address
					</Text>
					<TouchableOpacity
						onPress={() => this.setState({
							billingAddressTabView: !this.state.billingAddressTabView
						})}
						style={{padding: 8}}>
						<Text style={{fontSize: 22, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}> - </Text>
					</TouchableOpacity>
				</View>
				<View style={Style.lineSeparator}/>
				{this.renderDefaultAddress(this.state.billingAddress)}
				<TouchableOpacity style={[{marginHorizontal: 15, marginVertical: 15, flexDirection: 'row',}]} onPress={() => {
					this.props.navigator.push({
						id: 150,
						type: 'BILLING_ADDRESS',
						paymentMethod: true,
						routedFrom: 'payment',
						onUnmount: () => {
							get(this.state.Token, 'Users/Profile/Addresses/billing')
							.then((value) => {
								console.log('@@@@@@@@billing Address', value);
								if (!value.errorCode) {
									value = value.filter((address, index) => {
										return address.isDefault == true
									});
									console.log('defaultAdd billing', value)
									this.setState({
										billingAddress: value[0],
										show: true,
									});
									console.log('defaultAdd billing', this.state.billingAddress)
								}
							})
							.catch((err) => {
								console.log(err);
								//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
							})
							console.log('welcome bhai g')
						}
					})
				}}>
					<View style={styles.roundButton}>
						<Text style={{fontSize: 25, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
							+
						</Text>
					</View>
					<Text style={[styles.textStyle, {marginHorizontal: 15, marginVertical: 15}]}>
						Select an Address
					</Text>
				</TouchableOpacity>
			</View>
		);

	},

	renderSelectList(){
		return (
			<SelectList Data={this.state.DataSource} onItemPress={(methodID) => this.onPressListItem(methodID)}/>
		);
	},
	renderShippingAddress(){
		return (
			<View>
				<View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15, marginVertical: 15, marginRight: 30}]}>
					<Image
						source={images.shipping}
						resizeMode={'contain'}
						style={{alignSelf: 'center', justifyContent: 'center', padding: 10}}
					/>
					<Text style={[styles.textStyle, {padding: 10}]}>
						Shipping Address
					</Text>
					<TouchableOpacity
						onPress={() => this.setState({
							shippingAddressTabView: !this.state.shippingAddressTabView
						})}
						style={{padding: 8}}>
						<Text style={{fontSize: 22, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}> - </Text>
					</TouchableOpacity>
				</View>

				<View style={Style.lineSeparator}/>

				{this.renderDefaultAddress(this.state.shippingAddress)}

				<TouchableOpacity style={[{marginHorizontal: 15, marginVertical: 15, flexDirection: 'row',}]} onPress={() => {
					this.props.navigator.push({
						id: 160, type: 'SHIPPING_ADDRESS',
						paymentMethod: true,
						routedFrom: 'payment',
						onUnmount: () => {
							get(this.state.Token, 'Users/Profile/Addresses/shipping')
							.then((value) => {
								if (!value.errorCode) {
									value = value.filter((address, index) => {
										return address.isDefault == true
									});
									console.log('defaultAdd shippinhg', value)
									this.setState({
										shippingAddress: value[0],
										show: true,
									});
									console.log('defaultAdd shippingAddress', this.state.shippingAddress)
								}

							})
							.catch((err) => {
								console.log(err);
								//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
							})
							console.log('welcome bhai g')
						}
					})
				}}>
					<View style={styles.roundButton}>
						<Text style={{fontSize: 25, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
							+
						</Text>
					</View>
					<Text style={[styles.textStyle, {marginHorizontal: 15, marginVertical: 15}]}>
						Select an Address
					</Text>
				</TouchableOpacity>
			</View>
		);
	},
	renderEmptyView() {
		let {billingAddressTabView, shippingAddressTabView, isShippingRequired} = this.state;
		return (
			<ScrollView>
				<AddCreditCard navigator={this.props.navigator}/>
				<View style={{flexGrow: 1}}>
					{billingAddressTabView ? this.renderBillingAddressTab() : this.renderBillingAddress()}
					{shippingAddressTabView ? this.renderShippingAddressTab() : this.renderShippingAddress()}
				</View>
			</ScrollView>

		);
	},
	renderAddress(){
		let {billingAddressTabView, shippingAddressTabView, isShippingRequired} = this.state;
		return (
			<View style={{flex: 1, justifyContent: 'center'}}>
				{billingAddressTabView ? this.renderBillingAddressTab() : this.renderBillingAddress()}
				{shippingAddressTabView ? this.renderShippingAddressTab() : this.renderShippingAddress()}
			</View>
		);
	},
	
	renderPaymentAttributes(obj) {
		let {right_caret, card}=images;
		let {billingAddressTabView, shippingAddressTabView, isShippingRequired} = this.state;
		return (
			<View style = {{marginHorizontal: 20}}>
				<View style = {{borderWidth: 1, borderColor: StyleConstants.primary, borderRadius: 10, marginBottom: 10}}>
					<View style = {{borderBottomWidth: 1, borderBottomColor: StyleConstants.primary}}>
						<View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15, marginVertical: 15}]}>
							<Text style={[styles.textStyle]}>
								Card Number
							</Text>
							<View style={Style.rowWithSpaceBetween}>
								<Text style={{
									color: 'black',
									fontSize: 16,
									marginHorizontal: 15,
									justifyContent: 'center',
									alignSelf: 'center',
									fontFamily: Fonts.regFont[Platform.OS]
								}}>
									{'**** **** **** ' + obj.addtionalParameters.last4}
								</Text>
							</View>
						</View>
					</View>
					
					<View style = {{borderBottomWidth: 1, borderBottomColor: StyleConstants.primary}}>
						<View style={[{marginHorizontal: 15, paddingVertical: 15, flexDirection: 'row'}]}>
							<Text style={[styles.textStyle, {marginRight: 15, flex: 3}]}>
								Name on Card
							</Text>
							<Text style={[styles.textStyle, {marginHorizontal: 15, flex: 4}]}>
								{this.initCapital(obj.name)}
							</Text>
						</View>
					</View>
					
					<View style = {{borderBottomWidth: 1, borderBottomColor: StyleConstants.primary}}>
						<View style={[{marginHorizontal: 15, paddingVertical: 15, flexDirection: 'row'}]}>
							<Text style={[styles.textStyle, {marginRight: 15, flex: 3}]}>
								Expiry Date
							</Text>
							<Text style={[styles.textStyle, {marginHorizontal: 15, flex: 4}]}>
								{obj.addtionalParameters.exp_month + '/' + obj.addtionalParameters.exp_year}
							</Text>
						</View>
					</View>
					
					<View style = {{borderBottomWidth: 0, borderBottomColor: StyleConstants.primary}}>
						<View style={[{marginHorizontal: 15, paddingVertical: 15, flexDirection: 'row'}]}>
							<Text style={[styles.textStyle, {marginRight: 15, flex: 3}]}>
								Security Code
							</Text>
							<Text style={[styles.textStyle, {marginHorizontal: 15, flex: 4}]}>
								{'***'}
							</Text>
						</View>
					</View>
				</View>
				<View style={{flexGrow: 1, justifyContent: 'center', marginHorizontal: -20}}>
					{billingAddressTabView ? this.renderBillingAddressTab() : this.renderBillingAddress()}
					{shippingAddressTabView ? this.renderShippingAddressTab() : this.renderShippingAddress()}
				</View>
			</View>
		);
	},
	render() {
		let {billingAddressTabView, shippingAddressTabView, isShippingRequired} = this.state;
		let x = !billingAddressTabView && !shippingAddressTabView;
		console.log('@@@@@@@@@@@ XXX', this.props.transactionId);
		return (
			<Swiper
				loop={false}
				scrollEnabled = {true}
				showsPagination={false}
				height={height}
			>		
			{
				this.state.DataSource.length > 0 ? this.renderPaymentMethods() : this.renderEmptyView()
			}	
			</Swiper>
		);

	},
	onPressSubmit(paymentMethodId) {
		console.log('@@@@@@@@@@ hi ');
		let {Token, transactionId} =this.state;
		console.log('@@@@@@@@ transactionID', transactionId);
		console.log('@@@@@@@@ paymentMethodId', paymentMethodId);
		orderPayment(Token, transactionId, paymentMethodId)
		.then((resp) => {
			//   this.props.navigator.push({id: 125})
			this.props.navigator.push({id: 125, subscriptionId: this.props.subscriptionId, routedFrom: 'payment'});
		})
		.done();
	},
	renderStickyHeader(methodID) {
		return (
			<MenuBar
				// color = {'red'} // Optional By Default 'black'
				title={"Payment"} // Optional
				leftIcon={'icon-back_screen_black'}
				rightIcon={'icon-done'}// Optional
				// disableLeftIcon = {true} // Optional By Default false
				// disableRightIcon = {true} // Optional By Default false
				onPressLeftIcon={() => this.props.navigator.pop()} // Optional
				onPressRightIcon={() => this.onPressSubmit(methodID)} // Optional
			/>
		);
	},
});

export default PaymentHistory;

let AddCreditCard = React.createClass({

	getInitialState () {
		return {
			name: '',
			cardno: '',
			expiryMonth: '',
			expiryYear: '',
			secureCode: '',
			error: false,
		}
	},

	componentDidMount () {
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			this.setState({ token: value });
		});
	},

	onPressBack () {
		this.props.navigator.pop();
	},

	clearForm () {
		this.setState({
			cardno: '',
			expiryMonth: '',
			expiryYear: '',
			secureCode: '',
		});
	},

	onSubmitForm () {
		let {cardno, expiryMonth, expiryYear, secureCode} = this.state;
		let validate = (cardno !== '' || expiryMonth !== '' || expiryYear !== '' || secureCode !== '');

		if (validate) {
			let object = {cardno, expiryMonth, expiryYear, secureCode};

			createCardToken(object)
			.then((res) => {
				if (res.error) {
					this.clearForm();
					return Promise.reject({message: res.error.message});
				} else {
					// console.log('Yo Stripe: ', res);
					// console.log('Yo Stripe: ', res.id);
					// res.id is the token provided by Stripe
					return res;
				}
			})
			.then((res) => {
				if (res.id) {
					let object = {
						"name": this.state.name,
						"addtionalParameters": {
						"token": res.id,
						"last4": res.card.last4,
						"brand": res.card.brand,
						"country": res.card.country,
						"exp_month": res.card.exp_month,
						"exp_year": res.card.exp_year,
						"funding": res.card.funding,
						}
					};
					return object;
				}
				else {
					return Promise.reject({ message: 'darnit rigged' });
				}
			})
			.then((value) => {
				if (value) {
					return AddCustomerPaymentMethod(this.state.token, value);
				} else {
					return Promise.reject({ message: Errors.WrongBody });
				}
			})
			.then((value) => {
				// console.log(value);
				if(this.props.routedFrom=='paymentMethodAddedLater') {
					this.props.navigator.replace({id:110, transactionId: this.props.transactionId, subscriptionId: this.props.subscriptionId});
				//  this.props.onUnmount();
				}
				else {
					this.props.navigator.popN(2);
				}

			})
			.catch((error) => {
				Alert.alert(Errors.Wrong, error.message);
				console.log('AddCreditCard.js Error: ', error.message);
			});
		} else {
			Alert.alert(Errors.Required, Errors.RequiredBody);
		}
	},

	onChangeCardNo (cardno) {
		this.setState({ cardno });
	},

	onSubmitCardNo (e) {
		let nospaceordash = this.state.cardno.replace(/-|\s/g,"")
		this.setState({ cardno: nospaceordash }, () => {
			let {cardno} = this.state;
			if (creditCardRegex.test(cardno)) {
				this.refs.expiryMonth.focus();
			} else {
				this.setState({ cardno: '' }, () => {
					Alert.alert(Errors.CardErrorHeading, Errors.CardErrorBody);
					this.refs.cardno.focus();
				});
			}
		});
	},

	render () {
		let {name, cardno, expiryMonth, expiryYear, secureCode} = this.state;
		let {navigator} = this.props;

		return (
			<View style={styles.container} >
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {'Add Payment'} // Optional
					leftIcon = {'icon-back_screen_black'}
					rightIcon = {'icon-done'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => { navigator.pop() }} // Optional
					onPressRightIcon = {this.onSubmitForm} // Optional
				/>

				<ScrollView
					style={[styles.form,]}
					keyboardShouldPersistTaps={"always"}
				>

					<View style={[styles.inputGroup, Style.row]}>
						<Text style={[styles.inputName, Style.f16]}>
							Name
						</Text>
						<View style={styles.inputContainer}>
							<TextInput
								ref="name"
								autoFocus={false}
								placeholder="Card Holder Name"
								keyboardType = "default"
								value = {name}
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[Style.f16, styles.input]}
								onChangeText={(name) => {
									this.setState({ name });
								}}
								onSubmitEditing={(event) => {
									this.refs.cardno.focus();
								}}
							/>
						</View>
					</View>

					<View style={[styles.inputGroup, Style.row]}>
						<Text style={[styles.inputName, Style.f16]}>
							Card Number
						</Text>
						<View style={styles.inputContainer}>
							<TextInput
								ref="cardno"
								placeholder="Enter Card Number"
								keyboardType = "phone-pad"
								maxLength = {20}
								value = {cardno}
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[Style.f16, styles.input]}
								onChangeText={this.onChangeCardNo}
								onSubmitEditing={this.onSubmitCardNo}
							/>
						</View>
					</View>

					<View style={[styles.inputGroup, Style.row]}>
						<Text style={[styles.inputName, Style.f16]}>
							Expiry Month
						</Text>
						<View style={styles.inputContainer}>
							<TextInput
								ref="expiryMonth"
								placeholder="MM"
								keyboardType = "phone-pad"
								maxLength = {2}
								value = {expiryMonth}
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[Style.f16, styles.input]}
								onChangeText={(expiryMonth) => {
									this.setState({ expiryMonth }, () => {
										if (expiryMonth.length === 2) {
											this.refs.expiryYear.focus()
										}
									});
								}}
								onSubmitEditing={(event) => {
									this.refs.expiryYear.focus();
								}}
							/>
						</View>
					</View>

					<View style={[styles.inputGroup, Style.row]}>
						<Text style={[styles.inputName, Style.f16]}>
							Expiry Year
						</Text>
						<View style={styles.inputContainer}>
							<TextInput
								ref="expiryYear"
								placeholder="YY"
								keyboardType = "phone-pad"
								maxLength = {2}
								value = {expiryYear}
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[Style.f16, styles.input]}
								onChangeText={(expiryYear) => {
									this.setState({ expiryYear });
								}}
								onSubmitEditing={(event) => {
									this.refs.secureCode.focus();
								}}
							/>
						</View>
					</View>

					<View style={[styles.inputGroup, Style.row]}>
						<Text style={[styles.inputName, Style.f16]}>
							Secury Code
						</Text>
						<View style={styles.inputContainer}>
							<TextInput
								ref="secureCode"
								placeholder="CVC"
								keyboardType = "phone-pad"
								maxLength = {3}
								value = {secureCode}
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[Style.f16, styles.input]}
								onChangeText={(secureCode) => {
									this.setState({ secureCode });
								}}
								onSubmitEditing={(event) => {
									this.onSubmitForm();
								}}
							/>
						</View>
					</View>

				</ScrollView>

				<KeyboardSet/>
			</View>
		);
	}
});

let styles = StyleSheet.create({
	textStyle: {
		color: 'black',
		fontSize: 16,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: Fonts.regFont[Platform.OS],
	},
	billingAndShipping: {
		marginHorizontal: 20,
		marginVertical: 10,
		borderWidth: 1,
		borderRadius: 10,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	roundButton: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderRadius: 30,
		borderColor: 'black',
		marginVertical: 10,
		marginHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		paddingTop: 10,
		paddingBottom: 10,
	},
	form: {
		marginHorizontal: 5,
		marginVertical: 5,
	},

	inputGroup: {
		backgroundColor: 'white',
		paddingHorizontal: 10,
		marginBottom: 5,
	},

	inputContainer: {
		flex: 1,
		height: 60,
		justifyContent: 'center',
	},

	input: {
		height: 40,
	},

	inputName: {
		width: 120,
		color: 'dimgrey',
		alignSelf: 'center',
	},
	textStyleMini: {
		color: 'black',
		fontSize: 14,
		fontFamily: Fonts.regFont[Platform.OS],
		justifyContent: 'center',
		alignSelf: 'flex-start'
	},
	bannerx: {
		resizeMode: 'cover',
		width: width,
		height: height * 0.30,
		// alignSelf: 'center',
		marginBottom: 5,
	},


});
