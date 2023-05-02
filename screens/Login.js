import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Button, TextInput, StyleSheet, View, Text } from 'react-native';
import { setUserVariable } from '../UserContext';
import { set, ref, update } from "firebase/database";
import { db } from "../firebaseConfig";

export function SignUpLogInComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);

    // Send user data to firebase
    function createData(user) {
        console.log("testing")
        console.log(user)
        set(ref(db, `users/${user.uid}`), {          
          id: user.uid,
          email: email,
          name: '',
        //   friends: {canAddFriends: true},
          lastAct: Date()
        }).then(() => {
          // Data saved successfully!
          // alert('data updated!');
          console.log("Data saved successfully!");
        })  
        .catch((error) => {
          // The write failed...
          alert(error);
        });
    }

    function registerEmptyProfileImage() {

    }
    

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
                {user && user.emailVerified ? (
                    <Text style={{color: "green"}}>Email verified!</Text>
                ) : (
                    <Text style={{color: "red"}}>Please verify your email when signing up to access your account</Text>
                )}
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
                            setUser(user);
                            setUserVariable(user);
                            createData(user);
                            registerEmptyProfileImage();
                            console.log("user signed up");
                            
                            // Send email verification
                            sendEmailVerification(user).then(() => {
                                console.log("Email verification sent");
                            }).catch((error) => {
                                console.log("Error sending email verification: " + error);
                            });
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
                            if (user.emailVerified) {
                                setUser(user);
                                setUserVariable(user);
                                setEmailVerified(true);
                                update(ref(db, `users/${user.uid}`), {          
                                    lastAct: Date()
                                  }).then(() => {
                                    // Data saved successfully!
                                    // alert('data updated!');
                                    console.log("Data saved successfully!");
                                  })  
                                  .catch((error) => {
                                    // The write failed...
                                    alert(error);
                                  });
                                // createData(user);
                                console.log("Successfully logged in")
                            }
                            else {
                                console.log("Please verify your email before logging in");
                            }
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
                            setUser(null);
                            setUserVariable(null);
                            setEmailVerified(false);
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