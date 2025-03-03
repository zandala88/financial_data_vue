<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="fade-in">创建账号</h2>
      <el-form 
        ref="registerForm" 
        :model="form" 
        :rules="rules" 
        class="slide-up"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="邮箱"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="verifyCode" class="verify-code-container">
          <div class="verify-code-wrapper">
            <el-input 
              v-model="form.verifyCode" 
              placeholder="验证码"
            />
            <el-button 
              class="verify-code-btn"
              :disabled="!isEmailValid || cooldown > 0"
              @click="getVerifyCode"
            >
              {{ cooldown > 0 ? `${cooldown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-button 
          type="primary" 
          class="submit-btn" 
          @click="submitForm"
        >
          注册
        </el-button>
      </el-form>
      <div class="switch-link fade-in">
        已有账号? <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        verifyCode: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, message: '用户名长度不能小于2位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
        ]
      },
      cooldown: 0,
      isEmailValid: false
    }
  },
  watch: {
    'form.email'(val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.isEmailValid = emailRegex.test(val)
    }
  },
  methods: {
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.handleSubmit()
        } else {
          ElMessage.warning('请正确填写所有必填项')
          return false
        }
      })
    },
    async getVerifyCode() {
      if (!this.form.email || !this.isEmailValid) {
        ElMessage.warning('请先输入正确的邮箱地址')
        return
      }
      
      try {
        const res = await request({
          url: '/code',
          method: 'get',
          params: {
            email: this.form.email
          }
        })
        
        if (res.code === 200) {
          this.cooldown = 60
          this.startCooldown()
          ElMessage.success('验证码已发送，请查收邮件')
        } else {
          ElMessage.error(res.msg || '获取验证码失败')
        }
      } catch (error) {
        console.error('获取验证码错误:', error)
        ElMessage.error('获取验证码失败，请稍后重试')
      }
    },
    async handleSubmit() {
      try {
        const res = await request({
          url: '/register',
          method: 'post',
          data: {
            email: this.form.email,
            password: this.form.password,
            username: this.form.username,
            code: this.form.verifyCode
          }
        })

        if (res.code === 200) {
          localStorage.setItem('token', res.data.token)
          ElMessage.success({
            message: '注册成功，3秒后自动跳转...',
            duration: 3000
          })
          setTimeout(() => {
            this.$router.push('/user-profile')
          }, 3000)
        } else {
          ElMessage.error(res.msg || '注册失败')
        }
      } catch (error) {
        console.error('注册错误:', error)
        ElMessage.error('注册失败，请稍后重试')
      }
    },
    startCooldown() {
      const timer = setInterval(() => {
        this.cooldown--
        if (this.cooldown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.auth-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(10px);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.auth-box:hover {
  transform: translateY(-5px);
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  user-select: none;
}

.slide-up {
  opacity: 0;
  animation: fadeInUp 0.5s forwards 0.2s;
}

.switch-link {
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.switch-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.switch-link a:hover {
  color: #357abd;
  text-decoration: underline;
}

:deep(.el-input__wrapper) {
  background: rgba(236, 240, 243, 0.8);
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #4a90e2;
  background: white;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}

:deep(.el-form-item__error) {
  padding-left: 12px;
}

:deep(.el-button) {
  border-radius: 12px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

:deep(.el-button:active) {
  transform: translateY(0);
}

.submit-btn {
  width: 100%;
}

.verify-code-container {
  position: relative;
}

.verify-code-wrapper {
  position: relative;
  width: 100%;
}

.verify-code-wrapper :deep(.el-input__wrapper) {
  background: rgba(236, 240, 243, 0.8);
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: none;
  padding-right: 120px; /* 为按钮预留更多空间 */
  transition: all 0.3s ease;
}

.verify-code-wrapper :deep(.el-input__wrapper.is-focus) {
  border-color: #4a90e2;
  background: white;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}

.verify-code-btn {
  position: absolute;
  right: 2px;  /* 配合2px的border */
  top: 2px;
  bottom: 2px;
  margin: 0;
  height: auto !important;
  padding: 0 15px;
  font-size: 14px;
  border: none;
  background: #f5f5f5;
  color: #666;
  z-index: 1;
  border-radius: 10px;  /* 稍微小于输入框的圆角 */
  transition: all 0.3s ease;
}

.verify-code-btn:not(:disabled) {
  background: #4a90e2;
  color: white;
}

.verify-code-btn:not(:disabled):hover {
  background: #357abd;
  transform: none !important;
  box-shadow: none !important;
}

.verify-code-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
</style>