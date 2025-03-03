<template>
  <div class="about-page">
    <header class="header">
      <button @click="goHome" class="back-button">返回主页</button>
      <h1>关于我们</h1>
    </header>
    <section class="content">
      <p>欢迎来到金融数据可视化系统。我们致力于提供最优质的金融数据分析服务。</p>
      <!-- 新增内容开始 -->
      <h2>关于我</h2>
      <p>欢迎来到金融数据可视化平台！</p>
      <p>我是这个平台的唯一开发者，一个热爱数据与金融世界的独立创作者。在这个项目中，我专注于将复杂的金融数据通过直观、易于理解的图表和动态分析呈现出来，帮助用户快速捕捉市场趋势与信息。</p>
      <h2>我的初衷</h2>
      <ul>
        <li><strong>独立开发者：</strong>没有团队支持，这一切都是我独自构思、设计与实现的结果。</li>
        <li><strong>热情与专注：</strong>凭借对金融市场的热情和对数据分析的专业追求，我不断优化平台的功能和体验。</li>
        <li><strong>用户至上：</strong>致力于打造简洁高效的数据可视化工具，让用户能以最直观的方式理解金融数据的背后故事。</li>
      </ul>
      <!-- 新增内容结束 -->
    </section>
    <footer class="footer">
      <p>© 2025 金融数据可视化系统</p>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'AboutPage',
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.about-page {
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
}

.header {
  background: linear-gradient(to right, #4F46E5, #3B82F6);
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
}

.back-button {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  padding: 10px 20px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #4F46E5;
}

.content {
  margin: 20px;
  padding: 20px;
  background-color: #EFF6FF;
  border-radius: 10px;
}

.content h2 {
  color: #1E3A8A;
  margin-top: 20px;
}

.content p {
  line-height: 1.6;
  margin-bottom: 10px;
}

.content ul {
  list-style-type: disc;
  margin-left: 20px;
}

.content li {
  margin-bottom: 10px;
}

.footer {
  background: linear-gradient(to right, #3B82F6, #4F46E5);
  color: white;
  text-align: center;
  padding: 10px;
}

.team-photo {
  width: 100%;
  height: auto;
  margin: 20px 0;
}
</style>