import {Client, Events, GatewayIntentBits} from 'discord.js'
import vueInit from '@/core/vue'
import dotenv from 'dotenv'
import {loadCommands, loadEvents} from '@/core/loader'
import { useAppStore } from '@/store/app'
import { RefreshMemberList } from '@/commands/newweek'
import { GetDateInfo } from '@/commands/schedule'
import fs from 'fs';

vueInit()
dotenv.config()
loadCommands()
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const appStore = useAppStore()
appStore.client = client
loadEvents()

const ctxTime = new Date();
const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

export const GetMembersOnDuty = () => {
    let MembersOnDuty = [];
    try {
        const data = fs.readFileSync('src/commands/members.txt', 'utf-8');
        MembersOnDuty = data.split("','").map(name => name.replace(/'/g, ''));
    } catch (error) {
        console.error('讀取名單時發生錯誤：', error);
    }
    
    return MembersOnDuty
}

export const GetNewWeekCheck = () =>{
    let NewWeekCheck;
    try {
        const data = fs.readFileSync('src/commands/check.txt', 'utf-8');
        NewWeekCheck = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    if(NewWeekCheck === 'true')
        return true;
    else if(NewWeekCheck == 'false')
        return false;
}

export const SaveNewWeekCheck = (data) => {
    try {
        fs.writeFileSync('src/commands/check.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

client.once('ready', () => { 
    client.user.setPresence({
        status: 'idle',
    });
                                            /* 目標伺服器租屋聊天室     測試伺服器測試聊天室 */ 
    const channel = client.channels.cache.get('1099675393335763107'/*'1043818575548391519'*/);
    const roleID = '1147921909091156009';
    let titlecontent;
    let fieldcontent;
    let fieldvalue;
    let counter = 1;
    setInterval(async () => {
        const currentTime = new Date();
        let consoleHour = currentTime.getHours();
        let consoleMinute = currentTime.getMinutes();
        let NewWeekCheck = GetNewWeekCheck()
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1;
        const date = currentTime.getDate();
        const dayOfWeek = currentTime.getDay();
        console.log(`\n今天是${year}/${month}/${date} 周${dayOfWeek}，程式已運行${counter}分鐘。\n自動發訊目標時間 : 00:00 , 目前時間 : ${consoleHour.toString().padStart(2, '0')}:${consoleMinute.toString().padStart(2, '0')}\n排程表更新狀態 : ${NewWeekCheck}`);
        counter+=1;
        if (dayOfWeek === 1 && NewWeekCheck === false) {
            NewWeekCheck = 'true';
            console.log(`偵測到換周，已更新排程表，目前排程表更新狀態 : ${NewWeekCheck}`);
            await RefreshMemberList();
            const MembersOnDuty = GetMembersOnDuty();
            console.log('自動更新功能讀取到的名單 :');
            console.log(MembersOnDuty);
            const dateinfo = GetDateInfo();
            if (channel) {
                channel.send({
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
            }
            SaveNewWeekCheck(NewWeekCheck);
        }
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6){
            if (NewWeekCheck === true){
                NewWeekCheck = 'false';
                console.log(`已重置排程表更新狀態，目前排程表更新狀態 : ${NewWeekCheck}`);
                SaveNewWeekCheck(NewWeekCheck);
            }
        }
        if (/*時*/currentTime.getHours() === 0 && /*分*/currentTime.getMinutes() === 0) {
            const MembersOnDuty = GetMembersOnDuty()
            const dayOfWeek = currentTime.getDay();
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
            if (channel) {
                channel.send({
                    content: `<@&${roleID}>`,
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
            } else {
                console.error('無法找到指定的頻道');
            }
        }
    }, 60000);
});

client.login(process.env.TOKEN)