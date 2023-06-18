<template>
  <div class="box">
    <div class="bgImg">
      <img src="../../public/bgimg.jpg" alt="" />
    </div>
    <div class="login-panel">
      <n-card title="管理后台登录" class="nCard" :bordered="false" v-if="showLogin.count == 1 ? true : false">
        <n-form :rules="rules" :model="admin">
          <n-form-item path="account" label="账号">
            <n-input v-model:value="admin.account" placeholder="请输入账号" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="admin.rember" label="记住我" />
        <n-button strong secondary type="primary" @click="login" style="margin-left: 15.5rem;">登录</n-button>
          <n-button strong secondary  type="info" @click="signIn" style="margin-left: 1rem;">
            注册
          </n-button>
        </template>
      </n-card>
      <n-card title="管理后台注册" class="nCard" :bordered="false" v-else>
        <n-form :rules="rules" :model="admin">
          <n-form-item path="userName" label="名称">
            <n-input v-model:value="admin.userName" placeholder="请输入名称" />
          </n-form-item>
          <n-form-item path="account" label="账号">
            <n-input v-model:value="admin.account" placeholder="请输入账号" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
          </n-form-item>
          <n-form-item path="email" label="邮箱">
            <n-input v-model:value="admin.email" type="password" placeholder="请输入邮箱" />
          </n-form-item>
        </n-form>
        <template #footer>
        <n-button strong secondary type="primary" @click="backlogin" style="margin-left: 18.5rem;">返回登录</n-button>
          <n-button strong secondary  type="info" @click="signIn" style="margin-left: 1rem;">
            注册
          </n-button>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const adminStore = AdminStore()

const showLogin = reactive({
  count: 1
})

let rules = {
   userName: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在 3 到 12 个字符', trigger: 'blur' },
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在 3 到 12 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' },
  ],
}
const admin = reactive({
  account: localStorage.getItem('account') || '',
  password: localStorage.getItem('password') || '',
  rember: localStorage.getItem('rember') == 1 || false,
})


const login = async () => {
  let result = await axios.post('/admin/login', {
    account: admin.account,
    password: admin.password,
  })
  if (result.data.code == 200) {
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id
    if (admin.rember) {
      localStorage.setItem('account', admin.account)
      localStorage.setItem('password', admin.password)
      localStorage.setItem('rember', admin.rember ? 1 : 0)
    } else {
      window.localStorage.removeItem('account')
      window.localStorage.removeItem('password')
      window.localStorage.removeItem('rember')
    }
    router.push('/dashboard')
    message.info('登录成功')
  } else {
    message.error('登录失败')
  }
}

const signIn = async () => {
  showLogin.count = 0
  let result = await axios.post('/admin/signIn', {
    account: admin.account,
    password: admin.password,
  })
  if (result.data.code == 200) {
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id
    if (admin.rember) {
      localStorage.setItem('account', admin.account)
      localStorage.setItem('password', admin.password)
      localStorage.setItem('rember', admin.rember ? 1 : 0)
    } else {
      window.localStorage.removeItem('account')
      window.localStorage.removeItem('password')
      window.localStorage.removeItem('rember')
    }
    router.push('/dashboard')
    message.info('登录成功')
  } else {
    message.error('登录失败')
  }
}

const backlogin = ()=>{
  showLogin.count = 1
}

</script>

<style lang="scss" scoped>
.box {
  position: relative;
}

.login-panel {
  position: absolute;
  width: 500px;
  margin: 0 auto;
  left: 50%;
  margin-left: -250px;
  margin-top: 250px;
  background: rgba(29, 29, 31, 0.10);
  backdrop-filter: saturate(100%) blur(20px);
  font-size: large
}

.nCard {
  background: rgba(29, 29, 31, 0);

}


.bgImg {
  position: absolute;
  width: 100%;
}

.test {
  width: 100px;
  height: 100px;
  background-color: aqua;
}
</style>
