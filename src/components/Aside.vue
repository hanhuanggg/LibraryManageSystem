<script>
export default {
  name: "Aside",
  data() {
    return {
      // serverIp: serverIp,
      // user: localStorage.getItem("user")  ? JSON.parse(localStorage.getItem("user")) : {},
      form: {},
      role: "",
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
    console.log(this.user.role)
    this.role = this.user.role
    this.request.get("/user/username/"+this.user.username).then(res => {
      console.log(res)
      if(res.code ==='200'){
        this.form=res.data
      }
    })
  },
  methods: {
    async getUser() {
      return (await this.request.get("/user/username/" + this.user.username))
    },
    save() {
      this.request.post("/user", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")

          // 触发父级更新User的方法
          this.$emit("refreshUser")

          // 更新浏览器存储的用户信息
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem("user")).token
            localStorage.setItem("user", JSON.stringify(res.data))
          })

        } else {
          this.$message.error("保存失败")
        }
      })
    }
    // handleAvatarSuccess(res) {
    //   this.form.avatarUrl = res
    // }
  }


//   data() {
//     return {
//       userId: "",
//       date: "",
//       user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
//     }
//   },created() {
//     this.load()
//   },
//   methods: {
//     load() {
//       console.log(this.user)
//       this.request.post("/", {
//       })
//
//     },
//   }
}
</script>

<template>
  <el-menu :default-openeds="['1', '3']" style = "min-height: 100%; overflow-x: hidden"
           background-color="rgb(164, 92, 92)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           router

  >
    <div style="height: 60px;line-height: 60px;text-align: center">
      <img src="../assets/img.png" alt="" style="width: 20px; position:relative; top:4px;margin-right: 5px">
      <b style="color: aliceblue;font-size: 21px" >图书管理系统</b>
    </div>

    <el-menu-item index="/">
      <template slot="title"><i class="el-icon-house" style="font-weight: bold;"></i>
        <span slot="title" style="color: aliceblue;font-size: 17px"><b style="color: aliceblue;font-size: 19px" >借阅图书</b></span>
      </template>
    </el-menu-item>
    <el-menu-item index="/reservation">
          <template slot="title"><i class="el-icon-s-custom" style="font-weight: bold;"></i>
            <span slot="title" style="color: aliceblue;font-size: 17px"><b style="color: aliceblue;font-size: 19px" >我的借阅</b></span>
          </template>
        </el-menu-item>

    <el-submenu index="2" v-if="role === '管理员'">
      <template slot="title"><i class="el-icon-menu" style="font-weight: bold;"></i>
      <span slot="title" style="color: aliceblue;font-size: 17px"><b style="color: aliceblue;font-size: 19px" >系统管理</b></span>
      </template>
      <el-menu-item index="/user"><i class="el-icon-user"></i>
        <span slot="title"><b style="color: aliceblue;font-size: 18px" >借阅管理</b></span>
      </el-menu-item>
      <el-menu-item index="/room"><i class="el-icon-s-home"></i>
        <span slot="title"><b style="color: aliceblue;font-size: 18px" >图书管理</b></span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<style scoped>

</style>