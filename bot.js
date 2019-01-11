//Constantes
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json');

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

bot_secret_token = config.token

client.login(bot_secret_token)