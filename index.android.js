/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import Swiper from 'react-native-swiper';
import React from 'react-native';
import ActionButton from 'react-native-action-button';
import _ from 'underscore';
import './styleSheet';

console.log(styles);

var {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity, 
	MapView,
	Image,
} = React;

var userCoords = null;

class WhereToEat extends React.Component{
	constructor() {
		super();
		let localRestaurants = [
			{name: 'Little Korean Resturant', vicinity: 'on West Pender Street'
				,picUri: require('./localFixture/01-littleKorean.png')
			},
			{name: 'Big Korean Restaurant', vicinity: 'Don\' Remember'
				,picUri: require('./localFixture/noodleBox.jpg')
			},
			{name: '丼屋', vicinity: 'on Symore?'
				,picUri: require('./localFixture/03-donPlace.png')
			},
			{name: 'little Japanese Resturant', vicinity: 'near little korean resturant'
				,picUri: require('./localFixture/04-littleJapanese.png')
			},
			{name: 'Café 365', vicinity: 'near our Beanworks'
				,picUri: require('./localFixture/05-cafe335.png')
			},
			{name: 'Noodle box', vicinity: 'Beanworks Friday place'
				,picUri: require('./localFixture/noodleBox.jpg')
			},
			{name: 'shogun', vicinity: 'Howe'
				,picUri: require('./localFixture/noodleBox.jpg')
			},
			{name: 'A & W', vicinity: 'some where near Georgia Street'
				,picUri: require('./localFixture/08-aw.jpeg')
			},
			{name: 'VCC', vicinity: 'Comdata VCC'
				,picUri: require('./localFixture/09-vcc.jpeg')
			},
			{name: 'Throw Coin to Decide', vicinity: 'I am really tired of deciding where to eat for you guys, come on !'
				,picUri: require('./localFixture/furstratedFace.png')
			}
		];
		this.state = {restaurant: null,
		   	localRestaurants, 
			state: 'Hit + to see Menu',
			started: false,
			};	
		console.log(this.state.localRestaurants);
	}
	
	render() {
		let backgroundImage = (this.state.started)
							? require('./backgroundImageBW.jpg')
							: require('./backgroundImage.jpg');
		return (
				<Image source={backgroundImage} style={styles.container}>
				<Text style={styles.text}> Program is doing : {this.state.state} </Text>
					<MainArea restaurant={this.state.restaurant} programState={this.state.state}/>
					<ActionButtonArea 
						func1={this.chooseRestaurantInDowntownVancouver.bind(this)} 
						func2={this.findWhereToEat.bind(this)}
						/>
				</Image>
			   );
	}

	setStatus (state='Nothing') {
		this.setState({state});
	}

	chooseRestaurantInDowntownVancouver() {
		this.setState({started: true}),
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
						radius: 1000,
						types: 'food|restaurant|bar'
					};
					this.numOfCalls = 1;
					this.results = {};
					this.setStatus('About to fetch data from Alphbet(Google)');
					this.fetchDataFromGoogle(queryparams);
					this.setStatus("Waiting for you to click again");
				}.bind(this),
				(error) => console.log('Error' + error),
				{enableHighAccuracy: false, timeout: 500, maximumAge: 500}
				);
	}

	async fetchDataFromGoogle(queryParams) {
		navigator.geolocation.stopObserving();
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

class MainArea extends React.Component{
	render() {
		console.log(this.props);
		if (_.isNull(this.props.restaurant)){
		return(
			<View style={styles.MainArea}>
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
				<Text style={[styles.text,
					{fontSize: 25,
					fontWeight: 'bold',   
					}]}> 
					{this.props.restaurant.name}
				</Text>
				<Text style={[styles.text,{
							fontSize:15}
					]}> 
					{this.props.restaurant.vicinity}
				</Text>
				<Image source={this.props.restaurant.picUri} style={styles.MainAreaImage}/>
			</View>
			)
		}
	}
}

class ActionButtonArea extends React.Component {

	render(func1) {
		return(
					<ActionButton buttonColor="rgba(231,76,60,1)">
						<ActionButton.Item buttonColor='#9b59b6' 
								title="I work in Downtown YVR" 
								onPress={this.props.func1}>
							<Text> </Text>
						</ActionButton.Item>
						<ActionButton.Item buttonColor='#9b59b6' 
								title="Tell me where to eat" 
								onPress={this.props.func2}>
							<Text> </Text>
						</ActionButton.Item>
					</ActionButton>

			  )	
	}
}

AppRegistry.registerComponent('WhereToEat', function(){ return WhereToEat});
