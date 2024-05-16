import {createApp} from 'vue'
import {createPinia} from 'pinia'

export default () => {
    console.log('vue已啟動。')
    const vue = createApp({})
    const pinia = createPinia()

    vue.use(pinia)
}