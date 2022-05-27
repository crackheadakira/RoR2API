const axios = require("axios");
const url = "https://ror2api.morgantali.tech/items/passive/all";

axios.get(url).then((response) => {
  const { data } = response;
  for (item of data) {
    let { stats } = item;
    let collapsedStats = formatStats(stats);
    console.log(collapsedStats);
  }
});

function formatStats(data) {
  let finalArray = [];
  const objectKey = Object.keys(data);
  for (let i = 0; i < objectKey.length; i++) {
    const disassembled = data[objectKey[i]];
    const objectKey2 = Object.keys(disassembled);
    for (let j = 0; j < objectKey2.length; j++) {
      if (typeof disassembled === "string") {
        finalArray.push(`${objectKey[i]}: ${disassembled}`);
        break;
      }
      finalArray.push(`${objectKey[i]}: ${disassembled[objectKey2[j]]}`);
    }
  }
  return finalArray;
}
