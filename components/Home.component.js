import React, { useEffect, useState } from "react";
import { Platform } from 'react-native';
import { Container, Button, Text, Spinner } from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { SafeAreaView } from "react-native-safe-area-context";

// test firebase
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseConfig";

const HomeComponent = props => {
  const [coordinates, setCoordinates] = useState({});
  const [loading, setLoading] = useState(true);
  const loadFonts = async () => {
    try {
      if (Platform.OS === "android") {
        await Font.loadAsync({
          Roboto: require("../assets/Roboto.ttf"),
          Roboto_medium: require("../assets/Roboto_medium.ttf"),
          ...Ionicons.font
        });
      }
      setLoading(false);
    } catch (error) { console.log(error); }
  };

  const findCoordinates = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
      console.log('Permission to access location was denied');
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({ accuracy: 3 }); // Accuracy.Balanced
      const { latitude, longitude } = location.coords;
      setCoordinates({ latitude, longitude });
    }
  };

  useEffect(() => {
    loadFonts();
    findCoordinates();

    const email = "wg222@cornell.edu";
    const password = "123456";
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user signed up");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(240, 240, 240)" }}>
      {loading ? (
        <Grid style={{ alignItems: "center" }}>
          <Col>
            <Spinner color="blue" />
          </Col>
        </Grid>
      ) : (
          <Grid style={{ alignItems: "center" }}>
            <Col>
              <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
                onPress={() => {
                  props.navigation.navigate("Restaurants", {
                    coordinates
                  });
                }}>
                <Text style={{color: "rgb(255, 238, 0)"}}>View Local Restaurants</Text>
              </Button>
            </Col>
          </Grid>
        )}
    </SafeAreaView>
  );
};

export default HomeComponent;
