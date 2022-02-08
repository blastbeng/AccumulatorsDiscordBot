const Discord = require("discord.js");
const https = require('http');
const fs = require('fs');
const config = require("./config.json");
const { joinVoiceChannel } = require('@discordjs/voice');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const prefix = "!";
const dir = "/ramdisk";


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

            let server = message.guild.id;


            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            //connection.on(joinVoiceChannel.Ready, () => {

            fs.writeFileSync(dir+"/prova.wav", data)
                .then(connection => {
                    const dispatcher = connection.playFile(dir+"/prova.wav");
                    dispatcher.on("end", end => {
                        VC.leave()
                    });
                })
                .catch(console.error);

            //console.log('The connection has entered the Ready state - ready to play audio!');
            //});

            connection.destroy();
            this.close();
        });
        curl.on("error", terminate);
        curl.perform();

    }
});

client.login(config.BOT_TOKEN);
