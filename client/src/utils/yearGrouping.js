export default function yearGrouping(data){
    const outputData = [];

    for (const year in data) {
      outputData.push({ "name": parseInt(year), "pv": data[year] });
    }
    return outputData
}