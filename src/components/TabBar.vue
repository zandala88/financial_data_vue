<template>
  <div class="tab-bar">
    <div class="tab-group">
      <div
        v-for="tab in activeTabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: tab.active }"
        @click="activateTab(tab)"
      >
        <span class="tab-title">
          {{ tab.title }}{{ tab.count ? " " + tab.count : "" }}
        </span>
        <span class="close-icon" @click.stop="closeTab(tab)">×</span>
      </div>
    </div>
    <el-dropdown trigger="click" @command="addTab">
      <button class="cssbuttons-io-button">
        <svg
          height="24"
          width="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
            fill="currentColor"
          ></path>
        </svg>
        <span>Add</span>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="tab in availableTabs"
            :key="tab"
            :command="tab"
          >
            {{ tab }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "TabBar",
  data() {
    return {
      tabList: [],
      activeTabs: [],
      nextId: 1,
      routeMap: {
        上市公司: "/company",
        股票市场: "/stock",
        公募基金: "/fund",
        期货数据: "/futures",
        宏观经济: "/economics",
      },
    };
  },
  computed: {
    availableTabs() {
      return this.tabList;
    },
  },
  methods: {
    async fetchTabs() {
      try {
        const res = await request({
          url: "/tab/list",
          method: "get",
        });

        if (res.code === 200) {
          this.tabList = res.data.list;

          // 获取当前路由对应的标签标题
          const currentPath = this.$route.path;
          const currentTitle = Object.entries(this.routeMap).find(
            ([_, path]) => path === currentPath
          )?.[0];

          // 初始化标签
          this.tabList.forEach((tabTitle, index) => {
            const count = this.getNextCount(tabTitle);
            this.activeTabs.push({
              id: this.nextId++,
              title: tabTitle,
              active: tabTitle === currentTitle, // 根据当前路由设置激活状态
              count: count,
              uniqueKey: `${tabTitle}-${count || 1}`,
            });
          });

          // 如果没有匹配的标签，且有标签存在，则激活第一个标签
          if (
            !this.activeTabs.some((tab) => tab.active) &&
            this.activeTabs.length > 0
          ) {
            this.activeTabs[0].active = true;
            this.navigateToTab(this.activeTabs[0]);
          }
        }
      } catch (error) {
        console.error("获取标签列表失败:", error);
      }
    },
    getNextCount(tabTitle) {
      let uniqueKey = this.activeTabs
        .filter((tab) => tab.title === tabTitle)
        .map((tab) => tab.uniqueKey);
      let tmp = uniqueKey
        .map((key) => {
          const parts = key.split("-");
          return parseInt(parts[1], 10); // 转换为整数
        })
        .sort((a, b) => a - b);
      for (let i = 1; i <= tmp.length; i++) {
        if (tmp[i - 1] !== i) {
          return i > 1 ? i : undefined;
        }
      }
      return tmp.length + 1 > 1 ? tmp.length + 1 : undefined;
    },
    addTab(tabTitle) {
      // 先将所有标签设置为非激活状态
      this.activeTabs.forEach((tab) => (tab.active = false));

      // 创建新标签
      const count = this.getNextCount(tabTitle);
      const newTab = {
        id: this.nextId++,
        title: tabTitle,
        active: true,
        count: count,
        uniqueKey: `${tabTitle}-${count || 1}`,
      };

      // 添加新标签
      this.activeTabs.push(newTab);

      // 立即导航到新标签对应的路由
      this.navigateToTab(newTab);
    },
    navigateToTab(tab) {
      const route = this.routeMap[tab.title];
      if (route) {
        this.$router.push({
          path: route,
          query: {
            id: tab.uniqueKey,
          },
        });
      }
    },
    activateTab(tab) {
      this.activeTabs.forEach((t) => (t.active = false));
      tab.active = true;
      this.navigateToTab(tab);
    },
    closeTab(tab) {
      const index = this.activeTabs.indexOf(tab);

      // 如果关闭的是激活的标签，需要激活并导航到其他标签
      if (tab.active && this.activeTabs.length > 1) {
        // 优先选择右边的标签，如果没有则选择左边的
        const nextTab =
          this.activeTabs[index + 1] || this.activeTabs[index - 1];
        nextTab.active = true;
        // 导航到新激活的标签
        this.navigateToTab(nextTab);
      }

      // 移除要关闭的标签
      this.activeTabs = this.activeTabs.filter((t) => t.id !== tab.id);

      // 如果关闭后没有标签了，可以选择重定向到首页或其他页面
      if (this.activeTabs.length === 0) {
        this.$router.push("/");
      }
    },
  },
  created() {
    this.fetchTabs();
  },
};
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  height: 50px; 
  background: #f8f9fa; 
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
}

.tab-group {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-group::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 0 18px; 
  min-width: 130px; 
  max-width: 220px; 
  height: 36px; 
  margin: 8px 6px; 
  background: #e9ecef;
  border-radius: 8px; 
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item:hover {
  background: #dee2e6; 
}

.tab-item.active {
  background: #007bff; 
  color: white;
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.close-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px; 
  width: 18px; 
  height: 18px; 
  border-radius: 50%;
  font-size: 16px; 
  opacity: 0.8;
  transition: all 0.2s ease;
}

.tab-item:not(.active) .close-icon:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.tab-item.active .close-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.cssbuttons-io-button {
  display: flex;
  align-items: center;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  padding: 0.5em 1em 0.5em 0.8em;
  color: white;
  background: linear-gradient(
    0deg,
    rgba(24, 119, 242, 1) 0%,
    rgba(92, 164, 255, 1) 100%
  );
  border: none;
  box-shadow: 0 0.4em 1em -0.4em rgba(24, 119, 242, 0.6);
  letter-spacing: 0.05em;
  border-radius: 20em;
}

.cssbuttons-io-button svg {
  margin-right: 6px;
  height: 20px;
  width: 20px;
}

.cssbuttons-io-button:hover {
  box-shadow: 0 0.3em 1em -0.4em rgba(24, 119, 242, 0.6);
}

.cssbuttons-io-button:active {
  box-shadow: 0 0.2em 0.8em -0.4em rgba(24, 119, 242, 0.6);
}

/* 添加动画效果 */
.tab-item {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.el-dropdown-menu__item.is-disabled {
  color: #999;
  cursor: not-allowed;
}
</style> 