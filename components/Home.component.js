import React, { useEffect, useState } from "react";
import { Platform } from 'react-native';
import { Container, Button, Text, Spinner, Input, Row } from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { SafeAreaView } from "react-native-safe-area-context";

// test firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseConfig";

const HomeComponent = props => {
  const [coordinates, setCoordinates] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  //   const email = "wg222@cornell.edu";
  //   const password = "123456";
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in 
  //       const user = userCredential.user;
  //       console.log("user signed up");
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
      // });
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
            <Row>
              <Input placeholder="Email" value={email} onChangeText={setEmail}/>
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
            </Row>
            <Col>
              <Button 
                  style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
                  title="Sign up"
                  onPress={() => {
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
                  }}/>
            </Col>
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
            <Col>
              <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
                onPress={() => {
                  console.log("signing up");
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
                      console.log(errorMessage)
                      // ..
                    });
                }}>
                <Text style={{color: "rgb(255, 238, 0)"}}>Sign me up!</Text>
              </Button>
            </Col>
            <Col>
              <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
                onPress={() => {
                  console.log("Logging In!");
                  signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("Successfully logged in")
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                  });
                }}>
                <Text style={{color: "rgb(255, 238, 0)"}}>Log In!</Text>
              </Button>
            </Col>
          </Grid>
        )}
    </SafeAreaView>
  );
};

export default HomeComponent;
