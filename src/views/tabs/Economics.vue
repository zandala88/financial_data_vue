<template>
  <div class="economics">
    <div class="filter-container">
      <el-radio-group v-model="currentTab" class="tabs">
        <el-radio-button label="interestRates">利率数据</el-radio-button>
        <el-radio-button label="nationalEconomy">国民经济</el-radio-button>
        <el-radio-button label="priceIndex">价格指数</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 选项卡内容 -->
    <div class="content-container">
      <div v-if="currentTab === 'interestRates'" class="tab-content">
        <div class="section-header">
          <span class="title">SHIBOR 利率数据</span>
        </div>
        <div ref="chart" class="chart"></div>
        <div class="description">
          <p>上海银行间同业拆放利率（Shanghai Interbank Offered Rate，简称Shibor），以位于上海的全国银行间同业拆借中心为技术平台计算、发布并命名，是由信用等级较高的银行组成报价团自主报出的人民币同业拆出利率计算确定的算术平均利率，是单利、无担保、批发性利率。目前，对社会公布的Shibor品种包括隔夜、1周、2周、1个月、3个月、6个月、9个月及1年。</p>
          <p>Shibor报价银行团现由18家商业银行组成。报价银行是公开市场一级交易商或外汇市场做市商，在中国货币市场上人民币交易相对活跃、信息披露比较充分的银行。中国人民银行成立Shibor工作小组，依据《上海银行间同业拆放利率（Shibor）实施准则》确定和调整报价银行团成员、监督和管理Shibor运行、规范报价行与指定发布人行为。</p>
        </div>
        <div class="rate-trends-card">
          <h3>利率波动含义</h3>
          <div class="trends-content">
            <div class="trend-item">
              <h4>上升趋势</h4>
              <ul>
                <li>可能表示通货膨胀压力增大</li>
                <li>可能表示经济活动增强</li>
                <li>可能表示市场流动性紧张</li>
              </ul>
            </div>
            <div class="trend-item">
              <h4>下降趋势</h4>
              <ul>
                <li>可能表示通货紧缩风险</li>
                <li>可能表示经济活动减弱</li>
                <li>可能表示市场流动性宽松</li>
              </ul>
            </div>
            <div class="trend-item">
              <h4>期限利差</h4>
              <ul>
                <li>长期利率与短期利率之间的差异</li>
                <li>反映市场对未来经济预期的变化</li>
                <li>影响长期投资和短期投资决策</li>
              </ul>
            </div>
            <div class="trend-item">
              <h4>波动性</h4>
              <ul>
                <li>利率水平的随机变化</li>
                <li>反映市场不确定性和风险</li>
                <li>影响投资和消费决策</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'nationalEconomy'" class="tab-content">
        <div class="section-header">
          <span class="title">国民经济数据</span>
        </div>
        <div class="economy-container">
          <div class="economy-left">
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
          <div class="economy-right">
            <div class="description-card">
              <h3>国民经济构成说明</h3>
              <div class="description-content">
                <div class="description-item">
                  <h4>第一产业</h4>
                  <p>• 包括农业、林业、畜牧业、渔业等</p>
                  <p>• 占比高：反映农业经济主导地位</p>
                  <p>• 占比低：反映工业化程度高</p>
                  <p>• 我国第一产业占比通常在7-10%之间</p>
                </div>
                <div class="description-item">
                  <h4>第二产业</h4>
                  <p>• 包括工业、建筑业等</p>
                  <p>• 占比高：反映工业化程度高</p>
                  <p>• 占比低：反映服务业发达</p>
                  <p>• 我国第二产业占比通常在35-45%之间</p>
                </div>
                <div class="description-item">
                  <h4>第三产业</h4>
                  <p>• 包括服务业、金融业、信息产业等</p>
                  <p>• 占比高：反映经济结构现代化</p>
                  <p>• 占比低：反映工业化程度不足</p>
                  <p>• 我国第三产业占比通常在45-55%之间</p>
                </div>
                <div class="description-item">
                  <h4>产业结构变化</h4>
                  <p>• 第一产业占比下降：反映农业现代化</p>
                  <p>• 第二产业占比下降：反映产业升级</p>
                  <p>• 第三产业占比上升：反映经济转型</p>
                  <p>• 发达国家第三产业占比通常超过60%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'priceIndex'" class="tab-content">
        <div class="section-header">
          <span class="title">价格指数数据</span>
        </div>
        <div class="cpi-charts-container">
          <div class="chart-wrapper">
            <div ref="cpiChart" class="chart"></div>
          </div>
          <div class="chart-wrapper">
            <div ref="cpiChart2" class="chart"></div>
          </div>
        </div>
        <div class="cpi-description">
          <div class="description-card">
            <h3>数据解读指南</h3>
            <div class="description-content">
              <div class="description-item">
                <h4>同比数据</h4>
                <p>• 与上年同月相比的变化率</p>
                <p>• 反映物价的长期变化趋势</p>
                <p>• 消除季节性因素影响</p>
              </div>
              <div class="description-item">
                <h4>环比数据</h4>
                <p>• 与上月相比的变化率</p>
                <p>• 反映物价的短期波动情况</p>
                <p>• 显示最新价格变化趋势</p>
              </div>
              <div class="description-item">
                <h4>城乡差异</h4>
                <p>• 城镇CPI：反映城市居民消费价格水平</p>
                <p>• 农村CPI：反映农村居民消费价格水平</p>
                <p>• 差异反映城乡经济发展和消费结构差异</p>
              </div>
              <div class="description-item">
                <h4>数据意义</h4>
                <p>• 上升趋势：可能表示通货膨胀压力增大</p>
                <p>• 下降趋势：可能表示通货紧缩风险</p>
                <p>• 影响货币政策、居民生活水平和投资决策</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
.economics {
  padding: 30px;
  background-color: #f9f9f9;
  min-height: 100%;
}

.filter-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.content-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  justify-content: center;
}

:deep(.el-radio-button__inner) {
  padding: 8px 24px;
  font-size: 14px;
  border: none;
  background: transparent;
  border-radius: 6px;
  margin: 0 4px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #fff;
  color: #409EFF;
  border-color: transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 6px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 6px;
}

:deep(.el-radio-button__inner:hover) {
  color: #409EFF;
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header .title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  user-select: none;
}

.chart {
  width: 100%;
  height: 500px;
  margin: 20px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  margin-top: 20px;
  padding: 20px;
  text-align: left;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rate-trends-card {
  margin-top: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.rate-trends-card h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.trends-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.trend-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.trend-item h4 {
  color: #185ee0;
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8eaed;
}

.trend-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trend-item li {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0;
  padding-left: 16px;
  position: relative;
}

.trend-item li::before {
  content: "•";
  color: #185ee0;
  position: absolute;
  left: 0;
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
    height: 300px;
  }
}

.cpi-charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.chart {
  width: 100%;
  height: 400px;
  margin: 0;
}

.cpi-description {
  margin-top: 30px;
  padding: 20px;
}

.description-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.description-card h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.description-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.description-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.description-item h4 {
  color: #185ee0;
  font-size: 16px;
  margin-bottom: 12px;
}

.description-item p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0;
}

@media (max-width: 1200px) {
  .cpi-charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .chart {
    height: 300px;
  }
  
  .gdp-value {
    font-size: 2rem;
  }
  
  .economy-right .description-content {
    grid-template-columns: 1fr;
  }
}

.economy-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  min-height: calc(100vh - 250px);
}

.economy-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.economy-right {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.economy-right .description-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.economy-right .description-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 15px 0;
}

.economy-right .description-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.gdp-display {
  margin: 0;
  flex-shrink: 0;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 400px;
  margin: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .economy-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .economy-right .description-content {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .chart {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .chart {
    min-height: 300px;
  }
  
  .gdp-value {
    font-size: 2rem;
  }
  
  .economy-right .description-content {
    grid-template-columns: 1fr;
  }
}
</style>
