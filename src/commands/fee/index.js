import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export const command = new SlashCommandBuilder()
    .setName('帳單')
    .setDescription('計算帳單的分配')
    .addIntegerOption(option =>
        option.setName('feetype')
            .setDescription('帳單類型')
            .setRequired(true)
            .addChoices(
                { name: '電費', value: 0},
				{ name: '水費', value: 1},
				{ name: '網路費', value: 2 },
                { name: '瓦斯費', value: 3 },
                { name: '負責繳下張帳單的成員', value: 4 },
            ))
    .addIntegerOption(option =>
        option.setName('fee1')
            .setDescription('金額一')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('fee2')
            .setDescription('金額二 (只有電費需要用到)')
            .setRequired(false));

const ctxTime = new Date();
const memberlist = [`左仲凱`,`黃智祥`,`蘇翊嘉`,`黃品鈞`,`李臸宇`,`張桂嘉`];

export const GetFeeIndex = () => {
    let index;
    try {
        const data = fs.readFileSync('src/commands/feeindex.txt', 'utf-8');
        index = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    switch(index){
        case `0`:
            return 0;
        case `1`:
            return 1;
        case `2`:
            return 2;
        case `3`:
            return 3;
        case `4`:
            return 4;
        case `5`:
            return 5;
        case `6`:
            return 0;
        default :
            throw new Error(`未知的標籤`);
    }
}

export const SaveFeeIndex = (data) => {
    const formateddata = data.toString();
    try {
        fs.writeFileSync('src/commands/feeindex.txt', formateddata, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const WaterFee = (fee) => {
    let index = GetFeeIndex();
    let yuu = Math.round(fee * 0.2);
    let dama = Math.round(fee * 0.18);
    let ironmusk = Math.round(fee * 0.17);
    let defaultfee = Math.round(fee * 0.15);
    let value = (((yuu + dama + ironmusk + (defaultfee * 3)) - fee) / fee * 100).toFixed(3);
    let formattedValue ;
    if(value === 0) formattedValue = 0;
    else formattedValue = value > 0 ? `+${value}` : value;
    let color = 0x00FFFF;
    if(parseFloat(formattedValue)>1||parseFloat(formattedValue<-1)) color = 0xFF0000;
    let embed = {
        embeds: [
            {
                type: 'rich',
                title: `水費 ${memberlist[index]}負責繳費`,
                description: ``,
                color: color,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `(20%) *${yuu}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `(18%) *${dama}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `(17%) *${ironmusk}*`,
                    },
                    {
                        "name": `**左仲凱**`,
                        "value": `(15%) *${defaultfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `(15%) *${defaultfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `(15%) *${defaultfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee}*\n實收 *${yuu} + ${dama} + ${ironmusk} + ${defaultfee} + ${defaultfee} + ${defaultfee} = ${yuu+dama+ironmusk+(defaultfee*3)}*\n誤差比例 *${formattedValue}%*`,
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: '計算後的費用為四捨五入至整數的值，可能和實際情形不同。\n若計算誤差比例超過±1%則建議使用人工計算。\npowered by @pinjim0407'
                }
            }
        ]
    }
    index += 1;
    SaveFeeIndex(index);
    return embed;
}

export const ElectricityFee = (fee1, fee2) => {
    let index = GetFeeIndex();
    let publicfee = Math.round(fee1 * 0.6/6);
    let sfjroom = Math.round(fee1 * 0.1);
    let sfsroom = Math.round(fee1 * 0.3);
    let tfbroom = Math.round(fee2 * 0.3);
    let tfsroom = Math.round(fee2 * 0.2);
    let ffbroom = Math.round(fee2 * 0.3);
    let ffsroom = Math.round(fee2 * 0.2);
    let value = (((sfjroom + publicfee + sfsroom + publicfee + tfsroom + publicfee + tfbroom + publicfee + ffsroom + publicfee + ffbroom + publicfee) - (fee1 + fee2)) / (fee1 + fee2) * 100).toFixed(3);
    let formattedValue ;
    if(value === 0) formattedValue = 0;
    else formattedValue = value > 0 ? `+${value}` : value;
    let color = 0x00FFFF;
    if(parseFloat(formattedValue)>1||parseFloat(formattedValue<-1)) color = 0xFF0000;
    let embed = {
        embeds: [
            {
                type: 'rich',
                title: `電費 ${memberlist[index]}負責繳費`,
                description: `1/2樓 ${fee1}(公用60%、小間30%、和室10%)\n3/4樓 ${fee2}(大間30%、小間20%)\n`,
                color: color,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**公用電**`,
                        "value": `${fee1} * 0.6 / 6 ≒ ${publicfee}`,
                    },
                    {
                        "name": `**左仲凱**`,
                        "value": `(二樓和室 + 公用電) *${sfjroom} + ${publicfee} ≒ ${sfjroom+publicfee}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `(二樓小間 + 公用電) *${sfsroom} + ${publicfee} ≒ ${sfsroom+publicfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `(三樓小間 + 公用電) *${tfsroom} + ${publicfee} ≒ ${tfsroom+publicfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `(三樓大間 + 公用電) *${tfbroom} + ${publicfee} ≒ ${tfbroom+publicfee}*`,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `(四樓小間 + 公用電) *${ffsroom} + ${publicfee} ≒ ${ffsroom+publicfee}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `(四樓大間 + 公用電) *${ffbroom} + ${publicfee} ≒ ${ffbroom+publicfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee1} + ${fee2} = ${fee1+fee2}*\n實收 *${sfjroom+publicfee} + ${sfsroom+publicfee} + ${tfsroom+publicfee} + ${tfbroom+publicfee} + ${ffsroom+publicfee} + ${ffbroom+publicfee} = ${sfjroom+publicfee+sfsroom+publicfee+tfsroom+publicfee+tfbroom+publicfee+ffsroom+publicfee+ffbroom+publicfee}*\n誤差比例 *${formattedValue}%*`,
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: '計算後的費用為四捨五入至整數的值，可能和實際情形不同。\n若計算誤差比例超過±1%則建議使用人工計算。\npowered by @pinjim0407'
                }
            }
        ]
    }
    index += 1;
    SaveFeeIndex(index);
    return embed;
}

export const GasFee = (fee) => {
    let index = GetFeeIndex();
    let defaultfee = Math.round(fee/6);
    let value = (((defaultfee*6-fee)/fee)*100).toFixed(3);
    let formattedValue ;
    if(value === 0) formattedValue = 0;
    else formattedValue = value > 0 ? `+${value}` : value;
    let color = 0x00FFFF;
    if(parseFloat(formattedValue)>1||parseFloat(formattedValue<-1)) color = 0xFF0000;
    let embed = {
        embeds: [
            {
                type: 'rich',
                title: `瓦斯費 ${memberlist[index]}負責繳費`,
                description: ``,
                color: color,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**左仲凱**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee}*\n實收 *${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} = ${defaultfee*6}*\n誤差比例 *${formattedValue}%*`,
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: '計算後的費用為四捨五入至整數的值，可能和實際情形不同。\n若計算誤差比例超過±1%則建議使用人工計算。\npowered by @pinjim0407'
                }
            }
        ]
    }
    index += 1;
    SaveFeeIndex(index);
    return embed;
}

export const NetworkFee = (fee) => {
    let index = GetFeeIndex();
    let defaultfee = Math.round(fee/5);
    let value = (((defaultfee*5-fee)/fee)*100).toFixed(3);
    let formattedValue ;
    if(value === 0) formattedValue = 0;
    else formattedValue = value > 0 ? `+${value}` : value;
    let color = 0x00FFFF;
    if(parseFloat(formattedValue)>1||parseFloat(formattedValue<-1)) color = 0xFF0000;
    let embed = {
        embeds: [
            {
                type: 'rich',
                title: `網路費 ${memberlist[index]}負責繳費`,
                description: ``,
                color: color,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `*${defaultfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee}*\n實收 *${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} = ${defaultfee*5}*\n誤差比例 *${formattedValue}%*`,
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: '計算後的費用為四捨五入至整數的值，可能和實際情形不同。\n若計算誤差比例超過±1%則建議使用人工計算。\npowered by @pinjim0407'
                }
            }
        ]
    }
    index += 1;
    SaveFeeIndex(index);
    return embed;
}

export const action = async(ctx) => {
    try{
        const feetype = ctx.options.getInteger('feetype');
        const fee1 = ctx.options.getInteger('fee1');
        const fee2 = ctx.options.getInteger('fee2');
        switch(feetype){
            case 0:
                if(fee1===null||fee2===null) throw new Error(`計算電費分配必須有兩個費用金額(一二樓及三四樓)`); 
                else if(fee1<0||fee2<0) throw new Error(`費用不可小於0`); 
                else await ctx.reply(ElectricityFee(fee1, fee2));
                break;
            case 1:
                if(fee1<0) throw new Error(`費用不可小於0`); 
                else await ctx.reply(WaterFee(fee1));
                break;
            case 2:
                if(fee1<0) throw new Error(`費用不可小於0`); 
                else await ctx.reply(NetworkFee(fee1));
                break;
            case 3:
                if(fee1<0) throw new Error(`費用不可小於0`); 
                else await ctx.reply(GasFee(fee1));
                break;
            case 4:
                await ctx.reply({
                    embeds: [
                        {
                            type: 'rich',
                            title: `需負責繳下張帳單的是**${memberlist[GetFeeIndex()]}**`,
                            description: ``,
                            color: 0x00FFFF,
                        }
                    ]
                });
                break;
        }
    }catch(error){
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `帳單計算錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
}