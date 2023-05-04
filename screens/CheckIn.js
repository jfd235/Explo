import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Center,
  theme,
  Image,
  Heading,
  AspectRatio,
  HStack,
  Pressable,
  Button,
  Input,
} from "native-base";
import { db } from "../firebaseConfig";
import { ref, push, set, onValue } from 'firebase/database'
import { getUserVariable } from '../UserContext';

const onSubmitButtonPressed = (navigation, user, bizData) => {
  const currTime = new Date();
  const convert = new Date(currTime.getTime()).toString();
  console.log(convert)
  set(ref(db, `users/${user.uid}/locations/${bizData.id}/lastAct`),
        convert
    ).then(() => {
      // Data saved successfully!
      console.log("data updated!", bizData.id)
      // alert('data updated!');
      alert("You've checked in!");
      navigation.popToTop();
    })  
    .catch((error) => {
      // The write failed...
      alert(error);
  });
};

export function CheckIn({ navigation, route }) {
  let user = getUserVariable();
  if (!user) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>Can't view since you haven't signed in or created an account</Text>
      </View>
    );
  }
  // TODO: replace with real data
  const bizData =
    route.params != undefined
      ? route.params.bizData
      : {
          address: "422 Geary Street, San Francisco",
          id: "ChIJZ3qrUY6AhYARCmurUXI6SNA",
          imgUrl:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AZose0kuHeTua3KQIYDjWfMdQgI0hnWf-BAbFKa2mH7V9smCAWeeOZtM-uCMAvOyFbMeWfxDrMv3Xm6F7Q1q_zz9VbttVe2w6mBPzx-uhiNhUMDY8b5Nt5U35MotG2bL_U89RgPa9NT5NUInuGZNrcZRg2YYghJdXK8xuoSqWEoLrCAWO3U2&key=AIzaSyCXSbWuRHfBBAW26WZ_Abhvq7l5QLPMjvs",
          location: { latitude: 37.7872028, longitude: -122.4104472 },
          name: "Katana Ya",
          reviews: [
            {
              username: "John Doe",
              rating: 5,
              text: "Best place I have ever been!",
            },
            {
              username: "John Doe",
              rating: 5,
              text: "Best place I have ever been!",
            },
            {
              username: "John Doe",
              rating: 5,
              text: "Best place I have ever been!",
            },
          ],
          phoneNumber: 1234567890,
          website: "www.google.com",
          priceLevel: 1,
          rating: 4,
        };

  const checkInText_1 = "Check in NOW!";
  const checkInText_2 = "Share your experience / upload a pic!";

  return (
    <VStack space={6} justifyContent="center" paddingTop={5} maxW="100%">
      <Center>
        <AspectRatio ratio={2 / 1} height={160}>
          <Image
            source={{ uri: bizData.imgUrl }}
            alt="placeholder image for restaurant"
            rounded="xl"
          />
        </AspectRatio>
      </Center>
      <VStack
        space={5}
        paddingLeft={9}
        paddingRight={9}
        justifyContent="flex-start"
      >
        <Text italic fontSize="md">
          {checkInText_1}
        </Text>
        <Text bold fontSize="3xl">
          {bizData.name}
        </Text>
        <Input size="xl" placeholder={checkInText_2} />
        <Center borderWidth={3} height={160} rounded="xl" bg={"#F4F4F4"}>
          <Image
            source={require("../assets/icons/upload.png")}
            alt="upload image"
            style={{ height: 150, width: 150 }}
          />
        </Center>

        <Button
          height={50}
          rounded="xl"
          onPress={() => {
            onSubmitButtonPressed(navigation, user,route.params.bizData);
          }}
          bg={"#B6E13D"}
        >
          <Text fontSize="xl">Submit</Text>
        </Button>
      </VStack>
    </VStack>
  );
}