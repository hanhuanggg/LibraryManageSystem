<script>
export default {
  name: "Room",
  data(){
    return{
      tableData:[],
      total:0,
      pageNum:1,
      name:"",
      number:"",
      contain:0,
      area:"",
      describable:"",
      form:{},
      multipleSelection:[],
      dialogFormVisible: false,
      pageSize:10
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      this.request.get("/room/page",{
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
    },
    handleEdit(row){
      this.form=row
      this.dialogFormVisible=true
    },
    handleSelectionChange(val){
      console.log(val)
      this.multipleSelection = val
    },
    delBatch(){
      let ids= this.multipleSelection.map(v => v.id)
      this.request.post("/room/del/batch",ids).then(res=>{
        if(res.data){
          this.$message.success("批量删除成功！")
          this.load()
        }else {
          this.$message.error("删除失败！")
        }
      })
    },
    save(){
      this.request.post("/room",this.form).then(res=>
      {
        if(res.data){
          this.$message.success("添加成功！")
          this.dialogFormVisible=false;//打开弹窗
          this.load()
        }else {
          this.$message.error("添加失败！")
        }
      })
    },
    handleDel(id){
      this.request.delete("/room/"+id).then(res=>{
        if(res.data){
          this.$message.success("删除成功！")
          this.load()
        }else {
          this.$message.error("删除失败！")
        }
      })
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
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确定批量删除用户的信息吗？"
          @confirm ="delBatch"
      ><el-button type="danger" slot="reference" >批量删除<i class="el-icon-remove-outline"></i> </el-button>
      </el-popconfirm>

    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  >
      </el-table-column>
      <el-table-column prop="id" label="ID" >
      </el-table-column>
      <el-table-column prop="name" label="书籍名称" >
      </el-table-column>
      <el-table-column prop="number" label="书籍编号"   >
      </el-table-column>
      <el-table-column prop="contain" label="库存">
      </el-table-column>
      <el-table-column prop="area" label="作者" >
      </el-table-column>
      <el-table-column prop="describable" label="描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该用户的信息吗？"
              @confirm ="handleDel(scope.row.id)"
          ><el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i> </el-button>
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
      <el-dialog title="书籍信息" :visible.sync="dialogFormVisible">
        <el-form label-width="100">
          <el-form-item label="书籍名称" >
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书籍编号" >
            <el-input v-model="form.number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存" >
            <el-input v-model="form.contain" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" >
            <el-input v-model="form.area" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" >
            <el-input v-model="form.describable" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
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