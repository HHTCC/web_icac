<template>
  <section>
    <div slot="header" class="pub-mod-block">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>通讯录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="pub-mod-block" v-if="!state">
      <a class="label" v-if="list.length>0" :href="serverBaseUrl+'/export_phone_number_list?id='+id">导出表格</a>
      <el-table :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)" v-loading="loading">
        <el-table-column type="index" label="序号">
          <template slot-scope="scope">
            {{(scope.$index+1)+(currentPage-1)*10}}
          </template>
        </el-table-column>
        <el-table-column prop="n" label="昵称"></el-table-column>
        <el-table-column prop="m" label="手机号"></el-table-column>
      </el-table>
      <el-pagination
      style="margin-top:20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=parseInt(total)>
      </el-pagination>
    </div>
    <div class="pub-mod-block" v-else>
      <p style="text-align:center;line-height: 200px;color: #666;">o(╥﹏╥)o 用户没有开放权限，无法拿到数据！</p>
    </div>
  </section>
</template>
<script type="text/javascript">
import { serverBaseUrl } from 'src/common/setting'
export default {
  name: 'Home',
  data () {
    return {
      list: [],
      searchForm: {
        time: ''
      },
      loading: false,
      total: 0,
      currentPage: 1,
      pagesize: 10,
      id: this.$route.query.id,
      serverBaseUrl: serverBaseUrl,
      state: ''
    }
  },
  mounted () {
    this.loading = true
    this.getList()
  },
  methods: {
    async getList () {
      const res = await this.$api.table.phoneNumber({id: this.id})
      let data = res.data
      this.loading = false
      if (data.length && data[0]._phone_numbers_json_array === 1) {
        this.state = 1
      } else {
        this.state = 0
      }
      if (data.length > 0 && JSON.parse(data[0]._phone_numbers_json_array).length > 0) {
        this.list = JSON.parse(data[0]._phone_numbers_json_array)
        this.total = this.list.length
      } else {
        this.list = []
        this.total = 0
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    }
  }
}
</script>
<style lang="scss" scoped>
.pub-mod-block {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}
.label {
  float: right;
  width: 100px;
  border: 1px solid #409EFF;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  margin: 0 10px 0 0;
  color: #409EFF;
}
</style>
