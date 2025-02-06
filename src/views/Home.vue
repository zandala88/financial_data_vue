<template>
  <div class="home">
    <TabBar />
    <button class="faq-button" @click="goToUserProfile">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
          d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm89.6 32h-11.7c-22.2 10.3-46.7 16-73.9 16s-51.7-5.7-73.9-16h-11.7A134.4 134.4 0 0 0 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6a134.4 134.4 0 0 0-134.4-134.4z"
          fill="white"
        ></path>
      </svg>
      <span class="tooltip">User</span>
    </button>
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component 
            :is="Component" 
            :key="$route.fullPath"
          />
        </keep-alive>
      </router-view>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>你的关注</h3>
        <div v-if="tipData.stockRise.val !== 0 && tipData.stockRise.name !== tipData.stockFall.name">
          <p :style="{ color: tipData.stockRise.scope > 0 ? 'red' : 'green' }">
            股票涨幅最大: {{ tipData.stockRise.name }} - {{ tipData.stockRise.val }} ({{ tipData.stockRise.scope }}%)
          </p>
        </div>
        <div v-if="tipData.stockFall.val !== 0 && tipData.stockRise.name !== tipData.stockFall.name">
          <p :style="{ color: tipData.stockFall.scope > 0 ? 'red' : 'green' }">
            股票跌幅最大: {{ tipData.stockFall.name }} - {{ tipData.stockFall.val }} ({{ tipData.stockFall.scope }}%)
          </p>
        </div>
        <div v-if="tipData.stockRise.name === tipData.stockFall.name">
          <p>关注的股票: {{ tipData.stockRise.name }}</p>
        </div>
        <div v-if="tipData.fundRise.val !== 0 && tipData.fundRise.name !== tipData.fundFall.name">
          <p :style="{ color: tipData.fundRise.scope > 0 ? 'red' : 'green' }">
            基金涨幅最大: {{ tipData.fundRise.name }} - {{ tipData.fundRise.val }} ({{ tipData.fundRise.scope }}%)
          </p>
        </div>
        <div v-if="tipData.fundFall.val !== 0 && tipData.fundRise.name !== tipData.fundFall.name">
          <p :style="{ color: tipData.fundFall.scope > 0 ? 'red' : 'green' }">
            基金跌幅最大: {{ tipData.fundFall.name }} - {{ tipData.fundFall.val }} ({{ tipData.fundFall.scope }}%)
          </p>
        </div>
        <div v-if="tipData.fundRise.name === tipData.fundFall.name">
          <p>关注的基金: {{ tipData.fundRise.name }}</p>
        </div>
        <button @click="confirmTip">前往查看</button>
      </div>
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import request from '@/utils/request'

export default {
  name: 'Home',
  components: {
    TabBar
  },
  data() {
    return {
      tipData: null,
      showModal: false
    }
  },
  methods: {
    goToUserProfile() {
      this.$router.push('/user-profile')
    },
    async fetchTipData() {
      try {
        const response = await request.get('/user/tip')
        if (response.code === 200) {
          this.tipData = response.data
          if (this.tipData.exists) {
            this.showModal = true
          }
        }
      } catch (error) {
        console.error('Error fetching tip data:', error)
      }
    },
    async confirmTip() {
      try {
        const res = await request({
          url: '/user/tip/confirm',
          method: 'post'
        })

        if (res.code === 200) {
          this.$router.push('/user-profile')
        } else {
          console.error('Error confirming tip:', res.msg || '请求失败')
        }
      } catch (error) {
        console.error('Error confirming tip:', error)
      }
    }
  },
  mounted() {
    this.fetchTipData()
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.faq-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #1877f2;
  background-image: linear-gradient(0deg, rgba(24, 119, 242, 1) 0%, rgba(92, 164, 255, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.151);
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.faq-button svg {
  height: 1.5em;
  fill: white;
}

.faq-button:hover svg {
  animation: jello-vertical 0.7s both;
}

@keyframes jello-vertical {
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(0.75, 1.25, 1);
  }
  40% {
    transform: scale3d(1.25, 0.75, 1);
  }
  50% {
    transform: scale3d(0.85, 1.15, 1);
  }
  65% {
    transform: scale3d(1.05, 0.95, 1);
  }
  75% {
    transform: scale3d(0.95, 1.05, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

.tooltip {
  position: absolute;
  top: -20px;
  opacity: 0;
  background-color: #1877f2;
  background-image: linear-gradient(0deg, rgba(24, 119, 242, 1) 0%, rgba(92, 164, 255, 1) 100%);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-duration: 0.2s;
  pointer-events: none;
  letter-spacing: 0.5px;
}

.tooltip::before {
  position: absolute;
  content: "";
  width: 10px;
  height: 10px;
  background-color: #1877f2;
  background-size: 1000%;
  background-position: center;
  transform: rotate(45deg);
  bottom: -15%;
  transition-duration: 0.3s;
}

.faq-button:hover .tooltip {
  top: -40px;
  opacity: 1;
  transition-duration: 0.3s;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.modal-content p {
  font-size: 1em;
  margin: 10px 0;
  color: #555;
}

.modal-content button {
  background-color: #1877f2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content button:hover {
  background-color: #145dbf;
}
</style> 