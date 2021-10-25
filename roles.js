const Discord = require('discord.js');
const client = new Discord.Client();
const disbut = require('discord-buttons');
const { Permissions } = require('discord.js');
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
disbut(client);
var fs = require('fs');
require('dotenv').config();

var TOKEN = process.env.TOKEN;

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Managing Roles!");
});

client.on('guildMemberAdd', (guildMember) =>{
    let role = guildMember.guild.roles.cache.find(role => role.name === "the boys")
    var guild = guildMember.guild.name;
    guildMember.roles.add(role)

    const EMBEDMSG = new Discord.MessageEmbed()
        .setAuthor("Role Manager", client.user.displayAvatarURL())
        .setTitle("Welcome to the " + guild + " server.")
        .setDescription("If you need help, I'm here, just type '>help' in DM. The reason why you send commands in our DM is because I operate mostly outside server text channels")
        .setTimestamp()
        .setFooter("Reaction Role Manager Bot")
        .setColor("#F39C12")

    guildMember.send(EMBEDMSG);
});

client.on('message', async msg => {

    var user = msg.author.id;
    var admins = fs.readFileSync("perms.txt", {encoding:"utf8", flag:"r"}).split("\r\n");
    var pass = false;

    for(let i=0; i<admins.length; i++){
        if(user.toString() === admins[i].toString()){
            pass = true;
        }
    }

    if(!msg.author.bot){

        //set roles command && works
        if (msg.content.toLowerCase().startsWith("set reaction roles ")) {

            if(pass){
                var array = msg.content.substring(19, msg.content.length);
                array = array.split(", ");

                fs.writeFileSync("roles.txt", "", { encoding: "utf8", flag: "w" });
                for (let i = 0; i < array.length; i++) {
                    fs.writeFileSync("roles.txt", array[i].toString() + "\n", { encoding: "utf8", flag: "a" });
                }
                await msg.channel.send("**Reaction roles saved!**");
            }else{
                await msg.channel.send("**Access Denied.**");
            }
        }

        //push messages to channel name reaction-roles && works
        if (msg.content.toLowerCase().startsWith("push roles to ")) {

            try {
                if (pass) {
                    //declaring variables
                    var guildID = msg.content.substring(14, msg.content.length);
                    var guild = client.guilds.cache.get(guildID);
                    var channel = undefined;
                    var foundChannel = false;

                    //searching for name "reaction-roles" in the server channel list
                    for (let i = 0; i < (await guild).channels.cache.array().length; i++) {
                        if ((await guild).channels.cache.array()[i].name === "reaction-roles") {
                            foundChannel = true;
                            channel = (await guild).channels.cache.array()[i].id.toString();
                        }
                    }

                    //if channel is found, send buttons in the channel
                    if (foundChannel) {

                        var text = fs.readFileSync("roles.txt", { encoding: "utf8", flag: "r" }).split("\n");

                        for (let i = 0; i < text.length-1; i++) {

                            const button = new disbut.MessageButton()
                                .setLabel("Add")
                                .setStyle("blurple")
                                .setID("add")

                            const cancel = new disbut.MessageButton()
                                .setLabel("Cancel")
                                .setStyle("red")
                                .setID("cancel")

                            //declaring variables for message embed
                            var authorIMG = msg.author.avatarURL();
                            var authorNAME = msg.author.username;
                            var thumbnail = "https://www.logo-design-studio.com/prod_images_large/envelope.png";

                            const EMBEDMSG = new Discord.MessageEmbed()
                                .setAuthor(authorNAME, authorIMG)
                                .setTitle(text[i].toUpperCase())
                                .setColor("#5D6D7E")
                                .setDescription("Click the button 'Add' to assign yourself the role: " + text[i])
                                .setThumbnail(thumbnail)
                                .setTimestamp()
                                .setFooter("Reaction Role Manager Bot")

                            client.channels.cache.get(channel).send(EMBEDMSG, {
                                buttons: [button, cancel]
                            });

                            await sleep(1000);
                        }

                    } else {

                        await msg.channel.send("**No `reaction-roles` text channel found.\nIf you want me to send messages, create a `reaction-roles` text channel.**");

                    }
                } else {

                    await msg.channel.send("**Access Denied.**");

                }
            } catch (error) {

                await msg.channel.send("**I don't have the permissions to do that.**");

            }
        }

        //creates roles && works
        if(msg.content.toLowerCase() === "create roles"){

            try {
                if (pass) {
                    var text = fs.readFileSync("roles.txt", { encoding: "utf8", flag: "r" }).split("\n");

                    for (let i = 0; i < text.length - 1; i++) {
                        var guild = msg.guild;
                        let role = msg.guild.roles.cache.find(r => r.name === text[i])
                        if (role === undefined) {
                            guild.roles.create({
                                data: {
                                    name: text[i],
                                    color: 'PURPLE',
                                }
                            });
                            await msg.channel.send("**Created role " + text[i] + "!**");
                        } else {
                            await msg.channel.send("**Role " + text[i] + " already exists!**");
                            await sleep(1000);
                        }
                    }
                } else {
                    await msg.channel.send("**Access Denied.**");
                }
            } catch (error) {
                await msg.channel.send("**You have to be in a server channel to use this command!**");
            }
        }


        //HELP COMMAND SECTION

        //sends help command && works
        if(msg.content.toLowerCase() === ">help"){

            var authorIMG = msg.author.avatarURL();
            var authorNAME = msg.author.username;
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

            const EMBEDMSG = new Discord.MessageEmbed()
                .setAuthor(authorNAME, authorIMG)
                .setTitle("I'm here to help!")
                .setURL(url)
                .setColor("#F39C12")
                .addFields(
                    {name:"I am a Discord Bot created to manage roles", value: "I was created because a Bot before me stopped working.", inline:false},
                    {name:"Who has access to the commands?", value:"Administrators only.", inline:false},
                    {name: ">commands", value: "Shows all commands.", inline:false},
                )
                .setTimestamp()
                .setFooter("Reaction Role Manager Bot")

            await msg.channel.send(EMBEDMSG)
        }

        //sends bot commands && works
        if(msg.content.toLowerCase() === ">commands"){
            var authorIMG = msg.author.avatarURL();
            var authorNAME = msg.author.username;
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

            const EMBEDMSG = new Discord.MessageEmbed()
                .setAuthor(authorNAME, authorIMG)
                .setTitle("Commands:")
                .setColor("#F39C12")
                .addFields(
                    { name: "set reaction roles [role(s)]", value: "<@!889120532224684173> can create a file to store roles using this command.", inline: false },
                    { name: "create roles", value: "<@!889120532224684173> creates roles stored in a file created by `set reaction roles` command.", inline: false },
                    { name: "push roles to [guild ID]", value: "<@!889120532224684173> sends a role list for you server members to choose. To get your guild ID, right click on your server icon and choose the option `Copy ID`. ```diff\n-IMPORTANT! For you to use this command, you need a server text channel called 'reaction-roles'!\n```", inline: false },
                    { name: "Role list", value: "<@!889120532224684173> shows you what roles you saved with `set reaction roles` command.", inline:false},
                    { name: "Add button", value: "When you click the Add button <@!889120532224684173> assigns you the role you've choosen.", inline:false},
                    { name: "Cancel button", value: "When you click the Cancel button <@!889120532224684173> removes the role you've choosen.", inline: false },
                )
                .setTimestamp()
                .setFooter("Reaction Role Manager Bot")

            await msg.channel.send(EMBEDMSG)
        }

        //sends a list of roles saved in role.txt && works
        if(msg.content.toLowerCase() === ">role list"){
            var authorIMG = msg.author.avatarURL();
            var authorNAME = msg.author.username;
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var text = fs.readFileSync("roles.txt", {encoding:"utf8", flag:"r"});

            const EMBEDMSG = new Discord.MessageEmbed()
                .setAuthor(authorNAME, authorIMG)
                .setTitle("Saved Roles")
                .setDescription(text)
                .setColor("#F39C12")
                .setTimestamp()
                .setFooter("Reaction Role Manager Bot")

            await msg.channel.send(EMBEDMSG)
        }
    }
});

client.on('clickButton', async (button) =>{

    //removes role && works
    if(button.id === "cancel"){
        button.reply.defer();
        var user = button.clicker.id;
        var buttonMsgDescription = button.message.embeds[0].description
        var descriptionRole = buttonMsgDescription.substring(52, buttonMsgDescription.length);
        let role = button.clicker.member.guild.roles.cache.find(role => role.name === descriptionRole);

        button.clicker.member.roles.remove(role)

        if (!button.clicker.member.roles.cache.find(r => r.name === descriptionRole)){
            client.users.fetch(user).then(user => {
                const EMBEDMSG = new Discord.MessageEmbed()
                    .setAuthor("Role Manager", client.user.displayAvatarURL())
                    .setTitle("No assigned role " + descriptionRole)
                    .setDescription("You don't have the role: " + descriptionRole + " assigned in the " + button.guild.name + " server!")
                    .setFooter("Reaction Role Manager")
                    .setColor("#2ECC71")

                user.send(EMBEDMSG);
            });
        }else{
            client.users.fetch(user).then(user => {
                const EMBEDMSG = new Discord.MessageEmbed()
                    .setAuthor("Role Manager", client.user.displayAvatarURL())
                    .setTitle("Role Removed")
                    .setDescription("You removed the role: " + descriptionRole + " by reacting to the Cancel button in the " + button.guild.name + " server!")
                    .setFooter("Reaction Role Manager")
                    .setColor("#E74C3C")

                user.send(EMBEDMSG);
            });
        }
    }

    //adds the role && works
    if(button.id === "add"){
        button.reply.defer();
        var user = button.clicker.id;
        var buttonMsgDescription = button.message.embeds[0].description
        var descriptionRole = buttonMsgDescription.substring(52, buttonMsgDescription.length);
        let role = button.clicker.member.guild.roles.cache.find(role => role.name === descriptionRole);

        if (button.clicker.member.roles.cache.find(r => r.name === descriptionRole)){
            client.users.fetch(user).then(user => {
                const EMBEDMSG = new Discord.MessageEmbed()
                    .setAuthor("Role Manager", client.user.displayAvatarURL())
                    .setTitle("An Already Assigned Role")
                    .setDescription("You already have the role: " + descriptionRole + " in the " + button.guild.name + " server!")
                    .setFooter("Reaction Role Manager")
                    .setColor("#2ECC71")

                user.send(EMBEDMSG);
            });
        }else{
            button.clicker.member.roles.add(role);

            client.users.fetch(user).then(user => {
                const EMBEDMSG = new Discord.MessageEmbed()
                    .setAuthor("Role Manager", client.user.displayAvatarURL())
                    .setTitle("Role Added")
                    .setDescription("You have got the role: " + descriptionRole + " by reacting to the Add button in the " + button.guild.name + " server!")
                    .setFooter("Reaction Role Manager")
                    .setColor("#2ECC71")

                user.send(EMBEDMSG);
            });

            button.clicker.member.permissions.add([Permissions.DEFAULT])
        }
    }

});

client.login(TOKEN)