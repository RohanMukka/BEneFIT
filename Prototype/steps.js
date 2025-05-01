const axios = require('axios');
require('dotenv').config();

// Paste your access token here (from Playground or your OAuth2 flow)
const accessToken = 'ya29.a0AZYkNZifNXguotswQ4HI97qzEK2rXvHQ9YPnA2ZD1dXoWMIuhBg7T7OBw3vz0jv-mlVnuAoiyD91BQZJZZRxomx7t3W58Sp9Jx6FAUcwPd0kuWIgiTmktduc5FpE5hXFtuiIGTWCVT0zz4k2dGvQzCspZ6PaoQzCKjVcdJ9eaCgYKAeMSARYSFQHGX2MiFtuxf-g-ijaLJcdamel2tQ0175';
// Get midnight today and current time in milliseconds
const now = Date.now();
const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
const startTimeMillis = midnight.getTime();
const endTimeMillis = now;

const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

const data = {
  aggregateBy: [{
    dataTypeName: 'com.google.step_count.delta'
  }],
  bucketByTime: { durationMillis: 86400000 },
  startTimeMillis,
  endTimeMillis
};

axios.post(url, data, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    const buckets = response.data.bucket;
    let totalSteps = 0;
    if (buckets && buckets.length > 0) {
      const dataset = buckets[0].dataset[0];
      if (dataset && dataset.point && dataset.point.length > 0) {
        totalSteps = dataset.point[0].value[0].intVal;
      }
    }
    console.log(`Steps taken today: ${totalSteps}`);
  })
  .catch(error => {
    console.error('Error fetching steps:', error.response ? error.response.data : error.message);
  });
