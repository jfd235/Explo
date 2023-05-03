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
  ScrollView,
} from "native-base";
import StarRating from "react-native-star-rating-widget";
import ReviewCard from "../components/ReviewCard";
import { Linking } from "react-native";

function onCheckinButtonPressed(navigation, bizData) {
  console.log("checked in");
  navigation.navigate("CheckIn", { bizData });
}

const onCallButtonPressed = (phoneNumber) => {
  console.log("call the biz");
  Linking.openURL(`tel:${phoneNumber}`);
};

const onWebButtonPressed = (website) => {
  try {
    Linking.openURL(`${website}`);
  } catch (err) {
    console.error(err);
  }
};

// TODO: remove background highlighting

export function BizDetail({ navigation, route }) {
  console.log("details props:", route.params);
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

  const dollarSignComponents = (priceLevel) =>
    Array.from({ length: priceLevel }, (_, index) => (
      <Text key={index}>$</Text>
    ));

  const {
    name,
    address,
    imgUrl,
    reviews,
    priceLevel,
    phoneNumber,
    website,
    rating,
  } = bizData;

  return (
    <VStack space={6} justifyContent="center" paddingTop={5}>
      <Center>
        <AspectRatio ratio={2 / 1} height={170}>
          <Image
            source={{ uri: imgUrl }}
            alt="placeholder image for restaurant"
            rounded="xl"
          />
        </AspectRatio>
      </Center>
      <VStack
        paddingLeft="6"
        paddingRight="6"
        paddingTop="3"
        space={3}
        alignItems="flex-start"
      >
        <Heading> {name} </Heading>
        <HStack justifyContent="flex-start" width="100%">
          <StarRating
            maxStars={5}
            rating={rating}
            starSize={16}
            selectedStar={(rating) => {}}
          />
        </HStack>
        <HStack paddingLeft={28} space="0">
          {dollarSignComponents(priceLevel)}
        </HStack>
        <Text>{address}</Text>
        <HStack
          // bg={theme.colors.tertiary[500]}
          paddingLeft={28}
          paddingRight={28}
          width="100%"
          justifyContent="space-around"
        >
          <Pressable
            onPress={() => {
              onCheckinButtonPressed(navigation, bizData);
            }}
          >
            <VStack alignItems="center">
              <Image
                source={require("../assets/icons/shop.png")}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="check in to the biz"
              />
              <Text italic fontSize="sm" color="#333333">
                Check-in
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              onCallButtonPressed(phoneNumber);
            }}
          >
            <VStack alignItems="center">
              <Image
                source={require("../assets/icons/call.png")}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="call the biz"
              />
              <Text italic fontSize="sm" color="#333333">
                Call
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              onWebButtonPressed(website);
            }}
          >
            <VStack alignItems="center">
              <Image
                source={require("../assets/icons/web.png")}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="go to the biz website"
              />
              <Text italic fontSize="sm" color="#333333">
                Website
              </Text>
            </VStack>
          </Pressable>
        </HStack>

        <HStack
          bg={theme.colors.tertiary[500]}
          paddingLeft={28}
          paddingRight={28}
          width="100%"
          justifyContent="flex-start"
        >
          <Text fontSize="xl">Reviews</Text>
        </HStack>

        <VStack bg={theme.colors.tertiary[400]} p={5} width="100%" height="40%">
          <ScrollView showsVerticalScrollIndicator={false}>
            {reviews &&
              reviews.map((reviewData) => <ReviewCard data={reviewData} key={reviewData.time} />)}
          </ScrollView>
        </VStack>
      </VStack>
    </VStack>
  );
}