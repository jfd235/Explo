let zipCodeJson = require("./assets/zip_code_full.json");

console.log(zipCodeJson);
features = zipCodeJson.features;

let selectedEntries = [];
features.map((feature) => {
  const zipcode = Number(feature.properties.ZIPCODE);
  if (zipcode >= 10001 && zipcode <= 10282) {
    selectedEntries.push(feature);
  }
});

console.log(selectedEntries.length);
zipCodeJson.features = selectedEntries;
// console.log(zipCodeJson);

const fs = require("fs");

const json = JSON.stringify(zipCodeJson, null, 2);

fs.writeFile("data.json", json, (err) => {
  if (err) throw err;
  console.log("Data saved to file!");
});
