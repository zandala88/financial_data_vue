<template>
  <div class="home">
    <TabBar />
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component 
            :is="Component" 
            :key="$route.fullPath"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'

export default {
  name: 'Home',
  components: {
    TabBar
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style> 