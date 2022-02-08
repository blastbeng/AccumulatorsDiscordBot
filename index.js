const Discord = require("discord.js");
const https = require('http');
const fs = require('fs');
const { join } = require("path");
const config = require("./config.json");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType  } = require('@discordjs/voice');
const util = require('util');

const player = createAudioPlayer();
const querystring = require("querystring");
const { Curl } = require("node-libcurl");

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
        const exec = util.promisify(require('child_process').exec);
        async function lsWithGrep() {
            try {
                var params = "";
                const { stdout, stderr } = await exec("./getFile.sh "+params);
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false
                });
                connection.subscribe(player);
                
                const resource = createAudioResource('/ramdisk/prova.wav', {
                    inputType: StreamType.Arbitrary,
                });
                player.play(resource);
                
            }catch (err) {
                console.error(err);
            };
        };
        lsWithGrep();

    }
});

client.login(config.BOT_TOKEN);
