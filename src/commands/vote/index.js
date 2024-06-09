import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, SlashCommandBuilder } from 'discord.js';
import { errorMessages } from 'vue/compiler-sfc';

export const command = new SlashCommandBuilder()
    .setName('投票')
    .setDescription('發起新全員投票')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('投票主題')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('options')
            .setDescription('自訂義選項，選項間用空格隔開 (最多五個選項，預設為"同意"&"不同意")')
            .setRequired(false))
    .addIntegerOption(option =>
         option.setName('private')
            .setDescription('是否為私密投票 (預設為否)')
            .setRequired(false)
            .addChoices(
                { name: '是', value: 0 },
                { name: '否', value: 1 },
        ));

export const action = async (ctx) => {
    const ctxTime = new Date();
    const votedUsers = new Set();
    const name = ctx.options.getString('name');
    const options = ctx.options.getString('options');
    const privateset = ctx.options.getInteger('private');
    let option;
    let row;
    let buttons = [];
    let length;
    let voteresult = [];
    let privatevalue = false;
    let descriptioncontent = '';
    if (privateset === 0){
        privatevalue = true;
        descriptioncontent = '∙ 所有人都可以進行投票\n∙ 此投票不會公開成員選擇的選項\n∙ 每位成員只能選擇一個選項\n∙ 不能改投其他選項\n∙ 投票將在發起五分鐘後自動結算';
    }
    else if (privateset === 1){
        privatevalue = false;
        descriptioncontent = '∙ 所有人都可以進行投票\n∙ 每位成員只能選擇一個選項\n∙ 不能改投其他選項\n∙ 投票將在發起五分鐘後自動結算';
    }
    //自訂選項
    if (options != null) {
        option = options.split(" ");
        length = option.length;
        if (length > 5) {
            ctx.reply({
                embeds: [
                {
                    author: {
                        name: ctx.user.username,
                        iconURL: ctx.user.avatarURL()
                    },
                    type: 'rich',
                    title: `**無法發起投票!**`,
                    description: '自訂義的選項數量超過上限。',
                    color: 0xFF0000,
                    timestamp: ctxTime.toISOString(),
                    footer: {
                        text: 'powered by @pinjim0407'
                    }
                }
                ]
            });
            return;
        }
        else {
            let i = 0;
            while (option[i] != null) {
                voteresult[i] = 0;
                buttons[i] = new ButtonBuilder()
                    .setCustomId(`${option[i]}`)
                    .setLabel(`${option[i]}`)
                    .setStyle(ButtonStyle.Primary);
                i += 1;
            }
            
        }
    }
    //無自訂選項
    else {
        option = ['同意','不同意'];
        length = 2;
        voteresult[0] = 0;
        voteresult[1] = 0;
        buttons[0] = new ButtonBuilder()
            .setCustomId(`${option[0]}`)
            .setLabel(`${option[0]}`)
            .setStyle(ButtonStyle.Success);

        buttons[1] = new ButtonBuilder()
            .setCustomId(`${option[1]}`)
            .setLabel(`${option[1]}`)
            .setStyle(ButtonStyle.Danger);
    }

    row = new ActionRowBuilder()
        .addComponents(buttons);
    const message = await ctx.reply({
        embeds: [
            {
                author: {
                    name: ctx.user.username,
                    iconURL: ctx.user.avatarURL()
                },
                type: 'rich',
                title: `**${name}**`,
                description: descriptioncontent,
                color: 0x00FFFF,
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: 'powered by @pinjim0407'
                }
            }
        ],
        components: [row],
    });

    const collectorFilter = async(interaction) => {
        if (votedUsers.has(interaction.user.id)) {
            try{
                await interaction.reply({ 
                    embeds: [
                    {
                        author: {
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        },
                        type: 'rich',
                        title: `你已經投過票了`,
                        description: ``,
                        color: 0xFF0000,
                        timestamp: ctxTime.toISOString(),
                        footer: {
                            text: 'powered by @pinjim0407'
                        }
                    }],
                    ephemeral: true
                });
                return false;
            }catch(error){
                console.log(error);
            }    
        }
        return true;
    };
    const collector = message.createMessageComponentCollector({ filter: collectorFilter, time: 300_000 });

    collector.on('collect', async (interaction) => {
        try {
            votedUsers.add(interaction.user.id);
            for (let j = 0; j < length; j++) {
                if (interaction.customId === option[j]) {
                    voteresult[j] += 1;
                    await interaction.reply({
                        embeds: [
                        {
                            author: {
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            },
                            type: 'rich',
                            title: `投票完成`,
                            description: `投給了 **${option[j]}**`,
                            color: 0x00FF00,
                            timestamp: ctxTime.toISOString(),
                            footer: {
                                text: 'powered by @pinjim0407'
                            }
                        }
                    ],
                    ephemeral: privatevalue
                });
                }
            }
        } catch (error) {
            console.error(error);
            await ctx.editReply({ content: `投票出現問題。\n${errorMessages}`, embeds: [],components: [] });
        }
    });
    collector.on('end', async () => {
        console.log(`互動收集器已關閉。\n`)
        let fields = [];
        let total = 0;
        let max = 0;
        let maxindex = -1;
        let description = '';
        for (let i = 0; i < length; i++) {
            total += voteresult[i];
            if (voteresult[i] > max){
                max = voteresult[i];
                maxindex = i;
                description = `**最高票為 ${option[i]}**`;
            }
            else if (maxindex === -1){
                description = `**無人投票**`;
            }
            else if (voteresult[i] === max){
                description = `**${option[maxindex]}和${option[i]}平票**`;
                maxindex = i;
            }
        }
        for (let j = 0; j < length; j++) {
            let percentage = total !== 0 ? (voteresult[j] / total) : 0;
            let bluenumber = Math.round(percentage*10);
            let blue = '<:blue:1240696276111196222>'.repeat(bluenumber*2);
            let gray = '<:gray:1240701126903599187>'.repeat((10-bluenumber)*2);
            fields.push({
                name: `*${option[j]} : ${voteresult[j]}票(${Math.round((percentage)*100)}%)*`,
                value: `${blue+gray}`
            });
        }
        await ctx.editReply({ 
            embeds: [
            {
                author: {
                    name: ctx.user.username,
                    iconURL: ctx.user.avatarURL()
                },
                type: 'rich',
                title: `${name}的投票結果`,
                description: description,
                color: 0x00FFFF,
                fields: fields,
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: 'powered by @pinjim0407'
                }
            }
            ],
            components: [] 
        });
    });
}
