import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button, Input } from "native-base";


function onSubmitButtonPressed() {
  console.log("checked in");
}

export function CheckIn() {

    // TODO: replace with real data
    const bizName = "Pizza Royal";
    const checkInText_1 = "Check in NOW!";
    const checkInText_2 = "Share your experience / upload a pic!";


    return (
        <VStack space={6} justifyContent="center" paddingTop={5} maxW="100%">
          <Center>
            <AspectRatio ratio={2 / 1} height={160}>
              <Image source={{uri : "https://wallpaperaccess.com/full/317501.jpg"}} alt='placeholder image for restaurant' rounded="xl"/>
            </AspectRatio>
          </Center>
          <VStack space={5} paddingLeft={9} paddingRight={9} justifyContent="flex-start">
            <Text italic fontSize='md'>
                {checkInText_1}
            </Text>
            <Text bold fontSize='3xl'>
                {bizName}
            </Text>
            <Input size="xl" placeholder={checkInText_2} />
            <Center borderWidth={3}  height={160} rounded="xl" bg={"#F4F4F4"}>
                <Image source={require('../assets/icons/upload.png')} alt="upload image" style={{height: 150, width: 150}}/>
            </Center>

            <Button height={50} rounded="xl" onPress={onSubmitButtonPressed} bg={"#B6E13D"}>
                <Text fontSize='xl'>
                    Submit
                </Text>
            </Button>
          </VStack>
        </VStack>
    );
  }