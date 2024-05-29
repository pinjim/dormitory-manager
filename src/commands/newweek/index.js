import { SlashCommandBuilder } from 'discord.js';
import { GetDateInfo } from '../schedule';
import { GetMembersOnDuty } from '../../main';

export const command = new SlashCommandBuilder()
    .setName('更新')
    .setDescription('更新值日排程表');

const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    
export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const RefreshMemberList = async() =>{
    const fs = require('fs').promises;
    const filePath = 'src/commands/members.txt';
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        let members = data.split("','").map(members => members.replace(/'/g, ''));
        members = members.filter(members => members !== '李臸宇' && members !== '張桂嘉');
        members = shuffle(members);
        const randomIndex1 = Math.floor(Math.random() * 3);
        const randomIndex2 = Math.floor(Math.random() * 3);
        members.splice(randomIndex1, 0, '李臸宇');
        members.splice(randomIndex2, 0, '張桂嘉');
        const modifiedData = "'" + members.join("','") + "'";
        await fs.writeFile(filePath, modifiedData, 'utf-8');
        console.log('文件內容已成功修改並保存。');
        console.log(members)

    } catch (error) {
        console.error('讀取/寫入文件時發生錯誤：', error);
    }
}

export const action = async (ctx) => {
    const ctxTime = new Date();
    await RefreshMemberList();
    const MembersOnDuty = GetMembersOnDuty();
    console.log('更新功能讀取到的名單 :');
    console.log(MembersOnDuty);
    const dateinfo = GetDateInfo(ctxTime);
    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `排程表已更新。\n本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                description: '',
                color: 0xFF0000,
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
                    text: '排程表更新為自動產生，人員排序可能無法配合實際情形。\n若發生無法配合的狀況，請使用“/更新”指令來手動刷新排程表。\npowered by @pinjim0407'
                }
            }
        ]
    });
};