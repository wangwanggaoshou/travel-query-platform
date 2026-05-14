<template>
  <footer class="app-footer">
    <div class="container footer-container">
      <div class="footer-grid">
        <!-- 品牌信息 -->
        <div class="footer-brand">
          <div class="footer-logo">
            <el-icon size="24" color="#0ea5e9"><Compass /></el-icon>
            <span class="gradient-text">旅途智览</span>
          </div>
          <p class="footer-desc">
            智能旅游查询与建议平台，为您提供精准的景点信息、旅游攻略和个性化推荐。
          </p>
        </div>

        <!-- 快速链接 -->
        <div class="footer-links">
          <h4>快速链接</h4>
          <router-link to="/scenic">景点查询</router-link>
          <router-link to="/guide">旅游攻略</router-link>
          <router-link to="/recommend">智能推荐</router-link>
        </div>

        <!-- 功能介绍 -->
        <div class="footer-links">
          <h4>功能特色</h4>
          <span>真实评论聚合</span>
          <span>个性化推荐</span>
          <span>签证信息查询</span>
        </div>

        <!-- 联系信息 -->
        <div class="footer-links">
          <h4>关于我们</h4>
          <span>工程设计项目</span>
          <span>旅游信息查询系统</span>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 旅途智览 - 旅游查询与建议系统 | 毕业设计项目</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer 组件
</script>

<style scoped>
.app-footer {
  background: #1e293b;
  color: #94a3b8;
  padding: var(--spacing-3xl) 0 0;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.footer-desc {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  max-width: 320px;
}

.footer-links h4 {
  color: #ffffff;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
}

.footer-links a,
.footer-links span {
  display: block;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary-light);
}

.footer-bottom {
  text-align: center;
  padding: var(--spacing-lg) 0;
  font-size: var(--font-size-xs);
  color: #64748b;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
