const fs = require('fs');
const filename = './resources/users.json';


module.exports = {
    name: 'bangame',
    description: 'El juego que emocionó a spilberg',
    execute(message) {
        message.channel.send('Working on it boi');

        //checks users.json file
        checkUserFileExistance();
        checkUsersInUserFile(message);

        //starts game
        message.channel.send("Empezar juego")
        setTimeout(()=>{
            message.channel.send("Acabar juego tras 3 segs timeout")
        },3000)
    },
};

function checkUsersInUserFile(message) {
    let updateFile = false;

    try{
        //obtains JSON with info of users and guild members
        const obj = JSON.parse(fs.readFileSync(filename));
        const members = message.guild.members;

        //iterates over the members, if doesn't exists, updates the obj
        for(const k of members) {
            const name = members.get(k[0]).user.username;
            if(!obj.hasOwnProperty(name)) {
                updateFile = true;
                obj[name] = {
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

