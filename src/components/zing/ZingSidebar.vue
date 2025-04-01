<template>
  <aside class="sidebar">
    <div class="sidebar-item">
      <div class="icon-wrapper" @click="$emit('payout')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sidebar-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
        </svg>
        <span class="tooltip">Payout</span>
      </div>
    </div>
    <div class="sidebar-item">
      <div class="icon-wrapper" @click="$emit('transactions')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sidebar-icon">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
        </svg>
        <span class="tooltip">View Transactions</span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'ZingSidebar'
}
</script>

<style scoped>
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

/* Responsive styles */
@media (max-width: 768px) {
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
}

/* Dark mode styles */
:deep(.dark-mode) .sidebar {
  background-color: #121212;
  border-color: #333;
}

:deep(.dark-mode) .icon-wrapper {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.dark-mode) .icon-wrapper:hover {
  background-color: rgba(79, 209, 165, 0.2);
}

:deep(.dark-mode) .sidebar-icon {
  color: #4fd1a5;
}

:deep(.dark-mode) .tooltip {
  background-color: #4fd1a5;
}

:deep(.dark-mode) .tooltip::before {
  border-color: transparent #4fd1a5 transparent transparent;
}

@media (max-width: 768px) {
  :deep(.dark-mode) .tooltip::before {
    border-color: transparent transparent #4fd1a5 transparent;
  }
}
</style>
