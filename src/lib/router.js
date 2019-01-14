//导入Vue 
import Vue from 'vue';
//导入路由
import VueRouter from 'vue-router';
//注册插件
Vue.use(VueRouter);

//导入路由管理的组件
import login from '../components/login.vue';
import main from '../components/mian.vue';

//写规则
let routes = [
    //登录页
    {
        path: '/login',
        component: login
    },
    //主页
    {
        path: '/',
        component: main
    }
]

//实例化对象
let router = new VueRouter({
    routes
});

//注册导航守卫( 实际是 回调函数)
router.beforeEach((to, from, next) => {
    console.log('执行了');
    console.log(to);
    console.log(from);
    //...
    //next 方法如果不执行 就不会跳转
    next();
    if (to.path === '/login') {
        next();
    } else {
        //判断登录 判断是否有token
        let token = window.sessionStorage.getItem("token");
        if (token) {
            //登录成功
            //继续访问
            next();
        } else {
            //没有token 未登录
            //这里不是Vue实例 无法通过this访问 但是可以访问到Vue构造函数 可以同原型访问
            Vue.prototype.$message.error('请先登录');
            // this.$message.error("请先登录");

            //去登录页 编程式导航
            // this.$router.push("login");

            //打回登录页 可以使用next() 进行路由跳转
            next('/login');
        }
    }
})

//暴露出去
export default router;