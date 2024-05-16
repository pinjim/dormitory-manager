import { Events } from "discord.js"

export const event = {
    name : Events.ClientReady,
    once : true
}

export const action = (Client) => {
	console.log(`機器人${Client.user.tag}已開機。`)
   
}