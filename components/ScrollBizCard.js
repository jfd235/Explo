import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Button, Pressable, Spacer } from "native-base";

export default function ScrollBizCard(bizData) {
  const {name, distance, img_uri} = bizData.data;
    return (
      <Pressable  onPress={() => {}}>
        {
          ({
            isPressed
          }) => {return (
            <HStack space={2} paddingLeft={2} rounded="xl" alignItems="center" h={85} w={200} bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
              <AspectRatio ratio={1 / 1} height={60}>
                <Image source={{uri : img_uri}} alt='placeholder image for restaurant' rounded="xl"/>
              </AspectRatio>
            <VStack alignItems="flex-start">
              <Text italic fontSize="lg" numberOfLines={1} ellipsizeMode="tail">
                {name}
              </Text>
              <HStack>
                <Image source={require('../assets/icons/marker.png')} alt='location marker' rounded="md" h={5} w={5}/>
                <Text italic fontSize="sm">
                  {(distance / 1.60934).toFixed(1)+ " miles away"}
                </Text>
              </HStack>
            </VStack>
            
          </HStack>);
          }
        } 
        
      </Pressable>
    );
}