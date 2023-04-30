import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button, Input } from "native-base";


function onDetailsButtonPressed() {
  console.log("checked in");
}

function getTimeDiff(lastActTime) {
    const currTime = new Date();
    const hourDiff = (currTime.getTime() - lastActTime) / (1000 * 60 * 60);
    if (hourDiff <= 24) {
        return Math.round(hourDiff) + " hours ago";
    } else {
        return Math.round(hourDiff / 24) + " days ago";
    }
}

export function FriendsListView() {
    // TODO: replace with real data
    const currTime = new Date();

    const friendsData = [
        {name: "Haohua", lastAct: currTime.getTime() - (4 * 60 * 60 * 1000)},
        {name: "Jenny", lastAct: currTime.getTime() - (2 * 60 * 60 * 1000 * 24)},
        {name: "Ken", lastAct: currTime.getTime() - (6 * 60 * 60 * 1000 * 24)},
        {name: "Gordon", lastAct: currTime.getTime() - (3 * 60 * 60 * 1000 * 24)},
    ]

    const activityList = friendsData.map((dataEntry) =>
        <HStack key={dataEntry.name} justifyContent="space-between" alignItems="center" rounded="xl" w="100%" h={60} bg="#333333" p={2}>
            <Text fontSize="md" color="#FFFFFF"> {dataEntry.name} </Text>
            <Text italic fontSize="md" color="#FFFFFF">{getTimeDiff(dataEntry.lastAct)}</Text>
            <Button bg="#B6E13D" rounded="2xl">
                <Text fontSize="md" color="#FFFFFF">
                    Details
                </Text>
            </Button>
        </HStack>);
    console.log(friendsData);

    return (
        <VStack paddingLeft={5} paddingRight={5} space={5}>
            <Box paddingTop={35} paddingBottom={15}>
                <Text fontSize="3xl"> Latest Activities</Text>
            </Box>
            {activityList}
        </VStack>   
    )
    

}