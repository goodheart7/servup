import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Platform,
	TouchableOpacity,
	ListView,
	TextInput,
	ScrollView,
	Dimensions,
	Image,
} from 'react-native';
import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
	'left_caret': require('../../../res/common/back.png'),
	'check': require('../../../res/common/check.png'),
	'empty': require('../../../res/common/emptyPixel.png'),
};
var i = 0;
var defaultPic = require('../../../res/common/profile.png');
import MenuBar from '../../common/MenuBar';
import ScrollableTabView, {
	DefaultTabBar,
	ScrollableTabBar
} from 'react-native-scrollable-tab-view';
let items = ['first', 'second', 'third', ];
const {height, width} = Dimensions.get('window');
const moment = require('moment');


let Details = React.createClass({

	getInitialState () {
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			ds,
			Questions:[],
			Attributes: [],
			source: ds.cloneWithRows([{}, {}, {}]),
		}
	},
	componentDidMount () {
		let {orderQuestions, orderAttributes} = this.props;
		this.setState({ Questions: orderQuestions, Attributes: orderAttributes });
	},

	renderSelectedAttributes() {
		let {Attributes} = this.state;
		console.log('@@@@@@@@@@@@@@@',Attributes);
		if(Attributes != null) {
			return Attributes.map((attribute, index) => {
				return (
					<View key= {index}>
						<View style = {Style.rowWithSpaceBetween}>
							<Text style = {styles.textStyle}>
								{attribute.attributeName}
							</Text>
							<Text style = {styles.textStyle}>
								{attribute.selectedValues}
							</Text>
						</View>
						<View style = {Style.lineSeparator} />
					</View>
				);
			});
		}
	},

	renderSharedInfo() {
		let {Questions} = this.state;
		console.log('@@@@@@@@@@@@@@@',Questions);
		if(Questions != null) {
			return Questions.map((question, index) => {
				return (
					<View key= {index}>
						<View style = {Style.rowWithSpaceBetween}>
							<Text style = {styles.textStyle}>
								{question.question}
							</Text>
							<Text style = {styles.textStyle}>
								{question.selectedAnswers}
							</Text>
						</View>
						<View style = {Style.lineSeparator} />
					</View>
				);
			});
		}
	},

	renderStickyHeader() {
		return(
			<MenuBar
				title = {'Order Details'} // Optional
				leftIcon = {'icon-back_screen_black'}
				onPressLeftIcon = {() => this.props.navigator.pop()} // Optional
			/>
		);
	},


	cardistView(rowData, sectionID, rowID) {
		return (
			<TouchableOpacity
				style = {[Style.rowWithSpaceBetween, styles.container]}
				// onPress={}
			>
				<View style = {[Style.rowWithSpaceBetween, {flexWrap: 'wrap', flex: 2}]}>
					<View style = {{backgroundColor: 'white'}}>
						<Image
							source = {defaultPic}
							style = {[styles.image]}
							resizeMode = "cover"
						/>
						<View style = {{flexDirection:'row' }}>
							<Image
								source={defaultPic}
								style={{width: 25, height: 25, borderRadius: 12,marginTop: -30,marginLeft:0, borderWidth:2.5, borderColor:'white',  marginHorizontal: 10}}
								resizeMode="cover"
							/>
						</View>
					</View>
					<View style = {{alignSelf: 'center', paddingHorizontal: 8, flex: 3}}>
						<View style = {{flexDirection:'row', justifyContent:'space-between'}}>
							<Text style = {[{
								fontWeight: '400',
								color: 'black',
								fontSize: 17,
							}]}>
								{'Service Name'}
							</Text>
								<View style = {[{height:10, width:10, borderRadius:7, marginRight: -20}, {backgroundColor: 'red'}]}/>
						</View>
						<Text style = {[styles.textStyle, {paddingTop:5, paddingBottom:5}]}>
							{moment().format('MMM DD, YYYY')}
						</Text>
						<Text style = {styles.textStyle}>
							{'price'}
						</Text>
					</View>
				</View>

				<View style = {[Style.center, {paddingRight :5}]}>
					<Image
						style = {{width: 15, height: 15}}
						source = {defaultPic}
					/>
				</View>
			</TouchableOpacity>	
		);
	},

	renderTab(dataSource) {
		return (
			<ListView
				style = {{marginHorizontal: 10}}
				contentContainerStyle = {{justifyContent: 'center'}}
				// horizontal = {true}
				dataSource = {dataSource}
				renderRow = {this.cardistView}
				enableEmptySections = {true}
				bounces = {false}
				onEndReachedThreshold = {30} 
				// onEndReached = {this.reloadActive}
			/>
		);
	},

	render () {
		let {Attributes} = this.props.orderAttributes;
		console.log('@@@@@@@@ attr', this.props.orderAttributes);
		let {Questions} = this.props.orderQuestions;
		return (
			<View style = {{flex: 1, backgroundColor: StyleConstants.lightGray,}}>
				{this.renderStickyHeader()}
				<ScrollableTabView
					tabBarBackgroundColor={'white'}
					tabBarActiveTextColor={StyleConstants.primary}
					tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize:18, paddingTop:5}}
					tabBarUnderlineStyle={[{ backgroundColor: StyleConstants.primary,height: 2.5, marginBottom:2,  }]}
					renderTabBar={() => <DefaultTabBar />}
				>
					<View tabLabel='Selected Specs'>
						{this.renderTab(this.state.source)}
					</View>
					<View tabLabel='Shared information'>
						{this.renderTab(this.state.source)}
					</View>
				</ScrollableTabView>
			</View>
		);
	}
});

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		//padding: 10,
		marginVertical:10,
	},
	textStyle: {
		color: 'black',
		fontSize: 15,
		fontFamily: Fonts.regFont[Platform.OS],
	},
	textStyle: {
		fontSize: 20,
		color: 'black',
		fontFamily: Fonts.regFont[Platform.OS],
		//paddingVertical: 10
	},
	container: {
		marginHorizontal: 5,
		marginTop: 5,
		marginVertical: 2,
		backgroundColor: 'white',
		padding: 5
	},
	image: {
		width: 95,
		height: 95,
		marginHorizontal: 5,
		marginVertical: 5,
		borderWidth: 0.5,
		borderColor: 'gainsboro'
	},

});

export default Details;
