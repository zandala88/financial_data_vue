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
              <path class="bookmark-checkbox__icon-check" d="M8 11l3 3 5-5"></path>
            </svg>
          </label>
        </div>
      </div>
      <!-- 新增按钮容器 -->
      <div class="button-container">
        <button class="new-button" @click="togglePredictionModal">
          预测结果
        </button>
        <button class="new-button" @click="toggleModal">利润表</button>
        <button class="new-button" @click="toggleForecastModal">
          业绩预告
        </button>
        <button class="new-button" @click="toggleTop10Modal">十大股东</button>
      </div>
    </div>

    <!-- 预测结果弹窗 -->
    <div v-if="isPredictionModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closePredictionModal">&times;</div>
        <h3>预测结果</h3>
        <div ref="predictionChartRef" style="width: 100%; height: 600px"></div>
      </div>
    </div>

    <!-- 利润表弹窗 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeModal">&times;</div>
        <div
          ref="incomeChartRef"
          style="width: 100%; height: 400px; margin-top: 40px"
        ></div>
        <div
          ref="epsChartRef"
          style="width: 100%; height: 200px; margin-top: 20px"
        ></div>
        <div
          ref="taxChartRef"
          style="width: 100%; height: 200px; margin-top: 20px"
        ></div>
      </div>
    </div>

    <!-- 业绩预告弹窗 -->
    <div v-if="isForecastModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeForecastModal">&times;</div>
        <div
          ref="forecastChartRef"
          style="width: 100%; height: 300px; margin-top: 70px"
        ></div>
        <!-- 新增表格展示业绩预告数据 -->
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
              <td>{{ item.changeReason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 十大股东弹窗 -->
    <div v-if="isTop10ModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closeTop10Modal">&times;</div>
        <div
          ref="top10PieChartRef"
          style="width: 100%; height: 400px; margin-top: 20px"
        ></div>
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
        K线图显示股票价格的变动。红色表示收盘价高于开盘价（上涨），绿色表示收盘价低于开盘价（下跌）。
      </div>
    </div>

    <!-- MACD图 -->
    <div class="chart-container">
      <div class="chart-title">MACD图</div>
      <div ref="macdChartRef" style="width: 100%; height: 300px"></div>
      <div class="chart-description">
        MACD指标用于判断价格的走势。DIF是短期和长期移动平均线的差，DEA是DIF的平均。
      </div>
    </div>

    <!-- RSI图 -->
    <div class="chart-container">
      <div class="chart-title">RSI图</div>
      <div ref="rsiChartRef" style="width: 100%; height: 300px"></div>
      <div class="chart-description">
        RSI指标用于衡量价格的相对强弱。高于70表示超买，低于30表示超卖。
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
      router.back();
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
          ElMessage.warning("获取业绩预告数据失败");
        }
      } catch (error) {
        console.error("获取业绩预告数据失败:", error);
        ElMessage.error("获取业绩预告数据失败");
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
        await fetchPredictionData();
      }
    };

    const closePredictionModal = () => {
      isPredictionModalOpen.value = false;
    };

    const fetchPredictionData = async () => {
      try {
        const res = await request({
          url: "/stock/predict",
          method: "get",
          params: { id: route.params.id },
        });

        if (res.code === 200) {
          predictionData.value = res.data;
          renderPredictionChart();
        } else {
          ElMessage.warning("获取预测数据失败");
        }
      } catch (error) {
        console.error("获取预测数据失败:", error);
        ElMessage.error("获取预测数据失败");
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
            index < historicalData.length ? `前${historicalData.length - index}次` : "预测值"
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

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  color: black;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
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
  margin-top: 15px; /* 增加间距 */
  font-size: 15px; /* 增大字体 */
  color: #555; /* 更柔和的颜色 */
  background-color: #f9f9f9;
  padding: 15px; /* 增加内边距 */
  border-radius: 8px;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  padding: 0.3em 1em;
  border: 3px solid #e2e9f0;
  border-radius: 2px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
  color: #e2e9f0;
  text-decoration: none;
  transition: 0.3s ease all;
  z-index: 1;
  background-color: #78aac5;
}

.new-button:before {
  transition: 0.5s all ease;
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  bottom: 0;
  opacity: 0;
  content: "";
  background-color: #e2e9f0;
  z-index: -1;
}

.new-button:hover,
.new-button:focus {
  color: black;
}

.new-button:hover:before,
.new-button:focus:before {
  transition: 0.5s all ease;
  left: 0;
  right: 0;
  opacity: 1;
}

.new-button:active {
  transform: scale(0.9);
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
  margin: 10% auto; /* 调整位置 */
  padding: 30px; /* 增加内边距 */
  border: 1px solid #888;
  width: 70%; /* 调整宽度 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增加阴影 */
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
}

.forecast-table th,
.forecast-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.forecast-table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.forecast-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.forecast-table tr:hover {
  background-color: #ddd;
}

.top10-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top10-table th,
.top10-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.top10-table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
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
</style>
