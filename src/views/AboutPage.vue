<template>
  <div class="about-page">
    <header class="header">
      <button @click="goHome" class="back-button">返回主页</button>
      <h1>关于我们</h1>
    </header>
    <section class="content">
      <h2>关于我</h2>
      <p>欢迎来到金融数据可视化平台！</p>
      <p>我是这个平台的唯一开发者，一名热爱金融与数据分析的独立创作者。这个项目完全由我自主构思、设计与实现，旨在通过技术手段让复杂的金融数据变得直观易懂。</p>

      <h2>我的初衷</h2>
      <ul>
        <li><strong>独立开发者：</strong>没有团队支持，从前端、后端到模型开发全部由我一人完成。</li>
        <li><strong>热情驱动：</strong>出于对金融市场与数据分析的热爱，我不断迭代优化系统的功能与体验。</li>
        <li><strong>用户为本：</strong>力求打造简洁高效的数据可视化工具，让用户能用最直观的方式理解市场动向。</li>
      </ul>

      <h2>开源与透明</h2>
      <p>本平台完全开源，所有代码已托管至 <a href="https://github.com/zandala88/financial_data_go" target="_blank">GitHub</a>，欢迎访问、学习或提出建议。</p>

      <h2>系统模块</h2>
      <p>系统涵盖六大模块：</p>
      <ul>
        <li>上市公司信息</li>
        <li>股票市场（包含预测功能）</li>
        <li>公募基金</li>
        <li>期货数据</li>
        <li>宏观经济指标</li>
        <li>用户个人中心</li>
      </ul>
      <p>通过图表和动态交互，让用户从多个维度洞察金融市场。</p>

      <h2>数据来源</h2>
      <p>本项目所用金融数据全部来自 <a href="https://tushare.pro" target="_blank">TuShare</a>，感谢其提供高质量的免费金融数据接口支持。</p>

      <h2>技术亮点</h2>
      <ul>
        <li><strong>后端：</strong>基于 Golang（Gin + GORM），高性能、强可扩展</li>
        <li><strong>预测模型：</strong>使用 PyTorch 训练的 LSTM 模型，通过 Flask 暴露预测接口</li>
        <li><strong>前端：</strong>Vue3 + Element Plus + ECharts，响应式界面、交互友好</li>
        <li><strong>数据库：</strong>MySQL 与 Redis 相结合，保障系统性能与数据访问效率</li>
      </ul>
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

.content a {
  color: #3B82F6;
  text-decoration: none;
}

.content a:hover {
  text-decoration: underline;
  color: #4F46E5;
}
</style>