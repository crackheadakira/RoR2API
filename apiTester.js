const axios = require('axios');
const url = "https://ror2api.morgantali.tech/items/passive/common/39";

axios.get(url)
    .then(response => {

        let { stats } = response.data;
        console.log(formatStats(stats));

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