import {Client, Events, GatewayIntentBits} from 'discord.js'
import vueInit from '@/core/vue'
import dotenv from 'dotenv'
import {loadCommands, loadEvents} from '@/core/loader'
import { useAppStore } from '@/store/app'
import fs from 'fs';
import { MagnitudeLevel, DepthLevel, IntensityLevel } from './commands/earthquake'

vueInit()
dotenv.config()
loadCommands()
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const appStore = useAppStore()
appStore.client = client
loadEvents()

export const GetEarthQuakeID = () => {
    let earthquakeID;
    try {
        const data = fs.readFileSync('src/commands/earthquakeID.txt', 'utf-8');
        earthquakeID = data.trim();
        return earthquakeID;
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }

}

export const SaveEarthQuakeID = (id) => {
    const idString = id.toString();
    try {
        fs.writeFileSync('src/commands/earthquakeID.txt', idString, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

client.once('ready', () => { 
    client.user.setPresence({
        status: 'idle',
    });
    const channel = client.channels.cache.get(YOUR_CHANNEL);
    setInterval(async () => {
            try {
                const response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWB-427B7265-DE60-4C1F-8AD0-4E7509C741D1&format=JSON`);
                const data = await response.json();
        
                if (data.success === 'true') {
                    let lastnumber = GetEarthQuakeID();
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
                    if(number != lastnumber){
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
                            name: `地震深度 ${values[1].image}`,
                            value: `> ${depth}公里\n> ${values[1].level}`,
                            inline: true
                            },
                        ];
                        for(let i=0; i<20; i++){
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
                        await channel.send({
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
                            ]
                        });
                    }
                    lastnumber = number;
                    SaveEarthQuakeID(lastnumber);
                }else {
                    console.error(error);
                }
            }catch (error) {
                console.error(error);
            }
    }, 5000);
    });

client.login(process.env.TOKEN)