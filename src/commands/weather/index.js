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
    const target = 'F-C0032-001'/*'O-A0001-001'*/;
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${target}?Authorization=${apiKey}&format=JSON&locationName=${area}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success === 'true') {
            console.log(`成功連接中央氣象署API : ${url}`);
            return data;
        } else {
            console.error('Weather data request failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

export const ProcessWeatherData = (data,index) => {
    const time1 = data.records.location[0].weatherElement[index].time[0].parameter.parameterName;
    const time2 = data.records.location[0].weatherElement[index].time[1].parameter.parameterName;
    const time3 = data.records.location[0].weatherElement[index].time[2].parameter.parameterName;
    return [time1, time2, time3];
}

export const action = async(ctx) => {
    const ctxTime = new Date();
    const month = ctxTime.getMonth() + 1;
    const date = ctxTime.getDate();
    const area = ctx.options.getInteger('area');
    const data = await GetWeatherData(area);
    const locationname = data.records.location[0].locationName;
    let info = [];
    for (let i=0; i<5; i++){
        let times = ProcessWeatherData(data,i);
        let [time1, time2, time3] = times;
        info[i] = {value1 : time1, value2 : time2, value3 : time3};
    }
    let infodescription = [
        { valueimage: '', comfort: '' }, 
        { valueimage: '', comfort: '' }, 
        { valueimage: '', comfort: '' }
    ];
    let str = [];
    str[0] = info[0].value1;
    str[1] = info[0].value2;
    str[2] = info[0].value3;
    for(let i=0; i<3; i++){
        if(str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859471584657478/1.png?ex=664bbb42&is=664a69c2&hm=688dea48450c969ab57f5a33f348a210a45869e30cedc3b0bb3c9caa034b3d1b&=&format=webp&quality=lossless';
        else if(str[i].includes('雨') && !str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859478471835769/5.png?ex=664bbb44&is=664a69c4&hm=8a7252ca6d6842177e1dca412a600b710dd4eb61e6bd1a4f882091820cedb280&=&format=webp&quality=lossless';
        else if( str[i].includes('多雲') && str[i].includes('晴'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859487397187745/3.png?ex=664bbb46&is=664a69c6&hm=6e10f9505e1283feb3e95f29c61c53b0f0b6b67767fddfce217803640a280fd9&=&format=webp&quality=lossless';
        else if(str[i].includes('晴') && str[i].includes('雨'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859483236569189/4.png?ex=664bbb45&is=664a69c5&hm=d46bcce80c070fcbdc459a967e59c1a1782dc47f3424f33a0483b0cd9be2184d&=&format=webp&quality=lossless';
        else if(str[i].includes('多雲') || str[i].includes('陰'))
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241859491062874213/2.png?ex=664bbb47&is=664a69c7&hm=af9f7fbd990d1945a5419a9192949795aab2ed0c584b47f646acdf7d6209ebfb&=&format=webp&quality=lossless';
        else
            infodescription[i].valueimage = 'https://media.discordapp.net/attachments/1060629545398575255/1241863406420754462/Lovepik_com-611699258-Error_symbol.png?ex=664bbeec&is=664a6d6c&hm=aea586a0f0cb0d0c47931a16f6c5dd59c9fccf423fc5b646aca49ca059784641&=&format=webp&quality=lossless';
    }
    try{
        //0 : 氣象
        //1 : 降雨機率
        //2 : 低溫
        //3 : 舒適度指數
        //4 : 高溫
        await ctx.reply({
            embeds: [
                {   
                    author: {
                        name: '中央氣象局',
                        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png'
                    },
                    type: 'rich',
                    title: `${locationname} ${month}月${date}日的天氣預報`,
                    description: `*[datas from CWB open data API](https://www.cwa.gov.tw/V8/C/)*\n*[images from lovepik.com](https://zh.lovepik.com/)*`,
                    fields: [
                    ],
                    timestamp: ctxTime.toISOString(),
                    footer: {
                        text: '此指令僅為簡易查詢功能，\n實際情況以中央氣象局資料為準。\npowered by @pinjim0407'
                    }
                },
                {
                    type: 'rich',
                    title: `清晨 *00:00 ~ 06:00*`,
                    description: `${(info[0].value1).padEnd(11, ' ')}`,
                    color: 0xADD8E6,
                    thumbnail: {
                        url: infodescription[0].valueimage
                    },
                    fields: [
                        {
                            "name": `最高${info[4].value1}℃ 最低${info[2].value1}℃`,
                            "value": `*${info[3].value1}*`,
                        },
                        {
                            "name": `降雨機率 : ${info[1].value1}%`,
                            "value": `${'<:blue:1240696276111196222>'.repeat((info[1].value1)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value1)/10))}`,
                        },
                    ],
                },
                {
                    type: 'rich',
                    title: `日間 *06:00 ~ 18:00*`,
                    description: `${(info[0].value2).padEnd(11, ' ')}`,
                    color: 0x87CEEB,
                    thumbnail: {
                        url: infodescription[1].valueimage
                    },
                    fields: [
                        {
                            "name": `最高${info[4].value2}℃ 最低${info[2].value2}℃`,
                            "value": `*${info[3].value2}*`,
                        },
                        {
                            "name": `降雨機率 : ${info[1].value2}%`,
                            "value": `${'<:blue:1240696276111196222>'.repeat((info[1].value2)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value2)/10))}`,
                        },
                    ],
                },
                {
                    type: 'rich',
                    title: `夜間 *18:00 ~ 24:00*`,
                    description: `${(info[0].value3).padEnd(11, ' ')}`,
                    color: 0x000080,
                    thumbnail: {
                        url: infodescription[2].valueimage
                    },
                    fields: [
                        {
                            "name": `最高${info[4].value3}℃ 最低${info[2].value3}℃`,
                            "value": `*${info[3].value3}*`,
                        },
                        {
                            "name": `降雨機率 : ${info[1].value3}%`,
                            "value": `${'<:blue:1240696276111196222>'.repeat((info[1].value3)/10)}${'<:gray:1240701126903599187>'.repeat(10-((info[1].value3)/10))}`,
                        },
 
                    ],
                }
            ]
        });
    }
    catch(error){
        await ctx.reply(`輸入的地區有誤或中央氣象署API無回應。\n錯誤代號 : ${error}`)
        console.error('Error:', error);
    }
}