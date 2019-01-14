//导入axios
import axios from 'axios';

//设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

//暴露出去 (Vue的插件)
export default {
    install(Vue) {
        //4. 添加实例方法
        Vue.prototype.$axios = axios;
        
        //Vue 的插件需要实现install 方法
        //Vue 的内部会调用这个方法
        //传入Vue构造函数
    }
}

//两种写法一样

// let vueAxios = {}
// vueAxios.install = function(Vue) {
//     Vue.prototype.$axios = axios;
// }
// export default vueAxios;