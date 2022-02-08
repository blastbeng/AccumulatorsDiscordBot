const Discord = require("discord.js");
const https = require('http');
const fs = require('fs');
const config = require("./config.json");
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const prefix = "!";


client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "stronzo") {
        message.reply(`L'unico stronzo qui è Hanzo`);
    //} else if (command === "parla") {
    } else {

            var parola = "stronzi pezzenti"
            const options = {
                hostname: '192.168.1.160',
                port: 5500,
                path: '/api/tts?voice=marytts:istc-lucia-hsmm&text="stronzi"',
                method: 'GET',
            }
            console.log(options.path);

            const req = https.request(options, res => {

                    let server = message.guild.id;
                    

                    const connection = joinVoiceChannel({
                        channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator
                    });
                    //connection.on(joinVoiceChannel.Ready, () => {

                    let array = [];

                    const req = https.request(options, res => {
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            array.push(chunk);
                        });
                        res.on('end', function() {
                            fs.writeFileSync("/ramdisk/prova.wav", array)
                                .then(connection => {
                                    const dispatcher = connection.playFile("/ramdisk/prova.wav");
                                    dispatcher.on("end", end => {
                                        VC.leave()
                                    });
                                })
                                .catch(console.error);

                        });
                        //console.log('The connection has entered the Ready state - ready to play audio!');
                    //});

                    connection.destroy();
                });
            });

            req.on('error', error => {
                console.error(error)
            })

            req.end()


    }
});

client.login(config.BOT_TOKEN);
