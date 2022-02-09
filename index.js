const Discord = require("discord.js");
const fs = require('fs');
const config = require("./config.json");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType  } = require('@discordjs/voice');
const player = createAudioPlayer();
const fetch = require('node-fetch');

const client = new Discord.Client({
    intents: new Discord.Intents(32767)
});

const prefix = "!";
const path = config.CACHE_DIR;

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

function doPlay(params, connection) {    
    fetch(
        params,
        {
            method: 'GET',
            headers: { 'Accept': '*/*' }
        }
    ).then(res => {
        new Promise((resolve, reject) => {
            var file = "discord_accumulators_tmp.wav";
            var outFile = path+"/"+file;
            const dest = fs.createWriteStream(outFile);
            res.body.pipe(dest);
            res.body.on('end', () => resolve());
            dest.on('error', reject);

            dest.on('finish', function(){                            
                const resource = createAudioResource(outFile, {
                    inputType: StreamType.Arbitrary,
                });
                connection.subscribe(player);
                player.play(resource); 
            });
        })
    }); 
}

const api="http://192.168.1.160:5500/api/tts?";
const voice="voice=marytts%3Aistc-lucia-hsmm&lang=it&vocoder=high&denoiserStrength=0.005&speakerId=&ssml=false&ssmlNumbers=true&ssmlDates=true&ssmlCurrency=true&cache=true";
const text="&text=";

client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.member.voice.channel === null) return;

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


    if (command === "parla") {
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
                var params = api+voice+textParam;

                doPlay(params, connection);
                
            }catch (err) {
                console.error(err);
            };

    }

    //connection.destroy();
});

client.login(config.BOT_TOKEN);
