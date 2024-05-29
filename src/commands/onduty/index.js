import { SlashCommandBuilder } from 'discord.js';
import { GetMembersOnDuty } from '../../main';

export const command = new SlashCommandBuilder()
    .setName('值日')
    .setDescription('查看今日的值日');

export const action = async (ctx) => {
    const MembersOnDuty = GetMembersOnDuty();
    console.log('值日功能讀取到的名單 : ');
    console.log(MembersOnDuty);
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const date = currentTime.getDate();
    const dayOfWeek = currentTime.getDay();
    let titlecontent;
    let fieldcontent;
    let fieldvalue;
    switch (dayOfWeek) {
        case 0:
            titlecontent = `今日無需值日!`;
            fieldcontent = `${year}/${month}/${date} 週日，沒有垃圾車。`;
            fieldvalue = ``;
            break;
        case 1:
            titlecontent = `今日值日 : ${MembersOnDuty[0]}`;
            fieldcontent = `${year}/${month}/${date} 週一，需要丟一般垃圾。`;
            fieldvalue = `請在19:00前完成工作。`;
            break;
        case 2:
            titlecontent = `今日值日 : ${MembersOnDuty[1]}`;
            fieldcontent = `${year}/${month}/${date} 週二，需要丟資源回收。`;
            fieldvalue = `請在19:00前完成工作。`;
            break;
        case 3:
            titlecontent = `今日無需值日!`;
            fieldcontent = `${year}/${month}/${date} 週三，沒有垃圾車。`;
            fieldvalue = ``;
            break;
        case 4:
            titlecontent = `今日值日 : ${MembersOnDuty[2]}`;
            fieldcontent = `${year}/${month}/${date} 週四，需要丟一般垃圾。`;
            fieldvalue = `請在19:00前完成工作。`;
            break;
        case 5:
            titlecontent = `今日值日 : ${MembersOnDuty[3]}`;
            fieldcontent = `${year}/${month}/${date} 週五，需要丟資源回收。`;
            fieldvalue = `請在19:00前完成工作。`;
            break;
        case 6:
            titlecontent = `今日值日 : ${MembersOnDuty[4]}`;
            fieldcontent = `${year}/${month}/${date} 週六，需要丟一般垃圾。`;
            fieldvalue = `請在19:00前完成工作。`;
            break;
        default:
            fieldcontent = "無法正確取得日期資訊，請嘗試重新使用指令。";
    }
    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `${titlecontent}`,
                description: '',
                color: 0x00FFFF,
                fields: [
                    {
                      "name": `${fieldcontent}`,
                      "value": `${fieldvalue}`
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
        ]
    });
};