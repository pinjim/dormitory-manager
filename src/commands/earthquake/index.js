import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const command = new SlashCommandBuilder()
    .setName('地震')
    .setDescription('最近的地震資訊');

export const MagnitudeLevel = (magnitude) => {
    if(magnitude < 2) return '極微';
    else if(magnitude >= 2 && magnitude < 4) return {level: '微小', image: ':blue_circle:'};
    else if(magnitude >= 4 && magnitude < 5) return {level: '輕微', image: ':green_circle:'};
    else if(magnitude >= 5 && magnitude < 6) return {level: '中等', image: ':yellow_circle:'};
    else if(magnitude >= 6 && magnitude < 7) return {level: '強烈', image: ':orange_circle:'};
    else if(magnitude >= 7 && magnitude < 8) return {level: '重大', image: ':red_circle:'};
    else if(magnitude >= 8) return '極大';
    else return error;
}

export const DepthLevel = (depth) => {
    if(depth <= 30) return {level: '極淺層', image: ':red_circle:'}
    else if(depth > 30 && depth <=70) return {level: '淺層', image: ':yellow_circle:'};
    else if(depth > 70 && depth <= 300) return {level: '中層', image:':green_circle:'};
    else if(depth > 300 && depth <= 700) return {level: '深層', image:':white_circle:'};
    else return error;
}

export const IntensityLevel = (intensity) => {
    if(intensity.includes('0')) return {level: '無感', image: ':white_circle:', color: 0xFFFFFF};
    else if(intensity.includes('1')) return {level: '微震', image: ':white_circle:', color: 0xFFFFFF};//白
    else if(intensity.includes('2')) return {level: '輕震', image: ':blue_circle:', color: 0x0000FF};//藍
    else if(intensity.includes('3')) return {level: '弱震', image: ':green_circle:', color: 0x00FF00};//綠
    else if(intensity.includes('4')) return {level: '中震', image: ':yellow_circle:', color: 0xFFD700};//黃
    else if(intensity.includes('5弱')) return {level: '強震', image: ':orange_circle:', color: 0xFFA500};//橘
    else if(intensity.includes('5強')) return {level: '強震', image: ':orange_circle:', color: 0xFFA500};//橘
    else if(intensity.includes('6弱')) return {level: '烈震', image: ':red_circle:', color: 0xFF0000};//紅
    else if(intensity.includes('6強')) return {level: '烈震', image: ':red_circle:', color: 0xFF0000};//紅
    else if(intensity.includes('7')) return {level: '劇震', image: ':purple_circle:', color: 0x800080};//紫
    else return error;
}

export const action = async(ctx) => {
    try {
        const response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWB-427B7265-DE60-4C1F-8AD0-4E7509C741D1&format=JSON`);
        const data = await response.json();

        if (data.success === 'true') {
            const earthquakeInfo = data.records.Earthquake;
            const lastReportTime = new Date(earthquakeInfo[0].EarthquakeInfo.OriginTime);
            const report = earthquakeInfo[0];
            const magnitude = report.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue;
            const number = report.EarthquakeNo;
            const depth = report.EarthquakeInfo.FocalDepth;
            const location = report.EarthquakeInfo.Epicenter.Location;
            const reportContent = report.ReportContent;
            const reportUrl = report.Web;
            const imageUrl = report.ReportImageURI;
            const areatable = [];
            let index = 0;
            let values = [];
            values[0] = MagnitudeLevel(magnitude);
            values[1] = DepthLevel(depth);
            console.log(`value : ${values[1]}`);
            let field = [
                {
                  name: `地點`,
                  value: `${location}`,
                  inline: false
                },
                {
                  name: `地震規模 ${values[0].image}`,
                  value: `> 芮氏${magnitude}\n> ${values[0].level}`,
                  inline: true
                },
                {
                  name: `震央深度 ${values[1].image}`,
                  value: `> ${depth}公里\n> ${values[1].level}`,
                  inline: true
                },
            ];
            for(let i=0; i<30; i++){
                try{
                    let area = data.records.Earthquake[0].Intensity.ShakingArea[i].AreaDesc;
                    console.log(`result${i+1} : ${area}`);
                    if(area.includes('最大震度')) {
                        areatable[index] = report.Intensity.ShakingArea[i];
                        index += 1;
                }
                }catch(error){
                    console.log(`result${i+1} : ${error}`);
                }
            }
            areatable.sort((a, b) => {
                const intensityA = parseFloat(a.AreaIntensity.match(/\d+/)[0]);
                const intensityB = parseFloat(b.AreaIntensity.match(/\d+/)[0]);
                return intensityA - intensityB;
            });
            values[2] = IntensityLevel(areatable[index-1].AreaIntensity);
            console.log(areatable);
            let newfield = {name: `最大震度 ${values[2].image}`,value: `> ${areatable[index-1].AreaIntensity}\n> ${values[2].level}`,inline: true};
            field.push(newfield);
            for(let i=index-1; i>=0; i--){
                newfield = { name: `${areatable[i].AreaDesc}`, value: `${areatable[i].CountyName}`, inline: false};
                field.push(newfield);
            }
            await ctx.reply({
                embeds: [
                {   
                author: {
                    name: '中央氣象局',
                    iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png'
                },
                type: 'rich',
                title: `**地震報告 #${number}**`,
                url: reportUrl,
                description: `${reportContent}`,
                fields: field,
                color: values[2].color,
                image: { 
                    url: imageUrl
                },
                footer: {
                    text: `powered by @pinjim0407`
                },
                timestamp: lastReportTime,
                },
            ]});
        }
        else {
            await ctx.reply(`無法取得地震資訊\n${error}`);
            console.error(error);
        }
    } catch (error) {
        await ctx.reply(`無法取得地震資訊\n${error}`);
        console.error(error);
    }
};