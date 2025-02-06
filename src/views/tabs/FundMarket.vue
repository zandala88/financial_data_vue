<template>
  <div class="fund-market">
    <!-- 图表部分 -->
    <div class="chart-section">
      <div ref="radioChart" class="chart-container"></div>
      <div ref="instChart" class="chart-container"></div>
    </div>

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
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索基金名称/代码"
        :prefix-icon="Search"
        clearable
      >
        <template #append>
          <el-button>搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 表格部分 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="基金名称" min-width="120" />
        <el-table-column prop="management" label="基金管理人" min-width="120" />
        <el-table-column prop="custodian" label="托管人" min-width="100" />
        <el-table-column prop="fundType" label="基金类型" min-width="100" />
        <el-table-column prop="investType" label="投资类型" min-width="100" />
        <el-table-column label="费率" min-width="150">
          <template #default="{ row }">
            <div>管理费：{{ row.mFree }}%</div>
            <div>托管费：{{ row.cFree }}%</div>
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最小申购金额" min-width="120">
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
            <button class="c-button c-button--gooey" @click="handleViewDetail(row)">
              查看详情
              <div class="c-button__blobs">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </button>
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
    const radioChart = ref(null)
    const instChart = ref(null)

    // 获取图表数据
    const fetchGraphData = async () => {
      try {
        const res = await request({
          url: '/fund/graph',
          method: 'get'
        })

        if (res.code === 200) {
          renderRadioChart(res.data.radio)
          renderInstChart(res.data.inst)
        } else {
          ElMessage.error('获取图表数据失败')
        }
      } catch (error) {
        console.error('获取图表数据失败:', error)
        ElMessage.error('获取图表数据失败')
      }
    }

    // 渲染比例图表
    const renderRadioChart = (data) => {
      const chart = echarts.init(radioChart.value)
      const option = {
        title: {
          text: '各类型占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: 'bottom',
          padding: [10, 0, 0, 0]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.year)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '银行',
            type: 'bar',
            stack: 'total',
            data: data.map(item => item.bank)
          },
          {
            name: '证券公司',
            type: 'bar',
            stack: 'total',
            data: data.map(item => item.secComp)
          },
          {
            name: '基金公司',
            type: 'bar',
            stack: 'total',
            data: data.map(item => item.fundComp)
          },
          {
            name: '独立基金销售机构',
            type: 'bar',
            stack: 'total',
            data: data.map(item => item.indepComp)
          },
          {
            name: '其他',
            type: 'bar',
            stack: 'total',
            data: data.map(item => item.rests)
          }
        ]
      }
      chart.setOption(option)
      window.addEventListener('resize', () => chart.resize())
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
          total.value = res.data.totalPageNum * pageSize.value
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

    onMounted(() => {
      fetchFilterOptions()
      fetchTableData()
      fetchGraphData()
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
      radioChart,
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
  padding: 16px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 32px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.label {
  flex-shrink: 0;
  width: 70px;
  color: #606266;
  font-size: 14px;
}

.tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-tag {
  margin: 0;
  cursor: pointer;
  border-radius: 2px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
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
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

:deep(.el-tag .el-tag__close) {
  color: #909399;
}

:deep(.el-tag .el-tag__close:hover) {
  color: #409eff;
  background-color: transparent;
}

.search-section {
  margin-top: 20px;
  padding: 0 16px;
}

:deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
  padding: 0 15px;
}

:deep(.el-input-group__append:hover) {
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

:deep(.el-input__wrapper) {
  padding-right: 0;
}

:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input-group__append button) {
  border: none;
  color: white;
  background: transparent;
  padding: 0;
}

:deep(.el-input-group__append button:hover) {
  color: white;
  background: transparent;
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
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-pagination) {
  justify-content: flex-end;
}

:deep(.el-button--link) {
  padding: 2px 0;
  font-size: 14px;
}

.c-button {
  color: #000;
  font-weight: 700;
  font-size: 11px;
  text-decoration: none;
  padding: 0.9em 1.6em;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  z-index: 1;
}

.c-button--gooey {
  color: #06c8d9;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 4px solid #06c8d9;
  border-radius: 0;
  position: relative;
  transition: all 700ms ease;
}

.c-button--gooey .c-button__blobs {
  height: 100%;
  filter: url(#goo);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: -3px;
  right: -1px;
  z-index: -1;
}

.c-button--gooey .c-button__blobs div {
  background-color: #06c8d9;
  width: 34%;
  height: 100%;
  border-radius: 100%;
  position: absolute;
  transform: scale(1.4) translateY(125%) translateZ(0);
  transition: all 700ms ease;
}

.c-button--gooey .c-button__blobs div:nth-child(1) {
  left: -5%;
}

.c-button--gooey .c-button__blobs div:nth-child(2) {
  left: 30%;
  transition-delay: 60ms;
}

.c-button--gooey .c-button__blobs div:nth-child(3) {
  left: 66%;
  transition-delay: 25ms;
}

.c-button--gooey:hover {
  color: #fff;
}

.c-button--gooey:hover .c-button__blobs div {
  transform: scale(1.4) translateY(0) translateZ(0);
}
</style> 