import App from './App'
import Vue from 'vue'
import moment from 'moment'
import GoEasy from 'goeasy'
import Requst from 'utils/concatUrl.js'
import Url from 'url'
//引入 css 样式
import './style/animat.css'
//moment 不是组件，不用 Vue.use()
moment.locale('zh-cn')
Vue.prototype.$moment = moment
Vue.config.productionTip = false
//goeasy全局配置
Vue.prototype.$goeasy = GoEasy.getInstance({
	host: "hangzhou.goeasy.io", //若是新加坡区域：singapore.goeasy.io
	appkey: "BC-ae4f569d893847a8a260b27a34cf2c26",
	modules: ['pubsub'] //根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});
//设置全局 baseURL
Vue.prototype.$Requst = Requst
Vue.prototype.$Url = Url
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
