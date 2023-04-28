import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref, update, onValue, remove } from "firebase/database";
import { updateProfile } from "firebase/auth"
import * as ImagePicker from 'expo-image-picker';
import { app, db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';

export function ProfileScreen({ navigation: { goBack } }) {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
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
      // downloadProfileImage();
      readData();
    }, []);

    function readData() {
      const starCountRef = ref(db, `users/${user.uid}/name`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setName(data.name);
      });
    }

    // Send data to firebase
    function createData() {
      set(ref(db, `users/${user.uid}/name`), {          
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

    // const uploadProfileImage = async (imageUri) => {
    //   console.log("Uploading profile picture...")
    //   const storage = getStorage(app);
    //   const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
    //   const response = await fetch(imageUri);
    //   const blob = await response.blob();
      
    //   uploadBytes(storageRef, blob).then((snapshot) => {
    //     console.log('Uploaded profile picture!');
    //     Alert.alert('Success', 'Uploaded profile picture!');
    //   });
      
    //   await downloadProfileImage();
    //   goBack();
    // }

    // const downloadProfileImage = async () => {
    //   const storage = getStorage(app);
    //   const storageRef = ref(storage, user.photoURL);
    //   const val = await getDownloadURL(storageRef).then((downloadURL) => {
    //     console.log('File available at', downloadURL);
    //     setProfileImage(downloadURL);
    //   });
    // }


    // const handleUpdateProfile = async () => {
    //   try {
    //     await updateProfile(user, {
    //       displayName: name,
    //       photoURL: `users/${user.uid}/profile.jpg`,
    //     });
    //     // Update user context or navigate to another screen
    //     console.log("Profile updated:", user.displayName)
    //     Alert.alert('Success', 'Updated profile!');
    //     goBack();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };


    // const handleSelectProfileImage = async () => {
    //   try {
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== "granted") {
    //       alert("Sorry, we need camera roll permissions to make this work!");
    //       return;
    //     }
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //       allowsEditing: true,
    //       aspect: [1, 1],
    //       quality: 1,
    //     });

    //     if (!result.cancelled) {
    //       await uploadProfileImage(result.uri).then(response => console.log(response));;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    return (
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage, cache: 'reload' }} style={styles.profileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <TextInput style={styles.nameInput} placeholder="Enter your name" value={name} onChangeText={setName} />
          <Button title="Update name" onPress={createData} />
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