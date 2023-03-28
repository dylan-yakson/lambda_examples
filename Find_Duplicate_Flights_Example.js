const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const tableName = 'Scheduled_Flights'

  const params = {
    TableName: tableName,
    ProjectionExpression: 'flightNumber, departureDate, arrivalDate', // assuming these are the key attributes of a flight record
  };

  // query the DynamoDB table and get all flight records
  const result = await dynamoDB.scan(params).promise();

  const flights = result.Items; // assuming the flight records are stored in the "Items" property of the result object

  // create a map of flight numbers to their corresponding records
  const flightMap = {};
  flights.forEach((flight) => {
    const flightNumber = flight.flightNumber;
    const key = `${flightNumber}-${flight.departureDate}-${flight.arrivalDate}`;
    if (key in flightMap) {
      flightMap[key].duplicates.push(flight);
    } else {
      flightMap[key] = {
        flight: flight,
        duplicates: [],
      };
    }
  });

  // get all flights that have duplicates
  const duplicates = Object.values(flightMap).filter(
    (item) => item.duplicates.length > 0
  );

  // return the potential duplicates
  return duplicates;
};
