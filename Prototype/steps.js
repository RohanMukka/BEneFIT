const axios = require('axios'); // Import axios for making HTTP requests
require('dotenv').config();     // Load environment variables from .env file

// Paste your access token here (from Playground or your OAuth2 flow)
const accessToken = 'ya29.a0AZYkNZifNXguotswQ4HI97qzEK2rXvHQ9YPnA2ZD1dXoWMIuhBg7T7OBw3vz0jv-mlVnuAoiyD91BQZJZZRxomx7t3W58Sp9Jx6FAUcwPd0kuWIgiTmktduc5FpE5hXFtuiIGTWCVT0zz4k2dGvQzCspZ6PaoQzCKjVcdJ9eaCgYKAeMSARYSFQHGX2MiFtuxf-g-ijaLJcdamel2tQ0175';

// Get current timestamp and today's midnight in milliseconds
const now = Date.now();                  // Current timestamp in ms
const midnight = new Date();            // Create a new Date object
midnight.setHours(0, 0, 0, 0);          // Set time to 00:00:00
const startTimeMillis = midnight.getTime(); // Start time: today at 00:00
const endTimeMillis = now;                  // End time: current moment

// Endpoint URL for Google Fit aggregate data API
const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

// Request payload to aggregate step count data for today
const data = {
  aggregateBy: [{
    dataTypeName: 'com.google.step_count.delta' // Data type for step counts
  }],
  bucketByTime: { durationMillis: 86400000 },   // Aggregate by 1 day (24 hours)
  startTimeMillis,
  endTimeMillis
};

// Send POST request to Google Fit API
axios.post(url, data, {
  headers: {
    'Authorization': `Bearer ${accessToken}`, // OAuth2 access token for authentication
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    const buckets = response.data.bucket; // Get the list of aggregated time buckets
    let totalSteps = 0;

    // Check if there is data in the first bucket and extract step count
    if (buckets && buckets.length > 0) {
      const dataset = buckets[0].dataset[0];
      if (dataset && dataset.point && dataset.point.length > 0) {
        totalSteps = dataset.point[0].value[0].intVal; // Extract step count
      }
    }

    // Print the total steps taken today
    console.log(`Steps taken today: ${totalSteps}`);
  })
  .catch(error => {
    // Log any errors returned by the API
    console.error('Error fetching steps:', error.response ? error.response.data : error.message);
  });