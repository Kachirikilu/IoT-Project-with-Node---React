import mqtt from 'mqtt';

var options = {
    host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'wildan12',
    password: '12NoV2004@'
};

var client = mqtt.connect(options);

client.on('connect', function () {
    console.log('Connected to MQTT broker');

    client.subscribe('iot/PlantCare', function (err) {
        if (!err) {
            console.log('Subscribed to topic: iot/PlantCare');

            client.publish('iot/PlantCare', 'Hello, this is a test message!', function (err) {
                if (!err) {
                    console.log('Message published to topic: iot/PlantCare');
                } else {
                    console.error('Failed to publish message:', err);
                }
            });
        } else {
            console.error('Failed to subscribe to topic:', err);
        }
    });
});

client.on('error', function (error) {
    console.error('MQTT Error:', error);
});

client.on('message', function (topic, message) {
    console.log(`Received message from topic "${topic}": ${message.toString()}`);
});


let app = express()
let cache = apicache.middleware

app.use(cache('5 minutes'))

app.get('/will-be-cached', (req, res) => {
  res.json({ success: true })
})

// module.exports = clientSubs;
export default clientSubs;

