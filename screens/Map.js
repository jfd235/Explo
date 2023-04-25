import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from './mapStyle';
import * as Location from 'expo-location';

export function MapScreen() {
  const [coordinates, setCoordinates] = useState({});
  const mapRef = useRef(null);
  
  const findCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
      console.log('Permission to access location was denied');
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest}); // Accuracy.Balanced
      const { latitude, longitude } = location.coords;
      setCoordinates({ latitude, longitude });
      console.log(latitude)
      console.log(longitude)
      console.log("findCoordinates");
      return coordinates
    }
  }

  useEffect(() => {
    findCoordinates();
    console.log("useEffect");
    console.log(coordinates.latitude);
    console.log(coordinates.longitude);
  }, []);


  return (
    <View style={styles.container}>
      <MapView customMapStyle={mapStyle}provider={PROVIDER_GOOGLE}style={styles.mapStyle}
        showsUserLocation={true}
        followsUserLocation={true}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}mapType="standard"></MapView>
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});