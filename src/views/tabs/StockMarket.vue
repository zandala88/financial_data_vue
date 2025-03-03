<template>
  <div class="stock-market">
    
    <div class="filter-container">
      <div class="filters">
        <div class="filter-row">
          <span class="label">市场类型：</span>
          <el-checkbox-group v-model="checkedMarkets">
            <div
              v-for="market in marketList"
              :key="market"
              class="check_container"
            >
              <input
                :id="'checkbox-' + market"
                class="hidden"
                type="checkbox"
                :value="market"
                v-model="checkedMarkets"
              />
              <label class="checkbox" :for="'checkbox-' + market"></label>
              <span class="checkbox-label">{{ market }}</span>
            </div>
          </el-checkbox-group>
        </div>

        <div class="filter-row">
          <span class="label">交易所：</span>
          <el-checkbox-group v-model="checkedExchanges">
            <div
              v-for="exchange in exchangeList"
              :key="exchange"
              class="check_container"
            >
              <input
                :id="'checkbox-' + exchange"
                class="hidden"
                type="checkbox"
                :value="exchange"
                v-model="checkedExchanges"
              />
              <label class="checkbox" :for="'checkbox-' + exchange"></label>
              <span class="checkbox-label">{{
                getExchangeName(exchange)
              }}</span>
            </div>
          </el-checkbox-group>
        </div>

        <div class="filter-row">
          <span class="label">股票类型：</span>
          <el-checkbox-group v-model="checkedHsTypes">
            <div v-for="type in isHsList" :key="type" class="check_container">
              <input
                :id="'checkbox-' + type"
                class="hidden"
                type="checkbox"
                :value="type"
                v-model="checkedHsTypes"
              />
              <label class="checkbox" :for="'checkbox-' + type"></label>
              <span class="checkbox-label">{{ getHsTypeName(type) }}</span>
            </div>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 删除所选按钮移到右侧 -->
      <div class="actions">
        <el-button type="primary" link @click="clearAllSelected">
          删除所选
        </el-button>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <form class="form">
        <label for="search">
          <input
            required
            autocomplete="off"
            placeholder="请输入股票代码/名称"
            id="search"
            type="text"
            v-model="searchText"
            @input="handleSearch"
          />
          <div class="icon">
            <svg
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="swap-on"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
            <svg
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="swap-off"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
          <button type="reset" class="close-btn" @click="searchText = ''">
            <svg
              viewBox="0 0 20 20"
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
        </label>
      </form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="股票名称" min-width="100" />
        <el-table-column prop="area" label="地区" min-width="80" />
        <el-table-column prop="industry" label="行业" min-width="100" />
        <el-table-column prop="market" label="市场" min-width="80" />
        <el-table-column
          prop="actName"
          label="实控人"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="actEntType" label="实控人类型" min-width="100" />
        <el-table-column
          prop="fullName"
          label="公司全称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="enName"
          label="英文名称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="cnSpell" label="拼音简称" min-width="100" />
        <el-table-column prop="exchange" label="交易所" min-width="100">
          <template #default="{ row }">
            {{ getExchangeName(row.exchange) }}
          </template>
        </el-table-column>
        <el-table-column prop="currType" label="币种" min-width="80" />
        <el-table-column prop="listStatus" label="上市状态" min-width="100">
          <template #default="{ row }">
            {{ row.listStatus === "L" ? "上市" : "退市" }}
          </template>
        </el-table-column>
        <el-table-column prop="isHs" label="股票类型" min-width="100">
          <template #default="{ row }">
            {{ getHsTypeName(row.isHs) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <button
              class="c-button c-button--gooey"
              @click="handleViewDetail(row)"
            >
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
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import request from "@/utils/request";
import { useRouter } from "vue-router";

export default {
  name: "StockMarket",
  components: {
    Search,
  },
  data() {
    return {
      // 筛选条件列表
      marketList: [],
      exchangeList: [],
      isHsList: [],

      // 选中的值（改回多选）
      checkedMarkets: [],
      checkedExchanges: [],
      checkedHsTypes: [],
      searchText: "",
    };
  },
  created() {
    this.fetchFilterOptions();
  },
  methods: {
    // 获取筛选条件
    async fetchFilterOptions() {
      try {
        const res = await request({
          url: "/stock/query",
          method: "get",
        });

        if (res.code === 200) {
          this.marketList = res.data.marketList;
          this.exchangeList = res.data.exchangeList;
          this.isHsList = res.data.isHsList;
        }
      } catch (error) {
        console.error("获取筛选条件失败:", error);
        ElMessage.error("获取筛选条件失败");
      }
    },

    // 获取交易所名称
    getExchangeName(code) {
      const exchangeMap = {
        SZSE: "深交所",
        SSE: "上交所",
        BSE: "北交所",
      };
      return exchangeMap[code] || code;
    },

    // 获取股票类型名称
    getHsTypeName(code) {
      const typeMap = {
        S: "沪股通",
        N: "普通股票",
        H: "深股通",
      };
      return typeMap[code] || code;
    },

    clearAllSelected() {
      this.checkedMarkets = [];
      this.checkedExchanges = [];
      this.checkedHsTypes = [];
    },

    handleSearch() {
      // TODO: 实现搜索逻辑
      console.log("搜索:", this.searchText);
    },
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const tableData = ref([]);
    const page = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const searchText = ref("");
    const checkedMarkets = ref([]);
    const checkedExchanges = ref([]);
    const checkedHsTypes = ref([]);

    const fetchData = async () => {
      loading.value = true;
      try {
        // 创建 URLSearchParams 对象来正确处理多个相同参数
        const params = new URLSearchParams();

        // 添加基础参数
        params.append("page", page.value);
        params.append("pageSize", pageSize.value);

        // 添加搜索参数
        if (searchText.value) {
          params.append("search", searchText.value);
        }

        // 添加多个市场类型
        checkedMarkets.value.forEach((market) => {
          params.append("market", market);
        });

        // 添加多个交易所
        checkedExchanges.value.forEach((exchange) => {
          params.append("exchange", exchange);
        });

        // 添加多个股票类型
        checkedHsTypes.value.forEach((type) => {
          params.append("isHs", type);
        });

        const res = await request({
          url: `/stock/list?${params.toString()}`,
          method: "get",
        });

        tableData.value = res.data.list;
        total.value = res.data.totalPageNum * pageSize.value;
      } catch (error) {
        console.error("获取数据失败:", error);
        ElMessage.error("获取数据失败");
      } finally {
        loading.value = false;
      }
    };

    const handleSizeChange = (val) => {
      pageSize.value = val;
      page.value = 1;
      fetchData();
    };

    const handleCurrentChange = (val) => {
      page.value = val;
      fetchData();
    };

    // 监听筛选条件变化
    watch(
      [searchText, checkedMarkets, checkedExchanges, checkedHsTypes],
      () => {
        page.value = 1;
        fetchData();
      }
    );

    onMounted(() => {
      fetchData();
    });

    // 查看详情前检查数据是否存在
    const handleViewDetail = async (row) => {
      try {
        const res = await request({
          url: "/stock/have",
          method: "get",
          params: { id: row.id },
        });

        if (res.code === 200) {
          if (res.data.have) {
            router.push({
              name: "StockDetail",
              params: { id: row.id },
            });
          } else {
            ElMessage.warning("暂无该股票数据");
          }
        }
      } catch (error) {
        console.error("检查股票数据失败:", error);
        ElMessage.error("检查股票数据失败");
      }
    };

    return {
      loading,
      tableData,
      page,
      pageSize,
      total,
      searchText,
      checkedMarkets,
      checkedExchanges,
      checkedHsTypes,
      handleSizeChange,
      handleCurrentChange,
      fetchData,
      handleViewDetail,
    };
  },
};
</script>

<style scoped>
.stock-market {
  padding: 30px;
  background-color: #f9f9f9;
}

.filter-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters {
  flex: 1;
}

.filter-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.filter-row:not(:last-child) {
  border-bottom: 1px solid #ebeef5;
}

.label {
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  width: 100px;
}

:deep(.el-checkbox-group) {
  display: flex;
  gap: 24px;
}

:deep(.el-checkbox) {
  margin-right: 0;
  height: 32px;
}

/* 自定义复选框样式 */
:deep(.el-checkbox__input .el-checkbox__inner) {
  border-radius: 2px; /* 方形复选框 */
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #606266;
}

/* 选中状态样式 */
:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: #409eff;
}

:deep(.el-button--link) {
  padding: 0;
  height: auto;
}

.actions {
  padding-left: 30px;
  border-left: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  margin-top: 0;
}

.search-container {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-box .label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  margin-right: 8px;
}

:deep(.el-input) {
  flex: 1; /* 搜索框占满剩余空间 */
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-button) {
  min-width: 80px; /* 确保按钮有固定最小宽度 */
}

.table-container {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: 600;
}

.check_container {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
}

.checkbox {
  position: relative;
  top: 1px;
  width: 30px;
  height: 30px;
  border: 2px solid #9fa6e9;
  border-radius: 50px;
  cursor: pointer;
  display: block;
  transition: all 0.3s linear;
}

.checkbox::after {
  content: "";
  position: absolute;
  top: 25%;
  left: 20%;
  width: 6px;
  height: 12px;
  opacity: 0;
  transform: rotate(45deg) scale(0) translate(-50%, -50%);
  border-right: 4px solid #ffffff;
  border-bottom: 4px solid #ffffff;
  transition: all 0.3s linear;
}

.hidden:checked ~ .checkbox::after {
  opacity: 1 !important;
  transform: rotate(50deg) scale(1) translate(20%, -25%) !important;
}

.hidden:checked ~ .checkbox {
  background: #9fa6e9;
  border: none;
}

.hidden {
  display: none !important;
}

.checkbox-label {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

/* 新的搜索框样式 */
.form {
  --input-bg: #f0f0f0;
  --padding: 1.5em;
  --rotate: 80deg;
  --gap: 2em;
  --icon-change-color: #15a986;
  --height: 40px;
  width: 100%;
  padding-inline-end: 1em;
  background: var(--input-bg);
  position: relative;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.form label {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--height);
}

.form input {
  width: 100%;
  padding-inline-start: calc(var(--padding) + var(--gap));
  outline: none;
  background: none;
  border: 0;
}

.form svg {
  color: #111;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  height: 15px;
}

.icon {
  position: absolute;
  left: var(--padding);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.swap-off {
  transform: rotate(-80deg);
  opacity: 0;
  visibility: hidden;
}

.close-btn {
  background: none;
  border: none;
  right: calc(var(--padding) - var(--gap));
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  padding: 0.1em;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: 0.3s;
  opacity: 0;
  transform: scale(0);
  visibility: hidden;
}

.form input:focus ~ .icon {
  transform: rotate(var(--rotate)) scale(1.3);
}

.form input:focus ~ .icon .swap-off {
  opacity: 1;
  transform: rotate(-80deg);
  visibility: visible;
  color: var(--icon-change-color);
}

.form input:focus ~ .icon .swap-on {
  opacity: 0;
  visibility: visible;
}

.form input:valid ~ .icon {
  transform: scale(1.3) rotate(var(--rotate));
}

.form input:valid ~ .icon .swap-off {
  opacity: 1;
  visibility: visible;
  color: var(--icon-change-color);
}

.form input:valid ~ .icon .swap-on {
  opacity: 0;
  visibility: visible;
}

.form input:valid ~ .close-btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: 0s;
}

button {
  border: none;
  display: block;
  position: relative;
  padding: 1em 2.8em;
  font-size: 12px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  color: royalblue;
  z-index: 1;
  font-family: inherit;
  font-weight: 500;
}

button span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid royalblue;
}

button span::before {
  content: "";
  display: block;
  position: absolute;
  width: 8%;
  height: 500%;
  background: var(--lightgray);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}

button:hover span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background: royalblue;
}

button:hover {
  color: white;
}

button:active span::before {
  background: #2751cd;
}

.c-button {
  color: #000;
  font-weight: 700;
  font-size: 10px;
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