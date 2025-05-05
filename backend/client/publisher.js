import mqtt from 'mqtt';

var options = {
    host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'wildan12',
    password: '12NoV2004@'
};

var client = mqtt.connect(options);

client.on("connect", function() {
    setInterval(function() {
        setInterval(function() {
            var random = Math.random()*50;
            console.log(random);
            if(random < 30) {
                client.publish('iot/PlantCare', 'Simmple MQTT:' + random.toString())
            }
        })
    }),3000;
})