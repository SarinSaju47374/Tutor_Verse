export function monthGrouping(data){
    const outputData = [];

    for (const year in data) {
      for (const month in data[year]) {
        const monthName = new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'long' });
        outputData.push({
          "name": `${monthName}, ${year}`,
          "pv": data[year][month]
        });
      }
    }
    return  outputData
}

export function yearGrouping(data){
    const outputData = [];

    for (const year in data) {
      outputData.push({ "name": parseInt(year), "pv": data[year] });
    }
    return outputData
}

export const testData= [
  {
    "createdAt": "2023-10-01T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-11-02T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-12-03T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2022-01-04T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-01-05T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-02-06T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-03-07T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2024-03-08T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-03-09T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-04-10T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2024-05-11T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2023-01-12T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-03-13T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-05-14T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-08-15T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2023-09-16T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-09-17T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-09-18T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-09-19T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2023-09-20T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-05-21T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-05-22T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-02-23T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2023-03-24T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-05-25T04:31:47.986Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-07-26T04:33:03.269Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
  {
    "createdAt": "2023-05-27T04:35:00.063Z",
    "courseName": "CLASS 1 ENGLISH",
    "price": 4000,
    "courseDuration": 2
  },
  {
    "createdAt": "2023-07-28T16:45:19.347Z",
    "courseName": "CLASS 4 EVS",
    "price": 6000,
    "courseDuration": 3
  },
]