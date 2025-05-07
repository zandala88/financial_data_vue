<template>
  <div class="fund-detail">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <button @click="handleBack">
        <span>Back</span>
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
      <!-- 新增按钮容器 -->
      <div class="button-container">
        <button class="new-button" @click="toggleAIAnalysisModal">
          AI分析
        </button>
        <button class="new-button" @click="togglePredictionModal">
          预测结果
        </button>
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
        <p>K线图走势反映了基金价格的变动趋势：</p>
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

    <!-- 预测结果弹窗 -->
    <div v-if="isPredictionModalOpen" class="modal">
      <div class="modal-content">
        <div class="close" @click="closePredictionModal">&times;</div>
        <h3>预测结果</h3>
        <div ref="predictionChartRef" style="width: 100%; height: 600px"></div>
      </div>
    </div>
  </div>

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
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { debounce } from "lodash";
import * as echarts from "echarts";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import MarkdownIt from "markdown-it";

export default {
  name: "FundDetail",
  components: {
    ArrowLeft,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const chartRef = ref(null);
    const macdChartRef = ref(null);
    const rsiChartRef = ref(null);
    let chartInstance = null;
    let macdChartInstance = null;
    let rsiChartInstance = null;
    const dateRange = ref([]);
    const follow = ref(false);
    const predictionChartRef = ref(null);
    const isPredictionModalOpen = ref(false);
    const predictionData = ref({ list: [], val: 0 });
    let predictionChartInstance = null;
    const isAIAnalysisModalOpen = ref(false);
    const aiMessages = ref([]);
    let reader = null;
    let buffer = "";
    const md = new MarkdownIt({
      breaks: false,
    });

    // 更新关注状态
    const updateFollowStatus = debounce(async () => {
      try {
        await request({
          url: "/fund/follow",
          method: "post",
          data: {
            id: parseInt(route.params.id, 10), // 转换为整数
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

    // 返回上一页
    const handleBack = () => {
      router.back();
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

    // 计算EMA
    const calculateEMA = (data, period) => {
      const k = 2 / (period + 1);
      return data.reduce((acc, value, index) => {
        if (index === 0) {
          acc.push(value);
        } else {
          acc.push(value * k + acc[index - 1] * (1 - k));
        }
        return acc;
      }, []);
    };

    // 计算MACD
    const calculateMACD = (data) => {
      const shortEMA = calculateEMA(data, 12);
      const longEMA = calculateEMA(data, 26);
      const dif = shortEMA.map((val, index) => val - longEMA[index]);
      const dea = calculateEMA(dif, 9);
      const macd = dif.map((val, index) => (val - dea[index]) * 2);
      return { dif, dea, macd };
    };

    // 计算RSI
    const calculateRSI = (data, period = 14) => {
      let gains = 0;
      let losses = 0;
      const rsi = [];

      for (let i = 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        if (change > 0) {
          gains += change;
        } else {
          losses -= change;
        }

        if (i >= period) {
          const avgGain = gains / period;
          const avgLoss = losses / period;
          const rs = avgGain / avgLoss;
          rsi.push(100 - 100 / (1 + rs));

          const firstChange = data[i - period + 1] - data[i - period];
          if (firstChange > 0) {
            gains -= firstChange;
          } else {
            losses += firstChange;
          }
        }
      }

      return rsi;
    };

    // 计算移动平均线
    const calculateMA = (data, period) => {
      return data.map((_, index, array) => {
        if (index < period - 1) return null;
        const sum = array
          .slice(index - period + 1, index + 1)
          .reduce((acc, val) => acc + val, 0);
        return sum / period;
      });
    };

    // 渲染图表
    const renderChart = (data) => {
      if (!chartInstance || !macdChartInstance || !rsiChartInstance) {
        console.error("Chart instance not found");
        return;
      }

      const kLineOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {
          data: ["K线", "MA5", "MA10", "MA20"],
          top: "top",
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          top: "15%",
        },
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
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            type: "slider",
            start: 0,
            end: 100,
          },
        ],
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
            data: calculateMA(
              data.map((item) => item.close),
              5
            ),
            smooth: true,
            lineStyle: { opacity: 0.5 },
          },
          {
            name: "MA10",
            type: "line",
            data: calculateMA(
              data.map((item) => item.close),
              10
            ),
            smooth: true,
            lineStyle: { opacity: 0.5 },
          },
          {
            name: "MA20",
            type: "line",
            data: calculateMA(
              data.map((item) => item.close),
              20
            ),
            smooth: true,
            lineStyle: { opacity: 0.5 },
          },
        ],
      };

      const closePrices = data.map((item) => item.close);
      const macdData = calculateMACD(closePrices);
      const rsiData = calculateRSI(closePrices);

      const macdOption = {
        legend: {
          data: ["DIF", "DEA", "MACD"],
          top: "top",
        },
        xAxis: { type: "category", data: data.map((item) => item.tradeDate) },
        yAxis: { scale: true },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            type: "slider",
            start: 0,
            end: 100,
          },
        ],
        series: [
          { name: "DIF", type: "line", data: macdData.dif },
          { name: "DEA", type: "line", data: macdData.dea },
          { name: "MACD", type: "bar", data: macdData.macd },
        ],
      };

      const rsiOption = {
        legend: {
          data: ["RSI"],
          top: "top",
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.tradeDate).slice(-rsiData.length),
        },
        yAxis: { scale: true },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            type: "slider",
            start: 0,
            end: 100,
          },
        ],
        series: [{ name: "RSI", type: "line", data: rsiData }],
      };

      chartInstance.setOption(kLineOption);
      macdChartInstance.setOption(macdOption);
      rsiChartInstance.setOption(rsiOption);
    };

    // 获取数据
    const fetchFundData = async () => {
      if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
        console.error("Date range not set");
        return;
      }

      try {
        const res = await request({
          url: "/fund/data",
          method: "get",
          params: {
            id: route.params.id,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
          },
        });

        if (res.code === 200 && res.data.have) {
          renderChart(res.data.list);
          follow.value = res.data.follow; // 更新 follow 状态
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
      fetchFundData();
    };

    const togglePredictionModal = async () => {
      isPredictionModalOpen.value = !isPredictionModalOpen.value;
      if (isPredictionModalOpen.value) {
        await fetchPredictionData();
      }
    };

    const closePredictionModal = () => {
      isPredictionModalOpen.value = false;
      if (predictionChartInstance) {
        predictionChartInstance.dispose();
        predictionChartInstance = null;
      }
    };

    const fetchPredictionData = async () => {
      try {
        const res = await request({
          url: "/fund/predict",
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

      const historicalData = predictionData.value.list;
      const allData = [...historicalData, predictionData.value.val];

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
            name: "基金价格",
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

    onMounted(async () => {
      await nextTick();
      initChart();

      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      dateRange.value = [
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
      ];

      fetchFundData();

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
    });

    const startStream = async () => {
      aiMessages.value = [];
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "/api/v1/fund/ai?id=" + route.params.id,
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
          buffer += text;

          let lines = buffer.split("\n");
          buffer = lines.pop();

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
        await reader.cancel();
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

    const closeAIAnalysisModal = () => {
      isAIAnalysisModalOpen.value = false;
      closeStream();
    };

    const renderMarkdown = (text) => {
      return md.render(text);
    };

    return {
      chartRef,
      macdChartRef,
      rsiChartRef,
      dateRange,
      handleBack,
      follow,
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
      togglePredictionModal,
      isPredictionModalOpen,
      predictionData,
      predictionChartRef,
      closePredictionModal,
      isAIAnalysisModalOpen,
      aiMessages,
      toggleAIAnalysisModal,
      closeAIAnalysisModal,
      renderMarkdown,
    };
  },
};
</script>

<style scoped>
.fund-detail {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa; /* 改为更柔和的背景色 */
}

.nav-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 20px;
  padding: 10px; /* 增加内边距 */
  background-color: #ffffff; /* 增加背景色 */
  border-radius: 8px; /* 增加圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}

.chart-container {
  flex: 1;
  min-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.chart-title {
  text-align: center;
  font-weight: bold;
  margin: 15px 0;
  font-size: 20px;
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

.nav-header button {
  display: flex;
  height: 3em;
  width: 100px;
  align-items: center;
  justify-content: center;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 25px; /* 增加与收藏按钮的距离 */
}

.nav-header button:hover {
  background-color: #1976d2;
}

.nav-header button:active {
  background-color: #1565c0;
}

.nav-header button > svg {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 20px;
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

.button-container {
  display: flex;
  gap: 15px;
  margin-left: auto; /* 将按钮容器移到最右边 */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px; /* 增加圆角 */
  width: 80%;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #333; /* 改为更明显的关闭按钮颜色 */
}

.fixed-ai-analysis {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 400px;
  height: 600px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  box-sizing: border-box;
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
  margin-bottom: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
}
</style>
