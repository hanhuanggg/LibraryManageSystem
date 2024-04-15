<script>
export default {
  name: "Home",
  data(){
    return{
      tableData:[],
      total:0,
      pageNum:1,
      userId:"",
      date:"",
      start:"",
      end:"",
      contain:0,
      form:{
        date: null,
        start: null,
        end: null,
      },
      multipleSelection:[],
      dialogFormVisible: false,
      pageSize:10,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      startPickerOptions: {
        disabledHours: () => this.disableHours('end'),
        disabledMinutes: () => this.disableMinutes('end'),
      },
      endPickerOptions: {
        disabledHours: () => this.disableHours('start'),
        disabledMinutes: () => this.disableMinutes('start'),
      },
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      // console.log(this.date,this.start,this.end,this.contain)
      this.request.get("/room/page/on",{
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          date: this.date,
          start: this.start,
          end: this.end,
          contain: this.contain
        }
      })
          .then(res => {
            console.log(res.data.records)
            this.tableData =res.data.records
            this.total =res.data.total
          })

      // this.request.get("/role").then(res =>{
      //   this.roles = res.data
      // })
    },
    handleEdit(row){
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
    save() {
      console.log(this.form.date)
      this.form.state = "borrowing"
      this.form.id=""
      this.request.post("/reservation/saveMy", this.form)
          .then(res => {
            if (res.data) {
              this.$message.success("借阅成功！");
              this.dialogFormVisible = false; // 关闭弹窗
              this.load();
            } else {
              this.$message.error("借阅失败！");
            }
          })
          .catch(error => {
            console.error("Error saving reservation:", error);
            this.$message.error("借阅失败！发生了错误");
          });
    },
    handleDateChange() {
      // 当日期改变时更新开始时间和结束时间的默认日期
      if (this.form.date) {
        this.form.start = new Date(this.form.date);
        this.form.end = new Date(this.form.date);
      }
      if (this.date) {
        this.start = new Date(this.date);
        this.end = new Date(this.date);
      }
      // 更新禁用的小时和分钟
      this.$forceUpdate();
    },
    disableHours(type) {
      // 根据选择的日期和类型（'start'或'end'）禁用小时
    },
    disableMinutes(type) {
      // 根据选择的日期、选择的小时和类型（'start'或'end'）禁用分钟
    },
    reset(){
      this.date=""
      this.start=""
      this.end=""
      this.contain=0
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
    <div style="margin: 10px 0">
      <el-input
          style="width: 300px; margin-right: 10px"
          placeholder="请输入书籍名称"
          v-model="date"
          @input="handleBookInput"
      ></el-input>

      <el-input
          style="width: 300px; margin-right: 10px"
          placeholder="请输入作者名称"
          v-model="start"
          @input="handleAuthorInput"
      ></el-input>

      <el-input
          style="width: 300px; margin-right: 10px"
          placeholder="请输入书籍描述"
          v-model="end"
          @input="handlePressInput"
      ></el-input>
      <el-input style="width: 300px;margin: 10px"  v-model ="contain" placeholder="请输入借阅数量" suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" type="primary" @click="load()">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column prop="name" label="图书名称" >
      </el-table-column>
      <el-table-column prop="number" label="图书编号"   >
      </el-table-column>
      <el-table-column prop="contain" label="可借阅数量">
      </el-table-column>
      <el-table-column prop="area" label="作者" >
      </el-table-column>
      <el-table-column prop="describable" label="描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">借阅<i class="el-icon-s-flag"></i></el-button>
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
    <el-dialog title="借阅信息" :visible.sync="dialogFormVisible">
      <el-form label-width="100">
        <el-form :model="form" label-position="top">
          <el-form-item label="借阅日期">
            <!-- 使用 el-date-picker 组件选择日期 -->
            <el-date-picker v-model="form.date" type="date" placeholder="选择日期" clearable @change="handleDateChange"></el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间">
            <!-- 使用 el-time-picker 组件选择开始时间 -->
            <el-time-picker v-model="form.start" :picker-options="startPickerOptions" placeholder="选择开始时间" clearable></el-time-picker>
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