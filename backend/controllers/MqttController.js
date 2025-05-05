import mqtt from 'mqtt'
var options = {
  host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
  port: 8883,
  topic: 'iot/PlantCare',
  protocol: 'mqtts',
  username: 'wildan12',
  password: '12NoV2004@'
}

var client = mqtt.connect(options)
let latestMessages = {}

client.on('connect', function () {
  console.log('Connected to MQTT broker')

  client.subscribe(options.topic, function (err) {
      if (!err) {
            console.log('Subscribed to topic: ' + options.topic)

            client.publish('iot/TestMessage', 'Hello, this is a test message!', function (err) {
                if (!err) {
                    console.log('Message published to topic: ' + 'iot/TestMessage')
                } else {
                    console.error('Failed to publish message:', err)
                }
            }) 
      } else {
          console.error('Failed to subscribe to topic:', err)
      }
  })
})

client.on('message', function (topic, message) {
  console.log(`Raw message received:`, message.toString())
  try {
        const parsedMessage = JSON.parse(message.toString())

        const { id } = parsedMessage;

        if (!latestMessages[id]) {
          latestMessages[id] = [];
        }
    
        parsedMessage.timestamp = new Date().toISOString();

        if (parsedMessage.id) {
            latestMessages[id].push(parsedMessage);
        
            if (latestMessages[id].length > 2) {
            latestMessages[id].shift();
            }
            console.log(`Updated data for ID ${parsedMessage.id}:`, parsedMessage)
        } else {
            console.warn("Received message without an ID:", parsedMessage)
        }

        console.log(`Received message from "${topic}":`, latestMessages)
  } catch (error) {
      console.error('Invalid JSON format:', message.toString())
  }
})


// export { latestMessages, options }


// export const getMqttData = (req, res) => {
//     res.json({
//       status: 200,
//       topic: options.topic,
//       data: latestMessages || { error: "No data received yet" },
//     })
// }

export const getAllMqttData = (req, res) => {
    res.json({
      status: 200,
      topic: options.topic,
      data: latestMessages
    })
}

export const getMqttData = (req, res) => {
    const { id } = req.params
    const data = latestMessages[id]

    if (data) {
      res.json({
        status: 200,
        topic: options.topic,
        data: data
      })
    } else {
      res.json({
        status: 404,
        error: `No data found for ID ${id}`
      })
    }
}

