<template>
  <div class="fund-detail">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <button @click="handleBack">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
        </svg>
        <span>Back</span>
      </button>
    </div>

    <!-- 日期选择器 -->
    <div class="header">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="shortcuts"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
    </div>

    <!-- K线图 -->
    <div class="chart-container">
      <div class="chart-title">K线图</div>
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      <div class="chart-description">
        K线图显示基金价格的变动。红色表示收盘价高于开盘价（上涨），绿色表示收盘价低于开盘价（下跌）。
      </div>
    </div>

    <!-- MACD图 -->
    <div class="chart-container">
      <div class="chart-title">MACD图</div>
      <div ref="macdChartRef" style="width: 100%; height: 300px;"></div>
      <div class="chart-description">
        MACD指标用于判断价格的走势。DIF是短期和长期移动平均线的差，DEA是DIF的平均。
      </div>
    </div>

    <!-- RSI图 -->
    <div class="chart-container">
      <div class="chart-title">RSI图</div>
      <div ref="rsiChartRef" style="width: 100%; height: 300px;"></div>
      <div class="chart-description">
        RSI指标用于衡量价格的相对强弱。高于70表示超买，低于30表示超卖。
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

export default {
  name: 'FundDetail',
  components: {
    ArrowLeft
  },
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const chartRef = ref(null)
    const macdChartRef = ref(null)
    const rsiChartRef = ref(null)
    let chartInstance = null
    let macdChartInstance = null
    let rsiChartInstance = null
    const dateRange = ref([])

    // 返回上一页
    const handleBack = () => {
      router.back()
    }

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value || !macdChartRef.value || !rsiChartRef.value) {
        console.error('Chart container not found')
        return
      }
      
      // 确保先销毁旧实例
      if (chartInstance) {
        chartInstance.dispose()
      }
      if (macdChartInstance) {
        macdChartInstance.dispose()
      }
      if (rsiChartInstance) {
        rsiChartInstance.dispose()
      }

      chartInstance = echarts.init(chartRef.value)
      macdChartInstance = echarts.init(macdChartRef.value)
      rsiChartInstance = echarts.init(rsiChartRef.value)
    }

    // 计算EMA
    const calculateEMA = (data, period) => {
      const k = 2 / (period + 1)
      return data.reduce((acc, value, index) => {
        if (index === 0) {
          acc.push(value)
        } else {
          acc.push(value * k + acc[index - 1] * (1 - k))
        }
        return acc
      }, [])
    }

    // 计算MACD
    const calculateMACD = (data) => {
      const shortEMA = calculateEMA(data, 12)
      const longEMA = calculateEMA(data, 26)
      const dif = shortEMA.map((val, index) => val - longEMA[index])
      const dea = calculateEMA(dif, 9)
      const macd = dif.map((val, index) => (val - dea[index]) * 2)
      return { dif, dea, macd }
    }

    // 计算RSI
    const calculateRSI = (data, period = 14) => {
      let gains = 0
      let losses = 0
      const rsi = []

      for (let i = 1; i < data.length; i++) {
        const change = data[i] - data[i - 1]
        if (change > 0) {
          gains += change
        } else {
          losses -= change
        }

        if (i >= period) {
          const avgGain = gains / period
          const avgLoss = losses / period
          const rs = avgGain / avgLoss
          rsi.push(100 - 100 / (1 + rs))

          const firstChange = data[i - period + 1] - data[i - period]
          if (firstChange > 0) {
            gains -= firstChange
          } else {
            losses += firstChange
          }
        }
      }

      return rsi
    }

    // 计算移动平均线
    const calculateMA = (data, period) => {
      return data.map((_, index, array) => {
        if (index < period - 1) return null
        const sum = array.slice(index - period + 1, index + 1).reduce((acc, val) => acc + val, 0)
        return sum / period
      })
    }

    // 渲染图表
    const renderChart = (data) => {
      if (!chartInstance || !macdChartInstance || !rsiChartInstance) {
        console.error('Chart instance not found')
        return
      }

      const kLineOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: ['K线', 'MA5', 'MA10', 'MA20'],
          top: 'top'
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.tradeDate),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false }
        },
        yAxis: {
          scale: true,
          splitArea: { show: true }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: data.map(item => [
              item.open,
              item.close,
              item.low,
              item.high
            ]),
            itemStyle: {
              color: '#f56c6c',
              color0: '#67c23a',
              borderColor: '#f56c6c',
              borderColor0: '#67c23a'
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(data.map(item => item.close), 5),
            smooth: true,
            lineStyle: { opacity: 0.5 }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(data.map(item => item.close), 10),
            smooth: true,
            lineStyle: { opacity: 0.5 }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(data.map(item => item.close), 20),
            smooth: true,
            lineStyle: { opacity: 0.5 }
          }
        ]
      }

      const closePrices = data.map(item => item.close)
      const macdData = calculateMACD(closePrices)
      const rsiData = calculateRSI(closePrices)

      const macdOption = {
        legend: {
          data: ['DIF', 'DEA', 'MACD'],
          top: 'top'
        },
        xAxis: { type: 'category', data: data.map(item => item.tradeDate) },
        yAxis: { scale: true },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: [
          { name: 'DIF', type: 'line', data: macdData.dif },
          { name: 'DEA', type: 'line', data: macdData.dea },
          { name: 'MACD', type: 'bar', data: macdData.macd }
        ]
      }

      const rsiOption = {
        legend: {
          data: ['RSI'],
          top: 'top'
        },
        xAxis: { type: 'category', data: data.map(item => item.tradeDate).slice(-rsiData.length) },
        yAxis: { scale: true },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: [
          { name: 'RSI', type: 'line', data: rsiData }
        ]
      }

      chartInstance.setOption(kLineOption)
      macdChartInstance.setOption(macdOption)
      rsiChartInstance.setOption(rsiOption)
    }

    // 获取数据
    const fetchFundData = async () => {
      if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
        console.error('Date range not set')
        return
      }

      try {
        const res = await request({
          url: '/fund/data',
          method: 'get',
          params: {
            id: route.params.id,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1]
          }
        })

        if (res.code === 200 && res.data.have) {
          renderChart(res.data.list)
        } else {
          ElMessage.warning('暂无数据')
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        ElMessage.error('获取数据失败')
      }
    }

    // 日期变化处理
    const handleDateChange = () => {
      fetchFundData()
    }

    onMounted(async () => {
      await nextTick()
      initChart()
      
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      dateRange.value = [
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      ]
      
      fetchFundData()

      window.addEventListener('resize', () => {
        chartInstance?.resize()
        macdChartInstance?.resize()
        rsiChartInstance?.resize()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        chartInstance?.resize()
        macdChartInstance?.resize()
        rsiChartInstance?.resize()
      })
      if (chartInstance) {
        chartInstance.dispose()
      }
      if (macdChartInstance) {
        macdChartInstance.dispose()
      }
      if (rsiChartInstance) {
        rsiChartInstance.dispose()
      }
    })

    return {
      chartRef,
      macdChartRef,
      rsiChartRef,
      dateRange,
      handleBack,
      shortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '最近一个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
          }
        },
        {
          text: '最近三个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            return [start, end]
          }
        },
        {
          text: '最近一年',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setFullYear(start.getFullYear() - 1)
            return [start, end]
          }
        }
      ],
      handleDateChange
    }
  }
}
</script>

<style scoped>
.fund-detail {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.nav-header {
  margin-bottom: 20px;
}

.header {
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  min-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
  font-size: 18px;
  color: #333;
}

.chart-description {
  margin-top: 10px;
  font-size: 14px;
  color: #444;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-header button {
  display: flex;
  height: 3em;
  width: 100px;
  align-items: center;
  justify-content: center;
  background-color: #e2e9f0;
  border-radius: 3px;
  letter-spacing: 1px;
  transition: all 0.2s linear;
  cursor: pointer;
  border: none;
}

.nav-header button > svg {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 20px;
  transition: all 0.4s ease-in;
}

.nav-header button:hover > svg {
  font-size: 1.2em;
  transform: translateX(-5px);
}

.nav-header button:hover {
  box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
  transform: translateY(-2px);
}
</style>
