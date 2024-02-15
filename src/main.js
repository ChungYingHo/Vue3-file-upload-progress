import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import 'vuefinder/dist/style.css'
import VueFinder from 'vuefinder/dist/vuefinder'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)


app.use(VueFinder)
app.use(vuetify)

app.mount('#app')
 
