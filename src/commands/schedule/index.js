import { SlashCommandBuilder } from 'discord.js';
import { GetMembersOnDuty } from '../../main';

export const command = new SlashCommandBuilder()
    .setName('排程')
    .setDescription('查看這週的排程');

const ctxTime = new Date();
const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

export const GetDateInfo = (ctxTime) => {
    const currentDayIndex = ctxTime.getDay();
    const daysInWeek = [];
    const date = new Date(ctxTime);
    const offset = currentDayIndex;
    date.setDate(date.getDate() - offset);

    for (let i = 0; i < 7; i++) {
        let lmonth = date.getMonth() + 1;
        let ldate = date.getDate() + 1;
        if (lmonth === 2) {
            const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0;
            if (isLeapYear && ldate+i > 29) {
                let offset = ldate-29
                lmonth += 1;
                ldate = offset;
            } else if (!isLeapYear && ldate+i > 28) {
                let offset = ldate-28
                lmonth += 1;
                ldate = offset;
            }
        } 
        else if ([1, 3, 5, 7, 8, 10, 12].includes(lmonth) && ldate+i > 31) {
            let offset = ldate-31
            lmonth += 1;
            ldate = offset;
        } 
        else if ([4, 6, 9, 11].includes(lmonth) && ldate+i > 30) {
            let offset = ldate-30
            lmonth += 1;
            ldate = offset;
        }
        const formattedDate = `${lmonth}/${ldate + i }`;
        daysInWeek.push(formattedDate);
    }
    return daysInWeek;
}

export const action = async (ctx) => {
    const MembersOnDuty = GetMembersOnDuty();
    console.log('排程功能讀取到的名單 : ');
    console.log(MembersOnDuty);
    const dateinfo = GetDateInfo(ctxTime);
    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                description: '',
                color: 0x00ff33,
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
};