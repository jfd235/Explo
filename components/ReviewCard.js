import React, { useState, useEffect } from "react";
import {
  Flex,
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
} from "native-base";
import StarRating from "react-native-star-rating-widget";

export default function ReviewCard(data) {
  const { author_name, rating, text } = data.data;
  return (
    <VStack alignItems="flex-start" maxH="100%">
      <Text fontSize="sm">{author_name}</Text>
      <StarRating
        maxStars={5}
        rating={rating}
        starSize={12}
        selectedStar={(rating) => {}}
      />
      <Text italic isTruncated fontSize="sm">
        {text}
      </Text>
    </VStack>
  );
}
