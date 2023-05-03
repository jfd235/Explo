import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Image,
  Alert,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from './mapStyle';
import * as Location from 'expo-location';
import { getTimeDiff } from '../utils';
import {
  HStack,
  Box,
  Pressable,
  Spacer,
  ScrollView,
  FlatList,
  Text,
} from "native-base";
import ScrollBizCard from '../components/ScrollBizCard';
import { calGeoDistance } from '../utils';
import { db } from "../firebaseConfig";
import { ref, push, set, onValue } from 'firebase/database'
import { getUserVariable } from '../UserContext';
import { RecMarkers } from "../components/RecMarkers";

export function MapScreen({ navigation }) {
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showFriends, setShowFriends] = useState(false);
  const [showRecs, setShowRecs] = useState(false);
  const [markers, setMarkers] = useState({});

  // API:
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

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
      
      if (markers.length != 0) {
        return markers.map((friendMarker, index) => (
          // console.log(friendMarker)
          <Marker
            key={friendMarker.id}
            image={require("../assets/icons/marker.png")}
            coordinate={{
              latitude: friendMarker.location.latitude,
              longitude: friendMarker.location.longitude,
            }}
            onPress={(e) => {
              console.log("pressed: ", friendMarker.lastAct);
          }}
            // title={friendMarker.userName + ': ' + friendMarker.name}
            // description={getTimeDiff(new Date(friendMarker.lastAct))}
          >
              <Callout
                onPress={() => {
                  onBizCardPressedOut(friendMarker)
                  console.log("pressed")
                }}>
                  <Text
                    isTruncated
                    italic
                    fontSize="md"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    paddingLeft={2}
                  >
                    {`${friendMarker.userName} was here ${getTimeDiff(new Date(friendMarker.lastAct))}`}
                  </Text>
                  <ScrollBizCard bizData={friendMarker} userLocation={coordinates}/>
              </Callout>
          </Marker>
        ));
      }
    }

    function getDistanceFromMe(longitude, latitude) {
      let dis = calGeoDistance(
        {latitude: coordinates.latitude, longitude: coordinates.longitude},
        {latitude: latitude, longitude: longitude},
      );
      return dis;
    }
    const RecSliders = ({data}) => {
      if (coordinates == null) return null;

      const renderItem = ({ item }) => (
        <ScrollBizCard
          key={item.id}
          bizData={item}
          userLocation={coordinates}
          onBizCardPressedOut={onBizCardPressedOut}
        />
      );

      // markers.forEach((item) => {
      //   item.push(getDistanceFromMe(item[2], item[3]));
      // });
    
      const ItemSeparator = () => (
        <Box w="5"/>
      );

      return <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparator}
                data={data}
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
      //   name : "Granny Annie's Bar & Kitchen",
      //   latitude: 40.75863439838801,
      //   longitude: -73.95280781507101,
      //   image_uri: "https://lh5.googleusercontent.com/p/AF1QipNjTCMLfSUmeSIRasBhJJz0ULGlg26OkeT0Wi_a=w408-h541-k-no"
      // };
      set(ref(db, 'users/lZ7fuY2UchaLynfXdXbOCGZl0wj1/locations/-NUSdca7SAuAeHAZTXAp'),
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
        // console.log(latitude)
        // console.log(longitude)
        // console.log("findCoordinates");
      }
    }
    const readData = async (uid) => {
      if (!uid) {
        return null;
      }
      console.log("Reading data...")
      console.log(uid)
      const starCountRef = ref(db, `users/${uid}`);
      let name = null;
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        // delete data['canAddFriends']
        console.log("user name", data.name)
        name = data.name;
      });
      return name;
    }

    const findFriends = async () => {
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
            let tempRef = ref(db, `users/${key}/locations`);            
            onValue(tempRef, (snapshotFriend) => {
              const locations = snapshotFriend.val();
              if (locations) {
                // console.log("locations", locations)
                const locationKeys = Object.keys(locations)
                // console.log([friend['name'], new Date(friend['lastAct'])])
                // out.push([friend['name'], new Date(friend['lastAct'])])
                locationKeys.map((locationKey, idx2) => {
                  // const locationRef = ref(db, `locations/${locationKey}`);
                  // // console.log("locationKey", locationKey)
                  // onValue(locationRef, (snapshotLocation) => {
                  //   const locationData = snapshotLocation.val();
                  //   // console.log("locationData", locationData)
                  let nameRef = ref(db, `users/${key}`); 
                  onValue(nameRef, (snapshotName) => {
                    const userName = snapshotName.val()['name'];
                    console.log("found name", userName)
                    fetch(
                      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${locationKey}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
                    ).then((response) => response.json())
                    .then((responseJson) => {
                      const photo = responseJson.result?.photos?.[0];
                      const result = {
                        ...responseJson.result,
                        photoUrl: photo
                          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
                          : undefined,
                        reviews: responseJson.result.reviews,
                        formatted_phone_number: responseJson.result.formatted_phone_number,
                        website: responseJson.result.website,
                        price_level: responseJson.result.price_level,
                        rating: responseJson.result.rating,
                      };
                      // console.log("result", result)
                      const restaurantData = {
                        id: result.place_id,
                        name: result.name,
                        location: {
                          latitude: result.geometry.location.lat,
                          longitude: result.geometry.location.lng,
                        },
                        address: result.vicinity,
                        imgUrl: result.photoUrl,
                        reviews: result.reviews,
                        phoneNumber: result.formatted_phone_number,
                        website: result.website,
                        priceLevel: result.price_level,
                        rating: result.rating,
                        userName: userName,
                        lastAct: locations[locationKey].lastAct,
                      };
                      console.log("result location", restaurantData.location)
                      out.push(restaurantData);
                    }).then(() => {
                      console.log("setting markers", out);
                      setMarkers(out);
                    });
                  });
                });
              }
            });
          });
        }
      });
    }
    
    const getPlaceData = async (place_id) => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,photo,formatted_phone_number,website,reviews,price_level,rating&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
      ).then((response) => {
        const restaurantData = {
          id: result.place_id,
          name: result.name,
          location: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
          address: result.vicinity,
          imgUrl: result.photoUrl,
          reviews: result.reviews,
          phoneNumber: result.formatted_phone_number,
          website: result.website,
          priceLevel: result.price_level,
          rating: result.rating,
        };
        return restaurantData;
      });
    };

    const fetchData = () => {
      const { latitude, longitude } = coordinates;
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=800&type=restaurant&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("responseJsonRes", responseJson.results)
          const promises = responseJson.results.map(async (restaurant) => {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,photo,formatted_phone_number,website,reviews,price_level,rating&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
              );
              const detailsJson = await response.json();
              const photo = detailsJson.result?.photos?.[0];
              return {
                ...restaurant,
                photoUrl: photo
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
                  : undefined,
                reviews: detailsJson.result.reviews,
                formatted_phone_number: detailsJson.result.formatted_phone_number,
                website: detailsJson.result.website,
                price_level: detailsJson.result.price_level,
                rating: detailsJson.result.rating,
              };
            } catch (error) {
              console.error(error);
              return restaurant;
            }
          });
          Promise.all(promises).then((restaurantsWithPhotos) => {
            const restaurantData = restaurantsWithPhotos.map((result) => ({
              id: result.place_id,
              name: result.name,
              location: {
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng,
              },
              address: result.vicinity,
              imgUrl: result.photoUrl,
              reviews: result.reviews,
              phoneNumber: result.formatted_phone_number,
              website: result.website,
              priceLevel: result.price_level,
              rating: result.rating,
            }));
            setRestaurants(restaurantData);
          });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    useEffect(() => {
      findCoordinates().then(() => {
        if(coordinates) {
          console.log("Current location");
          console.log(coordinates.latitude);
          console.log(coordinates.longitude);
        }

        // Uncomment below lines to manually add data to database
        // console.log("Forcing data...")
        // forceData();
        // console.log("Forced data added")
      });
      findFriends().then(() => {
        console.log("Friends found")
      });
    }, []);

    useEffect(() => {
      if (coordinates == null || coordinates.longitude == undefined || coordinates.latitude == undefined)
        return;
      fetchData();
    }, [coordinates]);
  
    const onBizCardPressedOut = (bizData) => {
      navigation.navigate("Detail", { bizData });
    };

    return (
      <View style={styles.container}>
        {coordinates &&
          <MapView
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            showsUserLocation={true}
            followsUserLocation={true}
            region={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            mapType="standard"
          >
            {showFriends && <FriendsMarkers />}
            {!isLoading && showRecs && (
              <RecMarkers
                restaurants={restaurants}
                userLocation={coordinates}
                onBizCardPressedOut={onBizCardPressedOut}
              />
            )}
          </MapView>
        }
  
        <View
          style={{
            position: "absolute",
            top: "65%",
            width: "100%",
            paddingHorizontal: "10%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* <MapviewSwitch/> */}
          {showRecs && <RecSliders data={restaurants} />}
          {showFriends && <RecSliders data={markers} />}
        </View>
  
        <View
          style={{
            position: "absolute",
            top: "85%",
            width: "100%",
            paddingHorizontal: "10%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={switchStyles.container}>
            {/* <MapviewSwitch/> */}
            <HStack>
              <Pressable
                onPressOut={() => {
                  setShowRecs(false);
                  setShowFriends(!showFriends);
                }}
              >
                {({ isPressed }) => {
                  return (
                    <Box bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
                      {showFriends ? (
                        <Image
                          source={require("../assets/icons/show_friends_on.png")}
                          alt="show_friends_on"
                          w={30}
                          h={30}
                        />
                      ) : (
                        <Image
                          source={require("../assets/icons/show_friends_off.png")}
                          alt="show_friends_off"
                          w={30}
                          h={30}
                        />
                      )}
                    </Box>
                  );
                }}
              </Pressable>
              <Spacer />
              <Pressable
                onPressOut={() => {
                  setShowFriends(false);
                  setShowRecs(!showRecs);
                }}
                bg="#FFFFFF"
              >
                {({ isPressed }) => {
                  return (
                    <Box rounded="xl" bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
                      {showRecs ? (
                        <Image
                          source={require("../assets/icons/show_recs_on.png")}
                          alt="show_recs_on"
                          w={30}
                          h={30}
                        />
                      ) : (
                        <Image
                          source={require("../assets/icons/show_recs_off.png")}
                          alt="show_recs_off"
                          w={30}
                          h={30}
                        />
                      )}
                    </Box>
                  );
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