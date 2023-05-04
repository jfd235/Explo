import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button, Input, View, FlatList } from "native-base";
import { StyleSheet, Button as RNButton, Alert } from "react-native"
import { set, ref, onValue, query, equalTo, orderByChild} from "firebase/database";
import { db } from "../firebaseConfig";
import { getUserVariable } from '../UserContext';
import { getTimeDiff } from '../utils';


function onDetailsButtonPressed() {
  console.log("checked in");
}

function handleReadData(user) {
    readData(user).then((val) => {
        return val
    });
    // return ret;
}

export function Places({ navigation }) {
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [arr, setArr] = useState([]);

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
        
        const deleteItem = async (id) => {
            Alert.alert('Delete Item', 'Are you sure you want to remove this location?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Yes', onPress: () => {
                    console.log('OK Pressed')
                    console.log("deleting", id)
                    set(ref(db, `users/${user.uid}/locations/${id}`),
                    null
                    ).then(() => {
                        // Data saved successfully!
                        console.log("data updated!")
                        alert('data updated!');
                        readData();
                    })  
                    .catch((error) => {
                        // The write failed...
                        alert(error);
                    });
                }},
              ]);
        }

        const getLocations = async () => {
            console.log("getLocations")
            const starCountRef = ref(db, `users/${user.uid}/locations`);
            let out = [];
            onValue(starCountRef, (snapshot) => {
                const data = snapshot?.val();
                if(data) {
                    const keys = Object.keys(data)
                    keys.map((key, index) => {
                        out.push(key)
                    });
                }
            });
            console.log("getLocations", out)
            return out;
        }

        const test = async (id) => {
            return await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`);
        }

        const getData = async (ids) => {
            console.log("getData")
            let out = []
            for (const id of ids) {
                console.log(id);
                
                const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`);
                const responseJson = await response.json();
                console.log("res", responseJson)
                // const result = responseJson.result;
                const photo = responseJson.result?.photos?.[0];
                const result = {
                    ...responseJson.result,
                    photoUrl: photo
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
                    : undefined,
                    reviews: responseJson.result.reviews,
                    formatted_phone_number: responseJson.result.formatted_phone_number,
                    website: responseJson.result.website,
                    price_level: responseJson.result.price_level,
                    rating: responseJson.result.rating,
                };
                // console.log("result", data[key].lastAct)
                const restaurantData = {
                    id: result.place_id,
                    name: result.name,
                    location: {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                    },
                    address: result.vicinity,
                    imgUrl: result.photoUrl,
                    reviews: result.reviews,
                    phoneNumber: result.formatted_phone_number,
                    website: result.website,
                    priceLevel: result.price_level,
                    rating: result.rating,
                    locality: result.icon,
                    userName: user.name,
                    // lastAct: new Date(data[key].lastAct),
                };
                console.log("result location", restaurantData.lastAct)
                out.push(restaurantData);
                // console.log("push", restaurantData.name)
                // out.push(result);
                // setArr([...arr, await res]);
            }
            // const ret = await Promise.all(out)
            console.log("getData", out)
            return out;
        }

        const readData = async () => {
            console.log("Reading data...")
            const locationIDs = await getLocations();
            console.log("locationIDs", locationIDs)
            if(locationIDs.length > 0) {
                console.log("ids", locationIDs.length)
                const data = await getData(locationIDs);
                console.log("got data", data)
                
                setLocationData(data);
                setLoading(false);
                console.log("done", locationData);
            }
            else {
                setLocationData(null)
            }
        }
            
        // const readData = async () => {
        //     console.log("Reading data...")
        //     const starCountRef = ref(db, `users/${user.uid}/locations`);
        //     let out = [];
        //     onValue(starCountRef, (snapshot) => {
        //         const data = snapshot.val();
        //         // delete data['canAddFriends']
        //         if (data) {
        //             currentLocations = Object.keys(data)
        //             console.log(currentLocations)
    
        //             console.log("Retrieve friends...")
        //             for (const key of currentLocations) {
        //                 console.log("here")
        //                 console.log(data)
        //                 // let tempRef = ref(db, `users/${key}`);
                        
        //                 // onValue(tempRef, (snapshotFriend) => {
        //                 //     const friend = snapshotFriend.val();
        //                 //     if(friend) {
        //                 //         // console.log(friend)
        //                 //         console.log([friend['name'], new Date(friend['lastAct'])])
        //                 //         out.push([friend['name'], new Date(friend['lastAct'])])
        //                 //     }
        //                 // });
        //                 fetch(
        //                 `https://maps.googleapis.com/maps/api/place/details/json?place_id=${key}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
        //                 ).then((response) => response.json())
        //                 .then((responseJson) => {
        //                 const photo = responseJson.result?.photos?.[0];
        //                 const result = {
        //                     ...responseJson.result,
        //                     photoUrl: photo
        //                     ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs`
        //                     : undefined,
        //                     reviews: responseJson.result.reviews,
        //                     formatted_phone_number: responseJson.result.formatted_phone_number,
        //                     website: responseJson.result.website,
        //                     price_level: responseJson.result.price_level,
        //                     rating: responseJson.result.rating,
        //                 };
        //                 console.log("result", data[key].lastAct)
        //                 const restaurantData = {
        //                     id: result.place_id,
        //                     name: result.name,
        //                     location: {
        //                     latitude: result.geometry.location.lat,
        //                     longitude: result.geometry.location.lng,
        //                     },
        //                     address: result.vicinity,
        //                     imgUrl: result.photoUrl,
        //                     reviews: result.reviews,
        //                     phoneNumber: result.formatted_phone_number,
        //                     website: result.website,
        //                     priceLevel: result.price_level,
        //                     rating: result.rating,
        //                     userName: user.name,
        //                     lastAct: new Date(data[key].lastAct),
        //                 };
        //                 console.log("result location", restaurantData.lastAct)
        //                 out.push(restaurantData);
        //                 console.log("push", restaurantData.name)
        //                 // return out;
        //                 });
        //             };
        //         } 
        //     });
        //     setLocationData(out);
        //     console.log("done", locationData);
        //     setLoading(false);
        // };

        // const currTime = new Date();
        if (!locationData || locationData.length == 0)
        {
            return (
            <View style={styles.container}>
                <Text>No locations yet... Get out there!</Text>
                <View style={styles.buttonContainer}>
                    <RNButton
                        color="#FFFFFF"
                        title="Explore!"
                        onPress={() => navigation.navigate('Map')}
                    />
                </View>
            </View>
            )
        }
        console.log("not null")
        console.log("lastAct", locationData)

        const activityList = locationData.map((bizData) =>
            // console.log("bizData", bizData.id)
            <HStack key={bizData.id} justifyContent="space-between" alignItems="center" rounded="xl" w="100%" h={60} bg="#333333" p={2}>
                <Text fontSize="md" color="#FFFFFF"> {bizData.name} </Text>
                <View flexDirection="row-reverse" hieght={60} width={40} gap={2}>
                <Button bg="#FF6969" rounded="2xl" onPress={() => deleteItem(bizData.id)}>
                    <Text fontSize="md" color="#FFFFFF">
                        X
                    </Text>
                </Button>
                <Button bg="#B6E13D" rounded="2xl" onPress={() => navigation.navigate('Detail', {bizData})}>
                    <Text fontSize="md" color="#FFFFFF">
                        Details
                    </Text>
                </Button>
                </View>
            </HStack>);
        // console.log("test", locationData[0]);

        const renderItem = ({ item }) => {
            console.log("got called", locationData.length);
            return (
                // <View>
                <Text>{item.name}</Text>
                /* </View> */
            );
            };
        
        if(loading || locationData == null) {
            console.log("Loading...")
            return (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        return (
            <View>
            <VStack paddingLeft={5} paddingRight={5} space={5}>
                <Box paddingTop={35} paddingBottom={15}>
                    <Text fontSize="3xl"> My Places</Text>
                </Box>
                {activityList}
                {/* <FlatList data={locationData} rendxerItem={activityList}></FlatList> */}
            </VStack>   
            {/* <View style={[flex=1, height=100]}>
                <Text>Friend Feed:</Text>
                <FlatList data={locationData} renderItem={renderItem}></FlatList>
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