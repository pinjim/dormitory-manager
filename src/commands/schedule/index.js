import { SlashCommandBuilder } from 'discord.js';
import { GetDateInfo, SetSchedule, GetMemberRole } from '../datas/functions';

export const command = new SlashCommandBuilder()
    .setName('排程')
    .setDescription('查看這週的排程');

export const action = async (ctx) => {
    const ctxTime = new Date();
    const dateinfo = GetDateInfo(ctxTime);
    const offset = ctxTime.getDay();
    const schedule = await SetSchedule(offset);
    try{
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                    description: '',
                    color: 0x00ff33,
                    fields: [
                        {
                            "name": `${dateinfo[0]} 週一`,
                            "value": `> <@&${GetMemberRole(schedule[0])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[1]} 週二`,
                            "value": `> <@&${GetMemberRole(schedule[1])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[2]} 週三`,
                            "value": `> 無`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[3]} 週四`,
                            "value": `> <@&${GetMemberRole(schedule[2])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[4]} 週五`,
                            "value": `> <@&${GetMemberRole(schedule[3])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[5]} 週六`,
                            "value": `> 無`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[6]} 週日`,
                            "value": `> 無`,
                            "inline": true
                        },
                    ],
                    image: {
                        "url": `https://media.discordapp.net/attachments/1060629545398575255/1230184478132146287/image.png?ex=66326593&is=661ff093&hm=b5ecf75722780e2f53e3e42a9518429ac0883b29bf0de45bcde8f23fd83e6d05&=&format=webp&quality=lossless&width=902&height=478`,
                        "height": 0,
                        "width": 0
                    },
                    timestamp: ctxTime.toISOString(),
                    footer: {
                        text: '排程表日期為自動產生，可能不符合實際日期。\n若不符合實際情形，請以現實的日期為準。\npowered by @pinjim0407'
                    }
                }
            ]
        });
    }catch(error){
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `排程指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
};