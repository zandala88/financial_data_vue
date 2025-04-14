<template>
  <div class="user-profile">
    <div v-if="!userInfo" class="loading-wave">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
    </div>
    <div v-else>
      <div class="header">
        <button @click="goBack" class="back-button">返回</button>
        <div class="user-info">
          <div class="user-details">
            <p><strong>用户名：</strong>{{ userInfo.username }} <strong>邮箱：</strong>{{ userInfo.email }}</p>
            <p class="user-tip">点击右上角"退出登录"按钮可以安全退出系统</p>
          </div>
        </div>
        <button @click="logout" class="logout-button">退出登录</button>
      </div>
      <div class="content">
        <div class="watchlist stocks">
          <h2>股票关注列表</h2>
          <p class="list-tip">点击任意股票可查看详细信息，鼠标悬停可查看预测值</p>
          <p class="color-tip">红色表示预测上涨，绿色表示预测下跌，白色表示数据不足无法预测</p>
          <ul>
            <li v-for="stock in userInfo.stockList" :key="stock.id"
                @click="goToDetail('stock', stock.id)"
                @mouseover="hoveredStock = stock.id"
                @mouseleave="hoveredStock = null"
                :style="{ backgroundColor: stock.nextVal === 0 ? 'white' : (stock.nextVal > stock.val ? 'lightcoral' : 'lightgreen') }">
              {{ stock.name }}
              <span v-if="hoveredStock === stock.id" class="prediction">
                - 预测值: {{ stock.nextVal === 0 ? '暂无预测值' : stock.nextVal }}
              </span>
            </li>
          </ul>
        </div>
        <div class="watchlist funds">
          <h2>基金关注列表</h2>
          <p class="list-tip">点击任意基金可查看详细信息，鼠标悬停可查看预测值</p>
          <p class="color-tip">红色表示预测上涨，绿色表示预测下跌，白色表示数据不足无法预测</p>
          <ul>
            <li v-for="fund in userInfo.fundList" :key="fund.id"
                @click="goToDetail('fund', fund.id)"
                @mouseover="hoveredFund = fund.id"
                @mouseleave="hoveredFund = null"
                :style="{ backgroundColor: fund.nextVal === 0 ? 'white' : (fund.nextVal > fund.val ? 'lightcoral' : 'lightgreen') }">
              {{ fund.name }}
              <span v-if="hoveredFund === fund.id" class="prediction">
                - 预测值: {{ fund.nextVal === 0 ? '暂无预测值' : fund.nextVal }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'UserProfile',
  data() {
    return {
      userInfo: null,
      hoveredStock: null,
      hoveredFund: null
    }
  },
  created() {
    this.fetchUserInfo()
  },
  methods: {
    async fetchUserInfo() {
      try {
        const res = await request({
          url: '/user/info',
          method: 'get'
        })
        
        if (res.code === 200) {
          this.userInfo = res.data
        } else {
          console.error('获取用户信息失败:', res.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
    },
    goBack() {
      this.$router.push('/')
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    goToDetail(type, id) {
      if (type === 'stock') {
        this.$router.push(`/stock/detail/${id}`)
      } else if (type === 'fund') {
        this.$router.push(`/fund/detail/${id}`)
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f7fa; /* 更柔和的背景色 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-details {
  text-align: right;
}

.user-details p {
  display: inline-block;
  margin-right: 20px; /* 增加右边距 */
}

.content {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 80px);
}

.watchlist {
  width: 48%;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

p, li {
  font-size: 18px;
  color: #444;
  margin: 12px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  margin: 8px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.prediction {
  color: #333; /* 修改为更深的颜色 */
  font-weight: bold; /* 可选：加粗文本 */
}

.back-button, .logout-button {
  padding: 10px 15px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button:hover, .logout-button:hover {
  background: linear-gradient(45deg, #0056b3, #003f7f);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logout-button {
  background: linear-gradient(45deg, #dc3545, #c82333);
}

.logout-button:hover {
  background: linear-gradient(45deg, #c82333, #a71d2a);
}

.loading-wave {
  width: 400px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-bar {
  width: 30px;
  height: 15px;
  margin: 0 8px;
  background-color: #3498db;
  border-radius: 5px;
  animation: loading-wave-animation 1s ease-in-out infinite;
}

.loading-bar:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-bar:nth-child(3) {
  animation-delay: 0.2s;
}

.loading-bar:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes loading-wave-animation {
  0% {
    height: 15px;
  }

  50% {
    height: 75px;
    background-color: #2980b9; /* 动画中间颜色变化 */
  }

  100% {
    height: 15px;
  }
}

.user-tip {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}

.list-tip {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
  font-style: italic;
}

.color-tip {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 15px;
  font-style: italic;
  background-color: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
}
</style>