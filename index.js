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
const path = Config.CACHE_DIR;

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
const voice="&voice=larynx%3Alisa-glow_tts";
const vocoder="&vocoder=low";
const denoiser="&denoiserStrength=0.03";
const cache="&cache=false";
const text="&text=";




client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

          
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });


    if (command === "stronz") {
            try {

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

                var file = makeid(10)+".wav";

                var params = api+voice+vocoder+denoiser+cache+textParam;
                var outFile = path+file;
                var child =  exec("/usr/bin/curl -X 'GET' '"+params+"' -H 'accept: */*' --output '"+outFile+"'");
                child.stdout.pipe(process.stdout)
                child.on('exit', function() {                    
                    const resource = createAudioResource(outFile, {
                        inputType: StreamType.Arbitrary,
                    });
                    connection.subscribe(player);
                    player.play(resource);

                    fs.unlink(outFile,function(err){
                        if(err) return console.log(err);
                   });
                })     
                
            }catch (err) {
                console.error(err);
            };

    }

    //connection.destroy();
});

client.login(config.BOT_TOKEN);
