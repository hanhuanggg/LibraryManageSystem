<script>
export default {
  name: "User",
  data(){
    return{
      tableData:[],
      total:0,
      pageNum:1,
      username:"",
      form:{},
      multipleSelection:[],
      dialogFormVisible: false,
      pageSize:10,
      roles:[]
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      this.request.get("/reservation/page",{
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      })
          .then(res => {
            console.log(res)
            this.tableData =res.data.records
            this.total =res.data.total
          })
      this.request.get("/role").then(res =>{
        this.roles = res.data
      })
    },
    save(){
      this.request.post("/reservation",this.form).then(res=>{
        if(res.data){
          this.$message.success("操作成功！")
          this.dialogFormVisible = false; // 关闭弹窗
          this.load()
        }else {
          this.$message.error("操作失败！")
        }
      })
    },
    handleEdit(row){
      this.form=row
      this.form.reason=""
      this.form.state="pass"
      const currentTime = new Date()
      this.form.approvalTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`
      this.save()
    },
    handleSelectionChange(val){
      console.log(val)
      this.multipleSelection = val
    },
    handleDel(row){
      this.form=row
      this.form.state="fail"
      // 获取当前时间
      const currentTime = new Date()
      // 格式化当前时间
      this.form.approvalTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`
      this.dialogFormVisible=true
    },
    reset(){
      this.username=""
      this.email=""
      this.address=""
      this.load()
    },
    handleAdd(){
      this.dialogFormVisible=true;//打开弹窗
      this.form={}//置空
    },
    handleSizeChange(pageSize){
      console.log(pageSize)
      this.pageSize=pageSize
      this.load()
    },handleCurrentChange(pageNum){
      console.log(pageNum)
      this.pageNum=pageNum
      this.load()
    }
  }
}
</script>

<template>
  <div>
<!--    <div style="margin-bottom: 30px">-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item><a href="/">预约管理</a></el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

<!--    <div style="margin: 10px 0">-->
<!--      <el-input style="width: 300px;margin: 10px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model ="username"></el-input>-->
<!--      <el-input style="width: 300px;margin: 10px" placeholder="请输入邮箱" suffix-icon="el-icon-search" v-model ="email"></el-input>-->
<!--      <el-input style="width: 300px;margin: 10px" placeholder="请输入地址" suffix-icon="el-icon-search" v-model ="address"></el-input>-->
<!--      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>-->
<!--      <el-button type="warning" @click="reset">重置</el-button>-->
<!--    </div>-->

<!--    <div style="margin: 10px 0">-->
<!--      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i> </el-button>-->
<!--      <el-popconfirm-->
<!--          class="ml-5"-->
<!--          confirm-button-text='确定'-->
<!--          cancel-button-text='我再想想'-->
<!--          icon="el-icon-info"-->
<!--          icon-color="red"-->
<!--          title="确定批量删除用户的信息吗？"-->
<!--          @confirm ="delBatch"-->
<!--      ><el-button type="danger" slot="reference" >批量<i class="el-icon-remove-outline"></i> </el-button>-->
<!--      </el-popconfirm>-->

<!--    </div>-->
      <el-table :data="tableData" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" >-->
<!--      </el-table-column>-->
      <el-table-column prop="username" label="借阅用户" >
      </el-table-column>
      <el-table-column prop="name" label="书籍名称" >
      </el-table-column>
        <el-table-column prop="date" label="日期" >
      </el-table-column>
      <el-table-column prop="start" label="开始时间">
      </el-table-column>
      <el-table-column prop="end" label="结束时间" >
      </el-table-column>
        <el-table-column prop="state" label="申请状态" >
      </el-table-column>
        <el-table-column prop="approvalTime" label="审批时间" >
      </el-table-column>
        <el-table-column prop="reason" label="驳回理由" >
      </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                :disabled="scope.row.state === 'cancel'"
                type="success"
                @click="handleEdit(scope.row)"
            >
              通过<i class="el-icon-circle-check"></i>
            </el-button>
            <el-popconfirm
                :disabled="scope.row.state === 'cancel'"
                v-if="scope.row.state !== 'cancel'"
                class="ml-5"
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                title="确定驳回该预约吗？"
                @confirm="handleDel(scope.row)"
            >
              <el-button type="danger" slot="reference">驳回<i class="el-icon-circle-close"></i></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <!-- Form -->
    <el-dialog title="预约信息" :visible.sync="dialogFormVisible">
      <el-form label-width="100">
        <el-form-item label="用户名" >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议室" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驳回理由" >
          <el-input v-model="form.reason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.room-management {
  padding: 20px;
  margin: 20px;
}

.el-button {
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}

.el-icon {
  font-size: 18px;
}

.el-table {
  line-height: 2;
  font-size: 16px;
}

.el-pagination {
  font-size: 16px;
  font-weight: bold;
}
</style>