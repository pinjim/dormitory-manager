import { SlashCommandBuilder } from 'discord.js';
import { GetMemberList, GetMemberRole, SetSchedule } from '../datas/functions';
import { GetFeeIndex } from '../fee';

export const command = new SlashCommandBuilder()
    .setName('名單')
    .setDescription('查看名單和細項');

const DutyStatus = async(target) =>{
    const dayOfWeek = new Date().getDay();
    const schedule = await SetSchedule(dayOfWeek);
    console.log(schedule)
    for(let i=0; i<schedule.length; i++){
        if(schedule[i] === target){
            switch(i){
                case 0:
                    return `週一`;
                case 1:
                    return `週二`;
                case 2:
                    return `週四`;
                case 3:
                    return `週五`;
            }     
        }
    }
    return `無`; 
}

const FeeStatus = (target) => {
    const feeindex = GetFeeIndex();
    const memberlist = GetMemberList();
    if(memberlist[feeindex] === target) return `下一張`;
    else return `無`;
}

export const action = async(ctx) => {
    try{
        const currentTime = new Date();
        const memberlist = GetMemberList();
        let description = [];
        let fieldvalue;
        for(let i=0; i<memberlist.length; i++){
            if(memberlist[i] === `左仲凱`){
                fieldvalue = `
                    **名單號碼 [${i}] : <@&${GetMemberRole(memberlist[i])}>**
                    > 帳單分配 [** 電費, 水費, 瓦斯費 **]
                    > 負責值日 [** ${await DutyStatus(memberlist[i])} **]
                    > 負責帳單 [** ${FeeStatus(memberlist[i])} **]
                `
            }
            else{
                fieldvalue = `
                    **名單號碼 [${i}] : <@&${GetMemberRole(memberlist[i])}>**
                    > 帳單分配 [** 電費, 水費, 網路費, 瓦斯費 **]
                    > 負責值日 [** ${await DutyStatus(memberlist[i])} **]
                    > 負責帳單 [** ${FeeStatus(memberlist[i])} **]
                `
            }
            description.push(fieldvalue);
        }
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `成員名單`,
                    escription: '',
                    color: 0x00FFFF,
                    fields: [
                        {
                            "name": ``,
                            "value": `${description[0]}`                        
                        },
                        {
                            "name": ``,
                            "value": `${description[1]}`                        
                        },
                        {
                            "name": ``,
                            "value": `${description[2]}`                        
                        },
                        {
                            "name": ``,
                            "value": `${description[3]}`                        
                        },
                        {
                            "name": ``,
                            "value": `${description[4]}`                        
                        },
                        {
                            "name": ``,
                            "value": `${description[5]}`                        
                        },
                    ],
                    timestamp: currentTime.toISOString(),
                    footer: {
                        text: 'powered by @pinjim0407'
                    }
                }
            ],
        })
    }catch(error){
        console.log(error);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `名單指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
}