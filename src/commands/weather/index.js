import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const command = new SlashCommandBuilder()
    .setName('天氣')
    .setDescription('查看今天的天氣')
    .addIntegerOption(option =>
        option.setName('area')
            .setDescription('你所在的地區')
            .setRequired(true)
            .addChoices(
                { name: '宜蘭縣', value: 1 },
                { name: '基隆市', value: 2 },
                { name: '新北市', value: 3 },
                { name: '臺北市', value: 4 },
                { name: '桃園市', value: 5 },
                { name: '新竹市', value: 6 },
                { name: '新竹縣', value: 7 },
                { name: '苗栗縣', value: 8 },
                { name: '台中市', value: 9 },
                { name: '彰化縣', value: 10 },
                { name: '南投縣', value: 11 },
                { name: '雲林縣', value: 12 },
                { name: '嘉義市', value: 13 },
                { name: '嘉義縣', value: 14 },
                { name: '台南市', value: 15 },
                { name: '高雄市', value: 16 },
                { name: '屏東縣', value: 17 },
                { name: '台東縣', value: 18 },
                { name: '花蓮縣', value: 19 },
                { name: '澎湖縣', value: 20 },
                { name: '金門縣', value: 21 },
                { name: '連江縣', value: 22 }
            ));

export const GetWeatherData = async(areaindex) => {
    let area;
    switch(areaindex){
        case 1:
            area = '宜蘭縣';
            break;
        case 2:
            area = '基隆市';
            break;
        case 3:
            area = '新北市';
            break;
        case 4:
            area = '臺北市';
            break;
        case 5:
            area = '桃園市';
            break;
        case 6:
            area = '新竹市';
            break;
        case 7:
            area = '新竹縣';
            break;
        case 8:
            area = '苗栗縣';
            break;
        case 9:
            area = '台中市';
            break;
        case 10:
            area = '彰化縣';
            break;
        case 11:
            area = '南投縣';
            break;
        case 12:
            area = '雲林縣';
            break;
        case 13:
            area = '嘉義市';
            break;
        case 14:
            area = '嘉義縣';
            break;
        case 15:
            area = '台南市';
            break;
        case 16:
            area = '高雄市';
            break;
        case 17:
            area = '屏東縣';
            break;
        case 18:
            area = '台東縣';
            break;
        case 19:
            area = '花蓮縣';
            break;
        case 20:
            area = '澎湖縣';
            break;
        case 21:
            area = '金門縣';
            break;
        case 22:
            area = '連江縣';
            break;
        default:
            area = '未知地區';
    }
    const apiKey = 'CWB-427B7265-DE60-4C1F-8AD0-4E7509C741D1';
    const target = 'F-C0032-001';
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${target}?Authorization=${apiKey}&format=JSON&locationName=${area}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success === 'true') {
            console.log(`成功連接中央氣象署API : ${url}`);
            return {data,url};
        } else {
            console.error('Weather data request failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

export const ProcessWeatherData = (data, index) => {
    const time1 = data.records.location[0].weatherElement[index].time[0].parameter.parameterName;
    const time2 = data.records.location[0].weatherElement[index].time[1].parameter.parameterName;
    const time3 = data.records.location[0].weatherElement[index].time[2].parameter.parameterName;
    return [time1, time2, time3];
}

export const FormatDataTimeInfo = (timeinfo) => {
    const startdate = new Date(timeinfo.starttime);
    const enddate = new Date(timeinfo.endtime);
    const startmonth = startdate.getMonth() + 1;
    const endmonth = enddate.getMonth() + 1;
    const startday = startdate.getDate();
    const endday = enddate.getDate();
    const starthours = startdate.getHours();
    const endhours = enddate.getHours();

    return `${startmonth}/${startday} ${starthours}:00 ~ ${endmonth}/${endday} ${endhours}:00`;
}

export const action = async(ctx) => {
    const area = ctx.options.getInteger('area');
    const struct = await GetWeatherData(area);

    if (!struct || !struct.data) {
        await ctx.reply(`無法取得${area}的氣象資料。`);
        return;
    }

    const locationname = struct.data.records.location[0].locationName;
    const timeinfo1 = {starttime: struct.data.records.location[0].weatherElement[0].time[0].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[0].endTime};
    const timeinfo2 = {starttime: struct.data.records.location[0].weatherElement[0].time[1].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[1].endTime};
    const timeinfo3 = {starttime: struct.data.records.location[0].weatherElement[0].time[2].startTime, endtime: struct.data.records.location[0].weatherElement[0].time[2].endTime};
    let info = [];
    for (let i=0; i<5; i++){
        let times = ProcessWeatherData(struct.data, i);
        let [time1, time2, time3] = times;
        info[i] = {value1: time1, value2: time2, value3: time3};
    }

    let infodescription = [
        { valueimage: '', comfort: '' }, 
        { valueimage: '', comfort: '' }, 
        { valueimage: '', comfort: '' }
    ];
    let str = [info[0].value1, info[0].value2, info[0].value3];
    for(let i = 0; i < 3; i++){
        if(str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859471584657478/1.png?ex=664bbb42&is=664a69c2&hm=688dea48450c969ab57f5a33f348a210a45869e30cedc3b0bb3c9caa034b3d1b&=&format=webp&quality=lossless';
        else if(str[i].includes('雨') && !str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859478471835769/5.png?ex=664bbb44&is=664a69c4&hm=8a7252ca6d6842177e1dca412a600b710dd4eb61e6bd1a4f882091820cedb280&=&format=webp&quality=lossless';
        else if(str[i].includes('多雲') && str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859487397187745/3.png?ex=664bbb46&is=664a69c6&hm=6e10f9505e1283feb3e95f29c61c53b0f0b6b67767fddfce217803640a280fd9&=&format=webp&quality=lossless';
        else if(str[i].includes('晴') && str[i].includes('雨'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859483236569189/4.png?ex=664bbb45&is=664a69c5&hm=d46bcce80c070fcbdc459a967e59c1a1782dc47f3424f33a0483b0cd9be2184d&=&format=webp&quality=lossless';
        else if(str[i].includes('多雲') || str[i].includes('陰'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859491062874213/2.png?ex=664bbb47&is=664a69c7&hm=af9f7fbd990d1945a5419a9192949795aab2ed0c584b47f646acdf7d6209ebfb&=&format=webp&quality=lossless';
        else
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241863406420754462/Lovepik_com-611699258-Error_symbol.png?ex=664bbeec&is=664a6d6c&hm=aea586a0f0cb0d0c47931a16f6c5dd59c9fccf423fc5b646aca49ca059784641&=&format=webp&quality=lossless';
    }

    const ctxTime = new Date();
    
    try {
        await ctx.reply({
            embeds: [
                {   
                    author: {
                        name: '中央氣象局',
                        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png'
                    },
                    type: 'rich',
                    title: `${locationname}的三十六小時天氣預報`,
                    url: struct.url,
                    description: `*datas from [CWB Opendata API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001)*`,
                    fields: [],
                    timestamp: ctxTime.toISOString(),
                    footer: {
                        text: '指令僅能獲取簡易資料，詳細請查看中央氣象局網站。\npowered by @pinjim0407'
                    },
                    image: { 
                        url: 'https://media.discordapp.net/attachments/1060629545398575255/1242117290519040070/N-Picture16.jpg?ex=664cab5f&is=664b59df&hm=1192e892d3bbc2fd23e1716d9b43c1a896b548901aa52c75778236f37d123f9a&=&format=webp&width=860&height=221'
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
    } catch (error) {
        await ctx.reply(`輸入的地區有誤或中央氣象署API無回應。\n錯誤代號 : ${error}`)
        console.error('Error:', error);
    }
}
