<template>
  <div>
    <el-container style="min-height: 100vh ">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
        <Aside/>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px; border-bottom: 1px solid #ccc;line-height: 60px">
          <Header />
        </el-header>

        <el-main>
<!--          当前页面的子路由会在router-view里面展示-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";



export default {
  name: 'HomeView',
  data(){
    return{

    }
  },
  components: {
    Aside,
    Header
  },
  methods:{

  }
}
</script>
