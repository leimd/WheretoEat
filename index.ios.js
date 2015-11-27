/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var _ = require('underscore');
var {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity, 
	MapView,
} = React;

this.windowDimension = Dimensions.get('window');	
var userCoords = null;
var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#F5FCFF',
		borderWidth: 1,

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
		backgroundColor: '#2DB2DB',
		fontFamily: '.HelveticaNeueInterface-MediumP4',
		fontSize: 17,
		fontWeight: 'bold',
		textAlign: 'center',
		height:75,
	},
	button:{
		shadowOpacity: 50,
		shadowOffset: {width:3, height:3},
		flex:1,
	},
	MainArea:{
		top:40,
		borderWidth:5,
		height:this.windowDimension.height - 100,
		width: this.windowDimension.width,
	},
	mapStyle:{
		height: this.windowDimension.height - 200,
		width: this.windowDimension.width,
	}
});

class WhereToEat extends React.Component{
	constructor() {
		super();
		this.state = {restaurant: null};	
	}
	
	render() {
		return (
				<View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', }}>
				<MainArea restaurant={this.state.restaurant}/>
				<ButtonArea func1={this.findWhereToEat.bind(this)}/>
				</View>
			   );
	}

	findWhereToEat() {
		this.getGeolocation();
	}

	async getGeolocation() {
		let currentPosition = navigator.geolocation.getCurrentPosition(
				(position) => {
					userCoords = position.coords;
					console.log(userCoords);
					var queryparams = {
						key: 'AIzaSyBJ05I2ft3kJoOqdl8CgL9RmcU1Jj5jgmc',
						location: `${position.coords.latitude} , ${position.coords.longitude}`,
						radius: 3000,
						types: 'food|restaurant|bar'
					};
					this.numOfCalls = 1;
					this.results = {};
					this.fetchDataFromGoogle(queryparams);
					console.log("Finished");
				},
				(error) => console.log('Error' + error),
				{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
				);
	}

	async fetchDataFromGoogle(queryParams) {
		console.log('Fetching');
		const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
		var queryURI = baseUrl + Object.keys(queryParams).map((key)=>{
						return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
					}).join('&');
		try{
			let response = await fetch(queryURI);
			let pagetoken = JSON.parse(response._bodyText).next_page_token;
			let result = JSON.parse(response._bodyText).results;
			let key = queryParams['key'];
			this.setState({restaurant: _.sample(result)});
		} catch(error) {
			console.log('error');
			console.log(error);
		}
	}
}

class ButtonArea extends React.Component{

	render() { 
		return(
				<View style={{ flexDirection: "column",}}>
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
		console.log(this.props);
		if (_.isNull(this.props.restaurant)){
		return(
			<View style={styles.MainArea}>
				<Text>
					Click Button to Randomly select a restaurant {'\n'}
				</Text>
			</View>
			)
		} else {
			console.log(this.props.restaurant);
			console.log(userCoords);
		return (
			<View style={styles.MainArea}>
				<MapView
				annotations={[{
					latitude: this.props.restaurant.geometry.location.lat,
					longitude: this.props.restaurant.geometry.location.lng,
					animatiDrop: true,
					title: this.props.restaurant.name,
					subtitle: this.props.vicinity
					}]}
				mapType='standard'
				style={styles.mapStyle}
				region={{latitude: userCoords.latitude,
						longitude: userCoords.longitude,
						latitudeDelta: 0.1,
						longitudeDelta: 0.1}}
				showsUserLocation={true}
				minDelta={0.05}
				/>
				<Text style={{textAlign: 'center',
							fontWeight: 'bold',
							fontSize: 18
				}}> 
					{this.props.restaurant.name}
				</Text>
				<Text style={{textAlign: 'center',
							contSize:15
					
					}}> 
					{this.props.restaurant.vicinity}
				</Text>
			</View>
			)
		}
	}

	calcDistance(UserCoords, destinationCoords) {
	
	}

}

AppRegistry.registerComponent('WhereToEat', function(){ return WhereToEat});
