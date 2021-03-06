//导入axios
import axios from 'axios';
//导入Vue
// import Vue from 'vue';
//导入element-ui 的 message
import {
    Message
} from 'element-ui';

//设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

//设置axios拦截器
//请求发送之前 会触发这个回调函数
//修改请求的设置
axios.interceptors.request.use(config => {
    //判断请求的是 登录 还是其他的url地址
    if (config.url.indexOf('./login') != -1) {
        //登录接口
    } else {
        //非登录接口
        config.headers.Authorization = window.sessionStorage.getItem('token');
    }
    //返回处理过的axios设置
    return config;
}, error => {
    //出错啦
    return Promise.reject(error);
});

//axios 响应拦截器
//请求响应回来之后 会触发这个回调函数
axios.interceptors.response.use((response) => {
    //根据响应的状态码 同一用户提示
    if (response.data.meta.status === 200) {
        //成功 提示返回的信息
        // Vue.prototype.$message.success(response.data.meta.msg);
        Message.success(response.data.meta.msg);
    } else if (response.data.meta.status === 400) {
        //失败 提示返回信息
        // Vue.prototype.$message.error(response.data.meta.msg);
        Message.error(response.data.meta.msg);
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});

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
        // this.$axios.get()
        // this.$axios.post()
        // Vue.prototype.$myMethod = function (methodOptions){
        //     逻辑
        // }
        // this.$myMethod()
// }
// export default vueAxios;