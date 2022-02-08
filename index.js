const Discord = require("discord.js");
const https = require('http');
const fs = require('fs');
const { join } = require("path");
const config = require("./config.json");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
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
                const { stdout, stderr } = await exec("/usr/bin/curl -X 'GET' 'http://192.168.1.160:5500/api/tts?voice=marytts%3Aistc-lucia-hsmm&text=andate%20a%20fanculo%20stronzi%20luridi%20accumulatori&vocoder=high&denoiserStrength=0.03&cache=false'   -H 'accept: */*' --output /ramdisk/prova.wav");
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false
                });
                connection.subscribe(player);
                
                const resource = Voice.createAudioResource('/ramdisk/prova.wav', {
                    inputType: Voice.StreamType.Arbitrary,
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
