import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');


export default class Accordian extends Component {

  constructor (props) {
    super(props);
    this.state = { show: false, toggle: true };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.setState({
      show: !this.state.show,
      toggle: !this.state.toggle
    })
  }

  firstParagraph (answer) {
    let i = answer.indexOf('<op>');
    return i > 0 ? answer.slice(0, i) : '';
  }

  bulletPoints (answer) {
    return answer.match(/<op>(.*?)<\/op>/g).map((val, i) => {
      return (
        <Text style={styles.answer} key={i}>
          {`${i+1} -`} {val.replace(/<\/?op>/g,'')}
        </Text>
      );
    });
  }

  lastParagraph (answer) {
    return (
      <Text style={styles.answer}>
        {answer.slice(answer.lastIndexOf('</op>') + 5)}
      </Text>
    );
  }

  renderAnswer (answer) {
    if ( answer.match(/<op>(.*?)<\/op>/g) ) {
      return (
        <View>
          <Text style={styles.answer}>{this.firstParagraph(answer)}</Text>
          {this.bulletPoints(answer)}
          {this.lastParagraph(answer)}
        </View>
      )
    } else {
      return (<Text style={styles.answer}>{answer}</Text>);
    }
  }

  render () {
    let {show, toggle} = this.state;
    let {question, answer} = this.props;

    toggle ? sign = '+' : sign = '-';

    renderToggleAnswer = () => {
      if (show) {
        return (<View>{this.renderAnswer(answer)}</View>);
      } else {
        return (<View></View>);
      }
    }

    return (
      <View>
        <TouchableOpacity onPress={this.handleToggle}>
          <View style={Style.row}>
            <Text style={styles.question}>{question}</Text>
            <Text style={[styles.toggle, styles.sign]}>{sign}</Text>
          </View>
        </TouchableOpacity>
        {renderToggleAnswer()}
      </View>
    );
  }

}

const styles = StyleSheet.create({

  question: {
    fontSize: 18,
    color: 'black',
    marginVertical: 10,
    flex: 9,
    fontSize: 18,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  answer: {
    marginHorizontal: 10,
    marginVertical: 10,
    color: 'black',
    // textAlign: 'justify',
    // lineHeight:
    fontSize: 16,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  sign: {
    fontSize: 40,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  toggle: {
    flex: 1,
    marginLeft: 5,
    // alignSelf: 'flex-start',
  }

});
