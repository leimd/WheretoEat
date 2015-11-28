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
		flex:1,
		borderWidth:1,
	},
	MainArea:{
		top:40,
		borderWidth:5,
		height:this.windowDimension.height - 100,
		width: this.windowDimension.width,
	},
	ButtonArea:{
		flexDirection: 'row',
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
		let localRestaurants = [
			{name: 'Little Korean Resturant', vicinity: 'on West Pender Street'},
			{name: 'Big Korean Restaurant', vicinity: 'Don\' Remember'},
			{name: '丼屋', vicinity: 'on Symore?'},
			{name: 'little Japanese Resturant', vicinity: 'near little korean resturant'},
			{name: 'Café 365', vicinity: 'near our company'},
			{name: 'Noodle box', vicinity: 'Beanworks Friday place'},
			{name: 'shogun', vicinity: 'Howe'},
			{name: 'A & W', vicinity: 'some where near Georgia Street'},
			{name: 'VCC', vicinity: 'Comdata VCC'},
			{name: 'Throw Coin to Decide', vicinity: 'I am really tired of deciding where to eat for you guys, come on !'}
		];
		this.state = {restaurant: null, localRestaurants, state: 'Nothing'};	
		console.log(this.state.localRestaurants);
	}
	
	render() {
		return (
				<View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', }}>
				<MainArea restaurant={this.state.restaurant} programState={this.state.state}/>
				<ButtonArea 
				func1={this.findWhereToEat.bind(this)}
				func2={this.chooseRestaurantInVancouverDowntown.bind(this)}
				/>
				</View>
			   );
	}

	setStatus (state='Nothing') {
		this.setState({state});
	}

	chooseRestaurantInVancouverDowntown() {
		this.setStatus('Choosing Restaurant for you in Downtown Vancouver');
		this.setState({restaurant: _.sample(this.state.localRestaurants)});
		this.setStatus();	
	}

	findWhereToEat() {
		console.log('clicked');
		this.setStatus('you just clicked a button');
		this.getGeolocation();
	}

	async getGeolocation() {
		this.setStatus('Getting GEO location ...');
		console.log(navigator.geolocation.getCurrentPosition);
		navigator.geolocation.getCurrentPosition(
				(position) => {
					userCoords = position.coords;
					console.log(userCoords);
					var queryparams = {
						key: 'AIzaSyDns4_P-1c83QPVlKMt0TViMdDJQkIT-2U',
						location: `${position.coords.latitude} , ${position.coords.longitude}`,
						radius: 3000,
						types: 'food|restaurant|bar'
					};
					this.numOfCalls = 1;
					this.results = {};
					this.setStatus('About to fetch data from Alphbet(Google)');
					this.fetchDataFromGoogle(queryparams);
					this.setStatus("Waiting for you to click again");
				}.bind(this),
				(error) => console.log('Error' + error),
				{enableHighAccuracy: false, timeout: 2000, maximumAge: 1000}
				);
	}

	async fetchDataFromGoogle(queryParams) {
		this.setStatus('Waiting for Google API ...');
		const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
		var queryURI = baseUrl + Object.keys(queryParams).map((key)=>{
						return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
					}).join('&');
		try{
			let response = await fetch(queryURI);
			let pagetoken = JSON.parse(response._bodyText).next_page_token;
			let result = JSON.parse(response._bodyText).results;
			let key = queryParams['key'];
			console.log(result);
			this.setStatus('Got Data');
			this.setState({restaurants: result, restaurant: _.sample(result)});
		} catch(error) {
			console.log('error');
			console.log(error);
		}
	}
}

class ButtonArea extends React.Component{

	render() { 
		return(
				<View 
				style={ styles.ButtonArea}	
				>
					<Button onPress={this.props.func1}> Tell me where to eat NOW! </Button>	
					<Button onPress={this.props.func2}> I work near Vancouver Downtown</Button>	
				</View>
				)
	}
}

class Button extends React.Component{

	render() { 
		return(
				<View style={styles.button}>
					<TouchableOpacity onPress={this.props.onPress}>
						<Text style={styles.buttonText} numberOfLines={2}>
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
					Program is doing : {this.props.programState}
				</Text>
				<Text>
					Click Button to Randomly select a restaurant {'\n'}
				</Text>
			</View>
			)
		} else {
			console.log(this.props.restaurant);
			console.log(userCoords);
//				<MapView
//				annotations={[{
//					latitude: this.props.restaurant.geometry.location.lat,
//					longitude: this.props.restaurant.geometry.location.lng,
//					animatiDrop: true,
//					title: this.props.restaurant.name,
//					subtitle: this.props.vicinity
//					}]}
//				mapType='standard'
//				style={styles.mapStyle}
//				region={{latitude: userCoords.latitude,
//						longitude: userCoords.longitude,
//						latitudeDelta: 0.1,
//						longitudeDelta: 0.1}}
//				showsUserLocation={true}
//				minDelta={0.05}
//				/>
		return (
			<View style={styles.MainArea}>
				<Text>
					Program is doing : {this.props.programState}
				</Text>
				<Text style={{textAlign: 'center',
							fontWeight: 'bold',
							fontSize: 18
				}}> 
					{this.props.restaurant.name}
				</Text>
				<Text style={{textAlign: 'center',
							fontSize:15
					
					}}> 
					{this.props.restaurant.vicinity}
				</Text>
			</View>
			)
		}
	}

}

AppRegistry.registerComponent('WhereToEat', function(){ return WhereToEat});
