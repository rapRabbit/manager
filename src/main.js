import Vue from 'vue';
import App from './App.vue';

//全局样式导入
import '../src/assets/base.css';

//导入自己抽取的axios插件
import VueAxios from './lib/vue-axios';
Vue.use(VueAxios);//已经安装插件的语法实现了install 方法
                  //直接可以通过Vue.use跟Vue进行关联

//element-ui 导入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入自己抽取的路由
import router from './lib/router'

new Vue({
  el: '#app',
  //挂载到 最顶级的Vue实例上 
  router,
  render: h => h(App)
})
