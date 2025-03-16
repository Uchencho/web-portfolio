<template>
  <div class="about">
    <div class="about-card">
      <h1>About This Project</h1>
      <div class="divider"></div>
      <p>This portfolio was built using Cursor and a lot of patience.</p>

      <h2>Technology Stack</h2>
      <ul class="tech-list">
        <li><span class="tech-icon">⚡</span> Vue 3 - Progressive JavaScript Framework</li>
        <li><span class="tech-icon">🔄</span> Vue Router - Official Router for Vue.js</li>
        <li><span class="tech-icon">🎨</span> Modern CSS - Flexbox & CSS Variables</li>
        <li><span class="tech-icon">📱</span> Responsive Design - Mobile-first approach</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.about-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
  max-height: 100%;
  overflow-y: auto;
}

h1 {
  color: #42b983;
  margin-top: 0;
  font-size: 1.8rem;
  word-wrap: break-word;
}

h2 {
  color: #2c3e50;
  margin-top: 20px;
  font-size: 1.4rem;
  word-wrap: break-word;
}

.divider {
  height: 3px;
  width: 60px;
  background-color: #42b983;
  margin: 15px 0;
}

p {
  line-height: 1.5;
  color: #4a4a4a;
  margin-bottom: 15px;
  word-wrap: break-word;
}

.tech-list {
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
  width: 100%;
}

.tech-list li {
  padding: 8px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  color: #2c3e50;
}

.tech-list li:last-child {
  border-bottom: none;
}

.tech-icon {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: rgba(66, 185, 131, 0.1);
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  margin-right: 15px;
  font-size: 14px;
  flex-shrink: 0;
}

/* We've removed the dark mode styles here since they're now defined globally in App.vue */
</style>
