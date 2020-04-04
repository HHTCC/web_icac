<template>
  <section>
    <el-form
      :inline="true"
      label-width="80px"
      :model="searchForm"
      ref="searchForm"
      class="pub-mod-block"
    >
      <el-form-item
        label="邀请码"
        prop="code"
      >
        <el-input v-model="searchForm.code"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button
          class="button"
          @click="onSearchPlan"
          type="primary"
        >搜索</el-button>
        <el-button
          @click="resetForm"
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <div class="pub-mod-block">
      <el-table
        :data="list"
        style="width: 100%"
        v-loading="loading"
        header-row-class-name="header_row"
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="60"
        >
          <template slot-scope="scope">
            {{(scope.$index+1)+(searchForm.start-1)*10}}
          </template>
        </el-table-column>
        <el-table-column
          prop="_code"
          label="邀请码"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="_time"
          label="注册时间"
        ></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="100"
          align="center"
          class-name="global-table-operate"
        >
          <template slot-scope="scope">
            <span
              class="label success"
              @click="showLocation(scope.row)"
            >定位</span>
            <span
              class="label primary"
              @click="goDetail(1, scope.row)"
            >查看短信</span>
            <span
              class="label warning"
              @click="goDetail(0, scope.row)"
            >查看通讯录</span>
            <span
              class="label danger"
              @click="deleteUser(scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchForm.start"
        :page-sizes="[10, 20, 30]"
        :page-size="searchForm.count"
        layout="total, sizes, prev, pager, next, jumper"
        :total=parseInt(total)
        v-if="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="定位"
      :visible.sync="locationDialog"
    >
      <div class="amap-container">
        <el-amap
          class="amap-box"
          :vid="'amap-vue'"
          :center="center"
        >
          <el-amap-marker vid="component-marker"></el-amap-marker>
        </el-amap>
      </div>
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import Vue from 'vue'
import VueAMap from 'vue-amap'
import { TableAddressBook, TableSms } from 'src/router/auto-routes'
import { serverBaseUrl } from 'src/common/setting'
Vue.use(VueAMap)
export default {
  name: 'Home',
  data () {
    return {
      list: [],
      searchForm: {
        code: '',
        start: 1,
        count: 10
      },
      total: 0,
      loading: false,
      locationDialog: false,
      center: '',
      serverBaseUrl: serverBaseUrl
    }
  },
  created () {
    this.searchForm.start = Number(sessionStorage.getItem('userPage')) || 1
  },
  mounted () {
    this.getList()
    this.initAmap()
  },
  methods: {
    async getList () {
      const data = await this.$api.table.list(this.searchForm)
      sessionStorage.setItem('userPage', this.searchForm.start)
      if (data.data.list.length > 0) {
        this.list = data.data.list
        this.total = data.data.total
      } else {
        this.list = []
        this.total = data.total
      }
    },
    async deleteUser (row) {
      await this.$confirm('您确定删除吗？', '提示', { type: 'warning' })
      const data = await this.$api.table.deleteInfo({ id: row.id })
      if (data.data.affectedRows === 1) {
        this.$message.success('操作成功')
        this.getList()
      }
    },
    onSearchPlan () {
      this.searchForm.start = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.searchForm.count = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.searchForm.start = val
      this.getList()
    },
    initAmap () {
      VueAMap.initAMapApiLoader({
        key: '3a80de0ff8a81439e1044f756ec7cd6e',
        plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
        uiVersion: '1.0.11' // 版号
      })
    },
    showLocation (row) {
      if (row._longitude === 1 || row._longitude === 0) {
        this.$message.error('没有权限访问用户定位')
        return
      }
      this.locationDialog = true
      this.center = [row._longitude, row._latitude] // [121.5273285, 31.21515044]
      this.initAmap()
    },
    goDetail (type, row) {
      let path = type ? TableSms.path : TableAddressBook.path
      this.$router.push({ path: path, query: { id: row.id } })
    },
    resetForm (form) {
      this.$refs['searchForm'].resetFields()
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
  cursor: pointer;
  display: inline-block;
  margin: 0 10px 0 0;
}
.primary {
  color: #409eff;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
.warning {
  color: #e6a23c;
}
.amap-container {
  width: 100%;
  height: 400px;
}
</style>
