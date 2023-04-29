import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { getStorage, uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
import { set, ref, update, onValue, remove } from "firebase/database";
import * as ImagePicker from 'expo-image-picker';
import { app, db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';

export function LatestActivityScreen({ navigation: { goBack } }) {
  const [friends, setFriends] = useState([]);
  const [newFriend, setFriendToAdd] = useState('');
  let user = getUserVariable();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Can't view since you haven't signed in or created an account</Text>
      </View>
    );
  }

  else {
    useEffect(() => {
      readData();
    }, []);

    function readData() {
      const starCountRef = ref(db, `users/${user.uid}/friends`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log("friends")
        console.log(data)
        setFriends(data.name);
      });
    }

    // Send data to firebase
    function createData() {
      set(ref(db, `users/${user.uid}/friends`), {          
        name: name
      }).then(() => {
        // Data saved successfully!
        alert('data updated!');
      })  
      .catch((error) => {
        // The write failed...
        alert(error);
      });

      readData();
    }

    return (
      <View style={styles.container}>
        <View style={styles.profileInfoContainer}>
          <Text></Text>
          <TextInput style={styles.nameInput} placeholder="Enter your friend's name" onChangeText={setFriendToAdd} />
          <Button title="Add Friend" onPress={createData} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfoContainer: {
    alignItems: "center",
  },
  nameInput: {
    borderBottomWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 20,
    width: "80%",
    textAlign: "center",
  },
});