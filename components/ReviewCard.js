import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, VStack, Center, theme, Image, Heading, AspectRatio, HStack, Pressable, Button } from "native-base";
import StarRating from 'react-native-star-rating-widget';


export default function ReviewCard(data) {
    const {username, rating, text} = data.data;
    
    return (
        <Flex flexDirection="column" alignItems="flex-start">
            <Text>
                {username}
            </Text>
            <StarRating
                maxStars={5}
                rating={rating}
                starSize={12}
                selectedStar={(rating) => {}}
              />
            <Text>
                {text}
            </Text>
        </Flex>


    )

}