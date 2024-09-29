import fs from 'fs';

export const GetDateInfo = (ctxTime) => {
    const currentDayIndex = ctxTime.getDay();
    const daysInWeek = [];
    const date = new Date(ctxTime);
    const offset = currentDayIndex;
    date.setDate(date.getDate() - offset);

    for (let i = 0; i < 7; i++) {
        let lmonth = date.getMonth() + 1;
        let ldate = date.getDate() + 1;
        if (lmonth === 2) {
            const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0;
            if (isLeapYear && ldate+i > 29) {
                let offset = ldate-29
                lmonth += 1;
                ldate = offset;
            } else if (!isLeapYear && ldate+i > 28) {
                let offset = ldate-28
                lmonth += 1;
                ldate = offset;
            }
        } 
        else if ([1, 3, 5, 7, 8, 10, 12].includes(lmonth) && ldate+i > 31) {
            let offset = ldate-31
            lmonth += 1;
            ldate = offset;
        } 
        else if ([4, 6, 9, 11].includes(lmonth) && ldate+i > 30) {
            let offset = ldate-30
            lmonth += 1;
            ldate = offset;
        }
        const formattedDate = `${lmonth}/${ldate + i }`;
        daysInWeek.push(formattedDate);
    }
    return daysInWeek;
}

export const GetMemberList = () => {
    let MemberList = [];
    try {
        const data = fs.readFileSync('src/commands/datas/memberlist.txt', 'utf-8');
        MemberList = data.trim().split(",")
    } catch (error) {
        console.error('讀取名單時發生錯誤：', error);
    }
    return MemberList
}

export const SaveMemberList = (data) => {
    try {
        fs.writeFileSync('src/commands/datas/memberlist.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入名單時發生錯誤：', error);
    }
}

export const GetMemberRole = (member) => {
    try{
        let roleID;
        switch(member){
            case `左仲凱`:
                roleID =  `1286319883881156769`;
                break;
            case `黃智祥`:
                roleID =  `1286320020644954112`;
                break;
            case `蘇翊嘉`:
                roleID =  `1286320104262336625`;
                break;
            case `黃品鈞`:
                roleID =  `1286320163603349575`;
                break;
            case `李臸宇`:
                roleID =  `1286320207295549511`;
                break;
            case `張桂嘉`:
                roleID =  `1286320261884285029`;
                break;
            default:
                throw new Error(`無此成員。`);
        }
        return roleID;
    }catch(error){
        console.log(error);
    }
}

export const GetIndex = () => {
    let index;
    try {
        const data = fs.readFileSync('src/commands/datas/memberindex.txt', 'utf-8');
        index = data.trim();
    } catch (error) {
        console.error('讀取索引值時發生錯誤：', error);
    }
    return parseInt(index);
}

export const SaveIndex = (data) => {
    try {
        fs.writeFileSync('src/commands/datas/memberindex.txt', String(data), 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const GetNewWeekCheck = () =>{
    let NewWeekCheck;
    try {
        const data = fs.readFileSync('src/commands/datas/check.txt', 'utf-8');
        NewWeekCheck = data.trim();
    } catch (error) {
        console.error('讀取確認狀態時發生錯誤：', error);
    }
    if(NewWeekCheck === 'true')
        return true;
    else if(NewWeekCheck == 'false')
        return false;
}

export const SaveNewWeekCheck = (data) => {
    try {
        fs.writeFileSync('src/commands/datas/check.txt', data, 'utf-8');
    } catch (error) {
        console.error('寫入確認狀態時發生錯誤：', error);
    }
}

export const SetSchedule = async(dayOfWeek, reset) =>{
    try {
        let index = GetIndex()+reset;
        const memberlist = GetMemberList();
        console.log(`排程功能讀取到的差值 : `);
        console.log(dayOfWeek);
        console.log(`排程功能讀取到的索引值 : `);
        console.log(index);
        console.log(`排程功能讀取到的名單 : `);
        console.log(memberlist);
        let schedule = [];
        let offset;
        if(dayOfWeek === 1) offset=0;
        else if(dayOfWeek === 2 || dayOfWeek === 3) offset=1;
        else if(dayOfWeek === 4) offset=2;
        else if(dayOfWeek === 0 || dayOfWeek === 5|| dayOfWeek === 6) offset=3;
        offset += reset;
        for(let i=0; i<offset; i++){
            index-=1;
            if(index<0) index=5;
        }
        console.log(`格式化後的索引值 : `);
        console.log(index);
        for(let i=0; i<4; i++){
            if(index > 5) index = 0;
            schedule.push(memberlist[index]);
            index += 1;
        }
        console.log(`格式化後的名單 : `);
        console.log(schedule);
        return schedule;
    } catch (error) {
        console.error(error);
    }
}

export const SetEmbedContent = (dayOfWeek, check) => {
    let index = GetIndex();
    if(check) index-=1;
    const MemberList = GetMemberList();
    console.log(`值日功能讀取到的索引值 : `);
    console.log(index);
    console.log(`值日功能讀取到的名單 : `);
    console.log(MemberList)
    let titlecontent;
    let fieldvalue;

    switch (dayOfWeek) {
        case 0:
            titlecontent = `週日，沒有垃圾車。`;
            fieldvalue = `今日無需值日!`;
            break;
        case 1:
            titlecontent = `週一，需要丟一般垃圾。`;
            fieldvalue = `**今日值日 : <@&${GetMemberRole(MemberList[index])}>**\n> 請在19:00前完成工作。`;
            break;
        case 2:
            titlecontent = `週二，需要丟資源回收。`;
            fieldvalue = `**今日值日 : <@&${GetMemberRole(MemberList[index])}>**\n> 請在19:00前完成工作。`;
            break;
        case 3:
            titlecontent = `週三，沒有垃圾車。`;
            fieldvalue = `**今日無需值日!**`;
            break;
        case 4:
            titlecontent = `週四，需要丟一般垃圾。`;
            fieldvalue = `**今日值日 : <@&${GetMemberRole(MemberList[index])}>**\n> 請在19:00前完成工作。`;
            break;
        case 5:
            titlecontent = `週五，需要丟資源回收。`;
            fieldvalue = `**今日值日 : <@&${GetMemberRole(MemberList[index])}>**\n> 請在19:00前完成工作。`;
            break;
        case 6:
            titlecontent = `週六，暫停丟垃圾一天。`;
            fieldvalue = `**今日不排值日!**`;
            break;
        default:
            fieldvalue = "無法正確取得日期資訊，請嘗試重新使用指令。";
    }
    return {"title":titlecontent, "value":fieldvalue};
}