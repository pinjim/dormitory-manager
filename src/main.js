import {Client, Events, GatewayIntentBits} from 'discord.js'
import vueInit from '@/core/vue'
import dotenv from 'dotenv'
import {loadCommands, loadEvents} from '@/core/loader'
import { useAppStore } from '@/store/app'
import { RefreshMemberList } from '@/commands/newweek'
import { GetDateInfo } from '@/commands/schedule'
import fs from 'fs';
import { GetWeatherData, ProcessWeatherData, FormatDataTimeInfo } from './commands/weather'
import { MagnitudeLevel, DepthLevel, IntensityLevel } from './commands/earthquake'

vueInit()
dotenv.config()
loadCommands()
const client = new Client({  
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ]  
})
const appStore = useAppStore()
appStore.client = client
loadEvents()

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

export const GetEarthQuakeID = () => {
    let earthquakeID;
    try {
        const data = fs.readFileSync('src/commands/earthquakeID.txt', 'utf-8');
        earthquakeID = data.trim();
        return earthquakeID;
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }

}

export const SaveEarthQuakeID = (id) => {
    const idString = id.toString();
    try {
        fs.writeFileSync('src/commands/earthquakeID.txt', idString, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const CounterFormat = (counterMinutes) => {
    const counterHours = Math.floor(counterMinutes/60);
    const counterDays = Math.floor(counterHours/24);
    if(counterMinutes >= 60){
        if (counterHours >= 24) return `${counterDays}天${counterHours%24}小時${counterMinutes%60}分鐘`;
        else return `${counterHours}小時${counterMinutes%60}分鐘`;
    }else return `${counterMinutes}分鐘`;
}

export const GetPunishCheck = () => {
    let PunishCheck;
    try {
        const data = fs.readFileSync('src/commands/punishcheck.txt', 'utf-8');
        PunishCheck = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    if(PunishCheck === 'true')
        return true;
    else if(PunishCheck == 'false')
        return false;
}

export const SavePunishCheck = (data) => {
    try {
        fs.writeFileSync('src/commands/punishcheck.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const GetMemberOnPunish = () => {
    let member;
    try {
        const data = fs.readFileSync('src/commands/memberonpunish.txt', 'utf-8');
        member = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    return member;
}

export const SaveMemberOnPunish = (data) => {
    try {
        fs.writeFileSync('src/commands/memberonpunish.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const Punishment = (member) => {
    const punishcheck = 'true';
    SavePunishCheck(punishcheck);
    SaveMemberOnPunish(member);
}

export const GetPunishStatus = () => {
    let status;
    try {
        const data = fs.readFileSync('src/commands/punishstatus.txt', 'utf-8');
        status = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    if(status === 'true')
        return true;
    else if(status == 'false')
        return false;
}

export const SavePunishStatus = (data) => {
    try {
        fs.writeFileSync('src/commands/punishstatus.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const SetPunishStatus = () =>{
    let punishstatus;
    let punishcheck = GetPunishCheck();
    let newweekcheck = GetNewWeekCheck();
    if(punishcheck === true && newweekcheck === true){
        punishstatus = 'true';  
    }
    else{
        punishstatus = 'false';
    }
    SavePunishStatus(punishstatus);
}


let counter = 0;
client.once('ready', () => { 
    client.user.setPresence({
        status: 'idle',
    });
    let channels = [];
                                            /* 目標伺服器租屋聊天室     測試伺服器測試聊天室 */ 
    channels[0] = client.channels.cache.get('1099675393335763107'/*'1043818575548391519'*/);
    channels[1] = client.channels.cache.get('1242787299511500840');
    channels[2] = client.channels.cache.get('1249401688599826504');
    let titlecontent;
    let fieldcontent;
    let fieldvalue;
    setInterval(async () => {
        const ctxTime = new Date();
        let consoleHour = ctxTime.getHours();
        let consoleMinute = ctxTime.getMinutes();
        let NewWeekCheck = GetNewWeekCheck();
        let punishcheck = GetPunishCheck();
        let punishstatus = GetPunishStatus();
        const year = ctxTime.getFullYear();
        const month = ctxTime.getMonth() + 1;
        const date = ctxTime.getDate();
        const dayOfWeek = ctxTime.getDay();
        counter+=1;
        console.log(`\n今天是${year}/${month}/${date} 周${dayOfWeek}\n程式已運行${CounterFormat(counter)}\n自動發訊目標時間 : 00:00 , 目前時間 : ${consoleHour.toString().padStart(2, '0')}:${consoleMinute.toString().padStart(2, '0')}\n排程表更新狀態 : ${NewWeekCheck}\n預定懲罰狀態 : ${punishcheck}\n成員懲罰狀態 : ${punishstatus}`);
        
        if (dayOfWeek === 1 && NewWeekCheck === false) {
            NewWeekCheck = 'true';
            SaveNewWeekCheck(NewWeekCheck);
            SetPunishStatus();
            punishstatus = GetPunishStatus();
            console.log(`偵測到換周，已更新排程表，目前排程表更新狀態 : ${NewWeekCheck}`);
            await RefreshMemberList();
            const MembersOnDuty = GetMembersOnDuty();
            console.log('自動更新功能讀取到的名單 :');
            console.log(MembersOnDuty);
            const dateinfo = GetDateInfo(ctxTime);
            if(punishstatus === true){
                let member = GetMemberOnPunish();
                if (channels[0]) {
                    channels[0].send({
                    embeds: [
                        {
                            type: 'rich',
                            title: `排程表已更新。\n本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                            description: '',
                            color: 0xFF0000,
                            fields: [
                                {
                                    "name": `${dateinfo[0]}  ${days[0]}`,
                                    "value": `${member}`,
                                    "inline": true
                                },
                                {
                                    "name": `${dateinfo[1]} ${days[1]}`,
                                    "value": `${member}`,
                                    "inline": true
                                },
                                {
                                    "name": `${dateinfo[2]} ${days[2]}`,
                                    "value": `無`,
                                    "inline": true
                                },
                                {
                                    "name": `${dateinfo[3]} ${days[3]}`,
                                    "value": `${member}`,
                                    "inline": true
                                },
                                {
                                    "name": `${dateinfo[4]} ${days[4]}`,
                                    "value": `${member}`,
                                    "inline": true
                                },
                                {
                                    "name": `${dateinfo[5]} ${days[5]}`,
                                    "value": `${member}`,
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
                                text: `由於${member}上週未完成值日工作，\n作為懲罰由他負責倒垃圾一周。\npowered by @pinjim0407`
                            }
                        }
                    ]});
                }
            }
            else{    
                if (channels[0]) {
                    channels[0].send({
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
            }
        }
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6){
            if (NewWeekCheck === true){
                NewWeekCheck = 'false';
                console.log(`已重置排程表更新狀態，目前排程表更新狀態 : ${NewWeekCheck}`);
                SaveNewWeekCheck(NewWeekCheck);
            }
            if (dayOfWeek === 0 && punishstatus === true){
                punishstatus = 'false';
                console.log(`已重置成員受罰狀態，目前成員受罰狀態 : ${punishstatus}`);
                SavePunishCheck(punishstatus);
                SavePunishStatus(punishstatus);
            }
        }
        if (/*時*/ctxTime.getHours() === 0 && /*分*/ctxTime.getMinutes() === 0) {
            const MembersOnDuty = GetMembersOnDuty();
            const struct = await GetWeatherData(8);
            const locationname = struct.data.records.location[0].locationName;
            const timeinfo1 = {starttime: struct.data.records.location[0].weatherElement[0].time[0].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[0].endTime};
            const timeinfo2 = {starttime: struct.data.records.location[0].weatherElement[0].time[1].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[1].endTime};
            const timeinfo3 = {starttime: struct.data.records.location[0].weatherElement[0].time[2].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[2].endTime};
            const dayOfWeek = ctxTime.getDay();
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
            let info = [];
            for (let i=0; i<5; i++){
                let times = ProcessWeatherData(struct.data,i);
                let [time1, time2, time3] = times;
                info[i] = {value1 : time1, value2 : time2, value3 : time3};
            }
            let infodescription = [
                { valueimage: '', comfort: '' }, 
                { valueimage: '', comfort: '' }, 
                { valueimage: '', comfort: '' }
            ];
            let str = [];
            str[0] = info[0].value1;
            str[1] = info[0].value2;
            str[2] = info[0].value3;
            for(let i=0; i<3; i++){
                if(str[i].includes('晴'))
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859471584657478/1.png?ex=664bbb42&is=664a69c2&hm=688dea48450c969ab57f5a33f348a210a45869e30cedc3b0bb3c9caa034b3d1b&=&format=webp&quality=lossless';
                else if(str[i].includes('雨') && !str[i].includes('晴'))
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859478471835769/5.png?ex=664bbb44&is=664a69c4&hm=8a7252ca6d6842177e1dca412a600b710dd4eb61e6bd1a4f882091820cedb280&=&format=webp&quality=lossless';
                else if( str[i].includes('多雲') && str[i].includes('晴'))
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859487397187745/3.png?ex=664bbb46&is=664a69c6&hm=6e10f9505e1283feb3e95f29c61c53b0f0b6b67767fddfce217803640a280fd9&=&format=webp&quality=lossless';
                else if(str[i].includes('晴') && str[i].includes('雨'))
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859483236569189/4.png?ex=664bbb45&is=664a69c5&hm=d46bcce80c070fcbdc459a967e59c1a1782dc47f3424f33a0483b0cd9be2184d&=&format=webp&quality=lossless';
                else if(str[i].includes('多雲') || str[i].includes('陰'))
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859491062874213/2.png?ex=664bbb47&is=664a69c7&hm=af9f7fbd990d1945a5419a9192949795aab2ed0c584b47f646acdf7d6209ebfb&=&format=webp&quality=lossless';
                else
                    infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241863406420754462/Lovepik_com-611699258-Error_symbol.png?ex=664bbeec&is=664a6d6c&hm=aea586a0f0cb0d0c47931a16f6c5dd59c9fccf423fc5b646aca49ca059784641&=&format=webp&quality=lossless';
            }
            if (channels[0]) {
                if(punishstatus === true){
                    let member = GetMemberOnPunish();
                    channels[0].send({
                        embeds: [
                            {
                                type: 'rich',
                                title: `今日值日 : ${member}`,
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
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: '工作內容及注意事項請使用“/排程”指令以確認。\npowered by @pinjim0407'
                                }
                            },
                        ]
                    });
                }
                else{
                    channels[0].send({
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
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: '工作內容及注意事項請使用“/排程”指令以確認。\npowered by @pinjim0407'
                                }
                            },
                        ]
                    });
                }
                channels[0].send({
                    embeds: [
                        {   
                            author: {
                                name: '中央氣象局',
                                iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png'
                            },
                            type: 'rich',
                            title: `${locationname}的三十六小時天氣預報`,
                            description: `*datas from [CWB Opendata API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001)*`,
                            image: { 
                                url : 'https://media.discordapp.net/attachments/1060629545398575255/1242117290519040070/N-Picture16.jpg?ex=664cab5f&is=664b59df&hm=1192e892d3bbc2fd23e1716d9b43c1a896b548901aa52c75778236f37d123f9a&=&format=webp&width=860&height=221'
                            },
                        },
                        {
                            type: 'rich',
                            title: `${FormatDataTimeInfo(timeinfo1)}`,
                            description: `${info[0].value1}`,
                            color: 0xADD8E6,
                            thumbnail: {
                                url: infodescription[0].valueimage
                            },
                            fields: [
                                {
                                    name: `最高${info[4].value1}℃ 最低${info[2].value1}℃`,
                                    value: `*${info[3].value1}*`,
                                },
                                {
                                    name: `降雨機率 : `,
                                    value: `${'<:blue:1240696276111196222>'.repeat((info[1].value1)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value1)/10))} *${info[1].value1}%*`,
                                },
                            ],
                        },
                        {
                            type: 'rich',
                            title: `${FormatDataTimeInfo(timeinfo2)}`,
                            description: `${info[0].value2}`,
                            color: 0x87CEEB,
                            thumbnail: {
                                url: infodescription[1].valueimage
                            },
                            fields: [
                                {
                                    name: `最高${info[4].value2}℃ 最低${info[2].value2}℃`,
                                    value: `*${info[3].value2}*`,
                                },
                                {
                                    name: `降雨機率 : `,
                                    value: `${'<:blue:1240696276111196222>'.repeat((info[1].value2)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value2)/10))} *${info[1].value2}%*`,
                                },
                            ],
                        },
                        {
                            type: 'rich',
                            title: `${FormatDataTimeInfo(timeinfo3)}`,
                            description: `${info[0].value3}`,
                            color: 0x000080,
                            thumbnail: {
                                url: infodescription[2].valueimage
                            },
                            fields: [
                                {
                                    name: `最高${info[4].value3}℃ 最低${info[2].value3}℃`,
                                    value: `*${info[3].value3}*`,
                                },
                                {
                                    name: `降雨機率 : `,
                                    value: `${'<:blue:1240696276111196222>'.repeat((info[1].value3)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value3)/10))} *${info[1].value3}%*`,
                                },
                            ],
                        }
                    ]
                });
            } else {
                console.error('無法找到指定的頻道');
            }
        }
    }, 60000);
    setInterval(async () => {
            try {
                const response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWB-427B7265-DE60-4C1F-8AD0-4E7509C741D1&format=JSON`);
                const data = await response.json();
        
                if (data.success === 'true') {
                    let lastnumber = GetEarthQuakeID();
                    const earthquakeInfo = data.records.Earthquake;
                    const lastReportTime = new Date(earthquakeInfo[0].EarthquakeInfo.OriginTime);
                    const report = earthquakeInfo[0];
                    const magnitude = report.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue;
                    const number = report.EarthquakeNo;
                    const depth = report.EarthquakeInfo.FocalDepth;
                    const location = report.EarthquakeInfo.Epicenter.Location;
                    const reportContent = report.ReportContent;
                    const reportUrl = report.Web;
                    const imageUrl = report.ReportImageURI;
                    if(number != lastnumber){
                        const areatable = [];
                        let index = 0;
                        let values = [];
                        values[0] = MagnitudeLevel(magnitude);
                        values[1] = DepthLevel(depth);
                        console.log(`value : ${values[1]}`);
                        let field = [
                            {
                            name: `地點`,
                            value: `${location}`,
                            inline: false
                            },
                            {
                            name: `地震規模 ${values[0].image}`,
                            value: `> 芮氏${magnitude}\n> ${values[0].level}`,
                            inline: true
                            },
                            {
                            name: `地震深度 ${values[1].image}`,
                            value: `> ${depth}公里\n> ${values[1].level}`,
                            inline: true
                            },
                        ];
                        for(let i=0; i<20; i++){
                            try{
                                let area = data.records.Earthquake[0].Intensity.ShakingArea[i].AreaDesc;
                                console.log(`result${i+1} : ${area}`);
                                if(area.includes('最大震度')) {
                                    areatable[index] = report.Intensity.ShakingArea[i];
                                    index += 1;
                            }
                            }catch(error){
                                console.log(`result${i+1} : ${error}`);
                            }
                        }
                        areatable.sort((a, b) => {
                            const intensityA = parseFloat(a.AreaIntensity.match(/\d+/)[0]);
                            const intensityB = parseFloat(b.AreaIntensity.match(/\d+/)[0]);
                            return intensityA - intensityB;
                        });
                        values[2] = IntensityLevel(areatable[index-1].AreaIntensity);
                        console.log(areatable);
                        let newfield = {name: `最大震度 ${values[2].image}`,value: `> ${areatable[index-1].AreaIntensity}\n> ${values[2].level}`,inline: true};
                        field.push(newfield);
                        for(let i=index-1; i>=0; i--){
                            newfield = { name: `${areatable[i].AreaDesc}`, value: `${areatable[i].CountyName}`, inline: false};
                            field.push(newfield);
                        }
                        for(let i=1; i<3; i++){
                            await channels[i].send({
                                embeds: [
                                {   
                                author: {
                                    name: '中央氣象局',
                                    iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png'
                                },
                                type: 'rich',
                                title: `**地震報告 #${number}**`,
                                url: reportUrl,
                                description: `${reportContent}`,
                                fields: field,
                                color: values[2].color,
                                image: { 
                                    url: imageUrl
                                },
                                footer: {
                                    text: `powered by @pinjim0407`
                                },
                                timestamp: lastReportTime,
                                },
                            ]});
                        }
                        lastnumber = number;
                        SaveEarthQuakeID(lastnumber);
                    }
                }
                else {
                        console.error(error);
                }
            }catch (error) {
                console.error(error);
            }
    }, 5000);
});

client.on('messageCreate', message => {
    const admin = ['631743756147752961','777508877276413952'];
    if(message.author.bot) return;
    const prefix = '!';
    if(message.content.includes(prefix+`status`) && admin.includes(message.author.id)){
        const ctxTime = new Date();
        const year = ctxTime.getFullYear();
        const month = ctxTime.getMonth() + 1;
        const date = ctxTime.getDate();
        const dayOfWeek = ctxTime.getDay();
        let consoleHour = ctxTime.getHours();
        let consoleMinute = ctxTime.getMinutes();
        try{
            message.reply(`今天是${year}/${month}/${date} 周${dayOfWeek}\n程式已運行${CounterFormat(counter)}\n自動發訊目標時間 : 00:00 , 目前時間 : ${consoleHour.toString().padStart(2, '0')}:${consoleMinute.toString().padStart(2, '0')}\n排程表更新狀態 : ${GetNewWeekCheck()}\n預定懲罰狀態 : ${GetPunishCheck()}\n成員懲罰狀態 : ${GetPunishStatus()}`);
        }catch(error){
            message.reply(`無法取得狀態\nErrCode : ${error}`);
        }
    }
    if(message.content.includes(prefix+`repeat`) && admin.includes(message.author.id)){
        message.delete();
        message.channel.send(`${message.content.substring(8)}`);
    }
    else if(message.content.includes(prefix) && !admin.includes(message.author.id)){ 
        message.reply(`您沒有權限進行此互動。`);
    }
});

client.login(process.env.TOKEN)