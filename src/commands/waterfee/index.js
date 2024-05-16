import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
    .setName('水費')
    .setDescription('計算水費的分配')
    .addIntegerOption(option =>
        option.setName('fee')
            .setDescription('水費金額')
            .setRequired(true));

export const action = async (ctx) => {
    const ctxTime = new Date();
    const fee = ctx.options.getInteger('fee');
    let yuu = Math.round(fee * 0.18);
    let dama = Math.round(fee * 0.16);
    let ironmusk = Math.round(fee * 0.15);
    let defaultfee = Math.round(fee * 0.13);
    let value = (((yuu + dama + ironmusk + (defaultfee * 4)) - fee) / fee * 100).toFixed(3);
    let formattedValue = value >= 0 ? `+${value}` : value;
    await ctx.reply({
        embeds: [
            {
                type: 'rich',
                title: `水費`,
                description: ``,
                color: 0x00FFFF,
                fields: [
                    {
                        "name": `**-------------------------------------------**`,
                        "value": ``,
                    },
                    {
                        "name": `**李臸宇**`,
                        "value": `(18%)\t*${yuu}*`,
                    },
                    {
                        "name": `**黃智祥**`,
                        "value": `(16%)\t*${dama}*`,
                    },
                    {
                        "name": `**張桂嘉**`,
                        "value": `(15%)\t*${ironmusk}*`,
                    },
                    {
                        "name": `**左仲凱**`,
                        "value": `(13%)\t*${defaultfee}*`,
                    },
                    {
                        "name": `**蘇翊嘉**`,
                        "value": `(13%)\t*${defaultfee}*`,
                    },
                    {
                        "name": `**黃品鈞**`,
                        "value": `(13%)\t*${defaultfee}*`,
                    },
                    {
                        "name": `**吳宇璿**`,
                        "value": `(13%)\t*${defaultfee}*`,
                    },
                    {
                        "name": `**-------------------------------------------**`,
                        "value": `應收 *${fee}*\n實收 *${yuu} + ${dama} + ${ironmusk} + ${defaultfee} + ${defaultfee} + ${defaultfee} + ${defaultfee} = ${yuu+dama+ironmusk+(defaultfee*4)}*\n誤差比例 *${formattedValue}%*`,
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