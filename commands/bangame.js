const fs = require('fs');
const filename = './resources/users.json';
const Discord = require('discord.js');


module.exports = {
    name: 'bangame',
    description: 'El juego que emocionó a spilberg',
    execute(message,args) {

        //necesario que tenga argumento
        if(args.length > 0){

            //obtiene argumento
            let a = args.shift().toLowerCase();

            //si pone reglas envia una explicacion, si no, comprueba que sea una mencion para empezar el juego
            if(a=="reglas"){
                const embed = new Discord.RichEmbed()
                    .setTitle("REGLAS")
                    .addField("INICIO","Para empezar, introduce el @nombre de aquel que crees que merece ser baneado. Tras esto, podreis votar los miembros "+
                        "de este chat si merece el ban o no con !ban_yes o !ban_no. Tendréis 1 min para votar.")
                    .addField("RESULTADO","Si salen más votos a favor, esta persona recibirá un banpoint. Si sale igual o que no, aquel que ha iniciado "+
                        "la votación recibirá en su lugar el banpoint, por intentar abusar")
                    .addField("BANPOINTS","Cuando un usuario tenga 5 banpoints, se ganará 5 ricos minutos de no poder hablar. Tras esto, volverá a tener 0 banpoints. "+
                        " Si escribes '!bangame getpoints' se te dirán tus puntos actuales en este canal.");
                
                message.channel.send(embed)
            }
            else if (a=="getpoints"){
                getPoints(message)
            }else{
                user = message.mentions.users.first()
                if(fs.existsSync("./resources/temp_bangame_"+message.guild.id+".json")){
                    message.channel.send("Bangame en juego ya")
                }else if(user){
                    if(user.id==532719597263257610){
                        message.reply("No puedes banear a un dios")
                    }else{
                        message.channel.send('Working on it boi');
    
                        //checks users.json file
                        checkUserFileExistance();
                        checkUsersInUserFile(message);
                
                        //starts game
                        message.channel.send("Empezar juego")
                        const data = JSON.stringify({}, null, 2);
                
                        //Crea archivo temp para los puntos
                        fs.writeFileSync("./resources/temp_bangame_"+message.guild.id+".json",data,function(err){
                            console.log(err)
                        })
                
                        //Crea el timeout para acabar el juego
                        setTimeout(()=>{
                            message.channel.send("Acabar juego tras 10 segs timeout")
                            endBanGame(message,user)
                        },10*1000)
                    }
                }else{
                    message.reply("Introduce !bangame y: 'reglas' para una explicación, 'getpoints' para saber tus puntos o una mención (@persona) para empezar")
                }
        }
        }else{
            message.reply("Introduce !bangame y: 'reglas' para una explicación, 'getpoints' para saber tus puntos o una mención (@persona) para empezar")
        }
    },
};

//
function getPoints(message){
    let obj = JSON.parse(fs.readFileSync(filename)); 
    let banpoints = obj[message.guild.id][message.author.id].banpoints
    message.reply("Tienes " + banpoints + " banpoints")
}


//Cosa de resultado
function endBanGame(message,user){

    let obj = JSON.parse(fs.readFileSync("./resources/temp_bangame_"+message.guild.id+".json")); 
    let yes_votes = 0;
    let no_votes = 0;
    for (var [key, value] of Object.entries(obj)) {
        console.log(value)
        if(value)yes_votes++;
        else no_votes++;
    }
    
    const embed = new Discord.RichEmbed()
        .setTitle("Resultado votación de " + user.username)
        .addField("Votos para banear a este hijodeputa: ", yes_votes)
        .addField("Votos de misericordia: " , no_votes);
    message.channel.send(embed)

    let target;
    if(yes_votes>no_votes){
        target=user;
        message.channel.send("El pueblo ha hablado, " + target + ", te has ganado un rico banpoint")
    }else{
        target=message.author;
        message.channel.send("Te crees que tienes poder alguno? Pues por chulo te ganas un banpoint " + target)
    }
    fs.unlink("./resources/temp_bangame_"+message.guild.id+".json",(err)=>{
        if(err){
            console.log(err)
        }
    })

    obj = JSON.parse(fs.readFileSync(filename));
    let auxUser = obj[message.guild.id][target.id]

    auxUser.banpoints = auxUser.banpoints + 1

    if(auxUser.banpoints >= 5){
        //auxUser.banpoints=0;
        Mutea(message,target)
    }

    obj[message.guild.id][target.id] = auxUser

    const data = JSON.stringify(obj, null, 2);
    fs.writeFile(filename, data, function(err) {
        if(err) console.log(err);
        console.log('writing to ' + filename);
    });
}
        
async function Mutea(message,target){
    try{
        message.channel.send(target + " Te han culiado. 5 minutitos de ban")

        const userToMute = message.guild.members.find('id', target.id);
        const muteRol = message.guild.roles.find("name","Mutiao Culiao")

        const oldRoles = userToMute.roles;
       
        for(let pair of oldRoles){
            userToMute.removeRole(pair[1]).catch(console.error)
        }

        userToMute.addRole(muteRol).catch(console.error);
   
        setTimeout(()=>{
            userToMute.removeRole(muteRol).catch(console.error);

            for(let pair of oldRoles){
                userToMute.addRole(pair[1]).catch(console.error)
            }

            message.channel.send(target + " Te quitamos el bozal un rato")
        },20*1000)     
    }catch(err){
        console.log(err)
    }
   
}

//obtains JSON with info of users and guild members
function checkUsersInUserFile(message) {
    let updateFile = false;

    try{
        const obj = JSON.parse(fs.readFileSync(filename));
        if(!obj.hasOwnProperty(message.guild.id)){
            updateFile = true;
            obj[message.guild.id] = {}
        }
        const guildMembersOnFile = obj[message.guild.id]
        const members = message.guild.members;

        //iterates over the members, if doesn't exists, updates the obj
        for(const k of members) {
            const id = members.get(k[0]).id;
            if(!guildMembersOnFile.hasOwnProperty(id)) {
                updateFile = true;
                guildMembersOnFile[id] = {
                    banpoints: 0,
                };
            }
        }
        //updates file if needed
        if(updateFile) {
            const data = JSON.stringify(obj, null, 2);
            fs.writeFile(filename, data, function(err) {
                if(err) console.log(err);
                console.log('writing to ' + filename);
            });
        }
    }
    catch(err) {
        console.log(err);
    }
}

// checks existance of JSON file
function checkUserFileExistance() {
    try{
        if(!fs.existsSync(filename)) {
            console.log(filename +" doesn't exists");

            const data = JSON.stringify({}, null, 2);
            fs.writeFile(filename, data, function(err) {
                if(err) console.log(err);
                console.log('writing to ' + filename);
            });
            console.log('should exist now');
        }
    }
    catch(err) {
        console.log(err);
    }
}

