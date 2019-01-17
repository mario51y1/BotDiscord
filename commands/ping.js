module.exports = {
    name: 'ping',
    description: 'Intenta ganarme al ping pong, hijo puta',
    execute(message) {
        message.channel.send('Pong!');
    },
};