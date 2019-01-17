//Constantes
const Discord = require('discord.js')
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();

//command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//token y prefijo de comandos
const bot_secret_token = config.token;
const prefix = config.prefix;


//Comprueba que exista la palabra dab
function isDabing(message){
    if(message.includes("dab")){
        return true;
    }
}

//Cuando se recibe un mensaje
client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    if(isDabing(receivedMessage.content)){
        receivedMessage.guild.emojis.forEach(customEmoji => {
            if(customEmoji.name == "facudab"){
                receivedMessage.react(customEmoji)
            }
        })
        receivedMessage.react("💯")
        receivedMessage.react("🔥")
    } 
})

//Cuando esta en el server
client.on('ready',()=>{
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("with La madre de Facu")

    //LISTING THINGS
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })
    
    //var generalChannel = client.channels.get("512345652156563476")
    //generalChannel.send("AQUÍ LLEGA JIIIIIIIIIIIIIIIIIMMY")
})


client.login(bot_secret_token)