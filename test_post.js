const http = require('http');

const data = JSON.stringify({
  fromCity: 'TestCityA',
  toCity: 'TestCityB',
  dateRange: '2026-06-19 to 2026-06-20',
  passengers: 2,
  hotelType: '4',
  foodType: 40
});

const options = {
  hostname: 'localhost',
  port: 6001,
  path: '/api/expenses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Body:', body));
});

req.on('error', (e) => console.error('Request error:', e));
req.write(data);
req.end();
