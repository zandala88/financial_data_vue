<template>
  <div class="fund-market">


    <!-- 筛选条件 -->
    <div class="filter-section">
      <!-- 基金类型 -->
      <div class="filter-item">
        <span class="label">基金类型：</span>
        <div class="tags">
          <el-tag
            v-for="type in fundTypeList"
            :key="type"
            :class="{ active: selectedFundTypes.includes(type) }"
            @click="handleFundTypeSelect(type)"
            :effect="selectedFundTypes.includes(type) ? 'dark' : 'plain'"
            size="default"
          >
            {{ type }}
          </el-tag>
        </div>
      </div>

      <!-- 投资类型 -->
      <div class="filter-item">
        <span class="label">投资类型：</span>
        <div class="tags">
          <el-tag
            v-for="type in investTypeList"
            :key="type"
            :class="{ active: selectedInvestTypes.includes(type) }"
            @click="handleInvestTypeSelect(type)"
            :effect="selectedInvestTypes.includes(type) ? 'dark' : 'plain'"
            size="default"
          >
            {{ type }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <form class="form">
        <label for="search">
          <input
            required
            autocomplete="off"
            placeholder="搜索基金名称/代码"
            id="search"
            type="text"
            v-model="searchKeyword"
            @input="handleSearch"
          />
          <div class="icon">
            <svg
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="swap-on"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
            <svg
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="swap-off"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
          <button type="reset" class="close-btn" @click="searchKeyword = ''">
            <svg
              viewBox="0 0 20 20"
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
        </label>
      </form>
    </div>

    <!-- 表格部分 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="基金名称" min-width="110" />
        <el-table-column prop="management" label="基金管理人" min-width="110" />
        <el-table-column prop="custodian" label="托管人" min-width="100" />
        <el-table-column prop="fundType" label="基金类型" min-width="100" />
        <el-table-column prop="investType" label="投资类型" min-width="100" />
        <el-table-column label="费率" min-width="130">
          <template #default="{ row }">
            <div>管理费：{{ row.mFree }}%</div>
            <div>托管费：{{ row.cFree }}%</div>
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最小申购金额" min-width="90">
          <template #default="{ row }">
            {{ row.minAmount || '0' }}元
          </template>
        </el-table-column>
        <el-table-column prop="benchmark" label="业绩比较基准" min-width="180" show-overflow-tooltip />
        <el-table-column 
          label="操作" 
          width="100" 
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// 防抖函数
const useDebounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export default {
  name: 'FundMarket',
  
  setup() {
    const router = useRouter()
    const tableData = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')
    const fundTypeList = ref([])
    const investTypeList = ref([])
    const selectedFundTypes = ref([])
    const selectedInvestTypes = ref([])
    const instChart = ref(null)

    // 获取表格数据
    const fetchTableData = async () => {
      loading.value = true
      try {
        const params = new URLSearchParams()
        
        params.append('page', currentPage.value)
        params.append('pageSize', pageSize.value)

        if (searchKeyword.value.trim()) {
          params.append('search', searchKeyword.value.trim())
        }

        selectedFundTypes.value.forEach(type => {
          params.append('fundType', type)
        })

        selectedInvestTypes.value.forEach(type => {
          params.append('investType', type)
        })

        const res = await request({
          url: '/fund/list',
          method: 'get',
          params
        })

        if (res.code === 200) {
          tableData.value = res.data.list
          total.value = res.data.count
        } else {
          ElMessage.error('获取基金列表失败')
        }
      } catch (error) {
        console.error('获取基金列表失败:', error)
        ElMessage.error('获取基金列表失败')
      } finally {
        loading.value = false
      }
    }

    // 使用防抖包装的获取数据函数
    const debouncedFetchData = useDebounce(() => {
      currentPage.value = 1
      fetchTableData()
    }, 500)

    // 监听搜索关键词变化
    watch(searchKeyword, (newVal) => {
      if (newVal !== null) {
        debouncedFetchData()
      }
    })

    // 监听筛选条件变化
    watch([selectedFundTypes, selectedInvestTypes], () => {
      currentPage.value = 1
      fetchTableData()
    }, { deep: true })

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchTableData()
    }

    // 处理每页条数变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      fetchTableData()
    }

    // 查看详情
    const handleViewDetail = async (row) => {
      try {
        const res = await request({
          url: '/fund/have',
          method: 'get',
          params: { id: row.id }
        })

        if (res.code === 200) {
          if (res.data.have) {
            router.push({
              name: 'FundDetail',
              params: { id: row.id }
            })
          } else {
            ElMessage.warning('暂无该基金数据')
          }
        } else {
          ElMessage.error('检查基金数据失败')
        }
      } catch (error) {
        console.error('检查基金数据失败:', error)
        ElMessage.error('检查基金数据失败')
      }
    }

    // 获取筛选条件
    const fetchFilterOptions = async () => {
      try {
        const res = await request({
          url: '/fund/query',
          method: 'get'
        })

        if (res.code === 200) {
          fundTypeList.value = res.data.fundTypeList
          investTypeList.value = res.data.investTypeList
        } else {
          ElMessage.error('获取筛选条件失败')
        }
      } catch (error) {
        console.error('获取筛选条件失败:', error)
        ElMessage.error('获取筛选条件失败')
      }
    }

    // 选择基金类型
    const handleFundTypeSelect = (type) => {
      const index = selectedFundTypes.value.indexOf(type)
      if (index === -1) {
        selectedFundTypes.value.push(type)
      } else {
        selectedFundTypes.value.splice(index, 1)
      }
    }

    // 选择投资类型
    const handleInvestTypeSelect = (type) => {
      const index = selectedInvestTypes.value.indexOf(type)
      if (index === -1) {
        selectedInvestTypes.value.push(type)
      } else {
        selectedInvestTypes.value.splice(index, 1)
      }
    }

    // 渲染机构图表
    const renderInstChart = (data) => {
      const chart = echarts.init(instChart.value)
      chart.setOption({
        title: {
          text: '机构排名',
          left: 'center'
        },
        legend: {
          top: 'bottom',
          padding: [10, 0, 0, 0]
        },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: data.map(item => `${item.year} ${item.quarter}`) },
        yAxis: { type: 'value' },
        series: [
          { name: '基金规模', type: 'line', data: data.map(item => item.fundScale) },
          { name: '总规模', type: 'line', data: data.map(item => item.scale) }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 20
          }
        ]
      })
      window.addEventListener('resize', () => chart.resize())
    }

    onMounted(() => {
      fetchFilterOptions()
      fetchTableData()
    })

    return {
      searchKeyword,
      fundTypeList,
      investTypeList,
      selectedFundTypes,
      selectedInvestTypes,
      tableData,
      loading,
      currentPage,
      pageSize,
      total,
      handleFundTypeSelect,
      handleInvestTypeSelect,
      handleCurrentChange,
      handleSizeChange,
      handleViewDetail,
      Search,
      instChart
    }
  }
}
</script>

<style scoped>
.fund-market {
  padding: 20px;
  background-color: #f5f7fa;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 32px;
  padding: 0 10px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.label {
  flex-shrink: 0;
  width: 90px;
  color: #606266;
  font-size: 14px;
  padding-right: 12px;
}

.tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.el-tag {
  margin: 0;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  border: 1px solid #e4e7ed;
  background: #fff;
  color: #606266;
  transition: all 0.3s;
}

.el-tag:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.el-tag.active {
  color: #fff;
  border-color: #409eff;
  background-color: #409eff;
}

:deep(.el-tag .el-tag__close) {
  color: #909399;
}

:deep(.el-tag .el-tag__close:hover) {
  color: #409eff;
  background-color: transparent;
}

.search-container {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  align-items: center;
}

.form {
  --input-bg: #f0f0f0;
  --padding: 1.5em;
  --rotate: 80deg;
  --gap: 2em;
  --icon-change-color: #15a986;
  --height: 40px;
  width: 100%;
  padding-inline-end: 1em;
  background: var(--input-bg);
  position: relative;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.form label {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--height);
}

.form input {
  width: 100%;
  padding-inline-start: calc(var(--padding) + var(--gap));
  outline: none;
  background: none;
  border: 0;
}

.form svg {
  color: #111;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  height: 15px;
}

.icon {
  position: absolute;
  left: var(--padding);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.swap-off {
  transform: rotate(-80deg);
  opacity: 0;
  visibility: hidden;
}

.close-btn {
  background: none;
  border: none;
  right: calc(var(--padding) - var(--gap));
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  padding: 0.1em;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: 0.3s;
  opacity: 0;
  transform: scale(0);
  visibility: hidden;
}

.form input:focus ~ .icon {
  transform: rotate(var(--rotate)) scale(1.3);
}

.form input:focus ~ .icon .swap-off {
  opacity: 1;
  transform: rotate(-80deg);
  visibility: visible;
  color: var(--icon-change-color);
}

.form input:focus ~ .icon .swap-on {
  opacity: 0;
  visibility: visible;
}

.form input:valid ~ .icon {
  transform: scale(1.3) rotate(var(--rotate));
}

.form input:valid ~ .icon .swap-off {
  opacity: 1;
  visibility: visible;
  color: var(--icon-change-color);
}

.form input:valid ~ .icon .swap-on {
  opacity: 0;
  visibility: visible;
}

.form input:valid ~ .close-btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: 0s;
}

.table-section {
  margin-top: 20px;
  padding: 0 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
  font-size: 14px;
}

:deep(.el-table th) {
  font-weight: 500;
  color: #000;
}

:deep(.el-pagination) {
  justify-content: flex-end;
}

:deep(.el-button--link) {
  padding: 2px 0;
  font-size: 14px;
}

/* 移除旧的按钮样式 */
.c-button,
.c-button--gooey,
.c-button__blobs,
.c-button--gooey .c-button__blobs div {
  display: none;
}

/* 添加新的按钮样式 */
:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style> 