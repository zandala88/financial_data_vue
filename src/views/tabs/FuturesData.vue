<template>
  <div class="futures-calendar">
    <select v-model="selectedProduct" @change="fetchDetailData" class="product-select">
      <option v-for="product in products" :key="product.value" :value="product.value">
        {{ product.label }}
      </option>
    </select>
    
    <div class="chart-container">
      <div id="volume-chart" style="width: 100%; height: 400px;"></div>
      <div class="chart-description">
        <h3>成交量说明</h3>
        <p>显示期货合约在特定时间段内的交易数量。成交量增加表示市场活跃度提高，交易者参与度增加；成交量减少表示市场活跃度降低，交易者观望情绪增加。异常放量可能预示着市场即将发生重大变化。</p>
      </div>
    </div>

    <div class="chart-container">
      <div id="amount-chart" style="width: 100%; height: 400px;"></div>
      <div class="chart-description">
        <h3>成交金额说明</h3>
        <p>显示期货合约在特定时间段内的交易总金额。金额增加表示市场资金流入增加，金额减少表示市场资金流出或观望。与成交量结合分析可以判断市场热度。</p>
      </div>
    </div>

    <div class="chart-container">
      <div id="interest-chart" style="width: 100%; height: 400px;"></div>
      <div class="chart-description">
        <h3>持仓量说明</h3>
        <p>显示期货合约在特定时间点的未平仓合约数量。持仓量增加表示市场参与者对未来走势存在分歧，持仓量减少表示市场参与者对当前价格达成共识。持仓量变化可以反映市场情绪和预期。</p>
      </div>
    </div>

    <div class="chart-container">
      <div id="close-chart" style="width: 100%; height: 400px;"></div>
      <div class="chart-description">
        <h3>收盘价说明</h3>
        <p>显示期货主力合约的每日收盘价格。价格上涨表示市场看涨情绪，价格下跌表示市场看跌情绪。价格波动幅度可以反映市场风险程度。</p>
      </div>
    </div>

    <div class="usage-tips">
      <h3>使用技巧</h3>
      <ul>
        <li>可以通过图表下方的滑块调整时间范围，查看不同时期的数据</li>
        <li>使用鼠标滚轮可以放大缩小图表，更清晰地查看细节</li>
        <li>多个图表可以联动分析，比如：成交量增加+价格上涨表示强势上涨信号，成交量减少+价格下跌表示弱势下跌信号</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.futures-calendar {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.futures-calendar:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-select {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s, background-color 0.3s;
}

.product-select:focus {
  border-color: #007bff;
  background-color: #ffffff;
  outline: none;
}

.chart-container {
  margin-top: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-description {
  margin-top: 15px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.chart-description h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.chart-description p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.usage-tips {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.usage-tips h3 {
  color: #333;
  margin-bottom: 15px;
}

.usage-tips ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.usage-tips li {
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
  margin-bottom: 10px;
}

.usage-tips li:before {
  content: "•";
  color: #007bff;
  position: absolute;
  left: 0;
}
</style>

<script>
import request from '@/utils/request'
import * as echarts from 'echarts'

export default {
  name: 'FuturesCalendar',
  data() {
    return {
      selectedProduct: 'CU',
      products: [],
      detailData: []
    }
  },
  created() {
    this.fetchDetailData()
    this.fetchProductsData()
  },
  methods: {
    fetchDetailData() {
      request.get(`/fut/detail?prd=${this.selectedProduct}`)
        .then(response => {
          if (response.code === 200) {
            this.detailData = response.data.list
            this.renderCharts()
          }
        })
        .catch(error => {
          console.error('获取详细数据失败:', error)
        })
    },
    fetchProductsData() {
      request.get('/fut/query')
        .then(response => {
          if (response.code === 200) {
            this.products = response.data.list.map(item => ({
              label: item.name,
              value: item.prd
            }))
          }
        })
        .catch(error => {
          console.error('获取产品数据失败:', error)
        })
    },
    renderCharts() {
      this.renderVolumeChart()
      this.renderAmountChart()
      this.renderInterestChart()
      this.renderCloseChart()
    },
    renderVolumeChart() {
      const chartDom = document.getElementById('volume-chart')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '成交量'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.map(item => item.weekDate)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '成交量',
            type: 'bar',
            data: this.detailData.map(item => item.vol),
            itemStyle: {
              color: '#5470C6'
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ]
      }
      myChart.setOption(option)
    },
    renderAmountChart() {
      const chartDom = document.getElementById('amount-chart')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '成交金额'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.map(item => item.weekDate)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '成交金额',
            type: 'line',
            data: this.detailData.map(item => item.amount),
            itemStyle: {
              color: '#91CC75'
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ]
      }
      myChart.setOption(option)
    },
    renderInterestChart() {
      const chartDom = document.getElementById('interest-chart')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '持仓量'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.map(item => item.weekDate)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '持仓量',
            type: 'line',
            data: this.detailData.map(item => item.openInterest),
            lineStyle: {
              width: 3
            },
            itemStyle: {
              color: '#EE6666'
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ]
      }
      myChart.setOption(option)
    },
    renderCloseChart() {
      const chartDom = document.getElementById('close-chart')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '本周主力合约收盘价'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.map(item => item.weekDate)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '收盘价',
            type: 'line',
            data: this.detailData.map(item => item.mcClose),
            areaStyle: {},
            itemStyle: {
              color: '#73C0DE'
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script> 