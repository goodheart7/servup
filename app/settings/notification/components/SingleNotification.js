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
	Image,
	AsyncStorage,
  Switch,
} from 'react-native';


import {
  Style,
  StyleConstants,
  Fonts
} from '../../../stylesheet/style';
import Icon from '../../../stylesheet/icons'
const {height, width} = Dimensions.get('window');

export default class SingleNotification extends Component {

  constructor (props) {
    super(props);
    this.state = { opt: this.props.value };
    this.onToggleSubmit = this.onToggleSubmit.bind(this);
  }

  onToggleSubmit () {
    let obj = {
      id: this.props.id,
      type:this.props.type,
      text:this.props.text,
      value: this.state.opt,
    }
    this.props.onPressToggle(obj);
  };

  render () {
    let {name} = this.props;

    return (
      <View style = {Style.listRow}>
        <View style={Style.rowWithSpaceBetween}>
          <Text style = {styles.textStyle}>{this.props.text}</Text>
          <Switch
            value = {this.state.opt}
            onValueChange = {(opt) => {
              this.setState({opt}, () => {
                this.onToggleSubmit();
              })
            }}
          />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({

  textStyle: {
    width: width*.8,
    fontSize: 16,
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
    paddingHorizontal:10,
    paddingVertical:10,
  }

});
