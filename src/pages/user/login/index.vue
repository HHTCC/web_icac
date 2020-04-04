<route-config>
  {
  layoutName:'full',
  meta:{
  auth: false
  }
  }
</route-config>
<template>
  <div class="page-module login-container backgroundCover flex width_100 height_100">
    <div
      class="login-panel"
      @keyup.enter="onSubmit"
    >
      <div class="head-text align_center">
        <img src="./images/login_logo.png">
      </div>
      <el-form
        class="login-form"
        size="medium"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账户名："
            autofocus
            v-model="form.account"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入账户密码："
            v-model="form.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="width_100"
            icon="el-icon-check"
            @click="onSubmit"
            :loading="submitLoad"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapActions } from 'vuex'
import { SET_USER_INFO } from 'src/store/actions/type'
import { homePage } from 'src/common/setting'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        account: null,
        password: null
      },
      rules: {
        account: [{ required: true, message: '请输入账户名！', trigger: 'blur' }],
        password: [{ required: true, message: '请输入账户密码！', trigger: 'blur' }]
      },
      submitLoad: false
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      setUserInfo: SET_USER_INFO
    }),
    onSubmit () {
      const { $refs, form, $api, $message, setUserInfo, $router } = this
      $refs.form.validate(async (valid) => {
        if (!valid) return false
        this.submitLoad = true
        try {
          const rs = await $api.user.login(form)
          if (rs.code === 0) {
            let data = JSON.parse(rs.data)
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('account', data.account)
            setUserInfo(data)
            $message.success('登录成功')
            $router.replace(homePage)
          } else {
            $message.error(rs.data)
          }
        } finally {
          this.submitLoad = false
        }
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
.login-container {
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-image: url(./images/login_body.jpg);

  .login-panel {
    padding: 25px 15px;
    width: 350px;
    border-radius: 3px;
    background-color: #fff;
  }

  .head-text {
    width: 85px;
    margin: 0 auto 25px;
  }
}
</style>
