const fs = require('fs');
var filename = ""

module.exports = {
    name: "ban_no",
    description: "Vota NO en el bangame actual",
    execute(message) {
        filename = "./resources/temp_bangame_"+message.guild.id+".json";
        if(checkBanGame(message)){

            const obj = JSON.parse(fs.readFileSync(filename));

            if(obj.hasOwnProperty(message.author.id)){
                message.reply("Ya has votado, listopollas")
            }else{
                obj[message.author.id] = false
                
                const data = JSON.stringify(obj, null, 2);
                fs.writeFile(filename, data, function(err) {
                    if(err) console.log(err);
                    console.log('writing to ' + filename);
                });
            }
        }else{
            message.channel.send("No hay ningún bangame empezado, tolai.")
        }
    }
}

function checkBanGame(message){
    return fs.existsSync(filename)
}