import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

import MenuBar from '../common/MenuBar';
import {get} from '../../lib/rest';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'empty': require('../../res/common/emptyPixel.png')
}

import myListOfCategories from './stubs/categories';

export default class HelpScreen extends Component {

  constructor (props) {
    super(props);
    this.state = {
      categories: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      categoriesList:[],
    };

    this.onPressBack = this.onPressBack.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
  }

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({
        token: value,
      });
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@Help')
      return get(value, 'HelpCenter');
    })
    .then((res) => {
      if (res.Error) {
        this.setState({ categories: this.state.categories.cloneWithRows([]) });
      } else {
        this.setState({
          categories: this.state.categories.cloneWithRows(res),
          categoriesList: res,
        });
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  onPressBack () {
    this.props.navigator.pop();
  }

  renderCategories (rowData, sectionID, rowID) {
		let {navigator} = this.props;
    let {category, questionsAnswers} = rowData;
    // console.log(rowData);
    return (
      <TouchableOpacity
        onPress={() => { navigator.push({ id: 280, title: category, questionsAnswers: questionsAnswers }) }}
        style={[styles.category, Style.rowWithSpaceBetween]}
      >
        <Text style={Style.f16}>{category}</Text>
        <Image source={images.right_caret} style={styles.right_caret} />
      </TouchableOpacity>
    );
  }

  render () {
    let {categories, categoriesList} = this.state;
    let {navigator} = this.props;
      categoriesList = categoriesList ? categoriesList : [];
    renderList = () => {
			return (
				<ListView
          ref = 'list'
          dataSource={categories}
          renderRow={this.renderCategories}
          enableEmptySections={true}
          bounces = {false}
        />
			);
		}

    return (
      <View style={styles.container}>

        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Help'} // Optional
          leftIcon = {'icon-back_screen_black'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {this.onSubmitForm} // Optional
        />

        <ScrollView style={styles.wrapper}>
          {categoriesList.length > 0 ? renderList(): <View/> }
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex:1,
    backgroundColor: StyleConstants.lightGray,
  },

  wrapper: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    padding: 10
  },

  title: {
    color: 'gray',
    fontSize: 30,
  },

  category: {
    padding: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.75,
  },

  categoryTitle: {
    color: 'gray',
  },

  right_caret: {
    width: 15,
    height: 15,
  },

});
