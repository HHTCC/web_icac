<!--
/**
 * @intro: 默认布局.
 */
-->
<template>
  <el-container class="default-layout height_100">
    <v-menu/>
    <el-container direction="vertical">
      <v-header/>
      <el-main class="layout-container relative flex" id="elMain">
        <slot>
          <router-view class="page-module"/>
        </slot>
      </el-main>
    </el-container>
  </el-container>
</template>
<script type="text/javascript">
import VHeader from './components/header'
import VMenu from './components/menu'

export default {
  name: 'DefaultLayout',
  components: {
    VHeader,
    VMenu
  },
  mounted () {
    this.$router.afterEach((to, from, next) => {
      document.querySelector('#elMain').scrollTop = 0
    })
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .default-layout {
    .layout-container {
      .page-module {
        min-height: 100%;
      }

      background-color: #f0f0f0;
    }
  }
</style>
