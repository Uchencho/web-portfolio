<template>
  <div class="home">
    <div class="portfolio-container">
      <!-- Left Half - Summary -->
      <div class="summary-section">
        <h1>Uchencho</h1>
        <h2>Software Engineer</h2>
        <div class="divider"></div>
        <p class="bio">
          My name is Uchenna Alozie, a backend-focused software engineer with expertise in Golang, AWS, Smart Contracts and AI systems. I build scalable, efficient solutions for complex problems.
        </p>

        <div class="experience-section">
          <h3>Work Experience</h3>
          <p class="bio">
            I have 6 years of work experience which started as a data analyst for about a year and software developement for the next five.
          </p>
          <p class="bio">
            All those 5 years were with various start ups where one in particular I joined them after their seed round and left when they became a unicorn.
          </p>

          <div class="tags-container">
            <h4>Industries</h4>
            <div class="tags">
              <span class="tag">FinTech</span>
              <span class="tag">Financial Software</span>
              <span class="tag">Insurance</span>
            </div>
          </div>

          <div class="tags-container">
            <h4>Countries</h4>
            <div class="tags">
              <span class="tag">United States</span>
              <span class="tag">Spain</span>
              <span class="tag">Nigeria</span>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <a href="https://github.com/uchencho" target="_blank" rel="noopener noreferrer" class="contact-link" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="mailto:aloziekelechi17@gmail.com" class="contact-link" title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Right Half - Skills Bar Chart -->
      <div class="skills-section">
        <h3>Technical Skills</h3>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7z"/>
            </svg>
          </div>
          <div class="skill-label">Golang</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 90%"></div>
          </div>
          <div class="skill-percentage">90%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div class="skill-label">AWS DynamoDB</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 90%"></div>
          </div>
          <div class="skill-percentage">90%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
          </div>
          <div class="skill-label">AWS Lambda</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 90%"></div>
          </div>
          <div class="skill-percentage">90%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>
            </svg>
          </div>
          <div class="skill-label">AWS Cloudformation</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 85%"></div>
          </div>
          <div class="skill-percentage">85%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div class="skill-label">AWS Cloudwatch</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 85%"></div>
          </div>
          <div class="skill-percentage">85%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
            </svg>
          </div>
          <div class="skill-label">AWS CodePipeline</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 80%"></div>
          </div>
          <div class="skill-percentage">80%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21l-6.44-6.44zM17.42 8.83l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zM5.97 5.96l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z"/>
            </svg>
          </div>
          <div class="skill-label">Python</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 65%"></div>
          </div>
          <div class="skill-percentage">65%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <div class="skill-label">Solidity & Smart Contracts</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 65%"></div>
          </div>
          <div class="skill-percentage">65%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z"/>
            </svg>
          </div>
          <div class="skill-label">AI Prototyping</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 65%"></div>
          </div>
          <div class="skill-percentage">65%</div>
        </div>

        <h3 class="soft-skills-title">Soft Skills</h3>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </div>
          <div class="skill-label">Ownership</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 100%"></div>
          </div>
          <div class="skill-percentage">100%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="skill-label">Fun and Respect</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 100%"></div>
          </div>
          <div class="skill-percentage">100%</div>
        </div>

        <div class="skill-item">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </div>
          <div class="skill-label">Communication</div>
          <div class="skill-bar-container">
            <div class="skill-bar" style="width: 90%"></div>
          </div>
          <div class="skill-percentage">90%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.portfolio-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 140px);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Left Section - Summary */
.summary-section {
  flex: 1;
  padding: 30px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

h2 {
  font-size: 1.5rem;
  color: #42b983;
  margin: 10px 0 0 0;
  font-weight: 500;
}

h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 25px 0 15px 0;
}

.divider {
  width: 60px;
  height: 3px;
  background-color: #42b983;
  margin: 20px 0;
}

.bio {
  font-size: 1rem;
  line-height: 1.5;
  color: #4a4a4a;
  margin-bottom: 15px;
}

.experience-section {
  margin-top: 15px;
}

.experience-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.experience-item:last-child {
  border-bottom: none;
}

.experience-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.experience-company {
  font-size: 1rem;
  color: #42b983;
  margin-top: 5px;
}

.experience-period {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  margin-bottom: 10px;
}

.contact-section {
  margin-top: auto;
  margin-bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.contact-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: rgba(51, 51, 51, 0.7);
  color: white;
  text-decoration: none;
  border-radius: 50%;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.contact-link svg {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.contact-link:hover {
  background-color: #ff0000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 0, 0, 0.3);
}

.contact-link:hover svg {
  opacity: 1;
}

/* Right Section - Skills */
.skills-section {
  flex: 1;
  padding: 30px;
  background-color: white;
  overflow: hidden;
}

.skill-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.skill-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: rgba(66, 185, 131, 0.1);
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.skill-icon svg {
  color: #42b983;
  width: 16px;
  height: 16px;
}

/* Dark mode styles for skill icons */
.dark-mode .skill-icon {
  background-color: rgba(79, 209, 165, 0.15);
}

.dark-mode .skill-icon svg {
  color: #4fd1a5;
}

.skill-label {
  width: 140px;
  font-size: 0.95rem;
  color: #2c3e50;
}

.skill-bar-container {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 12px;
}

.skill-bar {
  height: 100%;
  background-color: #42b983;
  border-radius: 5px;
}

.skill-percentage {
  width: 40px;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.soft-skills-title {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}

/* For soft skills, use a different color to distinguish them */
.soft-skills-title + .skill-item .skill-bar {
  background-color: #42b983;
  background-image: linear-gradient(to right, #42b983, #3aa876);
}

/* Remove the previous 100% skills styling */
.skill-item .skill-bar[style="width: 100%"] {
  background-color: #3498db !important;
  background-image: linear-gradient(to right, #3498db, #9b59b6) !important;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

/* Target the specific skill bars directly */
.skill-item:nth-of-type(10) .skill-bar,
.skill-item:nth-of-type(11) .skill-bar {
  background-color: #3498db !important;
  background-image: linear-gradient(to right, #3498db, #9b59b6) !important;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

/* Responsive Design */
@media (max-width: 900px) {
  .portfolio-container {
    flex-direction: column;
  }

  .summary-section, .skills-section {
    padding: 30px;
  }

  .skill-label {
    width: 120px;
  }
}

@media (max-width: 600px) {
  .skill-item {
    flex-wrap: wrap;
  }

  .skill-label {
    width: 100%;
    margin-bottom: 5px;
  }

  .skill-percentage {
    width: 100%;
    text-align: left;
    margin-top: 5px;
  }

  .contact-section {
    flex-direction: column;
    gap: 10px;
  }

  .contact-link {
    text-align: center;
  }
}

.tags-container {
  margin-top: 12px;
}

.tags-container h4 {
  font-size: 0.95rem;
  color: #2c3e50;
  margin: 8px 0 6px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

/* Dark mode styles for tags */
.dark-mode .tags-container h4 {
  color: #f0f0f0;
}

.dark-mode .tag {
  background-color: rgba(79, 209, 165, 0.15);
  color: #4fd1a5;
  border: 1px solid rgba(79, 209, 165, 0.3);
}
</style>
