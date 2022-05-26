const axios = require('axios');
const url = "https://ror2api.morgantali.tech/items/passive";

axios.get(url)
    .then(response => {

        const { data } = response;
        console.log(data);

    });

function formatStats(data) {
    let finalArray = [];
    const objectKey = Object.keys(data);
    for (let i = 0; i < objectKey.length; i++) {
        const disassembled = data[objectKey[i]];
        const objectKey2 = Object.keys(disassembled);
        for (let j = 0; j < objectKey2.length; j++) {
            finalArray.push(`${objectKey[i]}: ${disassembled[objectKey2[j]]}`);
        }
    }
    return finalArray;
}