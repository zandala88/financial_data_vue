<template>
  <div class="stock-detail">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="left-section">
        <button
          class="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
          type="button"
          @click="handleBack"
        >
          <div
            class="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <p class="translate-x-2">Back</p>
        </button>
        <!-- 书签复选框 -->
        <div class="bookmark-checkbox">
          <input
            type="checkbox"
            id="bookmark-toggle"
            class="bookmark-checkbox__input"
            v-model="follow"
          />
          <label for="bookmark-toggle" class="bookmark-checkbox__label">
            <svg class="bookmark-checkbox__icon" viewBox="0 0 24 24">
              <path
                class="bookmark-checkbox__icon-back"
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
              ></path>
              <path
                class="bookmark-checkbox__icon-check"
                d="M8 11l3 3 5-5"
              ></path>
            </svg>
          </label>
        </div>
      </div>
      <!-- 新增按钮容器 -->
      <div class="button-container">
        <button class="new-button" @click="toggleAIAnalysisModal">
          AI分析
        </button>
        <button class="new-button" @click="togglePredictionModal">
          预测结果
        </button>
        <button class="new-button" @click="toggleModal">利润表</button>
        <button class="new-button" @click="toggleForecastModal">
          业绩报告
        </button>
        <button class="new-button" @click="toggleTop10Modal">十大股东</button>
      </div>
    </div>

    <!-- 预测结果弹窗 -->
    <!-- <div v-if="isPredictionModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closePredictionModal">&times;</div>
        <h3>预测结果</h3>
        <div ref="predictionChartRef" style="width: 100%; height: 600px"></div>
      </div>
    </div> -->

    <div v-if="isPredictionModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closePredictionModal">&times;</div>
        <h3>预测结果</h3>
        <div class="prediction-metrics">
          <div class="metric-item">
            <span class="metric-label">涨跌准确率:</span>
            <span class="metric-value">{{ accuracyData.accuracy }}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">
              <span class="info-icon" title="R² 系数，也叫 决定系数（Coefficient of Determination），是衡量回归模型好坏的常用指标之一，它反映了 模型对观测数据的拟合程度。R² 的取值范围是 0 到 1，值越大说明模型越能解释数据的变异性。">?</span>
              R² 决定系数:
            </span>
            <span class="metric-value">{{ accuracyData.r2 }}%</span>
          </div>
        </div>
        <div ref="predictionChartRef" style="width: 100%; height: 600px"></div>
      </div>
    </div>

    <!-- 利润表弹窗 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeModal">&times;</div>
        <h2 class="modal-title">利润表分析</h2>
        
        <!-- 营业收支分析 -->
        <div class="chart-section">
          <h3 class="chart-section-title">营业收支分析</h3>
          <div class="chart-description">
            <p>此图表展示了公司的营业收入、成本及利润情况：</p>
            <ul>
              <li>营业总收入：反映公司的整体经营规模</li>
              <li>营业总成本：包括原材料、人工、制造费用等各项支出</li>
              <li>利润总额：反映公司的整体盈利能力</li>
              <li>净利润：最终归属于股东的利润</li>
            </ul>
            <p>数据变动分析：</p>
            <ul>
              <li>收入增长但利润下降：可能表示成本控制出现问题</li>
              <li>收入利润同步增长：表示经营效率提升</li>
              <li>收入下降但利润上升：可能表示成本控制改善</li>
            </ul>
          </div>
          <div ref="incomeChartRef" style="width: 100%; height: 400px"></div>
        </div>

        <!-- 每股收益分析 -->
        <div class="chart-section">
          <h3 class="chart-section-title">每股收益分析</h3>
          <div class="chart-description">
            <p>基本每股收益(EPS)是衡量公司盈利能力的重要指标：</p>
            <ul>
              <li>EPS上升：表示公司盈利能力增强，股东回报提高</li>
              <li>EPS下降：可能表示公司经营效率下降或股本扩张</li>
              <li>EPS波动：反映公司经营的稳定性</li>
            </ul>
            <p>投资参考：</p>
            <ul>
              <li>持续增长的EPS通常意味着较好的投资价值</li>
              <li>EPS与股价的比值(市盈率)是重要的估值指标</li>
            </ul>
          </div>
          <div ref="epsChartRef" style="width: 100%; height: 300px"></div>
        </div>

        <!-- 所得税分析 -->
        <div class="chart-section">
          <h3 class="chart-section-title">所得税费用分析</h3>
          <div class="chart-description">
            <p>所得税费用反映了公司的税收负担：</p>
            <ul>
              <li>所得税率变化：可能反映税收政策调整或公司享受税收优惠</li>
              <li>所得税与利润的关系：反映实际税负水平</li>
              <li>异常波动：可能涉及税收筹划或会计处理变更</li>
            </ul>
            <p>分析要点：</p>
            <ul>
              <li>关注所得税率是否合理</li>
              <li>注意是否存在税收优惠政策</li>
              <li>警惕异常的税收波动</li>
            </ul>
          </div>
          <div ref="taxChartRef" style="width: 100%; height: 300px"></div>
        </div>
      </div>
    </div>

    <!-- 业绩报告弹窗 -->
    <div v-if="isForecastModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeForecastModal">&times;</div>
        <div
          ref="forecastChartRef"
          style="width: 100%; height: 300px; margin-top: 70px"
        ></div>
        <!-- 新增表格展示业绩报告数据 -->
        <table class="forecast-table">
          <thead>
            <tr>
              <th>公告日期</th>
              <th>类型</th>
              <th>最小变化</th>
              <th>最大变化</th>
              <th>最小净利润</th>
              <th>最大净利润</th>
              <th>上期净利润</th>
              <th>变化原因</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in forecastData" :key="item.annDate">
              <td>{{ item.annDate }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.pChangeMin }}</td>
              <td>{{ item.pChangeMax }}</td>
              <td>{{ item.netProfitMin }}</td>
              <td>{{ item.netProfitMax }}</td>
              <td>{{ item.lastParentNet }}</td>
              <td class="reason-cell" @click="showReason(item.changeReason)">{{ item.changeReason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 十大股东弹窗 -->
    <div v-if="isTop10ModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeTop10Modal">&times;</div>
        <div class="pie-chart-container">
          <div
            ref="top10PieChartRef"
            style="width: 100%; height: 450px; margin-top: 10px"
          ></div>
          <div class="pie-chart-title">股东持股比例变化</div>
        </div>
        <table class="top10-table">
          <thead>
            <tr>
              <th>公告日期</th>
              <th>股东名称</th>
              <th>持股数量</th>
              <th>持股比例</th>
              <th>流通股比例</th>
              <th>持股变动</th>
              <th>股东类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in top10Data" :key="item.holderName">
              <td>{{ item.annDate }}</td>
              <td>{{ item.holderName }}</td>
              <td>{{ item.holdAmount }}</td>
              <td>{{ item.holdRatio }}</td>
              <td>{{ item.holdFloatRatio }}</td>
              <td>{{ item.holdChange }}</td>
              <td>{{ item.holderType }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI分析固定窗口 -->
    <div v-if="isAIAnalysisModalOpen" class="fixed-ai-analysis">
      <div class="close" @click="closeAIAnalysisModal">&times;</div>
      <h3>AI 分析结果：</h3>
      <div
        v-for="(msg, index) in aiMessages"
        :key="index"
        v-html="renderMarkdown(msg)"
        class="ai-message"
      ></div>
    </div>

    <!-- 公司信息 -->
    <div class="company-info">
      <div class="company-name">{{ stockInfo.name }}</div>
      <div class="company-details">
        <span>行业: {{ stockInfo.industry }}</span>
        <span>市场: {{ stockInfo.market }}</span>
      </div>
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
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
      <div class="chart-description">
        <h4>K线图走势分析</h4>
        <p>K线图走势反映了股票价格的变动趋势：</p>
        <ul>
          <li>上升趋势：连续出现多个红色K线，且每个K线的收盘价高于前一个K线的收盘价</li>
          <li>下降趋势：连续出现多个绿色K线，且每个K线的收盘价低于前一个K线的收盘价</li>
          <li>横盘整理：K线在相对窄幅区间内波动，没有明显的上升或下降趋势</li>
          <li>突破形态：价格突破前期高点或低点，可能预示着趋势的改变</li>
        </ul>
        <p>移动平均线的走势含义：</p>
        <ul>
          <li>均线多头排列：短期均线在长期均线上方，表示上升趋势</li>
          <li>均线空头排列：短期均线在长期均线下方，表示下降趋势</li>
          <li>均线粘合：多条均线相互靠近，表示市场处于盘整状态</li>
          <li>均线发散：均线之间距离扩大，表示趋势正在加强</li>
        </ul>
      </div>
    </div>

    <!-- MACD图 -->
    <div class="chart-container">
      <div class="chart-title">MACD图</div>
      <div ref="macdChartRef" style="width: 100%; height: 300px"></div>
      <div class="chart-description">
        <h4>MACD走势分析</h4>
        <p>MACD指标走势反映了市场趋势的强弱变化：</p>
        <ul>
          <li>DIF线上升：表示短期趋势向上，市场看涨情绪增强</li>
          <li>DIF线下降：表示短期趋势向下，市场看跌情绪增强</li>
          <li>DEA线上升：表示中期趋势向上，市场整体向好</li>
          <li>DEA线下降：表示中期趋势向下，市场整体走弱</li>
        </ul>
        <p>MACD柱状图的走势含义：</p>
        <ul>
          <li>柱状图由负转正：空头力量减弱，多头力量增强，可能迎来上涨</li>
          <li>柱状图由正转负：多头力量减弱，空头力量增强，可能迎来下跌</li>
          <li>柱状图持续放大：当前趋势正在加强</li>
          <li>柱状图持续缩小：当前趋势正在减弱</li>
        </ul>
      </div>
    </div>

    <!-- RSI图 -->
    <div class="chart-container">
      <div class="chart-title">RSI图</div>
      <div ref="rsiChartRef" style="width: 100%; height: 300px"></div>
      <div class="chart-description">
        <h4>RSI走势分析</h4>
        <p>RSI指标走势反映了市场买卖力量的对比：</p>
        <ul>
          <li>RSI持续上升：表示买方力量增强，市场处于强势</li>
          <li>RSI持续下降：表示卖方力量增强，市场处于弱势</li>
          <li>RSI在50以上波动：市场处于多头主导状态</li>
          <li>RSI在50以下波动：市场处于空头主导状态</li>
        </ul>
        <p>RSI走势的特殊形态：</p>
        <ul>
          <li>RSI与价格形成顶背离：价格上涨但RSI下降，预示可能见顶回落</li>
          <li>RSI与价格形成底背离：价格下跌但RSI上升，预示可能见底反弹</li>
          <li>RSI突破下降趋势线：预示下跌趋势可能结束</li>
          <li>RSI跌破上升趋势线：预示上涨趋势可能结束</li>
        </ul>
      </div>
    </div>

    <!-- 添加变化原因弹窗 -->
    <div v-if="showReasonModal" class="reason-modal">
      <div class="reason-modal-content">
        <div class="reason-modal-header">
          <h3>变化原因详情</h3>
          <span class="close" @click="closeReasonModal">&times;</span>
        </div>
        <div class="reason-modal-body">
          {{ selectedReason }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { debounce } from "lodash";
import MarkdownIt from "markdown-it";

export default {
  name: "StockDetail",
  components: {
    ArrowLeft,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const chartRef = ref(null);
    const macdChartRef = ref(null);
    const rsiChartRef = ref(null);
    const incomeChartRef = ref(null);
    const epsChartRef = ref(null);
    const taxChartRef = ref(null);
    const forecastChartRef = ref(null);
    const top10PieChartRef = ref(null);
    const predictionChartRef = ref(null);
    let chartInstance = null;
    let macdChartInstance = null;
    let rsiChartInstance = null;
    let incomeChartInstance = null;
    let epsChartInstance = null;
    let taxChartInstance = null;
    let forecastChartInstance = null;
    let top10PieChartInstance = null;
    let predictionChartInstance = null;
    let reader = null;
    const dateRange = ref([]);
    const stockInfo = ref({
      name: "",
      industry: "",
      market: "",
      iList: [],
      mList: [],
    });
    const isModalOpen = ref(false);
    const isForecastModalOpen = ref(false);
    const forecastData = ref([]);
    const isTop10ModalOpen = ref(false);
    const top10Data = ref([]);
    const rankData = ref([]);
    const predictionData = ref({ list: [], val: 0 });
    const isPredictionModalOpen = ref(false);
    const follow = ref(false);
    const isAIAnalysisModalOpen = ref(false);
    const aiMessages = ref([]);
    let eventSource = null;
    let buffer = ""; // 用于存储未处理的流数据
    const md = new MarkdownIt({
      breaks: false, // 禁用自动换行
    });
    const accuracyData = ref({
      accuracy: "",
      r2: "",
    });
    const showReasonModal = ref(false);
    const selectedReason = ref('');
    
    // 更新关注状态
    const updateFollowStatus = debounce(async () => {
      try {
        await request({
          url: "/stock/follow",
          method: "post",
          data: {
            id: parseInt(route.params.id, 10),
            follow: follow.value,
          },
        });
      } catch (error) {
        console.error("更新关注状态失败:", error);
        ElMessage.error("更新关注状态失败");
      }
    }, 300); // 300ms 防抖

    // 监听 follow 变化
    watch(follow, () => {
      updateFollowStatus();
    });

    // 获取股票信息
    const fetchStockInfo = async () => {
      try {
        const res = await request({
          url: "/stock/info",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          stockInfo.value = res.data;
          follow.value = res.data.follow; // 更新 follow 状态
        } else {
          ElMessage.warning("获取股票信息失败");
        }
      } catch (error) {
        console.error("获取股票信息失败:", error);
        ElMessage.error("获取股票信息失败");
      }
    };

    // 计算EMA
    const calculateEMA = (dayCount, data) => {
      const alpha = 2 / (dayCount + 1);
      let ema = data[0].close;
      const result = [ema];
      for (let i = 1; i < data.length; i++) {
        ema = alpha * data[i].close + (1 - alpha) * ema;
        result.push(ema);
      }
      return result;
    };

    // 计算MACD
    const calculateMACD = (data) => {
      const ema12 = calculateEMA(12, data);
      const ema26 = calculateEMA(26, data);
      const dif = ema12.map((val, index) => val - ema26[index]);
      const dea = calculateEMA(
        9,
        dif.map((val) => ({ close: val }))
      );
      const macd = dif.map((val, index) => (val - dea[index]) * 2);
      return { dif, dea, macd };
    };

    // 计算移动平均线
    const calculateMA = (dayCount, data) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        const sum = data
          .slice(i - dayCount, i)
          .reduce((sum, item) => sum + item.close, 0);
        result.push(sum / dayCount);
      }
      return result;
    };

    // 计算RSI
    const calculateRSI = (period, data) => {
      const rsi = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period) {
          rsi.push("-");
          continue;
        }
        let gain = 0;
        let loss = 0;
        for (let j = 0; j < period; j++) {
          const change = data[i - j].close - data[i - j - 1].close;
          if (change > 0) {
            gain += change;
          } else {
            loss -= change;
          }
        }
        const rs = gain / loss;
        rsi.push(100 - 100 / (1 + rs));
      }
      return rsi;
    };

    // 导航到股票详情
    const navigateToDetail = (id) => {
      router.push({ name: "StockDetail", params: { id } });
    };

    // 返回上一页
    const handleBack = () => {
      router.push({ name: "StockMarket" });
    };

    // 查看利润表
    const viewProfitStatement = () => {
      router.push({ name: "ProfitStatement", params: { id: route.params.id } });
    };

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value || !macdChartRef.value || !rsiChartRef.value) {
        console.error("Chart container not found");
        return;
      }

      // 确保先销毁旧实例
      if (chartInstance) {
        chartInstance.dispose();
      }
      if (macdChartInstance) {
        macdChartInstance.dispose();
      }
      if (rsiChartInstance) {
        rsiChartInstance.dispose();
      }

      chartInstance = echarts.init(chartRef.value);
      macdChartInstance = echarts.init(macdChartRef.value);
      rsiChartInstance = echarts.init(rsiChartRef.value);
    };

    // 渲染图表
    const renderChart = (data) => {
      if (!chartInstance || !macdChartInstance || !rsiChartInstance) {
        console.error("Chart instance not found");
        return;
      }

      const { dif, dea, macd } = calculateMACD(data);
      const rsi = calculateRSI(14, data);

      const commonDataZoom = [
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ];

      const kLineOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {
          data: ["K线", "MA5", "MA10", "MA20"],
          top: 10,
        },
        dataZoom: commonDataZoom,
        xAxis: {
          type: "category",
          data: data.map((item) => item.tradeDate),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
        },
        yAxis: {
          scale: true,
          splitArea: { show: true },
        },
        series: [
          {
            name: "K线",
            type: "candlestick",
            data: data.map((item) => [
              item.open,
              item.close,
              item.low,
              item.high,
            ]),
            itemStyle: {
              color: "#f56c6c",
              color0: "#67c23a",
              borderColor: "#f56c6c",
              borderColor0: "#67c23a",
            },
          },
          {
            name: "MA5",
            type: "line",
            data: calculateMA(5, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA10",
            type: "line",
            data: calculateMA(10, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: calculateMA(20, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
        ],
      };

      const macdOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {
          data: ["DIF", "DEA", "MACD"],
          top: 10,
        },
        dataZoom: commonDataZoom,
        xAxis: {
          type: "category",
          data: data.map((item) => item.tradeDate),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
        },
        yAxis: {
          scale: true,
          splitNumber: 3,
        },
        series: [
          {
            name: "DIF",
            type: "line",
            data: dif,
            smooth: true,
            lineStyle: {
              color: "#ff0000",
            },
          },
          {
            name: "DEA",
            type: "line",
            data: dea,
            smooth: true,
            lineStyle: {
              color: "#0000ff",
            },
          },
          {
            name: "MACD",
            type: "bar",
            data: macd,
            itemStyle: {
              color: (params) => (params.value >= 0 ? "#ff0000" : "#00ff00"),
            },
          },
        ],
      };

      const rsiOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {
          data: ["RSI"],
          top: 10,
        },
        dataZoom: commonDataZoom,
        xAxis: {
          type: "category",
          data: data.map((item) => item.tradeDate),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
        },
        yAxis: {
          scale: true,
          splitNumber: 3,
        },
        series: [
          {
            name: "RSI",
            type: "line",
            data: rsi,
            smooth: true,
            lineStyle: {
              color: "#ff9900",
            },
          },
        ],
      };

      requestAnimationFrame(() => {
        chartInstance.setOption(kLineOption);
        macdChartInstance.setOption(macdOption);
        rsiChartInstance.setOption(rsiOption);
      });
    };

    // 获取数据
    const fetchStockData = async () => {
      if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
        console.error("Date range not set");
        return;
      }

      try {
        const res = await request({
          url: "/stock/data",
          method: "get",
          params: {
            id: route.params.id,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
          },
        });

        if (res.code === 200 && res.data.have) {
          renderChart(res.data.list);
        } else {
          ElMessage.warning("暂无数据");
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        ElMessage.error("获取数据失败");
      }
    };

    // 日期变化处理
    const handleDateChange = () => {
      fetchStockData();
    };

    const toggleModal = () => {
      isModalOpen.value = !isModalOpen.value;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      // 销毁图表实例
      if (incomeChartInstance) {
        incomeChartInstance.dispose();
        incomeChartInstance = null;
      }
      if (epsChartInstance) {
        epsChartInstance.dispose();
        epsChartInstance = null;
      }
      if (taxChartInstance) {
        taxChartInstance.dispose();
        taxChartInstance = null;
      }
    };

    const fetchIncomeData = async () => {
      try {
        const res = await request({
          url: "/stock/income",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          renderIncomeChart(res.data.list);
          renderEPSChart(res.data.list);
          renderTaxChart(res.data.list);
        } else {
          ElMessage.warning("获取利润表数据失败");
        }
      } catch (error) {
        console.error("获取利润表数据失败:", error);
        ElMessage.error("获取利润表数据失败");
      }
    };

    const renderIncomeChart = (data) => {
      if (!incomeChartInstance) {
        incomeChartInstance = echarts.init(incomeChartRef.value);
      }

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: {
          data: ["营业总收入", "营业总成本", "利润总额", "净利润"],
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.annDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "营业总收入",
            type: "bar",
            data: data.map((item) => item.totalRevenue),
          },
          {
            name: "营业总成本",
            type: "bar",
            data: data.map((item) => item.totalCogs),
          },
          {
            name: "利润总额",
            type: "bar",
            data: data.map((item) => item.totalProfit),
          },
          {
            name: "净利润",
            type: "bar",
            data: data.map((item) => item.nIncome),
          },
        ],
      };

      incomeChartInstance.setOption(option);
    };

    const renderEPSChart = (data) => {
      if (!epsChartInstance) {
        epsChartInstance = echarts.init(epsChartRef.value);
      }

      const option = {
        title: {
          text: "基本每股收益图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "10%",
          top: "20%",
          height: "70%",
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.annDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "基本每股收益",
            type: "line",
            data: data.map((item) => item.basicEps),
            lineStyle: {
              color: "#ff9900",
            },
          },
        ],
      };

      epsChartInstance.setOption(option);
    };

    const renderTaxChart = (data) => {
      if (!taxChartInstance) {
        taxChartInstance = echarts.init(taxChartRef.value);
      }

      const option = {
        title: {
          text: "所得税费用图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "10%",
          top: "20%",
          height: "70%",
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.annDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "所得税费用",
            type: "line",
            data: data.map((item) => item.incomeTax),
            lineStyle: {
              color: "#3366cc",
            },
          },
        ],
      };

      taxChartInstance.setOption(option);
    };

    const toggleForecastModal = async () => {
      isForecastModalOpen.value = !isForecastModalOpen.value;
      if (isForecastModalOpen.value) {
        await nextTick(); // 确保 DOM 已更新
        fetchForecastData();
      }
    };

    const closeForecastModal = () => {
      isForecastModalOpen.value = false;
      if (forecastChartInstance) {
        forecastChartInstance.dispose();
        forecastChartInstance = null;
      }
    };

    const fetchForecastData = async () => {
      try {
        const res = await request({
          url: "/stock/forecast",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          forecastData.value = res.data.list;
          renderForecastChart(res.data.list);
        } else {
          ElMessage.warning("获取业绩报告数据失败");
        }
      } catch (error) {
        console.error("获取业绩报告数据失败:", error);
        ElMessage.error("获取业绩报告数据失败");
      }
    };

    const renderForecastChart = (data) => {
      if (!forecastChartInstance) {
        forecastChartInstance = echarts.init(forecastChartRef.value);
      }

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },

        legend: {
          data: ["净利润最小值", "净利润最大值"],
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.annDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "净利润最小值",
            type: "bar",
            data: data.map((item) => item.netProfitMin),
          },
          {
            name: "净利润最大值",
            type: "bar",
            data: data.map((item) => item.netProfitMax),
          },
        ],
      };

      forecastChartInstance.setOption(option);
    };

    const toggleTop10Modal = async () => {
      isTop10ModalOpen.value = !isTop10ModalOpen.value;
      if (isTop10ModalOpen.value) {
        await nextTick(); // 确保 DOM 已更新
        fetchTop10Data();
      }
    };

    const closeTop10Modal = () => {
      isTop10ModalOpen.value = false;
      if (top10PieChartInstance) {
        top10PieChartInstance.dispose();
        top10PieChartInstance = null;
      }
    };

    const fetchTop10Data = async () => {
      try {
        const res = await request({
          url: "/stock/top10",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          top10Data.value = res.data.list;
          rankData.value = res.data.rank;
          renderTop10PieChart();
        } else {
          ElMessage.warning("获取十大股东数据失败");
        }
      } catch (error) {
        console.error("获取十大股东数据失败:", error);
        ElMessage.error("获取十大股东数据失败");
      }
    };

    const renderTop10PieChart = () => {
      if (!top10PieChartInstance) {
        top10PieChartInstance = echarts.init(top10PieChartRef.value);
      }

      const dataForPieChart = rankData.value.map((item) => ({
        name: item.holderName,
        value: item.holdRatio,
      }));

      const option = {
        title: {
          text: "股东持股比例",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "持股比例",
            type: "pie",
            radius: "50%",
            data: dataForPieChart,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      top10PieChartInstance.setOption(option);
    };

    const togglePredictionModal = async () => {
      isPredictionModalOpen.value = !isPredictionModalOpen.value;
      if (isPredictionModalOpen.value) {
        await fetchAccuracyData();
      }
    };

    const closePredictionModal = () => {
      isPredictionModalOpen.value = false;
    };

    const fetchAccuracyData = async () => {
      try {
        const res = await request({
          url: "/stock/accuracy",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          accuracyData.value = res.data;
          predictionData.value = res.data; // 使用 accuracy 接口返回的数据更新 predictionData
          renderPredictionChart();
        } else {
          ElMessage.warning("获取准确率数据失败");
        }
      } catch (error) {
        console.error("获取准确率数据失败:", error);
        ElMessage.error("获取准确率数据失败");
      }
    };

    const renderPredictionChart = () => {
      if (!predictionChartInstance) {
        predictionChartInstance = echarts.init(predictionChartRef.value);
      }

      // 构建数据数组,包含历史数据和预测值
      const historicalData = predictionData.value.list;
      const allData = [...historicalData];
      // 在最后添加预测值
      allData.push(predictionData.value.val);

      const option = {
        title: {
          text: "预测结果",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const index = params[0].dataIndex;
            if (index === historicalData.length) {
              return `预测值: ${params[0].value}`;
            }
            return `第${index + 1}次: ${params[0].value}`;
          },
        },
        xAxis: {
          type: "category",
          data: allData.map((_, index) =>
            index < historicalData.length
              ? `前${historicalData.length - index}次`
              : "预测值"
          ),
          axisLabel: {
            formatter: (value) => value,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "股价",
            type: "line",
            data: allData,
            markPoint: {
              symbol: "pin",
              symbolSize: 50,
              data: [
                {
                  value: predictionData.value.val,
                  xAxis: historicalData.length,
                  yAxis: predictionData.value.val,
                  name: "预测值",
                },
              ],
            },
          },
        ],
      };

      predictionChartInstance.setOption(option);
    };

    const closeAIAnalysisModal = () => {
      isAIAnalysisModalOpen.value = false;
      closeStream();
    };

    const startStream = async () => {
      aiMessages.value = []; // 清空旧数据
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://110.41.11.12:8877/api/v1/stock/ai?id=" + route.params.id,
          {
            method: "GET",
            headers: {
              Accept: "text/event-stream",
              token: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("网络请求失败");
        }

        reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (isAIAnalysisModalOpen.value) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          buffer += text; // 将新数据添加到缓冲区

          let lines = buffer.split("\n"); // 按换行符分割缓冲区
          buffer = lines.pop(); // 将最后一个不完整的行保留在缓冲区中

          // 逐行更新 aiMessages
          for (let line of lines) {
            if (
              line.trim() ||
              aiMessages.value[aiMessages.value.length - 1]?.trim()
            ) {
              aiMessages.value.push(line);
            }
          }
        }
        if (buffer.trim()) {
          aiMessages.value.push(buffer);
          buffer = ""; // 清空缓冲区
        }
      } catch (err) {
        console.error("流式请求错误", err);
      }
    };

    const closeStream = async () => {
      if (reader) {
        await reader.cancel(); // 取消流读取
        reader = null;
      }
    };

    const toggleAIAnalysisModal = async () => {
      isAIAnalysisModalOpen.value = !isAIAnalysisModalOpen.value;
      if (isAIAnalysisModalOpen.value) {
        startStream();
      } else {
        closeStream();
      }
    };

    const showReason = (reason) => {
      selectedReason.value = reason;
      showReasonModal.value = true;
    };

    const closeReasonModal = () => {
      showReasonModal.value = false;
      selectedReason.value = '';
    };

    watch(isModalOpen, async (newVal) => {
      if (newVal) {
        await nextTick(); // 确保 DOM 已经更新
        fetchIncomeData();
        // 初始化图表
        if (!incomeChartInstance) {
          incomeChartInstance = echarts.init(incomeChartRef.value);
        }
        if (!epsChartInstance) {
          epsChartInstance = echarts.init(epsChartRef.value);
        }
        if (!taxChartInstance) {
          taxChartInstance = echarts.init(taxChartRef.value);
        }
      }
    });

    watch(isForecastModalOpen, (newVal) => {
      if (newVal) {
        nextTick(() => {
          fetchForecastData();
        });
      } else if (forecastChartInstance) {
        forecastChartInstance.dispose();
        forecastChartInstance = null;
      }
    });

    watch(isPredictionModalOpen, (newVal) => {
      if (newVal) {
        nextTick(() => {
          renderPredictionChart();
        });
      } else if (predictionChartInstance) {
        predictionChartInstance.dispose();
        predictionChartInstance = null;
      }
    });

    onMounted(async () => {
      await nextTick();
      initChart();
      fetchStockInfo();

      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      dateRange.value = [
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
      ];

      fetchStockData();

      window.addEventListener("resize", () => {
        chartInstance?.resize();
        macdChartInstance?.resize();
        rsiChartInstance?.resize();
      });
    });

    onUnmounted(() => {
      window.removeEventListener("resize", () => {
        chartInstance?.resize();
        macdChartInstance?.resize();
        rsiChartInstance?.resize();
      });
      if (chartInstance) {
        chartInstance.dispose();
      }
      if (macdChartInstance) {
        macdChartInstance.dispose();
      }
      if (rsiChartInstance) {
        rsiChartInstance.dispose();
      }
      if (incomeChartInstance) {
        incomeChartInstance.dispose();
      }
      if (epsChartInstance) {
        epsChartInstance.dispose();
      }
      if (taxChartInstance) {
        taxChartInstance.dispose();
      }
      if (forecastChartInstance) {
        forecastChartInstance.dispose();
      }
      if (top10PieChartInstance) {
        top10PieChartInstance.dispose();
      }
      if (predictionChartInstance) {
        predictionChartInstance.dispose();
      }
    });

    // 渲染 Markdown
    const renderMarkdown = (text) => {
      return md.render(text);
    };

    return {
      chartRef,
      macdChartRef,
      rsiChartRef,
      incomeChartRef,
      epsChartRef,
      taxChartRef,
      forecastChartRef,
      top10PieChartRef,
      dateRange,
      handleBack,
      stockInfo,
      navigateToDetail,
      shortcuts: [
        {
          text: "最近一周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "最近一个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            return [start, end];
          },
        },
        {
          text: "最近三个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            return [start, end];
          },
        },
        {
          text: "最近一年",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setFullYear(start.getFullYear() - 1);
            return [start, end];
          },
        },
      ],
      handleDateChange,
      viewProfitStatement,
      isModalOpen,
      toggleModal,
      closeModal,
      isForecastModalOpen,
      toggleForecastModal,
      closeForecastModal,
      fetchForecastData,
      forecastData,
      isTop10ModalOpen,
      toggleTop10Modal,
      closeTop10Modal,
      top10Data,
      togglePredictionModal,
      isPredictionModalOpen,
      predictionData,
      predictionChartRef,
      closePredictionModal,
      follow,
      isAIAnalysisModalOpen,
      aiMessages,
      toggleAIAnalysisModal,
      closeAIAnalysisModal,
      renderMarkdown,
      accuracyData,
      showReasonModal,
      selectedReason,
      showReason,
      closeReasonModal,
    };
  },
};
</script>

<style scoped>
.stock-detail {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb; /* 更柔和的背景色 */
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: #ffffff; /* 增加背景色 */
  padding: 10px;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.left-section {
  display: flex;
  align-items: center;
  gap: 15px; /* 增加间距 */
}

.button-container {
  display: flex;
  gap: 15px; /* 增加按钮之间的间距 */
}

.bg-white {
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.bg-white:hover {
  background-color: #1976d2;
}

.bg-white:active {
  background-color: #1565c0;
}

.bg-green-400 {
  display: none;
}

.text-black {
  color: white;
}

.translate-x-2 {
  transform: none;
}

.company-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px; /* 增加内边距 */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-name {
  font-size: 22px; /* 增大字体 */
  font-weight: bold;
}

.company-details {
  display: flex;
  gap: 25px; /* 增加间距 */
}

.header {
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  min-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 8px; /* 圆角 */
  margin-bottom: 20px;
  padding: 15px; /* 增加内边距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  text-align: center;
  font-weight: bold;
  margin: 15px 0; /* 增加间距 */
  font-size: 20px; /* 增大字体 */
  color: #333;
}

.chart-description {
  margin-top: 15px;
  font-size: 15px;
  color: #555;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-description h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.chart-description p {
  margin-bottom: 10px;
}

.chart-description ul {
  margin: 10px 0;
  padding-left: 20px;
}

.chart-description li {
  margin-bottom: 5px;
}

/* 新增按钮样式 */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #006aff;
  border: 8px solid #c0dfff;
  color: white;
  gap: 8px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.text {
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 1px;
}

.svg {
  padding-top: 5px;
  height: 100%;
  width: fit-content;
}

.svg svg {
  width: 40px;
  height: 20px;
}

.button:hover {
  border: 8px solid #b1d8ff;
  background-color: #1b7aff;
}

.button:active {
  border: 5px solid #c0dfff;
}

.button:hover .svg svg {
  animation: jello-vertical 0.9s both;
  transform-origin: left;
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

button {
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

button > svg {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 20px;
  transition: all 0.4s ease-in;
}

button:hover > svg {
  font-size: 1.2em;
  transform: translateX(-5px);
}

button:hover {
  box-shadow: 9px 9px 33px #b1b1b1, -9px -9px 33px #ffffff;
  transform: translateY(-2px);
}

.new-button {
  font-size: 15px;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
  font-weight: bold;
  padding: 0.5em 1.2em;
  border: none;
  border-radius: 4px;
  background-color: #1e88e5;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.new-button:hover {
  background-color: #1976d2;
}

.new-button:active {
  background-color: #1565c0;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #ffffff;
  margin: 5% auto;
  padding: 30px;
  border: 1px solid #888;
  width: 90%;
  max-width: 1400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.forecast-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

.forecast-table th,
.forecast-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  word-wrap: break-word;
}

.forecast-table th {
  background-color: #ffffff; /* 改为白色背景 */
  color: #333; /* 文字颜色改为深灰色 */
  font-weight: bold;
  border-bottom: 2px solid #ddd; /* 添加底部边框以区分表头 */
}

/* 设置每列的宽度 */
.forecast-table th:nth-child(1),
.forecast-table td:nth-child(1) {
  width: 10%;
}

.forecast-table th:nth-child(2),
.forecast-table td:nth-child(2) {
  width: 8%;
}

.forecast-table th:nth-child(3),
.forecast-table td:nth-child(3) {
  width: 8%;
}

.forecast-table th:nth-child(4),
.forecast-table td:nth-child(4) {
  width: 8%;
}

.forecast-table th:nth-child(5),
.forecast-table td:nth-child(5) {
  width: 12%;
}

.forecast-table th:nth-child(6),
.forecast-table td:nth-child(6) {
  width: 12%;
}

.forecast-table th:nth-child(7),
.forecast-table td:nth-child(7) {
  width: 12%;
}

.forecast-table th:nth-child(8),
.forecast-table td:nth-child(8) {
  width: 30%;
}

.forecast-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.forecast-table tr:hover {
  background-color: #ddd;
}

/* 修改变化原因单元格的样式 */
.forecast-table td[data-full-text] {
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 限制最大宽度 */
}

.forecast-table td[data-full-text]:hover::before {
  content: attr(data-full-text);
  position: absolute;
  left: 0;
  top: 100%;
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: normal;
  width: 300px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.top10-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px; /* 减小表格与饼状图的间距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

.top10-table th:nth-child(1), /* 公告日期 */
.top10-table td:nth-child(1) {
  width: 10%;
}

.top10-table th:nth-child(2), /* 股东名称 */
.top10-table td:nth-child(2) {
  width: 30%;
}

.top10-table th:nth-child(3), /* 持股数量 */
.top10-table td:nth-child(3) {
  width: 8%;
}

.top10-table th:nth-child(4), /* 持股比例 */
.top10-table td:nth-child(4) {
  width: 8%;
}

.top10-table th:nth-child(5), /* 流通股比例 */
.top10-table td:nth-child(5) {
  width: 9%;
}

.top10-table th:nth-child(6), /* 持股变动 */
.top10-table td:nth-child(6) {
  width: 8%;
}

.top10-table th:nth-child(7), /* 股东类型 */
.top10-table td:nth-child(7) {
  width: 28%;
}

.top10-table th,
.top10-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
}

.top10-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.top10-table tr:hover {
  background-color: #ddd;
}

.bookmark-checkbox {
  display: inline-block;
}

.bookmark-checkbox__input {
  display: none;
}

.bookmark-checkbox__label {
  cursor: pointer;
}

.bookmark-checkbox__icon {
  width: 2em;
  height: 2em;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.3s, fill 0.3s;
}

.bookmark-checkbox__icon-back {
  stroke: #333;
  transition: transform 0.3s;
}

.bookmark-checkbox__icon-check {
  stroke: #fff;
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  transition: stroke-dashoffset 0.3s, transform 0.3s;
  transform: translateX(2px);
}

.bookmark-checkbox__input:checked
  + .bookmark-checkbox__label
  .bookmark-checkbox__icon {
  fill: #ff5a5f;
}

.bookmark-checkbox__input:checked
  + .bookmark-checkbox__label
  .bookmark-checkbox__icon-back {
  stroke: #ff5a5f;
  transform: scale(1.1);
  animation: bookmark-pop 0.4s ease;
}

.bookmark-checkbox__input:checked
  + .bookmark-checkbox__label
  .bookmark-checkbox__icon-check {
  stroke-dashoffset: 0;
  transition-delay: 0.2s;
}

@keyframes bookmark-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.1);
  }
}

/* AI分析固定窗口样式 */
.fixed-ai-analysis {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 400px; /* 增加宽度 */
  height: 600px; /* 增加高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  background-color: #ffffff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  box-sizing: border-box; /* 确保 padding 不影响宽高 */
}

.fixed-ai-analysis .close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.fixed-ai-analysis .close:hover,
.fixed-ai-analysis .close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.ai-message {
  margin-bottom: 10px; /* 每条消息之间的间距 */
  white-space: pre-wrap; /* 保留换行符并允许自动换行 */
  overflow: hidden; /* 隐藏溢出文本 */
  text-overflow: ellipsis; /* 使用省略号表示溢出文本 */
  word-wrap: break-word; /* 允许长单词换行 */
}

.prediction-metrics {
  margin: 20px 0; /* 修改边距，确保与标题和图表之间有适当间距 */
  display: flex;
  justify-content: center; /* 居中对齐 */
  gap: 40px; /* 两个指标之间的间距 */
}

.metric-item {
  padding: 15px 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 200px; /* 设置最小宽度确保布局统一 */
  text-align: center;
}

.metric-label {
  font-size: 16px;
  color: #666;
  margin-right: 10px; /* 标签和数值之间的间距 */
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.pie-chart-container {
  position: relative;
  width: 100%;
  margin-top: 40px; /* 增加上边距，为关闭按钮留出空间 */
}

.pie-chart-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 10px;
  background-color: rgba(245, 245, 245, 0.9);
  border-radius: 0 0 4px 4px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: relative; /* 改为相对定位 */
  float: right; /* 使用浮动 */
  margin: -10px 0; /* 调整位置 */
}

.close:hover,
.close:focus {
  color: #333;
}

/* 变化原因单元格样式 */
.reason-cell {
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.reason-cell:hover {
  background-color: #f0f0f0;
}

/* 变化原因弹窗样式 */
.reason-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.reason-modal-content {
  background-color: #ffffff;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.reason-modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reason-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.reason-modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.reason-modal .close {
  color: #aaa;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  position: relative; /* 改为相对定位 */
  float: right; /* 使用浮动 */
  margin: -10px 0; /* 调整位置 */
}

.reason-modal .close:hover {
  color: #333;
}

.modal-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.chart-section {
  margin-bottom: 40px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-section-title {
  color: #1e88e5;
  margin-bottom: 15px;
  font-size: 20px;
  border-bottom: 2px solid #1e88e5;
  padding-bottom: 10px;
}

.chart-description {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-description p {
  margin: 10px 0;
  color: #333;
  line-height: 1.6;
}

.chart-description ul {
  margin: 10px 0;
  padding-left: 20px;
}

.chart-description li {
  margin: 8px 0;
  color: #555;
  line-height: 1.5;
}

.info-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #1e88e5;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  margin-right: 5px;
  cursor: help;
  vertical-align: middle;
  font-weight: bold;
}

.info-icon:hover {
  background-color: #1565c0;
}
</style>
