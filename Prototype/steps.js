
const axios = require('axios');
require('dotenv').config();

// Paste your valid OAuth2 access token here
const accessToken = 'ya29.a0AZYkNZjOWxZNbbyKpcZR2PEH0C5HYZqbX5C9jNH525-T0m1f8v_6ZIyqctr8_bwgEwET2i_0R8DXJov3NBzb2jq0lFabb-xlRUxLz_EvpY0WWyzsFjcmHcl8EU25jlM8vYQhpZ_hfsSQzXJh2aEIEcosYqY2NcPeqgACzByGaCgYKARwSARYSFQHGX2MiJZ7zG9YRU5eufqUY2IsVog0175';


// Get today's midnight and current time (LOCAL timezone)
const now = Date.now();
const midnight = new Date();
midnight.setHours(0, 0, 0, 0);  // 12:00 AM local time
const startTimeMillis = midnight.getTime();
const endTimeMillis = now;

const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

const data = {
  aggregateBy: [{
    dataTypeName: 'com.google.step_count.delta'
  }],
  bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
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
    buckets.forEach(bucket => {
      const dataset = bucket.dataset[0];
      if (dataset.point && dataset.point.length > 0) {
        dataset.point.forEach(point => {
          totalSteps += point.value[0].intVal || 0;
        });
      }
    });
  }
  console.log(`Steps taken since midnight: ${totalSteps}`);
})
.catch(error => {
  console.error('Error fetching steps:', error.response ? error.response.data : error.message);
});
