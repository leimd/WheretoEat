/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity, 
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	buttonText:{
		backgroundColor: '#3FBFBF',
		color: '#BF7F3F',
		fontFamily: '.HelveticaNeueInterface-MediumP4',
		fontSize: 17,
		fontWeight: 'bold',
		textAlign: 'center',
		padding: 10,
	},
	button:{
		shadowOpacity: 50,
		shadowOffset: {width:3, height:3},
		flex:1,
	}
});


class WhereToEat extends React.Component{
	render() {
		return (
				<View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', }}>
				<MainArea/>
				<ButtonArea func1={this.findWhereToEat.bind(this)}/>
				</View>
			   );
	}

	findWhereToEat() {
		this.getGeolocation();
	}

	getGeolocation() {
		let currentPosition = navigator.geolocation.getCurrentPosition(
				(position) => {
					this.fetchDataFromGoogle(position.coords);
				},
				(error) => console.log('Error' + error),
				{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
				);
	}

	async fetchDataFromGoogle(currentPosition) {
		const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
		var queryparams = {
			key: 'AIzaSyBJ05I2ft3kJoOqdl8CgL9RmcU1Jj5jgmc',
			location: `${currentPosition.latitude} , ${currentPosition.longitude}`,
			radius: 3000,
			types: 'food|restaurant|bar'
		};
		var queryURI = baseUrl + Object.keys(queryparams).map((key)=>{
						return encodeURIComponent(key) + '=' + encodeURIComponent(queryparams[key]);
					}).join('&');
		console.log(queryURI);
		try{
			let response = await fetch(queryURI);
			console.log(JSON.parse(response._bodyText).results);
		} catch(error) {
			console.log('error ');
			console.log(error);
		}
	}
}

class ButtonArea extends React.Component{

	render() { 
		return(
				<View style={{ flexDirection: 'row'}}>
					<Button onPress={this.props.func1}> Tell me where to eat NOW! </Button>	
				</View>
				)
	}
}

class Button extends React.Component{

	render() { 
		return(
				<View style={styles.button}>
					<TouchableOpacity onPress={this.props.onPress}>
						<Text style={styles.buttonText}>
						{this.props.children}
						</Text>
					</TouchableOpacity>
				</View>
				)
	}

}

class MainArea extends React.Component{
	render() {
		return(
			<View>
				<Text>
					Click Button to Randomly select a restaurant {'\n'}
				</Text>
			</View>
			)
	}

}

AppRegistry.registerComponent('WhereToEat', function(){ return WhereToEat});
