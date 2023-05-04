import MapView, { Callout, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import React, {
  useState,
  useEffect,
  useRef,
  componentDidMount,
  useCallback,
} from "react";
import { Image, Button, VStack, Pressable, Text } from "native-base";

export function RewardsOverlay(props) {
  const { badge, onBadgePressed, onGotoCollectionsPressed } = props;
  return (
    <VStack justifyContent="flex-start" alignItems="center" space={10}>
      <Pressable onPress={onBadgePressed} height={300}>
        <Image
          source={require("../assets/icons/trophy_cup.png")}
          alt={"the earned trophy"}
        />
      </Pressable>
      <VStack w="100%" alignItems="center">
        <Button
          colorScheme="success"
          w={180}
          h={50}
          onPress={onGotoCollectionsPressed}
        >
          <Text bold fontSize="lg">
            Go to collections!
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
}
