/*

  How to use this StyleSheet:

  Style => Style has all the basestyles for the whole app
  StyleConstants => This has all the constant variable e.g, theme color & etc
  Font => Fonts used in application

  ## @ Guidlines
  ## Import it in your file with the given syntax below 

  import {
    Style,
    StyleConstants,
    Fonts
  } from '../stylesheet/style';

*/

import {Fonts} from './Fonts'
import {StyleConstants} from './StyleConstants'
import {BaseStyle} from './BaseStyle'
import {ContactsStyle} from './BaseStyle'


export {Fonts};
export {StyleConstants};
export {BaseStyle as Style};
export {ContactsStyle};
