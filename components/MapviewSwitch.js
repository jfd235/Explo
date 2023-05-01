import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Button, Pressable, Spacer } from "native-base";


// TODO: figure out why updating state won't re-render
export default function MapviewSwitch() {
    const [showFriends, setShowFriends] = useState(false);
    const [showRecs, setShowRecs] = useState(false);
    console.log(showRecs + " " + showFriends);
    return (
    <HStack >
      <Pressable onPressOut={()=> {setShowFriends(!showFriends)}}>
        {({
        isPressed
      }) => {
        return <Box bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
        {
            showFriends ? 
            <Image source={require("../assets/icons/show_friends_on.png")} alt="show_friends_on" w={30} h={30}/>
            :
            <Image source={require("../assets/icons/show_friends_off.png")} alt="show_friends_off" w={30} h={30}/>
        }
        </Box>
      }}
      </Pressable>
      <Spacer/>
      <Pressable onPressOut={()=> {setShowRecs(!showRecs)}} bg="#FFFFFF">
        {({
        isPressed
      }) => {
        return <Box rounded="xl" bg={isPressed ? "coolGray.200" : "#FFFFFF"}>
        {
            showRecs ? 
            <Image source={require("../assets/icons/show_recs_on.png")} alt="show_recs_on" w={30} h={30}/>
            :
            <Image source={require("../assets/icons/show_recs_off.png")} alt="show_recs_off" w={30} h={30}/>
        }
        </Box>
      }}
      </Pressable>
    </HStack>);
}