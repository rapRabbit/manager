<template>
  <div class="user-container">
    <!-- 顶部面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <myBreadcrumb :level2="level2" :level3="level3"></myBreadcrumb>
        </div>
      </el-col>
    </el-row>
    <!-- 提示框 -->
     <el-row class="mt">
      <el-col :span="24">
        <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      </el-col>
    </el-row>   
    <!-- 级联选择器 -->

  </div>
</template>
<script>
export default {
  name: "goods",
  data() {
    return {
      level2: "商品管理",
      level3: "商品列表",
      // 用户的数据
      paramsList: [],
      //选中的数据
      selectedOption2: [],
      //别名
      props: {
        label: "cat_name",
        value: "cat_id"
      },
      //tabs 命中的tab栏
      activeName: "dynamic"
    };
  },
  // 事件

  // 生命周期函数 回调函数
  async created() {
    // 直接调用方法
    let res = await this.$axios.get("categories?type=3");
    //赋值
  
    this.getGoods();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
