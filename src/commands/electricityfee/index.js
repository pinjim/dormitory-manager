import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
    .setName('電費')
    .setDescription('計算電費的分配')
    .addIntegerOption(option =>
        option.setName('fee1')
            .setDescription('一二樓電費金額')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('fee2')
            .setDescription('三四樓電費金額')
            .setRequired(true));

export const action = async (ctx) => {
    const ctxTime = new Date();
    const fee1 = ctx.options.getInteger('fee1');
    const fee2 = ctx.options.getInteger('fee2');
    let publicfee = Math.round(fee1 * 0.6/7);
    let sfjroom = Math.round(fee1 * 0.1);
    let sfsroom = Math.round(fee1 * 0.3);
    let tfbroom1 = Math.round(fee2 * 0.15);
    let tfbroom2 = Math.round(fee2 * 0.15);
    let tfsroom = Math.round(fee2 * 0.2);
    let ffbroom = Math.round(fee2 * 0.3);
    let ffsroom = Math.round(fee2 * 0.2);
    let value = (((sfjroom + publicfee + sfsroom + publicfee + tfsroom + publicfee + tfbroom1 + publicfee + tfbroom2 + publicfee + ffsroom + publicfee + ffbroom + publicfee) - (fee1 + fee2)) / (fee1 + fee2) * 100).toFixed(3);
    let formattedValue = value >= 0 ? `+${value}` : value;

    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `電費`,
                description: `1/2樓 ${fee1}(公用60%、小間30%、和室10%)\n3/4樓 ${fee2}(大間30%、小間20%)\n`,
                color: 0x00FFFF,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**公用電**`,
                        "value": `${fee1} * 0.6 / 7 ≒ ${publicfee}`,
                    },
                    {
                        "name": `**左仲凱**`,
                        "value": `(二樓和室 + 公用電)\t*${sfjroom} + ${publicfee} ≒ ${sfjroom+publicfee}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `(二樓小間 + 公用電)\t*${sfsroom} + ${publicfee} ≒ ${sfsroom+publicfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `(三樓小間 + 公用電)\t*${tfsroom} + ${publicfee} ≒ ${tfsroom+publicfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `(三樓大間/2 + 公用電)\t*${tfbroom1} + ${publicfee} ≒ ${tfbroom1+publicfee}*`,
                    },
                    {
                        "name": `**吳宇璿**`,
                        "value": `(三樓大間/2 + 公用電)\t*${tfbroom2} + ${publicfee} ≒ ${tfbroom2+publicfee}*`,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `(四樓小間 + 公用電)\t*${ffsroom} + ${publicfee} ≒ ${ffsroom+publicfee}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `(四樓大間 + 公用電)\t*${ffbroom} + ${publicfee} ≒ ${ffbroom+publicfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee1} + ${fee2} = ${fee1+fee2}*\n實收 *${sfjroom+publicfee} + ${sfsroom+publicfee} + ${tfsroom+publicfee} + ${tfbroom1+publicfee} + ${tfbroom2+publicfee} + ${ffsroom+publicfee} + ${ffbroom+publicfee} = ${sfjroom+publicfee+sfsroom+publicfee+tfsroom+publicfee+tfbroom1+publicfee+tfbroom2+publicfee+ffsroom+publicfee+ffbroom+publicfee}*\n誤差比例 *${formattedValue}%*`,
                    },
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: '計算後的費用為四捨五入至整數的值，可能和實際情形不同。\n若計算誤差比例超過±1%則建議使用人工計算。\npowered by @pinjim0407'
                }
            }
        ]
    });
}