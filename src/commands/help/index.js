import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, Component, ComponentType, ActionRowBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
    .setName('幫助')
    .setDescription('取得指令的協助')

const menu = new StringSelectMenuBuilder()
    .setCustomId('starter')
    .setPlaceholder('請選擇需要協助的指令')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('值日')
            .setDescription('查看今日的值日')
            .setValue(`0`),
        new StringSelectMenuOptionBuilder()
            .setLabel('排程')
            .setDescription('查看這週的排程')
            .setValue(`1`),
        new StringSelectMenuOptionBuilder()
            .setLabel('換班')
            .setDescription('和其他成員換班')
            .setValue(`2`),
        new StringSelectMenuOptionBuilder()
            .setLabel('名單')
            .setDescription('查看名單和細項')
            .setValue(`3`),
        new StringSelectMenuOptionBuilder()
            .setLabel('帳單')
            .setDescription('計算帳單的分配')
            .setValue(`4`),
        new StringSelectMenuOptionBuilder()
            .setLabel('公告')
            .setDescription('新增聊天室公告')
            .setValue(`5`),
        new StringSelectMenuOptionBuilder()
            .setLabel('晚餐')
            .setDescription('今天晚餐吃什麼')
            .setValue(`6`),
    );

const row = new ActionRowBuilder()
    .addComponents(menu);


export const action = async(ctx) => {
    try {
        const ctxTime = new Date();
        const response = await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `指令使用協助`,
                    description: '請在下拉式選單選擇需要協助的指令',
                    color: 0x00FFFF,
                    timestamp: ctxTime.toISOString(),
                    footer: {
                        text: 'powered by @pinjim0407'
                    }
                },
            ],
            components:[row]
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
        collector.on('collect', async i => {
            const selection = i.values[0];
            switch(selection){
                case `0`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `值日`,
                                description: '</值日:1231495900627734580> - 可以查看當天的值日成員',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `無引數`,
                                        "value": `--------------------------------------------------------`
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*查看今日的值日*\n> `/值日`'
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;
                case `1`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `排程`,
                                description: '</排程:1231495900627734579> - 可以查看本週的值日排程',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                    "name": `無引數`,
                                    "value": `--------------------------------------------------------`
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*查看這週的排程*\n> `/排程`'
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;
                case `2`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `換班`,
                                description: '</換班:1238830882857422849> - 可以將給定的兩位成員值日日期互換',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `引數`,
                                        "value": ``
                                    },
                                    {
                                        "name": `member1`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **給定第一個換班成員**
                                        `
                                    },
                                    {
                                        "name": `member2`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **給定第二個換班成員**
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `注意事項`,
                                        "value": `
                                            > 1 : 兩個成員必須在本周排班表內
                                            > 2 : 不可選擇同個成員作為換班對象
                                            > 3 : 選擇的兩位成員先後順序不影響結果
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*如果要讓**黃品鈞**和**張桂嘉**換班*\n> `/換班 member1:黃品鈞 member2:張桂嘉`'
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;   
                case `3`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `名單`,
                                description: '</名單:1287045744817340520> - 可以查看成員名單以及有無負責值日或繳費',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `無引數`,
                                        "value": `--------------------------------------------------------`
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*查看名單和細項*\n> `/名單`'
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;  
                case `4`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `帳單`,
                                description: '</帳單:1252866807145037905> - 可以自動計算帳單金額分配及分配繳費成員',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `引數`,
                                        "value": ``
                                    },
                                    {
                                        "name": `feetype`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **給定帳單種類**
                                        `
                                    },
                                    {
                                        "name": `fee1`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **數值**
                                            > 用途 : **給定第一筆帳單費用**
                                        `
                                    },
                                    {
                                        "name": `fee2`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **數值**
                                            > 用途 : **給定第二筆帳單費用**
                                            > 備註 : **只有計算電費會用到**
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `注意事項`,
                                        "value": `
                                            > 1 : 計算電費時fee1為一二樓費用 fee2為三四樓費用
                                            > 2 : 計算費用後顯示誤差超過±1%則建議人工計算
                                            > 3 : 要查看負責下一張帳單的成員時fee1輸入0即可
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*如果要計算網路費(1299)*\n> `/帳單 feetype:網路費 fee1:1299`\n*如果要計算電費(1000、2000)*\n> `/帳單 feetype:電費 fee1:1000 fee2:2000`\n*如果要查看下位繳費成員*\n> `/帳單 feetype:負責繳下張帳單的成員 fee1:0`'
                                            
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;  
                case `5`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `公告`,
                                description: '</公告:1287045744817340519> - 可以讓機器人在伺服器中張貼嵌入內容',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `引數`,
                                        "value": ``
                                    },
                                    {
                                        "name": `title`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **字串**
                                            > 用途 : **給定嵌入內容標題**
                                        `
                                    },
                                    {
                                        "name": `field1`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **決定是否啟用第一段內文**
                                        `
                                    },
                                    {
                                        "name": `field2`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **決定是否啟用第二段內文**
                                        `
                                    },
                                    {
                                        "name": `field3`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **決定是否啟用第三段內文**
                                        `
                                    },
                                    {
                                        "name": `title_url`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定標題連結**
                                        `
                                    },
                                    {
                                        "name": `description`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定標題敘述**
                                        `
                                    },
                                    {
                                        "name": `field1_name`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第一段內文標題**
                                        `
                                    },
                                    {
                                        "name": `field1_value`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第一段內文敘述**
                                            > 備註 : **不可換行**
                                        `
                                    },
                                    {
                                        "name": `field2_name`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第二段內文標題**
                                        `
                                    },
                                    {
                                        "name": `field2_value`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第二段內文敘述**
                                            > 備註 : **不可換行**
                                        `
                                    },
                                    {
                                        "name": `field3_name`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第三段內文標題**
                                        `
                                    },
                                    {
                                        "name": `field3_value`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定第三段內文敘述**
                                            > 備註 : **不可換行**
                                        `
                                    },
                                    {
                                        "name": `image_url`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **給定嵌入內容內嵌圖片網址**
                                            > 備註 : **因API問題可能會有死圖的狀況**
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `注意事項`,
                                        "value": `
                                            > 1 : 可以三段內文都不啟用
                                            > 2 : 可以不按照順序啟用內文
                                            > 2 : 可以只啟用第一段、第二段或第三段任意一段內文
                                            > 4 : 若啟用內文則必須輸入對應內文標題和敘述
                                            > 5 : 若有輸入內文標題和敘述則必須啟用對應內文
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*如果要發送一個*\n*標題為**標題***\n*敘述為**敘述***\n*啟用了第一段內文*\n*內文標題為**內文標題***\n*內文敘述為**內文敘述***\n的伺服器公告的話\n> `/公告 title: 標題\n> field1: ture\n> field2: false\n> field3: false\n> description: 敘述\n> field1_name: 內文標題\n> field1_value: 內文敘述`'
                                            
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;  
                case `6`:
                    await response.edit({
                        embeds: [
                            {
                                type: 'rich',
                                title: `晚餐`,
                                description: '</晚餐:1238859640809459842> - 可以查詢或隨機抽選一家常用餐廳',
                                color: 0x00FFFF,
                                fields: [
                                    {
                                        "name": `引數`,
                                        "value": ``
                                    },
                                    {
                                        "name": `platform`,
                                        "value": `
                                            > 必填 : **是**
                                            > 類型 : **選單**
                                            > 用途 : **篩選平台**
                                        `
                                    },
                                    {
                                        "name": `search`,
                                        "value": `
                                            > 必填 : **否**
                                            > 類型 : **字串**
                                            > 用途 : **查詢目標餐廳資訊**
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `注意事項`,
                                        "value": `
                                            > 1 : 如果如果篩選選擇all會在所有平台中抽選餐廳
                                            > 2 : 如果search內有輸入文字就會進入查詢模式
                                            > 3 : 查詢模式時平台篩選不會影響結果
                                            --------------------------------------------------------
                                        `
                                    },
                                    {
                                        "name": `指令範例`,
                                        "value": '*如果要隨機抽選一家餐廳*\n> `/晚餐 platform:all`\n*如果要隨機抽選一家foodpanda上的餐廳*\n> `/晚餐 platform:foodpanda`\n*如果要查詢**九湯屋**的資訊*\n> `/晚餐 platform:all search:九湯屋`'
                                    },
                                ],
                                timestamp: ctxTime.toISOString(),
                                footer: {
                                    text: 'powered by @pinjim0407'
                                }
                            },
                        ],
                        components: []
                    });
                    break;   
                default:
                    break;
            }
        });
        collector.on('end', async i => {
            await response.edit({
                embeds: [
                    {
                        type: 'rich',
                        title: `事件收集器已過期`,
                        description: `請重新使用"/幫助"指令以取得協助。`,
                        color: 0x00FFFF,
                    }
                ],
                components: []
            });;
        });
    }catch(error){
        console.log(error);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `公告指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
}

