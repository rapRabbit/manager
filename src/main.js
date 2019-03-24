import Vue from 'vue';
import App from './App.vue';

//全局样式导入
import '../src/assets/base.css';

//导入自己抽取的axios插件
import VueAxios from './lib/vue-axios';
Vue.use(VueAxios);
//已经安装插件的语法实现了install 方法
//直接可以通过Vue.use跟Vue进行关联

//element-ui 导入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入自己抽取的路由
import router from './lib/router';

//全局注册面包屑导航
import myBreadcrumb from './components/myBreadcrumb.vue';
//全局注册面包屑组件
Vue.component('myBreadcrumb',myBreadcrumb);

//导入moment.js
import moment from 'moment';

//过滤器
Vue.filter('beautifyTime',(value) => {
  //moment.js 格式化
  return moment(value).format('YYYY年MM月DD日 HH:mm:ss')
})

new Vue({
  el: '#app',
  //挂载到 最顶级的Vue实例上 
  router,
  render: h => h(App)
})

//这种写法跟上 面的意思的是一样的
// const app = new Vue({
//   router
// }).$mount('#app')
