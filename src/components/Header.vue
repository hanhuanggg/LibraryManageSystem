<script>
export default {
  name: "Header",
  props:{

  },
  watch:{
    '$route':function (){ //监听路由变化
      this.currentPathName=localStorage.getItem("currentPathName")//取出route里面设置的当前路由信息
    }
  },
  data(){
    return{
      currentPathName:'',
      user: localStorage.getItem("user")  ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  methods:{
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message("退出成功")
    }
  },
  created() {
    console.log(this.$route)
  }
}
</script>

<template>
  <div>
    <div style="flex:1;margin-bottom: 30px">
      <el-breadcrumb separator="/" style="display: inline-block ;left: 10px" >
        <el-breadcrumb-item :to="'/'" >首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown>
      <i class="el-icon-setting" style="margin-right: 15px;font-size: 35px"></i>
      <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link style="text-decoration: none;color: black" to="/person">个人信息</router-link>
        </el-dropdown-item >
        <el-dropdown-item style="font-size: 14px; padding: 5px 0"  @click="logout">
          <span style="text-decoration: none;" @click="logout">返回登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span style="margin-right: 25px;font-size: 20px">{{user.nickname}}</span>
  </div>
</template>

<style scoped>

</style>