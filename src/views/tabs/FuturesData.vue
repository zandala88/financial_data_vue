<template>
  <div class="futures-calendar">
    <select v-model="selectedProduct" @change="fetchDetailData" class="product-select">
      <option v-for="product in products" :key="product.value" :value="product.value">
        {{ product.label }}
      </option>
    </select>
    <div id="volume-chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
    <div id="amount-chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
    <div id="interest-chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
    <div id="close-chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
    <div id="yoy-chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
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
      this.renderYoyChart()
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
    },
    renderYoyChart() {
      const chartDom = document.getElementById('yoy-chart')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '同比增减'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['成交量同比', '金额同比', '持仓量环比']
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
            name: '成交量同比',
            type: 'bar',
            data: this.detailData.map(item => item.volYoy),
            itemStyle: {
              color: '#FAC858'
            }
          },
          {
            name: '金额同比',
            type: 'bar',
            data: this.detailData.map(item => item.amountYoy),
            itemStyle: {
              color: '#EE6666'
            }
          },
          {
            name: '持仓量环比',
            type: 'bar',
            data: this.detailData.map(item => item.interestWow),
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