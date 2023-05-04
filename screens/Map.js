import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Image,
  Alert,
} from "react-native";
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
import { RecMarkers } from "../components/RecMarkers";
import { getZipcodeBorders } from "../utils";
import { ZipCodeOverlay } from "../components/ZipCodeOverlay";
import { RewardsOverlay } from "../components/RewardsOverlay";

export function MapScreen({ navigation, route }) {
  const [coordinates, setCoordinates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [showFriends, setShowFriends] = useState(false);
  const [showRecs, setShowRecs] = useState(false);

  // API:
  const [restaurants, setRestaurants] = useState([]);

  // Map Overlay:
  const [showOverlay, setShowOverlay] = useState(true); // change to false after switch implemented
  const [zipCodeCoordinates, setZipCodeCoordinates] = useState([]);
  const [badgeToShow, setBadgeToShow] = useState(1);

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

    let DATA = [...restaurants];

    const renderItem = ({ item }) => (
      <ScrollBizCard
        key={item.id}
        bizData={item}
        userLocation={coordinates}
        onBizCardPressedOut={onBizCardPressedOut}
      />
    );

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

  const fetchData = () => {
    const { latitude, longitude } = coordinates;
    fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
    )
      .then((response) => response.json())
      .then((responseJson) => {
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
    findCoordinates();
    // fetchData(); // is this right to put this here? - Jenny
    console.log("useEffect");
    console.log(coordinates.latitude);
    console.log(coordinates.longitude);
  }, []);

  useEffect(() => {
    if (coordinates.longitude == undefined || coordinates.latitude == undefined)
      return;
    fetchData();
    const zipCodeCoordinates = getZipcodeBorders();
    setZipCodeCoordinates(zipCodeCoordinates._j); //TODO: figure out why this _j field
    if (route.params != null && route.params.badgeToShow != null) {
      setBadgeToShow(route.params.badgeToShow);
    }
  }, [coordinates]);

  const onBizCardPressedOut = (bizData) => {
    navigation.navigate("Detail", { bizData });
  };

  const onBadgePressed = () => {
    setBadgeToShow(null);
  };

  const onGotoCollectionsPressed = () => {
    console.log("go to collections");
  };

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
        {showFriends && <FriendsMarkers />}
        {!isLoading && showRecs && (
          <RecMarkers
            restaurants={restaurants}
            userLocation={coordinates}
            onBizCardPressedOut={onBizCardPressedOut}
          />
        )}
        {showOverlay && !badgeToShow && (
          <ZipCodeOverlay geometry={zipCodeCoordinates} />
        )}
      </MapView>

      <View
        style={{
          position: "absolute",
          top: "20%",
          width: "100%",
        }}
      >
        {badgeToShow && (
          <RewardsOverlay
            badge={badgeToShow}
            onBadgePressed={onBadgePressed}
            onGotoCollectionsPressed={onGotoCollectionsPressed}
          />
        )}
      </View>

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
        {!showRecs && !badgeToShow && <RecSliders />}
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
