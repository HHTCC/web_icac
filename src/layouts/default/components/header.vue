<!--
/**
 * @intro: 布局头部文件.
 */
-->
<template>
  <div class="default-layout-header">
    <div class="header-bar relative">
      <div class="head-text flex">
        <i class="el-icon-bell" />
        <span>欢迎登录后台管理平台</span>
      </div>
      <div class="elSwitch">
        <span>开启IOS直播 </span>
        <el-switch v-model="iosSwitch" @change="updateIosEnable"></el-switch>
      </div>
      <el-dropdown class="head-right">
        <div class="head-user flex pointer">
          <img
            src="./images/user-img.png"
            class="head-avatar"
          />
          <span
            class="user-text"
            v-text="userInfo.nick_name"
          />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="dropdown-menu"
        >
          <el-dropdown-item
            class="dropdown-list"
            @click.native="onLogout"
          >
            <i class="icon fa fa-user" />
            <span class="user-text">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { GET_USER_INFO } from 'src/store/getters/type'
import { SET_USER_INFO } from 'src/store/actions/type'
import { UserLogin } from 'src/router/auto-routes'
import { serverBaseUrl } from 'src/common/setting'
export default {
  data () {
    return {
      iosSwitch: false
    }
  },
  methods: {
    ...mapActions({
      setUserInfo: SET_USER_INFO
    }),
    // 登出
    async onLogout () {
      const { $confirm, $message, $router, setUserInfo } = this
      try {
        await $confirm('此操作将退出登录, 是否继续?', '提示', {
          type: 'warning'
        })
        const res = await this.$api.user.logout()
        $message.success(res.data)
        setUserInfo(null)
        $router.replace(UserLogin.path)
      } catch ({ data }) {
        data && $message.warn(data)
      }
    },
    async getHome () {
      // const data = await this.$api.user.home()
      axios.get(serverBaseUrl + '/home', {
        headers: {
          'token': sessionStorage.getItem('token'),
          'account': sessionStorage.getItem('account')
        }
      }).then((res) => {
        if (res.data !== 'ok') {
          this.setUserInfo(null)
          this.$router.replace(UserLogin.path)
        }
      })
    },
    async getIosEnable () {
      const data = await this.$api.user.getIosEnable()
      if (data.code === 0) {
        this.iosSwitch = !!data.data
      }
    },
    updateIosEnable () {
      this.$api.user.updateIosEnable({enable: this.iosSwitch ? 1 : 0})
    }
  },
  computed: {
    ...mapGetters({
      userInfo: GET_USER_INFO
    })
  },
  mounted () {
    this.getIosEnable()
    // this.getHome()
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
.default-layout-header {
  padding: 0;

  .header-bar {
    padding: 0 20px;
    line-height: 56px;
    font-size: 14px;
    color: #333;
    background-color: #fff;

    .head-text {
      align-items: center;
    }

    .head-right {
      position: absolute;
      top: 0;
      right: 15px;

      .head-user {
        align-items: center;
      }

      .user-text {
        color: #333;

        &.logout {
          margin-left: 20px;
        }
      }
    }

    .head-avatar {
      margin-right: 10px;
      width: 36px;
      height: 36px;
      border-radius: 18px;
    }
  }
}
.elSwitch{
  position: absolute;
  top: 0;
  right: 200px;
}
</style>
