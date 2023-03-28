const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const flight = event.flight; // assuming input event has a "flight" key containing the flight record to update
  const flightNumber = flight.flightNumber;
  const departureDate = flight.departureDate;
  const arrivalDate = flight.arrivalDate;
  const status = flight.status; // assuming the flight record has a "status" attribute

  const params = {
    TableName: 'Scheduled_Flights',
    Key: {
      flightNumber: flightNumber,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    },
    UpdateExpression: 'set #status = :s',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':s': status,
    },
  };
  try {
    // update the flight record in the DynamoDB table
    await dynamoDB.update(params).promise();

    // return a success message
    return {
      message: `Flight ${flightNumber} on ${departureDate} - ${arrivalDate} status updated to ${status}`,
    };
  } catch (error) {
    // Probably wouldn't want to send the actual error out of security concerns, but log it instead for internal staff review and send a generic error alert
    return {
      message: `Error updating ${flightNumber} on ${departureDate} - ${arrivalDate} to status "${status}"`,
      error: error || true
    };
  }
  
};
