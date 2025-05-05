import mqtt from 'mqtt';
import { createClient } from 'redis';

// Koneksi ke Redis
const redisClient = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

// Hubungkan Redis
await redisClient.connect();

// Konfigurasi MQTT
const options = {
    host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'wildan12',
    password: '12NoV2004@'
};

// Koneksi ke MQTT Broker
const client = mqtt.connect(options);

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe('iot/PlantCare', function (err) {
        if (!err) {
            console.log('Subscribed to topic: iot/PlantCare');
        } else {
            console.error('Failed to subscribe to topic:', err);
        }
    });
});

// Tangkap pesan dari MQTT dan simpan ke Redis
client.on('message', async function (topic, message) {
    console.log(`Received message from topic "${topic}": ${message.toString()}`);

    // Simpan pesan ke Redis
    await redisClient.setEx('mqttMessage', 3600, message.toString());
});

export { redisClient };
