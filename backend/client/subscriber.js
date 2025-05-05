import mqtt from 'mqtt';
var options = {
  host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
  port: 8883,
  topic: 'iot/PlantCare',
  protocol: 'mqtts',
  username: 'wildan12',
  password: '12NoV2004@'
};

var client = mqtt.connect(options);
let latestMessage = {};

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  client.subscribe(options.topic, function (err) {
      if (!err) {
          console.log('Subscribed to topic: ' + options.topic);
      } else {
          console.error('Failed to subscribe to topic:', err);
      }
  });
});

client.on('message', function (topic, message) {
  console.log(`Raw message received:`, message.toString());
  try {
      latestMessage = JSON.parse(message.toString());
      console.log(`Received message from "${topic}":`, latestMessage);
  } catch (error) {
      console.error('Invalid JSON format:', message.toString());
  }
});

// app.get('/api/mqtt-data', (req, res) => {
//   res.json({
//       status: 200,
//       topic: options.topic,
//       data: latestMessage || { error: 'No data received yet' },
//   });
// });

export const getMqttData = (req, res) => {
    res.json({
      status: 200,
      topic: options.topic,
      data: latestMessage || { error: "No data received yet" },
    });
  };