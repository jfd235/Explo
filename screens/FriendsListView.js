import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button, Input, View, FlatList } from "native-base";
import { StyleSheet, Button as RNButton } from "react-native"
import { set, ref, onValue, query, equalTo, orderByChild} from "firebase/database";
import { db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';


function onDetailsButtonPressed() {
  console.log("checked in");
}

function getTimeDiff(lastActTime) {
    console.log(lastActTime)
    console.log(new Date(lastActTime));
    const currTime = new Date();
    const hourDiff = (currTime.getTime() - lastActTime) / (1000 * 60 * 60);
    if (hourDiff <= 24) {
        return Math.round(hourDiff) + " hours ago";
    } else {
        return Math.round(hourDiff / 24) + " days ago";
    }
}

function handleReadData(user) {
    readData(user).then((val) => {
        return val
    });
    // return ret;
}

export function FriendsListView({ navigation }) {
    const [friendsData, setFriendsData] = useState([]);
    let user = getUserVariable();
    if (!user) {
        return (
          <View style={styles.container}>
            <Text>Can't view since you haven't signed in or created an account</Text>
          </View>
        );
    }
    
    else {
        // TODO: replace with real data
        useEffect(() => {
            readData();
          }, []);

          function readData() {
            console.log("Reading data...")
            const starCountRef = ref(db, `users/${user.uid}/friends`);
            let out = [];
            onValue(starCountRef, (snapshot) => {
              const data = snapshot.val();
              delete data['canAddFriends']
              currentFriends = Object.keys(data)

              currentFriends.map((key, idx) => {
                out.push([key, new Date(data[key]['lastAct'])])
              });
              console.log(out);
              setFriendsData(out);
            });
          }
        // const currTime = new Date();
        if (friendsData.length == 0)
        {
            console.log("here")
            console.log(friendsData)
            // console.log(user)
            return (
            <View style={styles.container}>
                <Text>No friends yet... Go add some!</Text>
                <View style={styles.buttonContainer}>
                    <RNButton
                        color="#FFFFFF"
                        title="View/Add Friends"
                        onPress={() => navigation.navigate('AddFriends')}
                    />
                </View>
            </View>
            )
        }
        console.log("not null")
        console.log(friendsData.length)

        const activityList = friendsData.map((dataEntry) =>
            <HStack key={dataEntry[0]} justifyContent="space-between" alignItems="center" rounded="xl" w="100%" h={60} bg="#333333" p={2}>
                <Text fontSize="md" color="#FFFFFF"> {dataEntry[0]} </Text>
                <Text italic fontSize="md" color="#FFFFFF">{getTimeDiff(dataEntry[1])}</Text>
                <Button bg="#B6E13D" rounded="2xl">
                    <Text fontSize="md" color="#FFFFFF">
                        Details
                    </Text>
                </Button>
            </HStack>);
        console.log(friendsData);

        const renderItem = ({ item }) => {
            console.log("got called");
            return (
                // <View>
                <Text>{item}</Text>
                /* </View> */
            );
            };

        return (
            <View>
            <VStack paddingLeft={5} paddingRight={5} space={5}>
                <Box paddingTop={35} paddingBottom={15}>
                    <Text fontSize="3xl"> Latest Activities</Text>
                </Box>
                {activityList}
                {/* <FlatList data={friendsData} renderItem={renderItem}></FlatList> */}
            </VStack>   
            {/* <View>
                <Text>Friend Feed:</Text>
                <FlatList data={friendsData} renderItem={renderItem}></FlatList>
            </View> */}
            </View>
        )
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
  const buttonStyles = StyleSheet.create({
    container: {
      width: 200,
      height: 50,
      paddingLeft: 10,
      backgroundColor: '#B6E13D',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
  });