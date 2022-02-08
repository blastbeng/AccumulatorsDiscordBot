const Discord = require("discord.js");
const https = require('http');
const fs = require('fs');
const config = require("./config.json");
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');
const { createAudioResource } = require('@discordjs/voice');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const player = createAudioPlayer();

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const prefix = "!";


client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "parla") {

        const curl = new Curl();
        const terminate = curl.close.bind(curl);

        curl.setOpt(Curl.option.URL, "http://192.168.1.160:5500/api/tts?voice=marytts:istc-lucia-hsmm&text=prova");
        curl.setOpt(Curl.option.HTTPGET, true);
        curl.on("end", function (statusCode, data, headers) {

            fs.writeFile("/ramdisk/prova.wav", data, (err) => {
                    if (err)
                        console.log(err);
                    else {
                        const connection = joinVoiceChannel({
                            channelId: message.member.voice.channel.id,
                            guildId: message.guild.id,
                            adapterCreator: message.guild.voiceAdapterCreator
                        });
                        const resource = createAudioResource("/ramdisk/prova.wav");
                        player.play(resource);
                        connection.subscribe(player);
                        player.stop();
                        
                        connection.destroy();
                    }
                });

            //console.log('The connection has entered the Ready state - ready to play audio!');
            //});

            this.close();
        });
        curl.on("error", terminate);
        curl.perform();

    }
});

client.login(config.BOT_TOKEN);
