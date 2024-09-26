import { SlashCommandBuilder } from 'discord.js';
import { SetEmbedContent } from '../datas/functions';

export const command = new SlashCommandBuilder()
    .setName('值日')
    .setDescription('查看今日的值日');

export const action = async (ctx) => {
    try{
        const currentTime = new Date();
        const dayOfWeek = currentTime.getDay();
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1;
        const date = currentTime.getDate();
        const embedcontent = SetEmbedContent(dayOfWeek, true);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `${year}/${month}/${date} ${embedcontent.title}`,
                    escription: '',
                    color: 0x00FFFF,
                    fields: [
                        {
                            "name": ``,
                            "value": `${embedcontent.value}`                        
                        }
                    ],
                    image: {
                        "url": `https://cdn.discordapp.com/attachments/1060629545398575255/1229843780518019142/image.png?ex=66312846&is=661eb346&hm=e80e04f017bfeffcffdce4fac134972b3a440fe894d611fe7ba8cf7e4d51f758&`,
                        "height": 0,
                        "width": 0
                    },
                    timestamp: currentTime.toISOString(),
                    footer: {
                        text: '工作內容及注意事項請使用“/排程”指令以確認。\npowered by @pinjim0407'
                    }
                }
            ],
        }); 
    }catch(error){
        console.log(error);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `值日指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
};