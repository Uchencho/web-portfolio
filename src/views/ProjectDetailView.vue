<template>
  <div class="project-detail">
    <aside class="sidebar">
      <div class="sidebar-item">
        <div class="icon-wrapper" @click="openPayoutModal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sidebar-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
          </svg>
          <span class="tooltip">Payout</span>
        </div>
      </div>
      <div class="sidebar-item">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sidebar-icon">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
          </svg>
          <span class="tooltip">View Wallet</span>
        </div>
      </div>
      <div class="sidebar-item">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sidebar-icon">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
          </svg>
          <span class="tooltip">View Transactions</span>
        </div>
      </div>
    </aside>

    <div class="main-content">
      <div class="project-header">
        <h1>Crypto Payout Consumer</h1>
        <p class="subtitle">A modern solution for cryptocurrency transactions</p>
      </div>

      <div class="dashboard">
        <div class="placeholder-content">
          <img src="../assets/logo.svg" alt="Crypto Payout Logo" class="project-logo">
          <p>Welcome to the Crypto Payout Consumer dashboard. Use the sidebar to navigate through different features.</p>
          <div class="action-buttons">
            <button class="action-button primary" @click="openPayoutModal">Create Payout</button>
            <router-link to="/projects" class="action-button secondary">Back to Projects</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetailView',
  inject: ['openPayoutModal']
}
</script>

<style scoped>
.project-detail {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 70px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  transition: width 0.3s ease;
  justify-content: center;
  border-right: 1px solid #eee;
}

.sidebar-item {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(44, 62, 80, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-wrapper:hover {
  background-color: rgba(66, 185, 131, 0.2);
}

.sidebar-icon {
  width: 24px;
  height: 24px;
  color: #42b983;
}

.tooltip {
  position: absolute;
  left: 60px;
  background-color: #42b983;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  transform: translateX(-10px);
  pointer-events: none;
  z-index: 10;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #42b983 transparent transparent;
}

.icon-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-header {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.dashboard {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 900px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.project-logo {
  width: 150px;
  height: 150px;
  margin-bottom: 30px;
  animation: pulse 3s infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(66, 185, 131, 0.7));
  }
  to {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(66, 185, 131, 0.7));
  }
}

.placeholder-content p {
  max-width: 600px;
  margin: 0 auto 30px;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-button {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
}

.action-button.primary {
  background-color: #42b983;
  color: white;
}

.action-button.primary:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.action-button.secondary {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.action-button.secondary:hover {
  background-color: rgba(66, 185, 131, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .project-detail {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: center;
    padding: 10px 0;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .sidebar-item {
    margin: 0 10px;
    margin-bottom: 0;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .sidebar-icon {
    width: 20px;
    height: 20px;
  }

  .tooltip {
    left: 50%;
    top: 45px;
    transform: translateX(-50%) translateY(-10px);
  }

  .tooltip::before {
    top: 0;
    left: 50%;
    margin-top: -10px;
    margin-left: -5px;
    border-color: transparent transparent #42b983 transparent;
  }

  .icon-wrapper:hover .tooltip {
    transform: translateX(-50%) translateY(0);
  }

  h1 {
    font-size: 2rem;
  }

  .project-logo {
    width: 120px;
    height: 120px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
}

/* We've removed the dark mode styles here since they're now defined globally in App.vue */
</style>
