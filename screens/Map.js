import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Button, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from './mapStyle';
import * as Location from 'expo-location';
import { getTimeDiff } from '../utils';
import { HStack, Box, Pressable, Spacer, ScrollView, FlatList, Text } from 'native-base';
import ScrollBizCard from '../components/ScrollBizCard';
import { calGeoDistance } from '../utils';
import { db } from "../firebaseConfig";
import { ref, push, set } from 'firebase/database'
import { getUserVariable } from '../UserContext';

export function MapScreen() {
  const [coordinates, setCoordinates] = useState({});

  const [showFriends, setShowFriends] = useState(false);
  // TODO: implemented recommended markers
  const [showRecs, setShowRecs] = useState(false);
  const [markers, setMarkers] = useState({});

  const mapRef = useRef(null);

  const MAX_SPAN = 0.005 * 2;
  let user = getUserVariable();
  
  if (!user) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>Can't view since you haven't signed in or created an account</Text>
      </View>
    );
  }

  else {
  
    const FriendsMarkers = () => {
      if (coordinates == null) return null;

      // TODO: replace with real data
      const currTime = new Date();
      const friendsData = [
        { name: "Haohua", 
          lastAct: currTime.getTime() - (4 * 60 * 60 * 1000),
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
        },
        { name: "Jenny", 
          lastAct: currTime.getTime() - (2 * 60 * 60 * 1000 * 24),
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
        },
        { name: "Ken", 
          lastAct: currTime.getTime() - (6 * 60 * 60 * 1000 * 24),
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
        },
        { name: "Gordon", 
          lastAct: currTime.getTime() - (3 * 60 * 60 * 1000 * 24),
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
        },
      ]
      

      return friendsData.map((friendMarker, index) => 
        <Marker
          key={index}
          image={require("../assets/icons/marker.png")}
          coordinate={{latitude: friendMarker.latitude, longitude: friendMarker.longitude}}
          title={friendMarker.name}
          description={getTimeDiff(friendMarker.lastAct)} 
        />
      );

    }

    const RecSliders = () => {
      if (coordinates == null) return null;

      function getDistanceFromMe(longitude, latitude) {
        let dis = calGeoDistance(
          {latitude: coordinates.latitude, longitude: coordinates.longitude},
          {latitude: latitude, longitude: longitude},
        );
        return dis;
      }

      // TODO: replace with real data
      const DATA = [
        {
          id: '1',
          name: 'Pizza Royal',
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          img_uri: "https://wallpaperaccess.com/full/317501.jpg",
        },
        {
          id: '2',
          name: 'The Cafe',
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          img_uri: "https://wallpaperaccess.com/full/317501.jpg",
        },
        {
          id: '3',
          name: 'Zhongzhong Noodles',
          longitude: (coordinates.longitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          latitude: (coordinates.latitude - MAX_SPAN + MAX_SPAN * Math.random()).toFixed(5),
          img_uri: "https://wallpaperaccess.com/full/317501.jpg",
        },
      ];

      const renderItem = ({ item }) => (
        <ScrollBizCard key={item.id} data={item}/>
      );

      DATA.forEach((item) => {
        item.distance = getDistanceFromMe(item.longitude, item.latitude);
      });
    
      const ItemSeparator = () => (
        <Box w="5"/>
      );

      return <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparator}
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />;
    }

    
    const forceData = () => {
      const currTime = new Date();
      const convert = new Date(currTime.getTime() - (34 * 60 * 60 * 1000)).toString();
      console.log(convert)
      // console.log(currTime.getTime())
      // console.log(Date(currTime.getTime() - (0 * 60 * 60 * 1000)))
      // const data = {
      //   name : "Starbucks",
      //   latitude: 40.759366980646455,
      //   longitude: -73.95292494096424,
      //   image_uri: "https://lh5.googleusercontent.com/p/AF1QipNVsaX5GV8bfaLGT7Or8zPpih5cd11pMDdxgvA1=w426-h240-k-no"
      // };
      set(ref(db, 'users/lZ7fuY2UchaLynfXdXbOCGZl0wj1/locations/-NUPzrnuPfKrHXCDqAPT'),
        convert
      ).then(() => {
        // Data saved successfully!
        console.log("data updated!")
        alert('data updated!');
      })  
      .catch((error) => {
        // The write failed...
        alert(error);
      });
    }
    
    
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
      findCoordinates().then((coordinates) => {
        console.log("useEffect");
        console.log(coordinates.latitude);
        console.log(coordinates.longitude);
        // Uncomment below lines to manually add data to database
        // console.log("Forcing data...")
        // forceData();
        // console.log("Forced data added")
      });
    }, []);

    function readData() {
      console.log("Reading data...")
      const starCountRef = ref(db, `users/${user.uid}/friends`);
      let out = [];
      onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          // delete data['canAddFriends']
          if (data) {
          currentFriends = Object.keys(data)
          // console.log(data)

          console.log("Retrieve friends...")
          currentFriends.map((key, idx) => {
              // console.log(data[key])
              let tempRef = ref(db, `users/${key}`);
              
              onValue(tempRef, (snapshotFriend) => {
                  const friend = snapshotFriend.val();
                  // console.log(friend)
                  console.log([friend['name'], new Date(friend['lastAct'])])
                  out.push([friend['name'], new Date(friend['lastAct'])])
              });
          });
          console.log(out);
          setFriendsData(out);
          }
      });
    }

    return (
      <View style={styles.container}>
        <MapView customMapStyle={mapStyle}provider={PROVIDER_GOOGLE}style={styles.mapStyle}
          showsUserLocation={true}
          followsUserLocation={true}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}mapType="standard">
            { showFriends ?
            <FriendsMarkers/> : null}
          </MapView>

          <View style={{position: 'absolute', top: '65%', width: '100%', paddingHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* <MapviewSwitch/> */}
              {<RecSliders/>}
          </View>

          <View style={{position: 'absolute', top: '85%', width: '100%', paddingHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={switchStyles.container}>
              {/* <MapviewSwitch/> */}
              <HStack >
                <Pressable onPressOut={()=> {setShowFriends(!showFriends)}}>
                  {({
                  isPressed
                }) => {
                  return <Box bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
                  {
                      showFriends ? 
                      <Image source={require("../assets/icons/show_friends_on.png")} alt="show_friends_on" w={30} h={30}/>
                      :
                      <Image source={require("../assets/icons/show_friends_off.png")} alt="show_friends_off" w={30} h={30}/>
                  }
                  </Box>
                }}
                </Pressable>
                <Spacer/>
                <Pressable onPressOut={()=> {setShowRecs(!showRecs)}} bg="#FFFFFF">
                  {({
                  isPressed
                }) => {
                  return <Box rounded="xl" bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
                  {
                      showRecs ? 
                      <Image source={require("../assets/icons/show_recs_on.png")} alt="show_recs_on" w={30} h={30}/>
                      :
                      <Image source={require("../assets/icons/show_recs_off.png")} alt="show_recs_off" w={30} h={30}/>
                  }
                  </Box>
                }}
                </Pressable>
              </HStack>
            </View>
          </View>
          
      </View>
    );
  }
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

const buttonStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 50,
    paddingLeft: 10,
    backgroundColor: '#B6E13D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const switchStyles = StyleSheet.create({
  container: {
    width: 100,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10, 
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});