import React, { useEffect, useState } from "react";
// import { Platform, StyleSheet, View } from 'react-native';
// import { Container, Button, Text, Spinner, Input, Row, NativeBaseProvider } from "native-base";
// import { Grid, Col } from "react-native-easy-grid";
// // import * as Font from "expo-font";
// import { Ionicons } from "@expo/vector-icons";
// import * as Location from 'expo-location';
// import { SafeAreaView } from "react-native-safe-area-context";

// // test firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { FONT_COLOR, BACKGROUND_COLOR } from "../constants";

import { auth } from "../firebaseConfig";

// // const SignUpLogInComponent = props => {
// export function SignUpLogInComponent() {
//   const [coordinates, setCoordinates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null);
//   const loadFonts = async () => {
//     try {
//       if (Platform.OS === "android") {
//         await Font.loadAsync({
//           Roboto: require("../assets/Roboto.ttf"),
//           Roboto_medium: require("../assets/Roboto_medium.ttf"),
//           ...Ionicons.font
//         });
//       }
//       setLoading(false);
//     } catch (error) { console.log(error); }
//   };

//   const findCoordinates = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       this.setState({
//         locationResult: 'Permission to access location was denied',
//       });
//       console.log('Permission to access location was denied');
//       return;
//     } else {
//       let location = await Location.getCurrentPositionAsync({ accuracy: 3 }); // Accuracy.Balanced
//       const { latitude, longitude } = location.coords;
//       setCoordinates({ latitude, longitude });
//     }
//   };

//   useEffect(() => {
//     // loadFonts();
//     findCoordinates();
//   }, []);

//   return (
//     <View style={[styles.container,{flexDirection: 'column',},]}>
//             <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR.LIGHT_GREY }}>
//                 {loading ? (
//                 <Grid style={{ alignItems: "center" }}>
//                     <Col>
//                     <Spinner color="blue" />
//                     </Col>
//                 </Grid>
//                 ) : (
//                     <Grid style={{ alignItems: "center" }}>
//                     <Row>
//                         <Input placeholder="Email" value={email} onChangeText={setEmail}/>
//                         <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
//                     </Row>
//                     <Col>
//                         <Button style={{ alignSelf: "center", backgroundColor: BACKGROUND_COLOR.DARK_GREY }}
//                         onPress={() => {
//                             props.navigation.navigate("Restaurants", {
//                             coordinates
//                             });
//                         }}>
//                         <Text style={{color: FONT_COLOR.YELLOW}}>View Local Restaurants</Text>
//                         </Button>
//                     </Col>
//                     <Col>
//                         <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
//                         onPress={() => {
//                             console.log("signing up");
//                             createUserWithEmailAndPassword(auth, email, password)
//                             .then((userCredential) => {
//                                 // Signed in 
//                                 const user = userCredential.user;
//                                 setUser(user)
//                                 console.log("user signed up");
//                                 // ...
//                             })
//                             .catch((error) => {
//                                 const errorCode = error.code;
//                                 const errorMessage = error.message;
//                                 console.log("error" + errorMessage)
//                                 // ..
//                             });
//                         }}>
//                         <Text style={{color: "rgb(255, 238, 0)"}}>Sign me up!</Text>
//                         </Button>
//                     </Col>
//                     <Col>
//                         <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
//                         onPress={() => {
//                             console.log("Logging In!");
//                             signInWithEmailAndPassword(auth, email, password)
//                             .then((userCredential) => {
//                             // Signed in 
//                             const user = userCredential.user;
//                             setUser(user)
//                             console.log("Successfully logged in")
//                             })
//                             .catch((error) => {
//                             console.log("error" + error)
//                             const errorCode = error.code;
//                             const errorMessage = error.message;
//                             });
//                         }}>
//                         <Text style={{color: "rgb(255, 238, 0)"}}>Log In!</Text>
//                         </Button>
//                     </Col>
//                     <Col>
//                         <View style={[buttonStyles.container]}>
//                             <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}
//                             onPress={() => {
//                                 console.log("Signing Out!");
//                                 signOut(auth).then(() => {
//                                 // Sign-out successful.
//                                 setUser(null)
//                                 }).catch((error) => {
//                                 // An error happened.
//                                 console.log("error" + error)
//                                 });
//                             }}>
//                             <Text style={{color: "rgb(255, 238, 0)"}}>Sign Out!</Text>
//                             </Button>
//                         </View>
//                     </Col>
//                     </Grid>
//                 )}
//             </SafeAreaView>
//     </View>
//   );
// };

import { Button, Row, TextInput, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";

export function SignUpLogInComponent({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

  return (
    <View style={[styles.container,{flexDirection: 'column',},]}>
        <View style={inputStyles.inputContainer}>
            <Text>Email:</Text>
            <TextInput
                style={inputStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            </View>
        <View style={inputStyles.inputContainer}>
            <Text>Password:</Text>
            <TextInput
                style={inputStyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
        </View>
      <View style={[buttonStyles.container]}>
        <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)"}} title="Sign me up!"
            onPress={() => {
                console.log("signing up");
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    setUser(user)
                    console.log("user signed up");
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("error" + errorMessage)
                    // ..
                });
            }}>
        </Button>
      </View>
      <View style={[buttonStyles.container]}>
        <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }}  title="Log in!"
            onPress={() => {
                console.log("Logging In!");
                signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                console.log("Successfully logged in")
                })
                .catch((error) => {
                console.log("error" + error)
                const errorCode = error.code;
                const errorMessage = error.message;
                });
            }}>
        </Button>
      </View>
      <View style={[buttonStyles.container]}>
        <Button style={{ alignSelf: "center", backgroundColor: "rgb(47, 47, 47)" }} title="Sign out!"
            onPress={() => {
                console.log("Signing Out!");
                signOut(auth).then(() => {
                // Sign-out successful.
                setUser(null)
                }).catch((error) => {
                // An error happened.
                console.log("error" + error)
                });
            }}>
            <Text style={{color: "rgb(255, 238, 0)"}}>Sign Out!</Text>
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const inputStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputContainer: {
      width: '80%',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
    },
});

const buttonStyles = StyleSheet.create({
  container: {
    width: 150,
    height: 50,
    backgroundColor: '#B6E13D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});