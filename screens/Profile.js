import React, { useState, useEffect, useContext } from "react";
import { View, Image, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { getStorage, uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
// import { storage } from 'firebase';
import { set, ref, update, onValue, remove } from "firebase/database";
import { updateProfile } from "firebase/auth"
import * as ImagePicker from 'expo-image-picker';
import { app, db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';
import { Box, HStack, VStack, Text } from "native-base";

export function ProfileScreen({ navigation: { goBack, navigate } }) {
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
    let progressList = null;

    useEffect(() => {
      downloadProfileImage();
      readData();
    }, []);

    progressList = getProgressList();

    function readData() {
      const starCountRef = ref(db, `users/${user.uid}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setName(data.name);
      });
    }

    // Send data to firebase
    function updateData() {
      update(ref(db, `users/${user.uid}`), {          
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

    function getProgressList() {
      // TODO: replace with real data
      let userProgress = [{location: "Midtown East", progress: 0.76}, {location: "Flatiron", progress: 0.72}, {location: "Hell's Kitchen", progress: 0.70}];
      
      return (
        <VStack paddingLeft={6} paddingRight={6} space={3} alignItems="center" >
          {userProgress.map((dataEntry) => 
                <HStack key={dataEntry.location} justifyContent="space-between" w="80%">
                  <Text italic fontSize="md">
                    {dataEntry.location}
                  </Text>
                  <Text fontSize="md" color="#32A93E">
                    {dataEntry.progress * 100 + "%"}
                  </Text>
                </HStack>)}
        </VStack>
      );
    }

    const uploadProfileImage = async (imageUri) => {
      console.log("Uploading profile picture...")
      const storage = getStorage(app);
      const storageRef = storeRef(storage, `users/${user.uid}/profile.jpg`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded profile picture!');
        Alert.alert('Success', 'Uploaded profile picture!');
      });
      
      goBack();
    }

    const downloadProfileImage = async () => {
      const storage = getStorage(app);
      // const storageRef = storeRef(storage, user.photoURL);
      const storageRef = storeRef(storage, `users/${user.uid}/profile.jpg`);
      const val = await getDownloadURL(storageRef).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setProfileImage(downloadURL);
      });
    }

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
          await uploadProfileImage(result.uri).then(response => console.log(response));;
        }
      } catch (error) {
        console.log(error);
      }
    };

    

    return (
      <View style={styles.container}>
        <VStack space={5} justifyContent="center">
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage, cache: 'reload' }} style={styles.profileImage} />
          <Button title="Change Profile Image" onPress={handleSelectProfileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <TextInput style={styles.nameInput} placeholder="Enter your name" value={name} onChangeText={setName} />
          <Button title="Update name" onPress={updateData} />
        </View>
        {progressList}
        <View style={styles.buttonContainer}>
          <Button
            color="#FFFFFF"
            title="View/Add Friends"
            onPress={() => navigate('AddFriends')}
          />
        </View>
        </VStack>
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
  buttonContainer: {
    width: 200,
    height: 50,
    backgroundColor: '#B6E13D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
