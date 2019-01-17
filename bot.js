// **************************
// INICIALIZACION
// **************************

//Constantes
const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();

//command handler y carga de comandos
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//token y prefijo de comandos
const bot_secret_token = config.token;
const prefix = config.prefix;


// Comprueba que exista la palabra dab
function isDabing(message) {
    if(message.includes('dab')) {
        return true;
    }
}

// **************************
// FUNCIONES AUXILIARES
// **************************

//Respuesta a comando erróneo
function comandoErroneo(message) {
    message.reply('Habla español hijo de puta (!aiuda)');
}

//aiudame
function responderAyuda(channel, cliente) {
    let str = 'Mira que guapos los comandos: \n\n';
    for (const file of commandFiles) {
    
        const command = require(`./commands/${file}`);
        str += command.name + ': ' + command.description + '\n';
    }
    channel.send(str);
}

//Función para procesar comandos
function executeCommand(message) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        comandoErroneo(message);
        return;
    }
    if(command==='aiuda') {
        responderAyuda(message.channel, client);
        return;
    }else {
        try {
            client.commands.get(command).execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
    
}

// **************************
// EVENTOS
// **************************


// Cuando se recibe un mensaje
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }

    //si es un comando
    if (receivedMessage.content.startsWith(prefix)) {
        executeCommand(receivedMessage);
    }

    //si tiene la palabra dab
    if(isDabing(receivedMessage.content)) {
        receivedMessage.guild.emojis.forEach(customEmoji => {
            if(customEmoji.name == 'facudab') {
                receivedMessage.react(customEmoji)
                    .then(() => receivedMessage.react('💯'))
                    .then(() => receivedMessage.react('🔥'))
                    .catch(() => console.error('Error con emojis'));
                }
        });
    }
 });

// Cuando esta en el server
client.on('ready', ()=> {
    console.log('Connected as ' + client.user.tag);
    client.user.setActivity('with La madre de Facu');

    // LISTING THINGS
    /*

    console.log('Servers:');
    client.guilds.forEach((guild) => {
        console.log(' - ' + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });
    */
    // var generalChannel = client.channels.get("512345652156563476")
    // generalChannel.send("AQUÍ LLEGA JIIIIIIIIIIIIIIIIIMMY")
 });


client.login(bot_secret_token);