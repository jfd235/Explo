import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button } from "native-base";
import StarRating from 'react-native-star-rating-widget';
import ReviewCard from '../components/ReviewCard';

function onCheckinButtonPressed() {
  console.log("checked in");
}


function onCallButtonPressed() {
  console.log("call the biz");
}

function onWebButtonPressed() {
  console.log("go to the biz website");
}

function linkToReviewPage() {
  console.log("go to the biz website");
}

// TODO: remove background highlighting

export function BizDetail() {

    const dollarSignComponents = Array.from({ length: 3 }, (_, index) => (
      <Text key={index}>$</Text>
    ));

    // TODO: replace with real data
    const bizName = "Pizza Royal";
    const addr = "1 E Loop Rd, New York, NY, 10044";
    const reviewData = {
      username: "John Doe",
      rating: 5,
      text: "Best place I have ever been!"
    };


    return (
        <VStack space={6} justifyContent="center" paddingTop={5}>
          <Center>
            <AspectRatio ratio={2 / 1} height={160}>
              <Image source={{uri : "https://wallpaperaccess.com/full/317501.jpg"}} alt='placeholder image for restaurant' rounded="xl"/>
            </AspectRatio>
          </Center>
          <VStack p="4" space={4} alignItems="flex-start" bg={theme.colors.tertiary[100]} >
            <Heading> Pizza Royal </Heading>
            <HStack justifyContent="space-around" bg={theme.colors.tertiary[300]} width="100%"> 
              <StarRating
                maxStars={5}
                rating={4}
                starSize={16}
                selectedStar={(rating) => {}}
              />
              <Box bg={theme.colors.tertiary[900]}>
                <Text>
                    {bizName}
                </Text>
              </Box>
            </HStack>
            <HStack bg={theme.colors.tertiary[600]} paddingLeft={28} space="0" > 
              {dollarSignComponents}
            </HStack>
            <Text>
              {addr}
            </Text>
            <HStack bg={theme.colors.tertiary[500]} paddingLeft={28} paddingRight={28} width="100%" justifyContent="space-between"> 
            <Pressable onPress={onCheckinButtonPressed}>
              <Image
                source={require('../assets/icons/shop.png')}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="check in to the biz"
              />
            </Pressable>
            <Pressable onPress={onCallButtonPressed}>
              <Image
                source={require('../assets/icons/call.png')}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="call the biz"
              />
            </Pressable>
            <Pressable onPress={onWebButtonPressed}>
              <Image
                source={require('../assets/icons/web.png')}
                fadeDuration={0}
                style={{ width: 50, height: 50 }}
                alt="go to the biz website"
              />
            </Pressable>
            </HStack>

            <HStack bg={theme.colors.tertiary[500]} paddingLeft={28} paddingRight={28} width="100%" justifyContent="space-between"> 
              <Text>Reviews</Text>

              <Button onPress={linkToReviewPage}>
                <Text>Write a review</Text>
              </Button>
            </HStack>

            <VStack bg={theme.colors.tertiary[400]} p={5} width="100%">
              <ReviewCard data={reviewData}/>
            </VStack>
          </VStack>
        </VStack>
    );
  }