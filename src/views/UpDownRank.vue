<template>
  <div class="up-down-rank">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()" type="primary" plain>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
      <div class="header-title">
        <h2>预测涨跌排行榜</h2>
      </div>
      <div class="header-right">
        <el-select v-model="size" @change="fetchAllData" class="size-select">
          <el-option :value="10" label="显示10条" />
          <el-option :value="20" label="显示20条" />
        </el-select>
      </div>
    </div>

    <!-- 排行榜内容 -->
    <div class="rank-content">
      <!-- 上涨排行 -->
      <div class="rank-section up-rank">
        <h3>涨幅排行</h3>
        <div class="rank-list">
          <div 
            v-for="(item, index) in upList" 
            :key="item.id" 
            class="rank-item"
            @click="goToDetail(item.id)"
          >
            <span class="rank-number">{{ index + 1 }}</span>
            <div class="stock-info">
              <div class="stock-name">{{ item.name }}</div>
            </div>
            <div class="change-percent up">+{{ item.score }}%</div>
          </div>
        </div>
      </div>

      <!-- 下跌排行 -->
      <div class="rank-section down-rank">
        <h3>跌幅排行</h3>
        <div class="rank-list">
          <div 
            v-for="(item, index) in downList" 
            :key="item.id" 
            class="rank-item"
            @click="goToDetail(item.id)"
          >
            <span class="rank-number">{{ index + 1 }}</span>
            <div class="stock-info">
              <div class="stock-name">{{ item.name }}</div>
            </div>
            <div class="change-percent down">-{{ item.score }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { ArrowLeft } from '@element-plus/icons-vue'

export default {
  name: 'UpDownRank',
  components: {
    ArrowLeft
  },
  data() {
    return {
      size: 10,
      upList: [],
      downList: []
    }
  },
  created() {
    this.fetchAllData()
  },
  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchRankData('up'),
        this.fetchRankData('down')
      ])
    },
    async fetchRankData(types) {
      try {
        const response = await request.get('/stock/rank', {
          params: {
            types,
            size: this.size
          }
        })
        if (response.code === 200) {
          if (types === 'up') {
            this.upList = response.data.list || []
          } else {
            this.downList = response.data.list || []
          }
        }
      } catch (error) {
        console.error(`获取${types}排行数据失败:`, error)
      }
    },
    goToDetail(id) {
      window.open(`/stock/detail/${id}`, '_blank')
    }
  }
}
</script>

<style scoped>
.up-down-rank {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 16px 24px;
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-left {
  justify-self: start;
}

.header-title {
  text-align: center;
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.header-right {
  justify-self: end;
}

.size-select {
  width: 120px;
}

.rank-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.rank-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e6e6e6;
}

.rank-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: white;
  border-radius: 50%;
  margin-right: 16px;
  font-size: 14px;
  font-weight: bold;
}

.rank-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.rank-section {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-width: 0; /* 防止内容溢出 */
}

.rank-section h3 {
  text-align: center;
  margin-bottom: 24px;
  color: #303133;
  font-size: 18px;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-weight: bold;
  color: #333;
}

.stock-code {
  font-size: 12px;
  color: #666;
}

.change-percent {
  font-weight: bold;
  min-width: 90px;
  text-align: right;
  font-size: 16px;
}

.change-percent.up {
  color: #f56c6c;
}

.change-percent.down {
  color: #67c23a;
}

@media (max-width: 768px) {
  .page-header {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .header-left, .header-title, .header-right {
    justify-self: center;
  }

  .rank-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .rank-section {
    margin-bottom: 16px;
  }
}
</style>