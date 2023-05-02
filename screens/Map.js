import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Button, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from "./mapStyle";
import * as Location from "expo-location";
import { getTimeDiff } from "../utils";
import {
  HStack,
  Box,
  Pressable,
  Spacer,
  ScrollView,
  FlatList,
  Text,
} from "native-base";
import ScrollBizCard from "../components/ScrollBizCard";
import { calGeoDistance } from "../utils";

export function MapScreen() {
  const [coordinates, setCoordinates] = useState({});

  const [showFriends, setShowFriends] = useState(false);
  // TODO: implemented recommended markers
  const [showRecs, setShowRecs] = useState(false);

  // API:
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const mapRef = useRef(null);

  const MAX_SPAN = 0.005 * 2;

  const FriendsMarkers = () => {
    if (coordinates == null) return null;

    // TODO: replace with real data
    const currTime = new Date();
    const friendsData = [
      {
        name: "Haohua",
        lastAct: currTime.getTime() - 4 * 60 * 60 * 1000,
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
      },
      {
        name: "Jenny",
        lastAct: currTime.getTime() - 2 * 60 * 60 * 1000 * 24,
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
      },
      {
        name: "Ken",
        lastAct: currTime.getTime() - 6 * 60 * 60 * 1000 * 24,
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
      },
      {
        name: "Gordon",
        lastAct: currTime.getTime() - 3 * 60 * 60 * 1000 * 24,
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
      },
    ];

    return friendsData.map((friendMarker, index) => (
      <Marker
        key={index}
        image={require("../assets/icons/marker.png")}
        coordinate={{
          latitude: friendMarker.latitude,
          longitude: friendMarker.longitude,
        }}
        title={friendMarker.name}
        description={getTimeDiff(friendMarker.lastAct)}
      />
    ));
  };

  const RecSliders = () => {
    if (coordinates == null) return null;

    function getDistanceFromMe(longitude, latitude) {
      let dis = calGeoDistance(
        { latitude: coordinates.latitude, longitude: coordinates.longitude },
        { latitude: latitude, longitude: longitude }
      );
      return dis;
    }

    // TODO: replace with real data
    const DATA = [
      {
        id: "1",
        name: "Pizza Royal",
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        img_uri: "https://wallpaperaccess.com/full/317501.jpg",
      },
      {
        id: "2",
        name: "The Cafe",
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        img_uri: "https://wallpaperaccess.com/full/317501.jpg",
      },
      {
        id: "3",
        name: "Zhongzhong Noodles",
        longitude: (
          coordinates.longitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        latitude: (
          coordinates.latitude -
          MAX_SPAN +
          MAX_SPAN * Math.random()
        ).toFixed(5),
        img_uri: "https://wallpaperaccess.com/full/317501.jpg",
      },
    ];

    const renderItem = ({ item }) => (
      <ScrollBizCard key={item.id} data={item} />
    );

    DATA.forEach((item) => {
      item.distance = getDistanceFromMe(item.longitude, item.latitude);
    });

    const ItemSeparator = () => <Box w="5" />;

    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const findCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
      });
      console.log("Permission to access location was denied");
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      }); // Accuracy.Balanced
      const { latitude, longitude } = location.coords;
      setCoordinates({ latitude, longitude });
      console.log(latitude);
      console.log(longitude);
      console.log("findCoordinates");
      return coordinates;
    }
  };

  const fetchData = async () => {
    const { latitude, longitude } = coordinates;
    fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const promises = responseJson.results.map(async (restaurant) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,photo&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
            );
            const detailsJson = await response.json();
            const photo = detailsJson.result?.photos?.[0];
            return {
              ...restaurant,
              photoUrl: photo
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
                : undefined,
            };
          } catch (error) {
            console.error(error);
            return restaurant;
          }
        });
        Promise.all(promises).then((restaurantsWithPhotos) => {
          setRestaurants(
            restaurantsWithPhotos.map((result) => ({
              id: result.place_id,
              name: result.name,
              location: {
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng,
              },
              address: result.vicinity,
            }))
          );
        });
      })

      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    findCoordinates();
    fetchData(); // is this right to put this here? - Jenny
    console.log("useEffect");
    console.log(coordinates.latitude);
    console.log(coordinates.longitude);
  }, []);

  return (
    <View style={styles.container}>
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
        {showFriends ? <FriendsMarkers /> : null}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id}
            coordinate={restaurant.location}
            onPress={() => setSelectedRestaurant(restaurant)}
          />
        ))}
      </MapView>

      {/* // This UI definitely can be improved. I was using <Modal> earlier. - Jenny */}

      {selectedRestaurant && (
        <View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
              <Text style={styles.modalAddress}>
                {selectedRestaurant.vicinity}
              </Text>
              <Text>{selectedRestaurant.rating}</Text>
              <Text>
                {selectedRestaurant.opening_hours?.open_now ? "Open" : "Closed"}
              </Text>
              <Text style={styles.modalText}>
                {selectedRestaurant.description}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

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
        {<RecSliders />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 50,
    paddingLeft: 10,
    backgroundColor: "#B6E13D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const switchStyles = StyleSheet.create({
  container: {
    width: 100,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
