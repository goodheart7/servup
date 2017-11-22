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
} from 'react-native';

import MenuBar from '../common/MenuBar';

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

import Accordian from './components/Accordian';

// import questionAndAnswers from './stubs/questionAndAnswers';

export default class HeloQA extends Component {

  constructor (props) {
    super(props);
    this.state = {
      list: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };

    this.onPressBack = this.onPressBack.bind(this);
    this.renderListAnswers = this.renderListAnswers.bind(this);
  }

  componentDidMount () {
    this.setState({
      list: this.state.list.cloneWithRows(this.props.questionsAnswers),
    });
  }

  onPressBack () {
    this.props.navigator.pop();
  }

  renderListAnswers (rowData, sectionID, rowID) {
		let {navigator} = this.props;
    let {question, answer} = rowData;
    // console.log(rowData);
    return (<Accordian key={rowID} question={question} answer={answer} />);
  }

  render () {
    let {list} = this.state;
    let {title, navigator} = this.props;

    renderList = () => {
			return (
				<ListView
          ref = 'list'
          style={styles.wrapper}
          dataSource={list}
          renderRow={this.renderListAnswers}
          enableEmptySections={true}
          bounces = {false}
        />
			);
		}

    return (
      <View style={styles.container}>

        {/* <TitleBar
          leftButton = {images.left_caret}
          title = {title}
          // rightButton = {require('../res/common/menu.png')}
          rightButton2 = {images.empty}
          onLeftButtonPress={this.onPressBack}
          // onRightButton2Press= {this.onPressAdd}
        /> */}

        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {title} // Optional
          leftIcon = {'icon-arrow-left2'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {this.onSubmitForm} // Optional
        />

        {list.getRowCount() == 0 ? <View></View> : renderList()}
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
    margin: 5,
    backgroundColor: 'white',
    padding: 10,
  },

});
