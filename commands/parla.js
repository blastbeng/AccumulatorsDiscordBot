const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType  } = require('@discordjs/voice');

const fs = require('fs');
const config = require("../config.json");
const player = createAudioPlayer();
const fetch = require('node-fetch');

const path = config.CACHE_DIR;
const api="http://192.168.1.160:5500/api/tts?";
const voice="voice=marytts%3Aistc-lucia-hsmm&lang=it&vocoder=high&denoiserStrength=0.005&speakerId=&ssml=false&ssmlNumbers=true&ssmlDates=true&ssmlCurrency=true&cache=true";
const text="&text=";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('parla')
        .setDescription('Il pezzente parla')
        .addStringOption(option => option.setName('input').setDescription('Testo')),
    async execute(interaction) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });
        connection.subscribe(player);

        const words = interaction.options.getString('input');

        var textParam=text+words;      
        var params = api+voice+textParam;

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
                    player.play(resource);                     
                    interaction.reply({ content: 'Il pezzente sta parlando' });
                });
            })
        }); 

    }
};