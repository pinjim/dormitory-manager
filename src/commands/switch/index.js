import { SlashCommandBuilder } from 'discord.js';
import { GetMembersOnDuty } from '../../main';
import { GetDateInfo } from '../schedule';

export const command = new SlashCommandBuilder()
    .setName('換班')
    .setDescription('和其他成員換班')
    .addIntegerOption(option =>
        option.setName('member1')
            .setDescription('第一位交換對象')
            .setRequired(true)
            .addChoices(
				{ name: '黃智祥', value: 0 },
				{ name: '黃品鈞', value: 1 },
				{ name: '蘇翊嘉', value: 2 },
                { name: '張桂嘉', value: 3 },
                { name: '李臸宇', value: 4 },
            ))
    .addIntegerOption(option =>
        option.setName('member2')
            .setDescription('第二位交換對象')
            .setRequired(true)
            .addChoices(
				{ name: '黃智祥', value: 0 },
				{ name: '黃品鈞', value: 1 },
				{ name: '蘇翊嘉', value: 2 },
                { name: '張桂嘉', value: 3 },
                { name: '李臸宇', value: 4 },
            )); 

export const action = async (ctx) => {
    const fs = require('fs').promises;
    const filePath = 'src/commands/members.txt';
    const ctxTime = new Date();
    const dateinfo = GetDateInfo(ctxTime);
    const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    let MembersOnDuty = GetMembersOnDuty();
    let index1 = ctx.options.getInteger('member1');
    let index2 = ctx.options.getInteger('member2');
    let memberlist = ['黃智祥', '黃品鈞', '蘇翊嘉', '張桂嘉', '李臸宇'];
    let member1 = memberlist[index1];
    let member2 = memberlist[index2];
    let indexmem1;
    let indexmem2;
    for(let i = 0; i<5; i++){
        if(MembersOnDuty[i] === member1) indexmem1 = i;
        if(MembersOnDuty[i] === member2) indexmem2 = i;
    }
    MembersOnDuty[indexmem1] = member2;
    MembersOnDuty[indexmem2] = member1
    try{
    const modifiedData = "'" + MembersOnDuty.join("','") + "'";
        await fs.writeFile(filePath, modifiedData, 'utf-8');
    } catch (error) {
        console.error('讀取/寫入文件時發生錯誤：', error);
    }
    MembersOnDuty = GetMembersOnDuty();
    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `${member1}和${member2}進行了換班，排程表已更新。\n本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                description: '',
                color: 0xFFA500,
                fields: [
                    {
                        "name": `${dateinfo[0]}  ${days[0]}`,
                        "value": `${MembersOnDuty[0]}`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[1]} ${days[1]}`,
                        "value": `${MembersOnDuty[1]}`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[2]} ${days[2]}`,
                        "value": `無`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[3]} ${days[3]}`,
                        "value": `${MembersOnDuty[2]}`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[4]} ${days[4]}`,
                        "value": `${MembersOnDuty[3]}`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[5]} ${days[5]}`,
                        "value": `${MembersOnDuty[4]}`,
                        "inline": true
                    },
                    {
                        "name": `${dateinfo[6]} ${days[6]}`,
                        "value": `無`,
                        "inline": true
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: 'powered by @pinjim0407'
                }
            }
        ]
    });
}