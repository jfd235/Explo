import React, { useState, useEffect } from "react";
import {
  Text,
  Card,
  CardItem,
  Spinner,
} from "native-base";
import { StyleSheet, Linking, ScrollView } from "react-native";
import { Grid, Col } from "react-native-easy-grid";
import Entypo from "react-native-vector-icons/Entypo";
import { SliderBox } from "react-native-image-slider-box";
import { SafeAreaView } from "react-native-safe-area-context";
import BusinessResource from "../resources/Business.resource";

const RestaurantDetailComponent = props => {
  const [width, setWidth] = useState(300);
  const restaurant = props.route.params.restaurant;
  const [restaurantDetails, setRestaurantDetails] = useState(undefined);
  const businessResourse = new BusinessResource();

  const loadRestaurantDetails = async () => {
    try {
      const restaurantDetails = await businessResourse.getRestaurantDetails(
        restaurant.id
      );
      setRestaurantDetails(restaurantDetails);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    loadRestaurantDetails();
  }, []);

  const onLayout = e => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {restaurantDetails == undefined ? (
        <Grid style={{ alignItems: "center" }}>
          <Col>
            <Spinner color="blue" />
          </Col>
        </Grid>
      ) : (
          <ScrollView>
            <Card style={{ borderRadius: 10 }}>
              <CardItem header style={{ borderRadius: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, color: "#0083ff" }}>{restaurantDetails.name}</Text>
              </CardItem>
              <CardItem cardBody onLayout={onLayout}>
                <SliderBox parentWidth={width} images={restaurantDetails.photos} sliderBoxHeight={400} autoplay={true} />
              </CardItem>
              <CardItem>
                <Text style={{ fontWeight: "bold" }}>Cuisine: </Text>
                {restaurantDetails.categories.map(category => (
                  <Entypo key={category.alias} name="dot-single">
                    <Text>{category.title}</Text>
                  </Entypo>
                ))}
              </CardItem>
              <CardItem>
                <Text style={{ fontWeight: "bold" }}>Price: </Text>
                <Text>{restaurantDetails.price != null ? restaurantDetails.price : "Not evaluated"}</Text>
              </CardItem>
              <CardItem>
                <Text style={{ fontWeight: "bold" }}>Phone: </Text>
                <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(`tel:${restaurantDetails.display_phone}`)}>{restaurantDetails.display_phone}</Text>
              </CardItem>
              <CardItem style={{ borderRadius: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Address: </Text>
                <Text>{restaurantDetails.location.address1}</Text>
              </CardItem>
            </Card>
          </ScrollView>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "rgb(240, 240, 240)",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: -45
  },
});


export default RestaurantDetailComponent;
