exports.handler = async (event) => {
    const flights = event.flights; // assuming input event has a "flights" key containing array of flight information
    const users = event.users; // assuming input event has a "users" key containing array of user information
  
    // sort the flights by departure time in ascending order
    flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
  
    // create an object to map user IDs to their corresponding information
    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = user;
    });
  
    // loop through the flights and add the corresponding user information to each flight
    flights.forEach((flight) => {
      const user = userMap[flight.userId];
      flight.user = user;
    });
  
    // return the sorted flights with user information
    return flights;
  };
  