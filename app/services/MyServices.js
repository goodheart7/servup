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
	//Image,
	ScrollView,
	AsyncStorage,
} from 'react-native';
import Image from 'react-native-image-progress';
import LoadingCardServices from '../home/LoadingCardServices';
import Modalbox from 'react-native-modalbox';
import ScrollableTabView, {
	DefaultTabBar,
	ScrollableTabBar
} from 'react-native-scrollable-tab-view';

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

import MenuBar from '../common/MenuBar';
import SideMenu from '../common/xxSideMenu';
import NavBar from '../common/NavBar';

import {
	getSavedCards,
	getActiveCards
} from '../../lib/networkHandler';

let images = {
	'left_caret': require('../../res/common/back.png'),
	'menu': require('../../res/common/menu.png'),
};

import {MiniSPCardsStubActive, MiniSPCardsStubSaved} from './MiniSPCardsStub';

import MiniSPActiveCard from './components/MiniSPActiveCard';
import MiniSPSaveCard from './components/MiniSPSaveCard';

const MyServices = React.createClass({

	getInitialState () {
		var ds = ds2 = ds3 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			ds, ds2, ds3,
			loaded: false,
			activeCards: ds.cloneWithRows([{}]),
			savedCards: ds2.cloneWithRows([{}]),
			activeCardsPending: ds3.cloneWithRows([{}]),
			activeCardsList:[],
			savedCardsList:[],
			sideMenuOpen: false,
			show: true,
			activeMax: 20,
			savedMax: 20,
		};
	},

	componentDidMount () {
		this.loadViewData();
	},

	loadViewData() {
		AsyncStorage.getItem("UserToken")
		.then((token) => {
			this.setState({ token });
			return getActiveCards(token, this.state.activeMax)
		})
		.then((res) => {
			var array;
			array = res;
			if (array.Errors)
				array = [];
			if (array.Message)
				array = [];
			
			var pendingCards = array.map((x)=> {
				if (x.paymentStatus == 'pending')
					return x;
			});
			pendingCards = pendingCards.filter((x) => {
				if (x)
					return x;
			});
			array = array.map((x)=> {
				if (x.paymentStatus != 'pending')
					return x;
			});

			array = array.filter((x) => {
				if (x)
					return x;
			});
			console.log('Active Cards res', pendingCards);
			console.log('Active Cards not pending', array);

			// array = array.concat(array);
			// array = array.concat(array);
			// array = array.concat(array);
			this.setState({
				activeCards: this.state.ds.cloneWithRows(array),
				activeCardsPending: this.state.ds3.cloneWithRows(pendingCards),
				// show: true,
				activeCardsList: res,
			});
			return getSavedCards(this.state.token, this.state.savedMax);
		})
		.then((res) => {
			// console.log('Liked Cards', res);
			this.setState({
				loaded: true,
				savedCards: this.state.ds2.cloneWithRows(res),
				savedCardsList: res,
			});
		})
		.catch((error) => {
			console.log('MyServices.js -- Error() : ', error);
		});
	},

	reloadActive() {
		if (this.state.loaded)
		{
			console.log('End reached, reloading more active cards');
			getActiveCards(this.state.token, this.state.activeMax + 20)
			.then((res) => {
				var array;
				array = res;
				if (array.Errors)
					array = [];
				if (array.Message)
					array = [];
				console.log('Active Cards reload', array);
				var pendingCards = array.map((x)=> {
					if (x.paymentStatus == 'pending')
						return x;
					});
				array = array.map((x)=> {
					if (x.paymentStatus != 'pending')
						return x;
				});

				array = array.filter((x) => {
					if (x)
						return x;
				});

				pendingCards = pendingCards.filter((x) => {
					if (x)
						return x;
				});
				this.setState({
					activeMax: this.state.activeMax + 20,
					activeCards: this.state.ds.cloneWithRows(array),
					activeCardsPending: this.state.ds3.cloneWithRows(pendingCards),
					show: true,
				});
			})
			.catch((error) => {
				console.log('MyServices.js reload -- Error() : ', error);
			});
		}
	},

	reloadSaved() {
		console.log('End reached, reloading more saved cards');
		getSavedCards(this.state.token, this.state.savedMax + 20)
		.then((res) => {
			this.setState({
				savedMax: this.state.savedMax + 20,
				savedCards: this.state.ds2.cloneWithRows(res),
				savedCardsList:res,
			});
		})
		.catch((error) => {
			console.log('MyServices.js reload -- Error() : ', error);
		});
	},

	animatedLoader() {
		return (
			<LoadingCardServices/>
		);
	},

	renderActiveCards (rowData, sectionID, rowID) {
		let {navigator} = this.props;
		return (
			<MiniSPActiveCard key={rowID} navigator={navigator} {...rowData}/>
		);
	},

	renderSavedCards (rowData, sectionID, rowID) {
		let {navigator} = this.props;
		return (
			<MiniSPSaveCard key={rowID} navigator={navigator} {...rowData}/>
		);
	},

	render () {
		let {navigator} = this.props;
		let {sideMenuOpen, activeCards, savedCards, activeCardsList, savedCardsList} = this.state;
		activeCardsList = activeCardsList ? activeCardsList :[];
		savedCardsList = savedCardsList ? savedCardsList : [];
		let currentRoute = navigator.getCurrentRoutes();

		renderEmpty = () => {
			if (this.state.show) {
				return (
					<View style={styles.emptyContainer}>
						<Text style={[Style.center, Style.f16]}>
							{'Empty'}
						</Text>
					</View>
				);
			}
		}

		renderActive = () => {
			return (
				<ScrollView contentContainerStyle = {{justifyContent: 'center'}}>
					<View style = {styles.textBox}>
						<Text style={[Style.center, Style.f18, {fontWeight: '400'}]}>
							{'Pending'}
						</Text>
					</View>
					<View style = {{alignItems: 'center'}}>
						<ListView
							ref = 'listA'
							style = {{marginHorizontal: 10}}
							contentContainerStyle = {{justifyContent: 'center'}}
							horizontal = {true}
							dataSource={this.state.loaded? this.state.activeCards : this.state.ds.cloneWithRows([{},{},{}])}
							renderRow={this.state.loaded? this.renderActiveCards : this.animatedLoader}
							enableEmptySections={true}
							bounces = {true}
							onEndReached = {this.reloadActive}
						/>
					</View>

					<View style = {styles.textBox}>	
						<Text style={[Style.center, Style.f18, {fontWeight: '400'}]}>
							{'Previously Subscribed'}
						</Text>
					</View>
					<View style = {{alignItems: 'center'}}>
						<ListView
							ref = 'listC'
							removeClippedSubviews = {false}
							style = {{marginHorizontal: 10}}
							contentContainerStyle = {{justifyContent: 'center'}}
							horizontal = {true}
							dataSource={this.state.loaded? this.state.activeCardsPending : this.state.ds3.cloneWithRows([{},{},{}])}
							renderRow={this.state.loaded? this.renderActiveCards : this.animatedLoader}
							enableEmptySections={true}
							bounces = {true}
							onEndReached = {this.reloadActive}
						/>
					</View>
				</ScrollView>
			);
		}

		renderSaved = () => {	
			return (
				<View style = {{alignItems: 'center'}}>
					<ListView
						ref = 'listS'
						style = {{marginHorizontal: 10}}
						contentContainerStyle = {{justifyContent: 'center'}}
						horizontal = {true}
						dataSource={savedCards}
						renderRow={this.renderSavedCards}
						enableEmptySections={true}
						bounces = {true}
						onEndReached = {this.reloadSaved}
					/>
				</View>
			);
		}

		return (
			<View style={styles.container}>

				<View style={{ zIndex: -1 }}>
					<MenuBar
						// color = {'red'} // Optional By Default 'black'
						title = {'My Services'} // Optional
						leftIcon = {'icon-back_screen_black'}
					 // rightIcon = {'icon-menu'} // Optional
						// disableLeftIcon = {true} // Optional By Default false
						// disableRightIcon = {true} // Optional By Default false
						onPressLeftIcon = {() => {this.props.routedFrom== 'payment'? navigator.popN(3): navigator.pop()} } // Optional
						//onPressRightIcon = {() => this.setState({
						//	sideMenuOpen: !this.state.sideMenuOpen
						//})} // Optional
					/>
				</View>

				<ScrollableTabView
					tabBarBackgroundColor={'white'}
					tabBarActiveTextColor={StyleConstants.primary}
					tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize:18, paddingTop:5}}
					tabBarUnderlineStyle={[{ backgroundColor: StyleConstants.primary,height: 2.5, marginBottom:2,  }]}
					renderTabBar={() => <DefaultTabBar />}
				>
					<View tabLabel='Active'>
						{this.state.loaded? activeCardsList.length > 0 ?  renderActive() : renderEmpty() : renderActive()}
					</View>
					<View tabLabel='Saved'>
						{savedCardsList.length >0 ? renderSaved() : renderEmpty()}
					</View>
				</ScrollableTabView>

				<NavBar navigator = {navigator} />

				<Modalbox
					isOpen = {sideMenuOpen}
					isDisabled = {this.state.sideMenuOpen = false}
					entry = {'right'}
					backdrop = {true}
					style = {{ left: width/3 }}
					swipeToClose = {true}
					animationDuration= {400}
				>
					<SideMenu navigator={navigator}/>
				</Modalbox>
			</View>
		);
	},

});

const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: StyleConstants.lightGray,
	},

	textBox: {
		backgroundColor: 'white',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
		marginBottom: 5,
		borderColor: 'transparent',
		borderWidth: 1,
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},

	emptyContainer: {
		flex: 1,
		// height: height,
		justifyContent: 'center',
		backgroundColor: 'white',
	},

});

export default MyServices
