import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { set, push, ref, onValue, query, equalTo, orderByChild} from "firebase/database";
import { db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';
import { FlatList } from "native-base";

export function AddFriends({ navigation: { goBack } }) {
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
        // delete data['canAddFriends']
        if (data) {
          console.log("data")
          console.log(data)
          currentFriends = Object.keys(data);
          let names = [];
          currentFriends.map((key, idx) => {
            let tempRef = ref(db, `users/${key}`);
            onValue(tempRef, (snapshotFriend) => {
              const friend = snapshotFriend.val();
              // console.log(friend)
              if(friend) {
                console.log(friend['name'])
                names.push(friend['name'])
                }
            });
          });
          console.log(names)
          setFriends(names)
          console.log("data filtered")
          console.log(currentFriends)
        }
      });
    }

    // Add friends to firebase
    function createData() {
      let data = null;

      // This queries the user
      const usersRef = ref(db, 'users');
      const nameQuery = query(usersRef, orderByChild('name'), equalTo(newFriend));
      onValue(nameQuery, (snapshot) => {
        data = snapshot.val();
        console.log(data)
        
        if (data == null) {
          alert("User cannot be found!")
        }
        else {
          const userId = Object.entries(data)[0][0]

          // This adds the friend to the users's friends list
          set(ref(db, `users/${user.uid}/friends/${userId}`), {          
            // email: data[userId].email,
            // id: data[userId].id,
            // name: data[userId].name,
            // lastAct: data[userId].lastAct,            
            date: Date()
          }).then(() => {
            // Data saved successfully!
            alert('Friend Added!');
          })  
          .catch((error) => {
            // The write failed...
            alert(error);
          });

          // console.log(friends)

          friends.push(data[userId])
        }
      });
    }

    const renderItem = ({ item }) => {
      return (
        // <View>
          <Text>{item}</Text>
        /* </View> */
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Enter friend's name:</Text>
          <TextInput style={styles.nameInput} placeholder="Enter your friend's name" onChangeText={setFriendToAdd} />
          <Button title="Add Friend" onPress={createData} />
        </View>
        <View style={styles.content}>
          <Text>Friend Feed:</Text>
          <FlatList data={friends} renderItem={renderItem}></FlatList>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nameInput: {
    borderBottomWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 20,
    width: "80%",
    textAlign: "center",
  },
//   nameInput: {
//     borderBottomWidth: 1,
//     borderColor: "gray",
//     padding: 10,
//     marginVertical: 20,
//     width: "80%",
//     textAlign: "center",
//   },
});