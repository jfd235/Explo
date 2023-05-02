import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Button, Pressable, Spacer } from "native-base";
import { calGeoDistance } from "../utils";


export default function ScrollBizCard(props) {
  if (props.userLocation == null) return null;
  const {name, location, imgUrl} = props.bizData;
  const {longitude, latitude} = props.userLocation;
  function getDistanceFromUser(longitude, latitude, userLng, userLat) {
    let dis = calGeoDistance(
      { latitude: userLat, longitude: userLng },
      { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
    );
    return dis;
  }

  const distance = getDistanceFromUser(location.longitude, location.latitude, longitude, latitude);

    return (
      <Pressable  onPress={() => {}}>
        {
          ({
            isPressed
          }) => {return (
            <HStack space={2} paddingLeft={2} rounded="xl" alignItems="center" h={85} w={200} bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
              <AspectRatio ratio={1 / 1} height={60}>
                <Image source={{uri : imgUrl}} alt='placeholder image for restaurant' rounded="xl"/>
              </AspectRatio>
            <VStack alignItems="flex-start" maxW={120}>
              <Text isTruncated italic fontSize="md" numberOfLines={1} ellipsizeMode="tail">
                {name}
              </Text>
              <HStack>
                <Image source={require('../assets/icons/marker.png')} alt='location marker' rounded="md" h={5} w={5}/>
                <Text italic fontSize="sm">
                  {(parseFloat(distance) / 1.60934).toFixed(1)+ " miles away"}
                </Text>
              </HStack>
            </VStack>
            
          </HStack>);
          }
        } 
        
      </Pressable>
    );
}