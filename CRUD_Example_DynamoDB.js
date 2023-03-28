const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const action = event.action; // assuming input event has an "action" key containing the action to perform
  const tableName = 'flights'; 
  switch (action) {
    case 'getFlight': {
      const flightNumber = event.flightNumber; // assuming the input event has a "flightNumber" key containing the flight number to retrieve

      const params = {
        TableName: tableName,
        Key: {
          flightNumber: flightNumber,
        },
      };

      // get the flight record from the DynamoDB table
      const result = await dynamoDB.get(params).promise();

      // return the flight record
      return result.Item;
    }

    case 'updateFlightStatus': {
      const flight = event.flight; // assuming the input event has a "flight" key containing the flight record to update
      const flightNumber = flight.flightNumber;
      const departureDate = flight.departureDate;
      const arrivalDate = flight.arrivalDate;
      const status = flight.status; // assuming the flight record has a "status" attribute

      const params = {
        TableName: tableName,
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

      // update the flight record in the DynamoDB table
      await dynamoDB.update(params).promise();

      // return a success message
      return {
        message: `Flight ${flightNumber} on ${departureDate} - ${arrivalDate} status updated to ${status}`,
      };
    }

    case 'createFlight': {
      const flight = event.flight; // assuming the input event has a "flight" key containing the flight record to create

      const params = {
        TableName: tableName,
        Item: flight,
      };

      // put the flight record in the DynamoDB table
      await dynamoDB.put(params).promise();

      // return a success message
      return {
        message: `Flight ${flight.flightNumber} created successfully`,
      };
    }

    case 'deleteFlight': {
      const flightNumber = event.flightNumber; // assuming the input event has a "flightNumber" key containing the flight number to delete

      const params = {
        TableName: tableName,
        Key: {
          flightNumber: flightNumber,
        },
      };

      // delete the flight record from the DynamoDB table
      await dynamoDB.delete(params).promise();

      // return a success message
      return {
        message: `Flight ${flightNumber} deleted successfully`,
      };
    }

    default:
      throw new Error(`Invalid action: ${action}`);
  }
};
