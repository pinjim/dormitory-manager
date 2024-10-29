import { Client, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

export const command = new SlashCommandBuilder()
    .setName('語音')
    .setDescription('機器人語音操作')
    .addIntegerOption(option =>
        option.setName('action')
            .setDescription('選擇欲讓機器人做的行動')
            .setRequired(true)
            .addChoices(
                { name: '加入語音', value: 0 },
                { name: '離開語音', value: 1 },
            ));

export const action = async (ctx) => {
    const action = ctx.options.getInteger('action');
    const filter = ctx.member.roles.cache.has(`1222238665888239666`);
    
    try {
        if (!filter) throw new Error(`你沒有權限使用這個指令`);
        switch (action) {
            case 0:
                const voiceChannel = ctx.member.voice.channel;
                if (!voiceChannel) {
                    throw new Error(`請先加入一個語音頻道再使用指令`);
                }
                const existingConnection = getVoiceConnection(ctx.guild.id);
                if (existingConnection) existingConnection.destroy();
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: ctx.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                await ctx.reply({
                    embeds: [
                        {
                            title: `已加入語音頻道`,
                            description: `機器人已成功加入語音頻道 ${voiceChannel.name}`,
                            color: 0x00FFFF,
                        }
                    ],
                });
                break;

            case 1:
                const currentChannel = getVoiceConnection(ctx.guild.id);
                
                if (!currentChannel) {
                    throw new Error(`機器人不在任何語音頻道中`);
                } else {
                    currentChannel.destroy();
                    await ctx.reply({
                        embeds: [
                            {
                                title: `已離開語音頻道`,
                                description: `機器人已成功離開語音頻道`,
                                color: 0x00FFFF,
                            }
                        ],
                    });
                }
                break;

            default:
                throw new Error(`預期外的索引值，請嘗試重新使用指令`);
        }
    } catch (error) {
        await ctx.reply({
            embeds: [
                {
                    title: `語音指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ],
        });
    }
};
