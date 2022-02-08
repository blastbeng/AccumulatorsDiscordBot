const Discord = require("discord.js");
const fs = require('fs');
const config = require("./config.json");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType  } = require('@discordjs/voice');
const util = require('util');
const player = createAudioPlayer();
const { exec } = require("child_process");

const client = new Discord.Client({
    intents: new Discord.Intents(32767)
});

const prefix = "!";
const path = "/ramdisk/";

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const api="http://192.168.1.160:5500/api/tts?";
const voice="&voice=marytts%3Aistc-lucia-hsmm";
const vocoder="&vocoder=high";
const denoiser="&denoiserStrength=0.03";
const cache="&cache=false";
const text="&text=";




client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    var words = "";

    for(var i = 0; i < args.length; i++){
        if(i===(args.length-1)){
            words+=args[i];
        }
        else {
            words+=args[i]+"%20";
        }
    }

    var textParam=text+words;

    if (command === "parla") {
        async function dovoice() {
            try {

                //var file = makeid(10)+".wav";
                var file = "accumulators-discord-bot.wav";

                var params = api+voice+vocoder+denoiser+cache+textParam;
                var outFile = path+file;
                exec("/usr/bin/curl -X 'GET' '"+params+"' -H 'accept: */*' --output '"+outFile+"'", (error, stdout, stderr) => {                 
                    const connection = joinVoiceChannel({
                        channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false
                    });
                    connection.subscribe(player);
                    
                    const resource = createAudioResource(outFile, {
                        inputType: StreamType.Arbitrary,
                    });
                    player.play(resource);
                });
                
            }catch (err) {
                console.error(err);
            };
        };
        dovoice();

    }
});

client.login(config.BOT_TOKEN);
