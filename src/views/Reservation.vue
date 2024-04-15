<script>
export default {
  name: "Reservation",
  data(){
    return{
      tableData:[],
      total:0,
      pageNum:1,
      name:"",
      number:"",
      contain:"",
      area:"",
      describable:"",
      form:{
        id:"",
      },
      dialogFormVisible: false,
      startPickerOptions: {
        disabledHours: () => this.disableHours('end'),
        disabledMinutes: () => this.disableMinutes('end'),
      },
      endPickerOptions: {
        disabledHours: () => this.disableHours('start'),
        disabledMinutes: () => this.disableMinutes('start'),
      },
      multipleSelection:[],
      pageSize:10,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      this.request.get("/room/myPage",{
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.user.id
        }
      })
          .then(res => {
            console.log(res)
            this.tableData =res.data.records
            this.total =res.data.total
          })
    },
    isEndBeforeCurrentTime(endTime) {
      const currentDateTime = new Date();
      const endDateTime = new Date(endTime);
      return endDateTime < currentDateTime;
    },
    handleEdit(row){
      this.form=row
      // console.log("---"+row)
      // console.log("---"+this.user.id)
      // console.log("id"+this.form.id)
      // console.log("Form Data:", this.form);
      this.form.state="return"
      this.form.roomId = this.form.id
      //console.log("id"+this.form.state)
      this.request.post("/reservation/back",this.form).then(res=>{
        if(res.data){
          this.$message.success("Success！")
          // this.load()
        }else {
        this.$message.success("Sucess！")
      }
      })
    },
    save() {
      console.log(this.form.date)
      this.form.state = "borrowing"
      this.form.id=""
      this.request.post("/reservation/borrowing", this.form)
          .then(res => {
            if (res.data) {
              this.$message.success("续借成功！");
              this.dialogFormVisible = false; // 关闭弹窗
              this.load();
            } else {
              this.$message.error("续借失败！");
            }
          })
          .catch(error => {
            console.error("Error saving reservation:", error);
            this.$message.error("借阅失败！发生了错误");
          });
    },
    handleRenew(row){
      this.form=row
      this.form.roomId=row.id
      this.form.contain =
          this.form.userId=this.user.id
      this.dialogFormVisible=true
    },
    handleSelectionChange(val){
      console.log(val)
      this.multipleSelection = val
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

    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column prop="name" label="书籍名称" >
      </el-table-column>
      <el-table-column prop="number" label="书籍编号"   >
      </el-table-column>
      <el-table-column prop="date" label="日期" >
      </el-table-column>
      <el-table-column prop="start" label="开始时间" >
      </el-table-column>
      <el-table-column prop="end" label="结束时间">
      </el-table-column>
      <el-table-column prop="state" label="申请状态">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.state === ''" type="success" @click="handleRenew(scope.row)">
            续借<i class="el-icon-refresh"></i>
          </el-button>
          <el-button
              :disabled="scope.row.state === 'return' || isEndBeforeCurrentTime(scope.row.end)"
              type="success"
              @click="handleEdit(scope.row)"
          >
            归还<i class="el-icon-circle-close"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="借阅信息" :visible.sync="dialogFormVisible">
      <el-form label-width="100">
        <el-form :model="form" label-position="top">
          <el-form-item label="借阅日期">
            <!-- 使用 el-date-picker 组件选择日期 -->
            <el-date-picker v-model="form.date" type="date" placeholder="选择日期" clearable @change="handleDateChange"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <!-- 使用 el-time-picker 组件选择结束时间 -->
            <el-time-picker v-model="form.end" :picker-options="endPickerOptions" placeholder="选择结束时间" clearable></el-time-picker>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

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