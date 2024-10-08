import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
    .setName('晚餐')
    .setDescription('今天晚餐吃什麼')
    .addIntegerOption(option =>
        option.setName('platform')
            .setDescription('篩選平台')
            .setRequired(true)
            .addChoices(
                { name: 'all', value: 0},
				{ name: 'FoodPanda', value: 1},
				{ name: 'GoogleMap', value: 2 },
            ))
    .addStringOption(option =>
        option.setName('search')
            .setDescription('查詢餐廳資料')
            .setRequired(false));

const restaurants = [
    { name: '六扇門時尚湯鍋', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/b4zx/liu-shan-men-miao-li-zhong-shan-dian)', star: '★4.8/5(3000+)', speed: '慢',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '三媽臭臭鍋', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/a7qv/san-ma-chou-chou-guo-miao-li-nan-miao-dian)', star: '★4.8/5(5000+)', speed: '慢',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '麗媽四季鍋', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/z1jt/li-ma-si-ji-guo-miao-li-zhong-zheng-dian)', star: '★4.8/5(5000+)', speed: '慢',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '老食人', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/DboTEgc9BgQtMgSh9)', star: '★4.3/5(100+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '小馬哥牛肉麵', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/mRESjLSA9GFKzfcFA)', star: '★4.4/5(50+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '小廚師餐坊', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/NNvs2UC9isVYkb3UA)', star: '★4.0/5(100+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '新竹吳家鴨香飯', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/b8ly/xin-zhu-wu-jia-ya-xiang-fan-miao-li-nan-miao-dian)', star: '★4.8/5(5000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '麥當勞', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/b0qa/mai-dang-lao-s72-miao-li-guang-fu-dian)', star: '★4.8/5(10000+)', speed: '快',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '漢堡王', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/mrmpWd32zQAts4xd7)', star: '★4.2/5(100+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '肯德基', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/f2g2/ken-de-ji-kfchan-bao-chu-fang-miao-li-zhong-zheng-dian)', star: '★4.9/5(10+)', speed: '快',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '金志小吃', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/e2zo/jin-zhi-xiao-chi)', star: '★4.8/5(5000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '蓁竑蛋黃麵', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/tjt0/zhen-hong-dan-huang-mian)', star: '★4.8/5(100+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '八方雲集', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/e2ca/ba-fang-yun-ji-miao-li-zhong-zheng-dian)', star: '★4.8/5(5000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '四海遊龍', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/zhdo/si-hai-you-long-miao-li-ju-dan-dian/)', star: '★4.9/5(2000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '九湯屋', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/bkaf/jiu-tang-wu-miao-li-fu-qian-dian)', star: '★4.8/5(2000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '成功牛排', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/rGRZy1BxcFVL6tUH9)', star: '★4.0/5(800+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '柚子的家', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/Jp8Vrb2SaD4cxuYt7)', star: '★4.4/5(100+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '霄餚食堂', color: 0x00FF00, url: '[GoogleMap](https://maps.app.goo.gl/WY5ofL1fMFu3vxcx6)', star: '★4.4/5(400+)', speed: '無外送服務', image: 'https://lh3.googleusercontent.com/9tLfTpdILdHDAvGrRm7GdbjWdpbWSMOa0csoQ8pUba9tLP8tq7M4Quks1xuMQAVnAxVfryiDXRzZ-KDnkPv8Sm4g_YFom1ltQHjQ6Q',platform: '2'},
    { name: '御饌鼎皇', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/d8ec/yu-zhuan-ding-huang-guo-shao-miao-li-zhong-zheng-dian)', star: '★4.5/5(500+)', speed: '慢',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
    { name: '真味廣東粥', color: 0xFF69B4, url: '[FoodPanda](https://www.foodpanda.com.tw/restaurant/b9wm/zhen-wei-guang-dong-zhou-miao-li-jian-gong-dian)', star: '★4.8/5(1000+)', speed: '中',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYvdBOGZxTEB-lvlz64V8bQz8pRDUHjJRcZY9OdRRCw&s',platform: '1'},
];
export const action = async (ctx) => {
    try{
        const ctxTime = new Date();
        const platform = ctx.options.getInteger('platform');
        const target = ctx.options.getString('search');
        let index = null;
        if(target != null){
            for(let i=0; i<restaurants.length-1; i++){
                if(restaurants[i].name.includes(target)){
                    index = i;
                    break;
                }
            }
            if(index === null){
                await ctx.reply({
                    embeds: [
                        {
                            type: 'rich',
                            title: `沒有和關鍵字“${target}”相關的餐廳`,
                            description: ``,
                            timestamp: ctxTime.toISOString(),
                            footer: {
                                text: 'powered by @pinjim0407'
                            }
                        }
                    ]
                })
                return 0;
            }
        }
        else{
            index = Math.floor(Math.random() * restaurants.length-1);
            if(platform != 0){
                do{
                    index = Math.floor(Math.random() * restaurants.length-1);
                }while(restaurants[index].platform != platform);
            }
        }
        await ctx.reply({
            embeds: [
            {
                type: 'rich',
                title: `${restaurants[index].name}`,
                description: '',
                color: restaurants[index].color,
                thumbnail: {
                    url: restaurants[index].image
                },
                fields: [
                    {
                        "name": ``,
                        "value": `餐廳評價 **${restaurants[index].star}**`,
                    },
                    {
                        "name": ``,
                        "value": `外送速度 **${restaurants[index].speed}**`,
                    },
                    {
                        "name": ``,
                        "value": `${restaurants[index].url}`,
                    }
                ],
                timestamp: ctxTime.toISOString(),
                footer: {
                    text: 'powered by @pinjim0407'
                }
            }]
        });
    }catch(error){
        console.log(error);
        await ctx.reply({
            embeds: [
                {
                    type: 'rich',
                    title: `晚餐指令執行錯誤`,
                    description: `${error}`,
                    color: 0xFF0000,
                }
            ]
        });
    }
}