<template>
  <div class="projects">
    <h1>My Projects</h1>
    <p class="subtitle">A showcase of my blockchain and web development work</p>

    <div class="projects-grid">
      <!-- Zing Project -->
      <router-link to="/project/zing" class="card-link">
        <div class="project-card featured">
          <div class="project-header">
            <div class="project-badge">New</div>
            <h2>Zing</h2>
          </div>
          <p class="project-description">
            A modern solution for cryptocurrency transactions, allowing users to easily send payments
            across different blockchain networks.
          </p>
          <div class="tech-stack">
            <span class="tech-tag">Vue.js</span>
            <span class="tech-tag">JavaScript</span>
            <span class="tech-tag">Blockchain</span>
            <span class="tech-tag">Responsive Design</span>
          </div>
          <div class="view-more">
            <span>View Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectsView'
}
</script>

<style scoped>
.projects {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  margin-top: 30px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.3s ease;
}

.card-link:hover {
  transform: translateY(-5px);
}

.project-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #eee;
  cursor: pointer;
}

.card-link:hover .project-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.project-card.featured {
  border: 2px solid #42b983;
}

.project-header {
  padding: 20px 20px 10px;
  position: relative;
}

.project-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #42b983;
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.project-header h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.project-description {
  padding: 0 20px;
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
}

.tech-stack {
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.view-more {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #42b983;
  font-weight: 600;
  font-size: 0.9rem;
  gap: 5px;
  border-top: 1px solid #f0f0f0;
}

.card-link:hover .view-more {
  color: #3aa876;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}

/* Dark mode styles */
:deep(.dark-mode) h1 {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  font-weight: 700 !important;
}

:deep(.dark-mode) .subtitle {
  color: #4fd1a5 !important;
  font-weight: 500 !important;
}

:deep(.dark-mode) .project-card {
  background-color: #252525 !important;
  border-color: #4fd1a5 !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important;
}

:deep(.dark-mode) .card-link:hover .project-card {
  box-shadow: 0 10px 25px rgba(79, 209, 165, 0.3) !important;
}

:deep(.dark-mode) .project-card.featured {
  border-color: #4fd1a5 !important;
  background: linear-gradient(145deg, #252525, #1a1a1a) !important;
}

:deep(.dark-mode) .project-badge {
  background-color: #4fd1a5 !important;
  color: #121212 !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

:deep(.dark-mode) .project-header h2 {
  color: #4fd1a5 !important;
  font-weight: 600 !important;
}

:deep(.dark-mode) .project-description {
  color: #e0e0e0 !important;
}

:deep(.dark-mode) .tech-tag {
  background-color: rgba(79, 209, 165, 0.15) !important;
  color: #4fd1a5 !important;
  border: 1px solid rgba(79, 209, 165, 0.3) !important;
  font-weight: 600 !important;
}

:deep(.dark-mode) .view-more {
  color: #4fd1a5 !important;
  border-top-color: #333 !important;
  background-color: rgba(79, 209, 165, 0.05) !important;
}

:deep(.dark-mode) .card-link:hover .view-more {
  color: #ffffff !important;
  background-color: rgba(79, 209, 165, 0.2) !important;
}
</style>
