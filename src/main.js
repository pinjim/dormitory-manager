import { Client, Events, GatewayIntentBits } from 'discord.js'
import vueInit from '@/core/vue'
import dotenv from 'dotenv'
import { loadCommands, loadEvents } from '@/core/loader'
import { useAppStore } from '@/store/app'
import { 
    GetDateInfo, 
    GetMemberList, 
    SaveMemberList, 
    GetIndex, 
    SaveIndex, 
    GetNewWeekCheck,
    SaveNewWeekCheck,
    SetSchedule,
    SetEmbedContent,
    GetMemberRole
} from './commands/datas/functions'

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

client.once('ready', () => { 
    client.user.setPresence({
        status: 'idle',
    });
                                            /* 目標伺服器租屋聊天室     測試伺服器測試聊天室 */ 
    const channel = client.channels.cache.get('1099675393335763107'/*'1043818575548391519'*/);
    setInterval(async () => {
        const ctxTime = new Date();
        const year = ctxTime.getFullYear();
        const month = ctxTime.getMonth() + 1;
        const date = ctxTime.getDate();
        let NewWeekCheck = GetNewWeekCheck();
        const dayOfWeek = ctxTime.getDay();

        if (dayOfWeek === 1 && NewWeekCheck === false) {
            SaveMemberList(`左仲凱,黃智祥,蘇翊嘉,黃品鈞,李臸宇,張桂嘉`);
            NewWeekCheck = 'true';
            SaveNewWeekCheck(NewWeekCheck);
            console.log(`偵測到換週，已更新排程表，目前排程表更新狀態 : ${NewWeekCheck}`);
            const schedule = await SetSchedule(1);
            const dateinfo = GetDateInfo(ctxTime);
            try{ 
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
                            timestamp: ctxTime.toISOString(),
                            footer: {
                                text: '排程表更新為自動產生，人員排序可能無法配合實際情形。\n若發生無法配合的狀況，請使用“/換班”指令來安排適合的值日排班。\npowered by @pinjim0407'
                            }
                        }
                    ]
                });
                }
            }catch(error){
                console.log(`${error}`);
            }
        }
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6){
            if (NewWeekCheck === true){
                NewWeekCheck = 'false';
                console.log(`已重置排程表更新狀態，目前排程表更新狀態 : ${NewWeekCheck}`);
                SaveNewWeekCheck(NewWeekCheck);
            }
        }
        if (/*時*/ctxTime.getHours() === 0 && /*分*/ctxTime.getMinutes() === 0) {
            try{
                let index = GetIndex();
                const memberlist = GetMemberList();
                
                const embedcontent = SetEmbedContent(dayOfWeek);
                if (channel) {
                    channel.send({
                        embeds: [
                            {
                                type: 'rich',
                                title: `${year}/${month}/${date} ${embedcontent.title}`,
                                description: '',
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
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: '工作內容及注意事項請使用“/排程”指令以確認。\npowered by @pinjim0407'
                                }
                            },
                        ]
                    });
                }else {
                    throw new Error(`無法找到指定的頻道`);
                }
                if(dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek ===5){
                    if(index+1>memberlist.length-1) SaveIndex(0);
                    else SaveIndex(index+1);
                }
            }catch(error){
                console.log(`${error}`);
            }
        }
    }, 60000);
});

client.login(process.env.TOKEN)