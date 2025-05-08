<template>
  <div class="company-list">
    <!-- 省份列表 -->
    <div class="filter-section province-list">
      <div class="section-header">
        <span class="title">选择省份</span>
        <div class="actions">
          <el-button type="default" link @click="selectAll">全选</el-button>
          <el-divider direction="vertical" />
          <el-button type="default" link @click="clearAll">清空</el-button>
        </div>
      </div>
      <div class="province-container">
        <div v-for="province in provinces" :key="province" class="cntr">
          <input
            type="checkbox"
            :id="'cbx-' + province"
            :value="province"
            v-model="checkedProvinces"
            class="hidden-xs-up"
          />
          <label :for="'cbx-' + province" class="cbx"></label>
          <span class="lbl">{{ province }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="filter-section search-box">
      <div class="section-header">
        <span class="title">搜索条件</span>
      </div>
      <form class="form" @submit.prevent="fetchTableData">
        <button type="button">
          <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
            <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <input class="input" v-model="searchKeyword" placeholder="请输入搜索关键词" required type="text">
        <button class="reset" type="reset" @click="searchKeyword = ''">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </form>
    </div>

    <!-- 表格部分 -->
    <div class="filter-section table-container">
      <div class="section-header">
        <span class="title">公司列表</span>
        <div class="table-actions">
          <span class="total-count">共 {{ total }} 条数据</span>
        </div>
      </div>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="comName" label="公司名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="comId" label="统一社会信用代码" min-width="200" show-overflow-tooltip />
        <el-table-column prop="chairman" label="法人代表" width="100" />
        <el-table-column prop="manager" label="总经理" width="100" />
        <el-table-column prop="secretary" label="董秘" width="100" />
        <el-table-column prop="regCapital" label="注册资本" min-width="120">
          <template #default="{ row }">
            {{ row.regCapital.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="province" label="所在省份" min-width="90" />
        <el-table-column prop="city" label="所在城市" min-width="90" />
        <el-table-column prop="employees" label="员工人数" min-width="90" />
        
        <!-- 添加操作列 -->
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          :pager-count="7"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <span class="total-info">共 {{ totalPageNum }} 页，{{ total }} 条数据</span>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="公司详情"
      width="800px"
      @close="handleClose"
    >
      <div v-if="companyDetail" class="company-detail">
        <div class="detail-section basic-info">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <p><strong>公司名称：</strong>{{ companyDetail.comName }}</p>
            <p><strong>统一社会信用代码：</strong>{{ companyDetail.comId }}</p>
            <p><strong>法人代表：</strong>{{ companyDetail.chairman }}</p>
            <p><strong>总经理：</strong>{{ companyDetail.manager }}</p>
            <p><strong>董秘：</strong>{{ companyDetail.secretary }}</p>
            <p><strong>注册资本：</strong>{{ companyDetail.regCapital.toFixed(2) }}</p>
            <p><strong>所在省份：</strong>{{ companyDetail.province }}</p>
            <p><strong>所在城市：</strong>{{ companyDetail.city }}</p>
            <p><strong>员工人数：</strong>{{ companyDetail.employees }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">公司介绍</h3>
          <div class="section-content">
            <span>{{ companyDetail.introduction }}</span>
            <el-button class="copy-btn" type="primary" link @click="copyText(companyDetail.introduction)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">主要业务及产品</h3>
          <div class="section-content">
            <span>{{ companyDetail.mainBusiness }}</span>
            <el-button class="copy-btn" type="primary" link @click="copyText(companyDetail.mainBusiness)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">经营范围</h3>
          <div class="section-content">
            <span>{{ companyDetail.businessScope }}</span>
            <el-button class="copy-btn" type="primary" link @click="copyText(companyDetail.businessScope)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: block; height: 0; width: 0;">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
          <feBlend in="SourceGraphic" in2="goo"></feBlend>
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Search, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'

export default {
  name: "CompanyList",
  data() {
    return {
      provinces: [],
      checkedProvinces: [],
      searchKeyword: "",
      Search: Search,
      
      // 表格数据
      tableData: [],
      loading: false,
      totalPageNum: 0,
      total: 0,
      page: 1,
      pageSize: 10,
      dialogVisible: false,
      companyDetail: null
    };
  },
  watch: {
    // 监听搜索条件变化
    checkedProvinces() {
      this.page = 1
      this.fetchTableData()
    },
    searchKeyword() {
      this.page = 1
      this.fetchTableData()
    }
  },
  created() {
    this.fetchProvinces();
    this.fetchTableData();
  },
  components: {
    CopyDocument
  },
  methods: {
    async fetchProvinces() {
      try {
        const res = await request({
          url: "/company/query",
          method: "get",
        });

        if (res.code === 200) {
          this.provinces = res.data.list;
        }
      } catch (error) {
        console.error("获取省份列表失败:", error);
        ElMessage.error("获取省份列表失败");
      }
    },
    selectAll() {
      this.checkedProvinces = [...this.provinces];
    },
    clearAll() {
      this.checkedProvinces = [];
    },
    async fetchTableData() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          search: this.searchKeyword || undefined,
          province: this.checkedProvinces // 直接传递选中的省份数组
        }
        
        const res = await request({
          url: '/company/list',
          method: 'get',
          params,
          paramsSerializer: params => {
            // 自定义参数序列化
            const parts = []
            for (const key in params) {
              if (params[key] !== undefined) {
                if (Array.isArray(params[key])) {
                  // 数组参数处理：每个元素单独作为一个参数
                  params[key].forEach(item => {
                    parts.push(`${key}=${encodeURIComponent(item)}`)
                  })
                } else {
                  parts.push(`${key}=${encodeURIComponent(params[key])}`)
                }
              }
            }
            return parts.join('&')
          }
        })
        
        if (res.code === 200) {
          this.tableData = res.data.list
          this.totalPageNum = res.data.totalPageNum
          this.total = res.data.count
          this.hasMore = this.page < this.totalPageNum
        }
      } catch (error) {
        console.error('获取公司列表失败:', error)
        ElMessage.error('获取公司列表失败')
      } finally {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchTableData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchTableData()
    },
    async handleViewDetail(row) {
      try {
        const res = await request({
          url: '/company',
          method: 'get',
          params: { id: row.id }
        })
        
        if (res.code === 200) {
          this.companyDetail = res.data
          this.dialogVisible = true
        } else {
          ElMessage.error('获取公司详情失败')
        }
      } catch (error) {
        console.error('获取公司详情失败:', error)
        ElMessage.error('获取公司详情失败')
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.companyDetail = null
    },
    copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          ElMessage.success('复制成功');
        }).catch(() => {
          // 使用回退方案
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            ElMessage.success('复制成功');
          } catch (err) {
            ElMessage.error('复制失败');
          }
          document.body.removeChild(textarea);
        });
      } else {
        // 使用回退方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          ElMessage.success('复制成功');
        } catch (err) {
          ElMessage.error('复制失败');
        }
        document.body.removeChild(textarea);
      }
    }
  },
};
</script>

<style scoped>
.company-list {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #e2e8f0);
  min-height: 100%;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.filter-section {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.filter-section:hover {
  box-shadow: 0 2px 12px rgba(0, 21, 41, 0.12);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header .title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  user-select: none;
}

.section-header .actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 省份列表样式 */
.province-list :deep(.el-checkbox-group) {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.province-list :deep(.el-checkbox.is-bordered) {
  margin: 0;
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.province-list :deep(.el-checkbox.is-bordered:hover) {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.province-list :deep(.el-checkbox.is-bordered.is-checked) {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.province-list :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #606266;
}

/* 搜索框样式 */
.search-box {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #dcdfe6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-box :deep(.el-input) {
  padding: 0 16px;
}

.search-box :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
}

.search-box :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc;
}

.search-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}

.search-box :deep(.el-input-group__append) {
  padding: 0;
  background: none;
  border: none;
}

.search-box :deep(.el-button) {
  border-radius: 0 4px 4px 0;
  padding: 0 20px;
}

/* 分割线样式 */
:deep(.el-divider--vertical) {
  height: 1em;
  margin: 0 8px;
}

.table-container {
  padding-bottom: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-count {
  color: #606266;
  font-size: 14px;
}

.pagination-container {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.total-info {
  color: #606266;
  font-size: 14px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
}

:deep(.el-pagination .el-pager li.more::before) {
  content: "...";
}

:deep(.el-pagination .el-pager li) {
  background: transparent;
}

:deep(.el-pagination .el-pager li.active) {
  background-color: #409eff;
  color: #fff;
}

:deep(.el-table) {
  margin: 16px;
  width: calc(100% - 32px) !important;
}

:deep(.el-table__header-wrapper) {
  background-color: #f5f7fa;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #1f2f3d;
  font-weight: 500;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

/* 操作列按钮样式 */
:deep(.el-button--link) {
  padding: 4px 0;
  font-size: 14px;
}

:deep(.el-button--link:hover) {
  opacity: 0.8;
}

.company-detail {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-grid p {
  margin: 0;
  line-height: 1.6;
  display: flex;
  align-items: center;
}

.section-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  line-height: 1.8;
  color: #606266;
}

.section-content span {
  flex: 1;
  text-align: justify;
}

.copy-btn {
  flex-shrink: 0;
  padding: 4px;
  margin-top: 2px;
  background: transparent !important;
  border: none !important;
}

.copy-btn :deep(.el-button) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.copy-btn :deep(.el-button:hover) {
  background: transparent !important;
  border: none !important;
}

.copy-btn :deep(.el-icon) {
  font-size: 16px;
  color: #409eff;
}

.copy-btn:hover :deep(.el-icon) {
  color: #66b1ff;
}

.company-detail strong {
  color: #909399;
  margin-right: 8px;
  font-weight: 500;
  flex-shrink: 0;
}

:deep(.el-dialog) {
  border-radius: 12px;
  margin-top: 8vh !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.el-dialog__body) {
  padding: 0;
  max-height: 65vh;
  overflow-y: auto;
}

:deep(.el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb) {
  background: #dcdfe6;
  border-radius: 3px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

/* 添加一些动画效果 */
:deep(.el-dialog) {
  transition: all 0.3s ease-in-out;
}

.detail-section {
  transition: all 0.2s ease-in-out;
}

.detail-section:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-button--text) {
  margin-left: 8px;
  color: #409eff;
  font-size: 16px;
  vertical-align: middle;
}

:deep(.el-button--text:hover) {
  color: #66b1ff;
}

.province-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px;
}

.cntr {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.cbx {
  position: relative;
  top: 1px;
  width: 27px;
  height: 27px;
  border: 1px solid #c8ccd4;
  border-radius: 3px;
  transition: background 0.1s ease;
  cursor: pointer;
  display: block;
  margin-right: 8px;
}

.cbx:after {
  content: '';
  position: absolute;
  top: 2px;
  left: 8px;
  width: 7px;
  height: 14px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: all 0.3s ease;
  transition-delay: 0.15s;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
  font-size: 14px;
}

.hidden-xs-up {
  display: none!important;
}

input:checked + .cbx {
  border-color: transparent;
  background: #6871f1;
  animation: jelly 0.6s ease;
}

input:checked + .cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

@keyframes jelly {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}

.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}

.form {
  --timing: 0.3s;
  --width-of-input: 100%;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #fff;
  --border-color: #2f2ee9;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}

.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}

.form:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}

.form:focus-within {
  border-radius: var(--after-border-radius);
}

input:focus {
  outline: none;
}

.form:focus-within:before {
  transform: scale(1);
}

.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}

input:not(:placeholder-shown) ~ .reset {
  opacity: 1;
  visibility: visible;
}

.form svg {
  width: 17px;
  margin-top: 3px;
}

/* 移除旧的按钮样式 */
.c-button,
.c-button--gooey,
.c-button__blobs,
.c-button--gooey .c-button__blobs div {
  display: none;
}

/* 添加新的按钮样式 */
:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style> 