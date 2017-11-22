import {
	Platform
} from 'react-native';

let StyleConstants = {
	primary: '#ff3300',//'#f96623',//'#00833c',//'#4357F4',
	white: '#fff',
	black: '#333',
	gray: '#999',
	lightGray: '#edecea',
	navbarBg: '#ddd',
	navbarHeight: 55,
	paragraphFontSize: 12,
	h1FontSize: 20,
	h2FontSize: 14,
	headingFontSize: 20,

	TitleFixedHeight: Platform.OS === 'ios' ? 64: 40,
	TitleParallaxHeight: 155,
};

export {StyleConstants};
