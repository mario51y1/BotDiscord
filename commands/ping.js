module.exports = {
    name: 'ping',
    description: 'Intenta ganarme al ping pong, hijo puta',
    execute(message, args){
        message.channel.send('Pong!');
    },
};