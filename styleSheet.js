"use strict";
import {StyleSheet} from 'react-native';
var Dimensions = require('Dimensions');
this.windowDimension = Dimensions.get('window');	

console.log(this.windowDimension);

styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		width: this.windowDimension.width,
		height: this.windowDimension.height,
		alignSelf: 'stretch',
	},
	mapStyle:{
		height: this.windowDimension.height - 200,
		width: this.windowDimension.width,
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
	MainArea:{
		top:20,
		height:this.windowDimension.height - 50,
		width: this.windowDimension.width,
	},
	MainAreaImage:{
		width:  this.windowDimension.width * 0.9,
		height: this.windowDimension.height - 200,	
		alignSelf: 'center',
	},
	text: {
		textAlign: 'center',
		color: '000000',
		opacity: 100,
	}
});
