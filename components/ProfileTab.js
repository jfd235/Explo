import * as React from "react";
import { View, useWindowDimensions, Animated, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import {
  VStack,
  HStack,
  Text,
  Center,
  Box,
  Pressable,
  Divider,
  Icon,
  FlatList,
  Image,
  AspectRatio,
} from "native-base";

export default function ProfileTab(props) {
  const layout = useWindowDimensions();

  const { tabIndex } = props;

  const [index, setIndex] = React.useState(tabIndex);
  console.log("tab index", tabIndex);
  console.log("tab index state", index);
  const [routes] = React.useState([
    { key: "first", title: "Progress" },
    { key: "second", title: "Badges" },
  ]);

  const progressList = getProgressList();

  const badgeData = [
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/bronze_medal.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/silver_medal.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/tropy_star.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/trophy_cup.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_1.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_4.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_5.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_6.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_2.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Award_3.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Medal_Blue_2.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Medal_Blue.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Medal_Purple.png")}
          alt="test badge"
        />
      ),
    },
    {
      image: () => (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={require("../assets/icons/Medal_Red.png")}
          alt="test badge"
        />
      ),
    },
  ];

  const BadgeGrid = ({ badgeData }) => {
    const renderItem = ({ item }) => (
      <Box h={100} w={100} p="2">
        {item.image()}
      </Box>
    );

    const ItemSeparator = () => <Box w="2" />;

    return (
      <FlatList
        data={badgeData}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparator={ItemSeparator}
        // contentContainerStyle={styles.contentContainer}
      />
    );
  };

  function getProgressList() {
    // TODO: replace with real data
    let userProgress = [
      { location: "Midtown East", progress: 0.76 },
      { location: "Flatiron", progress: 0.72 },
      { location: "Hell's Kitchen", progress: 0.7 },
    ];
    const width = Dimensions.get("window").width * 0.8;

    return (
      <VStack
        space={3}
        justifyContent="flex-start"
        alignItems="center"
        w="100%"
      >
        {userProgress.map((dataEntry) => (
          <HStack
            key={dataEntry.location}
            justifyContent="space-between"
            w="100%"
          >
            <Text italic fontSize="md">
              {dataEntry.location}
            </Text>
            <Text fontSize="md" color="#32A93E">
              {dataEntry.progress * 100 + "%"}
            </Text>
          </HStack>
        ))}
      </VStack>
    );
  }

  const ProgressRoute = () => (
    <VStack flex={1} my="4" style={{ flex: 1 }}>
      {progressList}
    </VStack>
  );

  const TrophyRoute = () => (
    <VStack flex={1} my="4">
      <BadgeGrid badgeData={badgeData} />
      {/* <Image source={badgeUrls[0].url} h={50} w={50} />; */}
    </VStack>
  );

  const renderScene = SceneMap({
    first: ProgressRoute,
    second: TrophyRoute,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((_, i) => i);
    return (
      <Box flexDirection="row" w={300}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const borderColor = index === i ? "#B6E13D" : "gray.400";
          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              cursor="pointer"
            >
              <Pressable
                onPress={() => {
                  setIndex(i);
                }}
              >
                <Text fontSize="lg">{route.title}</Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
