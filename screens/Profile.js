import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, Button, TextInput, StyleSheet } from 'react-native';
// import firebase from 'firebase/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
// import 'firebase/storage';
import { auth } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';

// let user = getUserVariable();

async function uploadProfileImage(imageUri) {
  // const userId = auth().currentUser.uid;
  let user = getUserVariable();
  console.log(user)
  const storage = getStorage();
  const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
  const response = await fetch(imageUri);
  const blob = await response.blob();

  uploadBytes(storageRef, blob).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  // const response = await fetch(imageUri);
  // const blob = await response.blob();

  // await storageRef.put(blob);

  const downloadUrl = await storageRef.getDownloadURL();
  return downloadUrl;
}

export function ProfileScreen() {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  console.log("called again")
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
      const user = getUserVariable();
      setName(user.displayName);
      setProfileImage(user.photoURL);
      console.log(profileImage)
    }, []);


    const handleUpdateProfile = async () => {
      try {
        await user.updateProfile({
          displayName: name,
          photoURL: profileImage,
        });
        // Update user context or navigate to another screen
      } catch (error) {
        console.log(error);
      }
    };


    const handleSelectProfileImage = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.cancelled) {
          setProfileImage(result.uri);
          uploadProfileImage(result.uri)
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Button title="Change Profile Image" onPress={handleSelectProfileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Button title="Update Profile" onPress={handleUpdateProfile} />
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