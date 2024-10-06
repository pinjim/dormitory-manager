import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
    .setName('公告')
    .setDescription('新增聊天室公告')
    .addStringOption(option =>
        option.setName('title')
            .setDescription('設定嵌入內容標題')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('field1')
            .setDescription('是否啟用第一段內文')
            .setRequired(true)
            .addChoices(
                { name: 'ture', value: 1 },
                { name: 'false', value: 0 },
            ))
    .addIntegerOption(option =>
        option.setName('field2')
            .setDescription('是否啟用第二段內文')
            .setRequired(true)
            .addChoices(
                { name: 'ture', value: 1 },
                { name: 'false', value: 0 },
            ))
    .addIntegerOption(option =>
        option.setName('field3')
            .setDescription('是否啟用第三段內文')
            .setRequired(true)
            .addChoices(
                { name: 'ture', value: 1 },
                { name: 'false', value: 0 },
            ))
    .addStringOption(option =>
        option.setName('title_url')
            .setDescription('設定標題連結')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('description')
            .setDescription('設定標題敘述')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('field1_name')
            .setDescription('設定第一段內文標題')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('field1_value')
            .setDescription('設定第一段內文敘述')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('field2_name')
            .setDescription('設定第二段內文標題')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('field2_value')
            .setDescription('設定第二段內文敘述')
            .setRequired(false))  
    .addStringOption(option =>
        option.setName('field3_name')
            .setDescription('設定第三段內文標題')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('field3_value')
            .setDescription('設定第二段內文敘述')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('image_url')
            .setDescription('嵌入內容內嵌圖片網址')
            .setRequired(false));

export const action = async(ctx) => {
    try{    
        const currentTime = new Date();
        const title = ctx.options.getString('title');
        const titleURL = ctx.options.getString('title_url');
        const description = ctx.options.getString('description');
        let fieldcheck = [];
        let fieldnames = [];
        let fieldvalues = [];
        fieldcheck.push(ctx.options.getInteger('field1'));
        fieldnames.push(ctx.options.getString('field1_name'));
        fieldvalues.push(ctx.options.getString('field1_value'));
        fieldcheck.push(ctx.options.getInteger('field2'));
        fieldnames.push(ctx.options.getString('field2_name'));
        fieldvalues.push(ctx.options.getString('field2_value'));
        fieldcheck.push(ctx.options.getInteger('field3'));
        fieldnames.push(ctx.options.getString('field3_name'));
        fieldvalues.push(ctx.options.getString('field3_value'));
        const imageURL = ctx.options.getString('image_url');
        let fields = [];
        for(let i=0; i<3; i++){
            if(fieldcheck[i]){
                fields.push({
                    name: fieldnames[i],
                    value: fieldvalues[i]
                  })
            }
        }
        await ctx.reply({
            embeds: [{
                type: 'rich',
                title: `公告發布成功`
            }],
            ephemeral: true
        });
        await ctx.channel.send({
            embeds: [{
              title: title,
              url: titleURL,
              description: description,
              fields: fields,
              image: {
                url: imageURL
              },
              color: 0x00FFFF,
              timestamp: currentTime.toISOString(),
              footer: {
                text: `本公告由${ctx.user.username}發布\npowered by @pinjim0407`
              }
            }]
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