import { SlashCommandBuilder } from 'discord.js';
import { GetDateInfo, GetMemberList, SaveMemberList, SetSchedule, GetMemberRole } from '../datas/functions';

export const command = new SlashCommandBuilder()
    .setName('換班')
    .setDescription('和其他成員換班')
    .addStringOption(option =>
        option.setName('member1')
            .setDescription('第一位交換對象')
            .setRequired(true)
            .addChoices(
                { name: '左仲凱', value: '左仲凱' },
				{ name: '黃智祥', value: '黃智祥' },
				{ name: '黃品鈞', value: '黃品鈞' },
				{ name: '蘇翊嘉', value: '蘇翊嘉' },
                { name: '張桂嘉', value: '張桂嘉' },
                { name: '李臸宇', value: '李臸宇' },
            ))
    .addStringOption(option =>
        option.setName('member2')
            .setDescription('第二位交換對象')
            .setRequired(true)
            .addChoices(
                { name: '左仲凱', value: '左仲凱' },
				{ name: '黃智祥', value: '黃智祥' },
				{ name: '黃品鈞', value: '黃品鈞' },
				{ name: '蘇翊嘉', value: '蘇翊嘉' },
                { name: '張桂嘉', value: '張桂嘉' },
                { name: '李臸宇', value: '李臸宇' },
            )); 

export const action = async (ctx) => {
    try{
        const ctxTime = new Date();
        const dayOfWeek = ctxTime.getDay();
        const dateinfo = GetDateInfo(ctxTime);
        let list = [];
        let member = [];
        let index = [];
        list.push(await SetSchedule(dayOfWeek));
        list.push(GetMemberList());
        member.push(ctx.options.getString('member1'));
        member.push(ctx.options.getString('member2'));
        if(member[0] === member[1]) throw new Error(`無法選擇相同成員作為換班對象。`);
        for(let k=0; k<2; k++){
            for(let i=0; i<2; i++){
                for(let j=0; j<list[k].length; j++){
                    console.log(`目標 : ${member[i]}; 比較對象 : ${list[k][j]}`);
                    if(member[i] === list[k][j]){
                        index[i+(k*2)] = j;
                        console.log(`index[${i+(k*2)}] : ${index[i+(k*2)]}`);
                        break;
                    } 
                    else if(j === list[k].length-1) throw new Error(`${member[i]}不在本週排班中。`);
                }
            }
        }
        let save;
        for(let i=0; i<2; i++){
            save = list[i][index[0+(i*2)]];
            list[i][index[0+(i*2)]] = list[i][index[1+(i*2)]];
            list[i][index[1+(i*2)]] = save;
            console.log(`更新後的名單${i}`);
            console.log(list[i]);
        }
        SaveMemberList(list[1].join(','));
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `${member[0]}和${member[1]}進行了換班，排程表已更新。\n本週排程表 (${dateinfo[0]} ~ ${dateinfo[6]})`,
                    description: '',
                    color: 0xFFA500,
                    fields: [
                        {
                            "name": `${dateinfo[0]} 週一`,
                            "value": `> <@&${GetMemberRole(list[0][0])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[1]} 週二`,
                            "value": `> <@&${GetMemberRole(list[0][1])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[2]} 週三`,
                            "value": `> 無`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[3]} 週四`,
                            "value": `> <@&${GetMemberRole(list[0][2])}>`,
                            "inline": true
                        },
                        {
                            "name": `${dateinfo[4]} 週五`,
                            "value": `> <@&${GetMemberRole(list[0][3])}>`,
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
                        text: 'powered by @pinjim0407'
                    }
                }
            ]
        });
    }catch(error){
        console.log(error);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `換班指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
}