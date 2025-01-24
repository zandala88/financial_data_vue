<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="fade-in">登入账号</h2>
      <el-form ref="loginForm" :model="form" :rules="rules" class="slide-up">
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <div class="forgot-password">
          <a href="#">忘记密码?</a>
        </div>
        <el-button type="primary" class="submit-btn" @click="submitForm">
          登录
        </el-button>
      </el-form>
      <div class="switch-link fade-in">
        还没有账号? <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { Message, Lock } from "@element-plus/icons-vue";

export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.handleSubmit();
        } else {
          ElMessage.warning("请正确填写所有必填项");
          return false;
        }
      });
    },
    async handleSubmit() {
      try {
        const res = await request({
          url: "/login",
          method: "post",
          data: {
            email: this.form.email,
            password: this.form.password,
          },
        });

        if (res.code === 200) {
          localStorage.setItem("token", res.data.token);
          ElMessage.success({
            message: "登录成功，3秒后自动跳转...",
            duration: 3000,
          });
          setTimeout(() => {
            this.$router.push("/");
          }, 3000);
        } else {
          ElMessage.error(res.msg || "登录失败");
        }
      } catch (error) {
        console.error("登录错误:", error);
        ElMessage.error("登录失败，请稍后重试");
      }
    },
  },
};
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

.form-group {
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.5s forwards;
}

.form-group:nth-child(1) {
  animation-delay: 0.2s;
}
.form-group:nth-child(2) {
  animation-delay: 0.4s;
}

input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(236, 240, 243, 0.8);
}

input:focus {
  border-color: #4a90e2;
  background: white;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}

.forgot-password {
  text-align: right;
  margin: 10px 0 20px;
  opacity: 0;
  animation: fadeIn 0.5s forwards 0.6s;
  user-select: none;
}

.forgot-password a {
  color: #666;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: #4a90e2;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s forwards 0.8s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.switch-link {
  margin-top: 25px;
  color: #666;
  font-size: 14px;
  opacity: 0;
  animation: fadeIn 0.5s forwards 1s;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  width: 100%;
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
</style>