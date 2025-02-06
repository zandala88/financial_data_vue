<template>
  <div class="container">
    <div class="tabs">
      <input type="radio" id="radio-1" name="tabs" v-model="currentTab" value="interestRates">
      <label class="tab" for="radio-1">利率数据</label>
      
      <input type="radio" id="radio-2" name="tabs" v-model="currentTab" value="nationalEconomy">
      <label class="tab" for="radio-2">国民经济</label>
      
      <input type="radio" id="radio-3" name="tabs" v-model="currentTab" value="priceIndex">
      <label class="tab" for="radio-3">价格指数</label>
      
      <span class="glider"></span>
    </div>

    <!-- 选项卡内容 -->
    <div class="tab-content" v-if="currentTab === 'interestRates'">
      <div ref="chart" class="chart"></div>
      <div class="description">
        <p>上海银行间同业拆放利率（Shanghai Interbank Offered Rate，简称Shibor），以位于上海的全国银行间同业拆借中心为技术平台计算、发布并命名，是由信用等级较高的银行组成报价团自主报出的人民币同业拆出利率计算确定的算术平均利率，是单利、无担保、批发性利率。目前，对社会公布的Shibor品种包括隔夜、1周、2周、1个月、3个月、6个月、9个月及1年。</p>
        <p>Shibor报价银行团现由18家商业银行组成。报价银行是公开市场一级交易商或外汇市场做市商，在中国货币市场上人民币交易相对活跃、信息披露比较充分的银行。中国人民银行成立Shibor工作小组，依据《上海银行间同业拆放利率（Shibor）实施准则》确定和调整报价银行团成员、监督和管理Shibor运行、规范报价行与指定发布人行为。</p>
      </div>
    </div>
    <div v-if="currentTab === 'nationalEconomy'">
      <div class="selector">
        <div class="select-wrapper">
          <select v-model="selectedYear" class="styled-select">
            <option value="" disabled>选择年份</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
          </select>
          <span class="select-arrow"></span>
        </div>
        <div class="select-wrapper">
          <select v-model="selectedQuarter" class="styled-select">
            <option value="" disabled>选择季度</option>
            <option v-for="quarter in quarters" :key="quarter" :value="quarter">第{{ quarter }}季度</option>
          </select>
          <span class="select-arrow"></span>
        </div>
        <button @click="fetchGdpData" class="styled-button">
          <span>获取数据</span>
        </button>
      </div>
      <div class="gdp-display">
        <div class="gdp-card">
          <h2>国内生产总值(GDP)</h2>
          <div class="gdp-value">{{ gdpData.gdp }} 亿元</div>
        </div>
      </div>
      <div ref="gdpChart" class="chart"></div>
    </div>
    <div v-if="currentTab === 'priceIndex'">
      <div ref="cpiChart" class="chart"></div>
      <div ref="cpiChart2" class="chart"></div>
      <div ref="cpiChart3" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      currentTab: 'interestRates', // 默认显示的选项卡
      shiborData: [],
      selectedYear: '2024',
      selectedQuarter: '1',
      years: Array.from({ length: 33 }, (_, i) => (1992 + i).toString()),
      quarters: ['1', '2', '3', '4'],
      gdpData: {},
      cpiData: []
    };
  },
  methods: {
    async fetchShiborData() {
      try {
        const res = await request({
          url: '/economics/shibor',
          method: 'get'
        });
        
        if (res.code === 200) {
          this.shiborData = res.data.list;
          this.initChart();
        }
      } catch (error) {
        console.error('获取利率数据失败:', error);
      }
    },
    initChart() {
      const chart = echarts.init(this.$refs.chart);
      const dates = this.shiborData.map(item => item.date);
      const onRates = this.shiborData.map(item => item.on);
      const oneWRates = this.shiborData.map(item => item.oneW);
      const twoWRates = this.shiborData.map(item => item.twoW);
      const oneMRates = this.shiborData.map(item => item.oneM);
      const threeMRates = this.shiborData.map(item => item.threeM);
      const sixMRates = this.shiborData.map(item => item.sixM);
      const nineMRates = this.shiborData.map(item => item.nineM);
      const oneYRates = this.shiborData.map(item => item.oneY);

      const option = {
        title: {
          text: 'SHIBOR 利率',
          left: 'center',
          top: '5%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['隔夜', '一周', '两周', '一个月', '三个月', '六个月', '九个月', '一年'],
          top: '10%'
        },
        grid: {
          top: '20%'
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'slider', // 滑动条缩放
            start: 0,
            end: 100
          },
          {
            type: 'inside' // 鼠标滚轮缩放
          }
        ],
        series: [
          {
            name: '隔夜',
            type: 'line',
            data: onRates
          },
          {
            name: '一周',
            type: 'line',
            data: oneWRates
          },
          {
            name: '两周',
            type: 'line',
            data: twoWRates
          },
          {
            name: '一个月',
            type: 'line',
            data: oneMRates
          },
          {
            name: '三个月',
            type: 'line',
            data: threeMRates
          },
          {
            name: '六个月',
            type: 'line',
            data: sixMRates
          },
          {
            name: '九个月',
            type: 'line',
            data: nineMRates
          },
          {
            name: '一年',
            type: 'line',
            data: oneYRates
          }
        ]
      };

      chart.setOption(option);
    },
    async fetchGdpData() {
      try {
        const res = await request({
          url: '/economics/cn_gdp',
          method: 'get',
          params: {
            year: this.selectedYear,
            quarter: this.selectedQuarter
          }
        });

        if (res.code === 200) {
          this.gdpData = res.data.list[0];
          this.initGdpChart();
        } else if (res.code === 2005) {
          ElMessage({
            message: '暂无该时间段的数据',
            type: 'warning',
            duration: 3000
          });
          // 清空当前数据
          this.gdpData = {};
          // 清空饼图
          if (this.$refs.gdpChart) {
            const chart = echarts.init(this.$refs.gdpChart);
            chart.clear();
          }
        }
      } catch (error) {
        console.error('获取国民经济数据失败:', error);
        ElMessage.error('数据获取失败，请稍后重试');
        // 发生错误时也清空数据和图表
        this.gdpData = {};
        if (this.$refs.gdpChart) {
          const chart = echarts.init(this.$refs.gdpChart);
          chart.clear();
        }
      }
    },
    initGdpChart() {
      const chart = echarts.init(this.$refs.gdpChart);
      const total = this.gdpData.pi + this.gdpData.si + this.gdpData.ti;
      const option = {
        title: {
          text: '国民经济数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}亿元 ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 'bottom',
          data: ['第一产业', '第二产业', '第三产业']
        },
        series: [
          {
            name: 'GDP 组成',
            type: 'pie',
            radius: '50%',
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside'
            },
            data: [
              { 
                value: this.gdpData.pi, 
                name: '第一产业',
                itemStyle: { color: '#91CC75' }
              },
              { 
                value: this.gdpData.si, 
                name: '第二产业',
                itemStyle: { color: '#5470C6' }
              },
              { 
                value: this.gdpData.ti, 
                name: '第三产业',
                itemStyle: { color: '#FAC858' }
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      chart.setOption(option);
    },
    async fetchCpiData() {
      try {
        const res = await request({
          url: '/economics/cn_cpi',
          method: 'get'
        });

        if (res.code === 200) {
          this.cpiData = res.data.list;
          this.initCpiChart();
          this.initCpiChart2();
          this.initCpiChart3();
        }
      } catch (error) {
        console.error('获取价格指数数据失败:', error);
        ElMessage.error('数据获取失败，请稍后重试');
      }
    },
    initCpiChart() {
      const chart = echarts.init(this.$refs.cpiChart);
      const months = this.cpiData.map(item => item.month);
      const ntYoy = this.cpiData.map(item => item.ntYoy);
      const townYoy = this.cpiData.map(item => item.townYoy);
      const cntYoy = this.cpiData.map(item => item.cntYoy);

      const option = {
        title: {
          text: '居民消费价格指数同比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全国', '城镇', '农村'],
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全国',
            type: 'line',
            data: ntYoy
          },
          {
            name: '城镇',
            type: 'line',
            data: townYoy
          },
          {
            name: '农村',
            type: 'line',
            data: cntYoy
          }
        ]
      };

      chart.setOption(option);
    },
    initCpiChart2() {
      const chart = echarts.init(this.$refs.cpiChart2);
      const months = this.cpiData.map(item => item.month);
      const ntMom = this.cpiData.map(item => item.ntMom);
      const townMom = this.cpiData.map(item => item.townMom);
      const cntMom = this.cpiData.map(item => item.cntMom);

      const option = {
        title: {
          text: '居民消费价格指数环比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全国', '城镇', '农村'],
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全国',
            type: 'line',
            data: ntMom
          },
          {
            name: '城镇',
            type: 'line',
            data: townMom
          },
          {
            name: '农村',
            type: 'line',
            data: cntMom
          }
        ]
      };

      chart.setOption(option);
    },
    initCpiChart3() {
      const chart = echarts.init(this.$refs.cpiChart3);
      const months = this.cpiData.map(item => item.month);
      const ntAccu = this.cpiData.map(item => item.ntAccu);
      const townAccu = this.cpiData.map(item => item.townAccu);
      const cntAccu = this.cpiData.map(item => item.cntAccu);

      const option = {
        title: {
          text: '居民消费价格指数累计值',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全国', '城镇', '农村'],
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全国',
            type: 'line',
            data: ntAccu
          },
          {
            name: '城镇',
            type: 'line',
            data: townAccu
          },
          {
            name: '农村',
            type: 'line',
            data: cntAccu
          }
        ]
      };

      chart.setOption(option);
    }
  },
  mounted() {
    if (this.currentTab === 'interestRates') {
      this.fetchShiborData();
    } else if (this.currentTab === 'nationalEconomy') {
      this.fetchGdpData();
    } else if (this.currentTab === 'priceIndex') {
      this.fetchCpiData();
    }
  },
  watch: {
    currentTab(newTab) {
      if (newTab === 'interestRates') {
        this.fetchShiborData();
      } else if (newTab === 'nationalEconomy') {
        this.fetchGdpData();
      } else if (newTab === 'priceIndex') {
        this.fetchCpiData();
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 2rem;
  border-radius: 12px;
}

.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 99px;
  width: auto;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.tabs * {
  z-index: 2;
}

.container input[type="radio"] {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 80px;
  font-size: .8rem;
  color: black;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in, background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab:hover {
  background-color: #e6eef9;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: 10px;
  left: 30%;
  font-size: 10px;
  margin-left: 0.75rem;
  border-radius: 50%;
  margin: 0px;
  background-color: #e6eef9;
  transition: 0.15s ease-in;
}

.container input[type="radio"]:checked + label {
  color: #185ee0;
}

.container input[type="radio"]:checked + label > .notification {
  background-color: #185ee0;
  color: #fff;
  margin: 0px;
}

.container input[id="radio-1"]:checked ~ .glider {
  transform: translateX(0);
}

.container input[id="radio-2"]:checked ~ .glider {
  transform: translateX(100%);
}

.container input[id="radio-3"]:checked ~ .glider {
  transform: translateX(200%);
}

.glider {
  position: absolute;
  display: flex;
  height: 30px;
  width: 80px;
  background-color: #e6eef9;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

.tab-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.chart {
  width: 1000px;
  height: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  position: relative;
  width: 200px;
  height: 250px;
  border-radius: 14px;
  z-index: 1111;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}

.bg {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 190px;
  height: 240px;
  z-index: 2;
  background: rgba(255, 255, 255, .95);
  backdrop-filter: blur(24px);
  border-radius: 10px;
  overflow: hidden;
  outline: 2px solid white;
}

.blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ff0000;
  opacity: 1;
  filter: blur(12px);
  animation: blob-bounce 5s infinite ease;
}

@keyframes blob-bounce {
  0% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-100%, -100%) translate3d(100%, 0, 0);
  }
  50% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }
  75% {
    transform: translate(-100%, -100%) translate3d(0, 100%, 0);
  }
  100% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
}

.description {
  margin-top: 20px;
  padding: 20px;
  text-align: left;
  max-width: 800px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 700px) {
  .tabs {
    transform: scale(0.6);
  }
}

.selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.select-wrapper {
  position: relative;
  min-width: 120px;
}

.styled-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 0.8rem 2rem 0.8rem 1rem;
  font-size: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.styled-select:hover {
  border-color: #185ee0;
}

.styled-select:focus {
  outline: none;
  border-color: #185ee0;
  box-shadow: 0 0 0 3px rgba(24, 94, 224, 0.15);
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #666;
  pointer-events: none;
}

.styled-button {
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: linear-gradient(135deg, #185ee0, #1254d6);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(24, 94, 224, 0.15);
}

.styled-button:hover {
  background-color: #1254d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 94, 224, 0.15);
}

.styled-button:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .selector {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .select-wrapper {
    width: 100%;
    max-width: 300px;
  }
  
  .styled-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .chart {
    width: 100%;
    height: auto;
  }
}

.gdp-display {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.gdp-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.gdp-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #185ee0;
  margin: 1rem 0;
}

.gdp-details {
  margin-top: 1.5rem;
}

.gdp-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.gdp-item:last-child {
  border-bottom: none;
}
</style>
