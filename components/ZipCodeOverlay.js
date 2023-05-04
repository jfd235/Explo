import MapView, { Callout, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import React, {
  useState,
  useEffect,
  useRef,
  componentDidMount,
  useCallback,
} from "react";

function generateColor(number) {
  // Convert the number to a string
  const str = String(number);

  // Use the djb2 hash algorithm to generate a hash value
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  // Convert the hash value to an RGB color
  const red = (hash >> 16) & 0xff;
  const green = (hash >> 8) & 0xff;
  const blue = hash & 0xff;
  const color = `rgb(${red}, ${green}, ${blue})`;
  return color;
}

export function ZipCodeOverlay(props) {
  const { geometry } = props;
  console.log("rendering overlay");
  console.log(geometry.length);
  if (geometry == null) return null;
  return geometry.map((entry, index) => {
    return (
      <Polygon
        key={index}
        coordinates={entry.coordinates}
        fillColor={generateColor(Math.random() * 100000)}
        strokeWidth={1}
      />
    );
  });
}
