<template>
  <div class="main-page">
    <!-- 顶部 Header 区域 -->
    <header class="header">
      <h1>金融数据可视化与分析系统</h1>
    </header>

    <!-- 导航栏 -->
    <nav class="navbar">
      <ul>
        <li><a href="/user-profile">个人中心</a></li>
        <li><a href="/home" target="_blank">数据概览</a></li>
        <li><a href="/up-down">预测涨跌排行</a></li>
        <li><a href="/about">关于</a></li>
      </ul>
    </nav>

    <!-- 搜索框区域 -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索功能..."
        @input="updateSuggestions"
      />
      <button @click="search">搜索</button>
      <!-- 显示建议列表 -->
      <ul v-if="suggestions.length" class="suggestions">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <!-- Hero 区域 -->
    <section class="hero">
      <h2>探索金融世界的新视角</h2>
      <p>我们的系统通过高效的实时数据与趋势分析，提供全方位的金融信息展示。</p>
    </section>

    <div class="content">
      <!-- 交易日历部分 -->
      <div class="futures-calendar">
        <h2>交易日历</h2>
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarData"
            :key="index"
            :class="{ open: day.isOpen, closed: !day.isOpen }"
            class="calendar-day"
          >
            <div>{{ day.calDate }}</div>
            <div>{{ day.isOpen ? "开放" : "关闭" }}</div>
          </div>
        </div>
      </div>

      <!-- 新增沪深市十大成交股部分 -->
      <div class="top10-stocks">
        <h2>沪深市十大成交股</h2>
        <div class="top10-chart-section">
          <div ref="shChartRef" class="chart"></div>
          <div ref="szChartRef" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 水平放置基金图表 -->
    <div class="fund-graphs">
      <!-- 各渠道公募基金销售保有规模占比数据 -->
      <div class="fund-graph">
        <h2>各渠道公募基金销售保有规模占比</h2>
        <div ref="radioChartRef" class="chart"></div>
      </div>

      <!-- 销售机构公募基金销售保有规模数据 -->
      <div class="fund-graph">
        <h2>销售机构公募基金销售保有规模</h2>
        <div ref="instChartRef" class="chart"></div>
      </div>
    </div>

    <!-- 底部 Footer 区域 -->
    <footer class="footer">
      <p>© 2025 金融数据可视化系统</p>
    </footer>
  </div>
</template>

<script>
import request from "@/utils/request";
import * as echarts from "echarts";

export default {
  name: "MainPage",
  data() {
    return {
      calendarData: [],
      top10Stocks: [],
      searchQuery: "",
      features: ["上市公司", "股票市场", "公募基金", "期货数据", "宏观经济"],
      suggestions: [],
    };
  },
  created() {
    this.fetchCalendarData();
    this.fetchTop10Data();
    this.fetchGraphData();
  },
  methods: {
    fetchCalendarData() {
      request
        .get("/fut/cal")
        .then((response) => {
          if (response.code === 200) {
            this.calendarData = response.data.sse;
          }
        })
        .catch((error) => {
          console.error("获取日历数据失败:", error);
        });
    },
    fetchTop10Data() {
      request
        .get("/stock/hsgt/top10")
        .then((response) => {
          if (response.code === 200) {
            const { shList, szList } = response.data;
            const shData = shList.map((item) => ({
              name: item.name,
              value: item.amount,
            }));
            const szData = szList.map((item) => ({
              name: item.name,
              value: item.amount,
            }));

            // 初始化沪市图表
            const shChartInstance = echarts.init(this.$refs.shChartRef);
            const shOption = {
              title: {
                text: "沪市",
                left: "center",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },
              xAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
              },
              yAxis: {
                type: "category",
                data: shData.map((item) => item.name),
              },
              series: [
                {
                  name: "成交金额",
                  type: "bar",
                  data: shData.map((item) => item.value),
                },
              ],
            };
            shChartInstance.setOption(shOption);

            // 初始化深市图表
            const szChartInstance = echarts.init(this.$refs.szChartRef);
            const szOption = {
              title: {
                text: "深市",
                left: "center",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },
              xAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
              },
              yAxis: {
                type: "category",
                data: szData.map((item) => item.name),
              },
              series: [
                {
                  name: "成交金额",
                  type: "bar",
                  data: szData.map((item) => item.value),
                },
              ],
            };
            szChartInstance.setOption(szOption);
          } else {
            console.error("获取沪深市十大成交股数据失败");
          }
        })
        .catch((error) => {
          console.error("获取沪深市十大成交股数据失败:", error);
        });
    },
    fetchGraphData() {
      request
        .get("/fund/graph")
        .then((response) => {
          if (response.code === 200) {
            this.renderRadioChart(response.data.radio);
            this.renderInstChart(response.data.inst);
          } else {
            console.error("获取图表数据失败");
          }
        })
        .catch((error) => {
          console.error("获取图表数据失败:", error);
        });
    },
    renderRadioChart(data) {
      const chart = echarts.init(this.$refs.radioChartRef);
      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { top: "bottom", padding: [10, 0, 0, 0] },
        grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
        xAxis: { type: "category", data: data.map((item) => item.year) },
        yAxis: { type: "value" },
        series: [
          {
            name: "商业银行",
            type: "bar",
            stack: "total",
            data: data.map((item) => item.bank),
          },
          {
            name: "证券公司",
            type: "bar",
            stack: "total",
            data: data.map((item) => item.secComp),
          },
          {
            name: "基金公司直销",
            type: "bar",
            stack: "total",
            data: data.map((item) => item.fundComp),
          },
          {
            name: "独立基金销售机构",
            type: "bar",
            stack: "total",
            data: data.map((item) => item.indepComp),
          },
          {
            name: "其他",
            type: "bar",
            stack: "total",
            data: data.map((item) => item.rests),
          },
        ],
      };
      chart.setOption(option);
      window.addEventListener("resize", () => chart.resize());
    },
    renderInstChart(data) {
      // 确保只处理20条数据
      const limitedData = data.slice(0, 20);

      // 根据排名对数据进行排序
      limitedData.sort((a, b) => a.rank - b.rank);

      const chart = echarts.init(this.$refs.instChartRef);
      chart.setOption({
        legend: { top: "bottom", padding: [10, 0, 0, 0] },
        grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
        xAxis: {
          type: "category",
          data: limitedData.map(
            (item) => `${item.instName} (${item.year} ${item.quarter})`
          ),
          axisLabel: { interval: 0, rotate: 30, fontSize: 10 }, // 调整标签旋转和字体大小
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "基金规模",
            type: "bar",
            data: limitedData.map((item) => item.fundScale),
          },
          {
            name: "总规模",
            type: "bar",
            data: limitedData.map((item) => item.scale),
          },
        ],
        dataZoom: [
          { type: "inside", start: 0, end: 100 }, // 显示所有数据
          { type: "slider", start: 0, end: 100, bottom: 20 },
        ],
      });
      window.addEventListener("resize", () => chart.resize());
    },
    updateSuggestions() {
      const query = this.searchQuery.toLowerCase();
      if (query) {
        this.suggestions = this.features.filter((feature) =>
          feature.toLowerCase().includes(query)
        );
      } else {
        this.suggestions = [];
      }
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion;
      this.suggestions = [];
      this.search();
    },
    search() {
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        if (query.includes("上市公司")) {
          window.location.href = "/home/company";
        } else if (query.includes("股票市场")) {
          window.location.href = "/home/stock";
        } else if (query.includes("公募基金")) {
          window.location.href = "/home/fund";
        } else if (query.includes("期货数据")) {
          window.location.href = "/home/futures";
        } else if (query.includes("宏观经济")) {
          window.location.href = "/home/economics";
        } else {
          alert("未找到相关功能");
        }
      }
    },
  },
};
</script>

<style scoped>
.main-page {
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  background: linear-gradient(to right, #4f46e5, #3b82f6);
  color: white;
  padding: 20px;
  text-align: center;
}

.navbar {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px;
}

.navbar ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.navbar li {
  display: inline;
}

.navbar a {
  text-decoration: none;
  font-size: 1.2em;
}

.hero {
  background-color: #eff6ff;
  padding: 40px;
  border-radius: 10px;
  margin: 20px;
  text-align: center;
}

.hero h2 {
  color: #1e40af;
}

.hero p {
  color: #1e3a8a;
}

.content {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}

.futures-calendar {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 45%;
  margin-right: 10px;
  transition: box-shadow 0.3s;
}

.futures-calendar:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  justify-items: center;
}

.calendar-day {
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  font-size: 0.9em;
}

.calendar-day:hover {
  transform: scale(1.1);
}

.calendar-day.open {
  background-color: #e3f2fd;
}

.calendar-day.closed {
  background-color: #ffebee;
}

.footer {
  background: linear-gradient(to right, #3b82f6, #4f46e5);
  color: white;
  text-align: center;
  padding: 10px;
}

.top10-stocks {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 45%;
}

.top10-chart-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 800px;
}

.chart {
  width: 100%;
  height: 50%;
}

.fund-graphs {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}

.fund-graph {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 45%;
}

.chart {
  width: 100%;
  height: 400px;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  position: relative; /* 使建议列表相对于搜索框定位 */
}

.search-bar input {
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.search-bar button {
  padding: 8px 16px;
  font-size: 1em;
  color: white;
  background-color: #4f46e5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #3b82f6;
}

.suggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute; /* 绝对定位 */
  top: 40px; /* 调整位置 */
  z-index: 10; /* 确保浮动在最上层 */
}

.suggestions li {
  padding: 8px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}
</style>
