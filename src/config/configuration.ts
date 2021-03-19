export default () => ({
  port: Number(process.env.PORT) || 3000,
  mqtt: {
    host: process.env.MQTT_HOST || 'localhost',
    port: Number(process.env.MQTT_PORT) || 1883
  },
});
