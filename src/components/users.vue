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
              <i class="el-icon-search" @click="searchUser"></i>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-button type="success" @click="visible=true" plain>添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="userList" style="width: 100%" border>
          <el-table-column label="#" width="30" type="index"></el-table-column>
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
          <el-table-column prop="mg_state" label="用户状态" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="statusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="showEditDialog(scope.row)"
                plain
                size="mini"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                type="danger"
                plain
                size="mini"
                @click="delOne(scope.row)"
                icon="el-icon-delete"
              ></el-button>
              <el-button type="warning" plain size="mini" icon="el-icon-check"></el-button>
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
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 对话框 添加框 -->
    <el-dialog title="添加用户" :visible.sync="visible">
      <el-form
        :model="form"
        label-position="left"
        label-width="80px"
        :rules="rules"
        ref="userForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="submitForm('userForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 修改框 -->
    <el-dialog title="修改用户用户" :visible.sync="editVisible">
      <el-form :model="editForm" label-position="left" label-width="80px" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
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
  data() {
    return {
      level2: "用户管理",
      level3: "用户列表",
      pageData: {
        query: "",
        // 页码
        pagenum: 1,
        // 页容量
        pagesize: 10
      },
      // 总页数
      total: 0,
      // 用户的数据
      userList: [],
      //是否显示对话框
      visible: false,
      //提交的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 32, message: "长度在3到32 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 32, message: "长度在3 到 32 个字符", trigger: "blur" }
        ]
      },
      //编辑框是否可见
      editVisible: false,
      //编辑框的表单数据
      editForm: {
        //增加用户的id 方便后续编辑使用
        id: 0,
        username: "",
        email: "",
        mobile: ""
      }
    };
  },
  methods: {
    async getUsers() {
      //从上到下执行代码
      let res = await this.$axios.get("users", {
        params: this.pageData
      });
      //赋值
      // console.log(res);
      this.userList = res.data.data.users;
      this.total = res.data.data.total;
    },
    //查询用户数据
    searchUser() {
      this.getUsers();
    },
    //提交表单数据
    async submitForm(formName) {
      //获取dom元素 .validate(饿了吗UI提供的验证方法)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //验证成功
          //调用接口
          let res = await this.$axios.post("users", this.form);
          if ((res.data.meta, status === 201)) {
            //关闭弹框
            this.visible = false;
            //重新获取数据
            this.getUsers();
          }
        } else {
          //验证失败
          this.$message.error("哥们,数据不对呀");
          return false;
        }
      });
    },
    //删除 某一个用户
    delOne(data) {
      // console.log(data);
      //获取用户id
      let id = data.id;
      //提示用户
      this.$confirm("此次操作将永久删除这个用户,是否继续?", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "danger"
      })
        .then(async () => {
          //确定
          let res = await this.$axios.delete(`users/${id}`);
          //重新获取用户数据即可
          this.getUsers();
        })
        .catch(() => {
          //取消
          this.$message("谢不杀之恩");
        });
    },
    //修改用户状态
    async statusChange(data) {
      let res = await this.$axios.put(`users/${data.id}/state${data.mg_state}`);
      console.log(res);
    },
    //显示编辑框
    async showEditDialog(data) {
      //打印data
      //显示编辑框
      this.editVisible = true;
      //调用接口获取数据
      let res = await this.$axios.get(`users/${data.id}`);
      //console.log(res);
      for (const key in this.editForm) {
        this.editForm[key] = res.data.data[key];
      }
    },
    //修改用户
    async submitEdit(formName) {
      let res = await this.$axios.put(`users/${this.editForm.id}`, this.editForm);
      if(res.data.meta.status === 200){
        //关闭编辑框
        this.editVisible = false;
        //重新获取数据即可
        this.getUsers();
      }
    }
  },
  // 生命周期函数
  async created() {
    //直接调用 方法
    this.getUsers();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
