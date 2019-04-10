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
    <!-- 操纵框 -->
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" v-model="pageData.query">
            <template slot="append">
              <i class="el-icon-search" @click="searchAssociation"></i>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-button type="success" plain @click="addVisible=true">创建社团</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="goodsList" style="width: 100%" border>
          <el-table-column label="#" width="40" type="index"></el-table-column>
          <el-table-column prop="goods_name" label="社团名称" width="150"></el-table-column>
          <el-table-column prop="goods_price" label="社团简介" width="450"></el-table-column>
          <el-table-column prop="goods_weight" label="社团负责人" width="100"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="250">
            <template slot-scope="prop">{{prop.row.add_time | beautifyTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" icon="el-icon-edit"  @click="showEditDialog(scope.row)"></el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delOne(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 底部的分页 -->
    <el-row>
      <el-col :span="24">
        <el-pagination
          :current-page="pageData.pagenum"
          :page-sizes="[2, 4, 6, 8,10]"
          :page-size="pageData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
        ></el-pagination>
      </el-col>
    </el-row>
     <!-- 对话框 添加框 -->
    <el-dialog title="创建社团" :visible.sync="addVisible">
      <el-form :model="addForm" label-position="left" label-width="90px" ref="userForm">
        <el-form-item label="社团名称" prop="username">
          <el-input v-model="addForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="社团简介" prop="password">
          <el-input v-model="addForm.goods_price"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="社团负责人" >
          <el-input v-model="addForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>   
        <el-form-item label="number">
          <el-input v-model="addForm.goods_number" autocomplete="off"></el-input>
        </el-form-item> 
        <el-form-item label="cat">
          <el-input v-model="addForm.goods_cat" autocomplete="off"></el-input>
        </el-form-item> 
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 对话框 修改框 -->
    <el-dialog title="修改社团信息" :visible.sync="editVisible">
      <el-form :model="editForm" label-position="left" label-width="90px" ref="editForm">
        <el-form-item label="社团名称" prop="username">
          <el-input v-model="editForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="社团简介">
          <el-input v-model="editForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="社团负责人">
          <el-input v-model="editForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm',)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
    name: "associations",
    data() {
        return {
            level2: "社团管理",
            level3: "社团列表",
            pageData: {
                query: "",
                //页码
                pagenum: 1,
                //叶容量
                pagesize: 6
            },
            //总页数
            total: 0,
            //用户的数据
            goodsList: [],
            //是否显示添加框
            addVisible: false,
            //是否显示对话框
            visble: false,
            //提交的表单数据
            addForm: {
              goods_name: "",
              goods_price: "",
              goods_weight: "",
              goods_number: "100",
              goods_cat: [1],
            },
            //编辑框是否可见
            editVisible: false,
            //编辑框的表单数据
            editForm: {
              //增加用户的id 方便后续编辑使用
              goods_id: 0,
              goods_name: "",
              goods_price: "",
              goods_weight: "",
              goods_number: "",
              goods_cat: [],
            },
        };
    },
    //事件
    methods: {
        //获取分页数据的方法
        async getGoods(){
            //从上往下执行代码
            let res = await this.$axios.get("goods",{
                params: this.pageData
            });
            //赋值
            this.total = res.data.data.total;
            this.goodsList = res.data.data.goods;
            console.log(res.data.data.goods);
        },
        //查询社团信息
        searchAssociation() {
          this.getGoods();
        },
        //页码改变
        currentChange(pagenum) {
            // console.log(pagenum);
            // 修改页码
            this.pageData.pagenum = pagenum;
            //重新获取数据即可
            this.getGoods();
        },
        
        //页容量改变
        sizeChange(pagesize) {
            //修改页容量
            this.pageData.pagesize = pagesize;
            //重置页码
            this.pageData.pagenum = 1;
            //获取数据
            this.getGoods();
        },
        //打开编辑窗口
        async showEditDialog(data) {
          this.editVisible = true;
          //调用接口获取数据
          let res = await this.$axios.get(`goods/${data.goods_id}`);
          // console.log(res);
          for (const key in this.editForm){
            this.editForm[key] = res.data.data[key];
          }
        },

        //修改社团信息
        async submitEdit(formName) {
          let res = await this.$axios.put(
            `goods/${this.editForm.goods_id}`,
            this.editForm
          );
          console.log(res);
          if(res.data.meta.status === 200) {
            //关闭编辑窗
            this.editVisible = false;
            //重新获取数据
            this.getGoods();
          }
        },

        //删除某一个社团
        async delOne(data) {
          //获取当前所选社团id
          let id = data.goods_id;
          console.log(id);
          //提示用户
          this.$confirm("此次操作将永久删除这个社团,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "danger"
          })
            .then(async () => {
              //确定
              let res = await this.$axios.delete(`goods/${data.goods_id}`);
              //重新获得用户数据
              this.getGoods();
            })
            .catch(() => {
              //取消
              this.$message("谢不杀之恩");
            });
        },

        //创建一个社团
        async submitAdd(formName) {
          console.log(this.addForm);
         let res = await this.$axios.post("goods", this.addForm);
                console.log(res);
            // if(res.data.meta.status === 201) {
            //   this.$message.success("社团创建成功!");
            //   this.$router.push({
            //     name: 'goodlist'
            //   });
            //   this.addVisible = false;
            //   this.getGoods();
            // }else {
            //   this.$message.error("社团添加失败!");
            // };
          }
        },
    //生命周期函数
    async created() {
        //直接调用方法
        this.getGoods();
    }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}   
</style>