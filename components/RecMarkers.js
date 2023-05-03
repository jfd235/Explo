import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef, componentDidMount, useCallback } from "react";
import { Text } from "native-base";
import ScrollBizCard from "./ScrollBizCard";

export function RecMarkers(props) {
    
    if (props.restaurants == null) return null;
    return props.restaurants.map((rest, index) => (
      <Marker
        key={rest.id}
        coordinate={{
          latitude: rest.location.latitude,
          longitude: rest.location.longitude,
        }}
        onPress={(e) => {
            console.log("pressed: ", rest);
        }}
      > 
        <Callout title={rest.name}
            description={rest.address}>
                <ScrollBizCard bizData={rest} userLocation={props.userLocation}/>
        </Callout>
      </Marker>
    ));
  };