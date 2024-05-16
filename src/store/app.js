import {defineStore} from 'pinia'

export const useAppStore = defineStore('app',{
    state : () => ({
        commandsActionMap : null,
        client : null,
    }),
    getters : {},
    actions : {},
}) 