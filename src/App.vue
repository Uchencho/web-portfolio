<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header>
      <nav>
        <router-link to="/" class="logo-link">
          <img src="./assets/logo.svg" alt="Logo" class="nav-logo">
          <span class="logo-text">Uche's Canva</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/projects">Projects</router-link>
          <router-link to="/about">About</router-link>
          <button @click="toggleDarkMode" class="theme-toggle" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-icon">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-icon">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>
    <div class="content-wrapper">
      <main :class="{ 'full-width': !isProjectDetailRoute }">
        <router-view />
      </main>
    </div>
    <footer>
      <div class="footer-content">
        <span>built by Uchencho</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="footer-icon">
          <path d="M11 15H6l7-14v8h5l-7 14v-8z" fill="currentColor"/>
        </svg>
      </div>
    </footer>

    <!-- Payout Modal -->
    <PayoutModal :show="showPayoutModal" @close="showPayoutModal = false" :network="currentNetwork" />
  </div>
</template>

<script>
import PayoutModal from './components/PayoutModal.vue'

export default {
  components: {
    PayoutModal
  },
  data () {
    return {
      isDarkMode: false,
      showPayoutModal: false,
      currentNetwork: 'testnet'
    }
  },
  created () {
    // Initialize default network
  },
  watch: {
    currentNetwork () {
      // Network has changed
    }
  },
  computed: {
    isProjectDetailRoute () {
      return this.$route.path.includes('/project/zing')
    }
  },
  provide () {
    return {
      openPayoutModal: this.openPayoutModal
    }
  },
  methods: {
    toggleDarkMode () {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode)
    },
    openPayoutModal () {
      this.showPayoutModal = true
    }
  },
  mounted () {
    // Check if user previously enabled dark mode
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      this.isDarkMode = savedDarkMode === 'true'
    } else {
      // Check if user's system prefers dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDarkMode = prefersDarkMode
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

*, *:before, *:after {
  box-sizing: inherit;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Dark mode styles */
#app.dark-mode {
  background-color: #121212;
  color: #f0f0f0;
}

#app.dark-mode header {
  background-color: #1e1e1e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

#app.dark-mode .logo-link,
#app.dark-mode nav a {
  color: #f0f0f0;
}

#app.dark-mode nav a.router-link-exact-active {
  color: #4fd1a5;
  border-bottom: 2px solid #4fd1a5;
}

#app.dark-mode nav a:hover {
  background-color: rgba(79, 209, 165, 0.1);
}

#app.dark-mode main {
  background-color: #121212;
}

#app.dark-mode .project-card {
  background-color: #252525;
  border-color: #4fd1a5;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

#app.dark-mode .project-card.featured {
  border-color: #4fd1a5;
  background: linear-gradient(145deg, #252525, #1a1a1a);
}

#app.dark-mode .project-badge {
  background-color: #4fd1a5;
  color: #121212;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

#app.dark-mode .project-header h2 {
  color: #4fd1a5;
  font-weight: 600;
}

#app.dark-mode .project-description {
  color: #e0e0e0;
}

#app.dark-mode .tech-tag {
  background-color: rgba(79, 209, 165, 0.15);
  color: #4fd1a5;
  border: 1px solid rgba(79, 209, 165, 0.3);
  font-weight: 600;
}

#app.dark-mode .view-more {
  color: #4fd1a5;
  border-top-color: #333;
  background-color: rgba(79, 209, 165, 0.05);
}

#app.dark-mode .card-link:hover .view-more {
  color: #ffffff;
  background-color: rgba(79, 209, 165, 0.2);
}

#app.dark-mode h1 {
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

#app.dark-mode h2 {
  color: #4fd1a5;
}

#app.dark-mode h3 {
  color: #4fd1a5;
  font-weight: 600;
}

#app.dark-mode .subtitle {
  color: #4fd1a5;
  font-weight: 500;
}

#app.dark-mode footer {
  background-color: #121212;
  border-top: none;
  color: #f0f0f0;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  width: 100%;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.2rem;
}

.nav-logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

nav a:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

nav a.router-link-exact-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

.theme-icon {
  width: 24px;
  height: 24px;
  color: #2c3e50;
}

#app.dark-mode .theme-icon {
  color: #4fd1a5;
}

.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

main {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  overflow: auto;
}

main.full-width {
  max-width: 100%;
}

footer {
  background-color: #f8f9fa;
  color: #2c3e50;
  text-align: center;
  padding: 8px;
  width: 100%;
  font-size: 0.9rem;
  border-top: none;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.footer-icon {
  width: 16px;
  height: 16px;
  color: #ffcc00;
}

@media (max-width: 768px) {
  html, body {
    overflow: auto;
  }

  #app {
    overflow: auto;
  }

  .content-wrapper {
    flex-direction: column;
    overflow: auto;
  }

  main {
    max-width: 100%;
    overflow: auto;
  }

  .logo-text {
    display: none;
  }

  .logo-link {
    position: relative;
  }

  .logo-link:hover::after {
    content: 'Uche\'s Canva';
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #42b983;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
  }

  #app.dark-mode .logo-link:hover::after {
    background-color: #4fd1a5;
  }

  .nav-logo {
    margin-right: 0;
  }
}

#app.dark-mode .card,
#app.dark-mode .about-card,
#app.dark-mode .dashboard,
#app.dark-mode .project-card {
  background-color: #252525;
  border-color: #4fd1a5;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
}

#app.dark-mode .card h1,
#app.dark-mode .about-card h1,
#app.dark-mode .dashboard h1,
#app.dark-mode .card h2,
#app.dark-mode .about-card h2,
#app.dark-mode .dashboard h2 {
  color: #4fd1a5;
  font-weight: 600;
}

#app.dark-mode .card p,
#app.dark-mode .about-card p,
#app.dark-mode .dashboard p,
#app.dark-mode .placeholder-content p {
  color: #e0e0e0;
}

#app.dark-mode .divider {
  background-color: #4fd1a5;
}

#app.dark-mode .tech-list li {
  border-bottom-color: #333;
  color: #e0e0e0;
}

#app.dark-mode .tech-icon {
  background-color: rgba(79, 209, 165, 0.15);
  color: #4fd1a5;
  border: 1px solid rgba(79, 209, 165, 0.3);
}

#app.dark-mode .action-button.primary {
  background-color: #4fd1a5;
  color: #121212;
  font-weight: 700;
}

#app.dark-mode .action-button.secondary {
  color: #4fd1a5;
  border-color: #4fd1a5;
  background-color: rgba(79, 209, 165, 0.05);
}

#app.dark-mode .action-button.primary:hover {
  background-color: #3cb28f;
  box-shadow: 0 4px 8px rgba(79, 209, 165, 0.3);
}

#app.dark-mode .action-button.secondary:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
}

#app.dark-mode .sidebar {
  background-color: #121212;
  border-color: #333;
}

#app.dark-mode .icon-wrapper {
  background-color: rgba(255, 255, 255, 0.05);
}

#app.dark-mode .icon-wrapper:hover {
  background-color: rgba(79, 209, 165, 0.2);
}

#app.dark-mode .sidebar-icon {
  color: #4fd1a5;
}

#app.dark-mode .tooltip {
  background-color: #4fd1a5;
}

#app.dark-mode .tooltip::before {
  border-color: transparent #4fd1a5 transparent transparent;
}

#app.dark-mode .portfolio-container {
  background-color: #252525;
  border-color: #4fd1a5;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

#app.dark-mode .summary-section {
  background-color: #1e1e1e;
  border-right: 1px solid #333;
}

#app.dark-mode .skills-section {
  background-color: #252525;
}

#app.dark-mode .skill-label {
  color: #e0e0e0;
}

#app.dark-mode .skill-bar-container {
  background-color: #333;
}

#app.dark-mode .skill-bar {
  background-color: #4fd1a5;
}

#app.dark-mode .skill-percentage {
  color: #b0b0b0;
}

#app.dark-mode .experience-title {
  color: #ffffff;
}

#app.dark-mode .experience-company {
  color: #4fd1a5;
}

#app.dark-mode .experience-period {
  color: #b0b0b0;
}

#app.dark-mode .experience-item {
  border-bottom-color: #333;
}

#app.dark-mode .bio,
#app.dark-mode .experience-item p {
  color: #e0e0e0;
}

#app.dark-mode .contact-link {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
  font-weight: 600;
}

#app.dark-mode .contact-link:hover {
  background-color: #ff0000;
  box-shadow: 0 4px 8px rgba(255, 0, 0, 0.4);
}

#app.dark-mode .soft-skills-title {
  color: #4fd1a5;
  border-top-color: #333;
}

#app.dark-mode .soft-skills-title + .skill-item .skill-bar {
  background-color: #4fd1a5;
  background-image: linear-gradient(to right, #4fd1a5, #3cb28f);
}

#app.dark-mode .skill-item:nth-of-type(10) .skill-bar,
#app.dark-mode .skill-item:nth-of-type(11) .skill-bar {
  background-color: #3498db !important;
  background-image: linear-gradient(to right, #3498db, #9b59b6) !important;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.4);
}
</style>
