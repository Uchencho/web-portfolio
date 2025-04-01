<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-backdrop zing-project-modal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>About Zing Project</h2>
          <div class="header-actions">
            <div class="tech-icon solidity-icon" title="Solidity">
              <svg viewBox="0 0 100 100" width="30" height="30" style="background-color: white; border-radius: 50%; padding: 3px;">
                <!-- Upper section -->
                <polygon fill="#2D2D2D" points="50,0 20,50 50,40 80,50" />
                <polygon fill="#4D4D4D" points="50,0 80,50 50,40" />
                <polygon fill="#1D1D1D" points="20,50 50,40 50,0" />
                <!-- Lower section -->
                <polygon fill="#2D2D2D" points="50,100 20,50 50,60 80,50" />
                <polygon fill="#4D4D4D" points="50,100 80,50 50,60" />
                <polygon fill="#1D1D1D" points="20,50 50,60 50,100" />
              </svg>
            </div>
            <div class="tech-icon" title="Golang">
              <svg viewBox="0 0 300 300" width="30" height="30" style="background-color: white; border-radius: 50%; padding: 3px;">
                <g transform="translate(0,10)">
                  <path fill="currentColor" d="M40.2,101.1c-0.4,0-0.5-0.2-0.3-0.5l2.1-2.7c0.2-0.3,0.7-0.5,1.1-0.5h35.7c0.4,0,0.5,0.3,0.3,0.6l-1.7,2.6 c-0.2,0.3-0.7,0.6-1,0.6L40.2,101.1z"/>
                  <path fill="currentColor" d="M25.1,110.3c-0.4,0-0.5-0.2-0.3-0.5l2.1-2.7c0.2-0.3,0.7-0.5,1.1-0.5h45.6c0.4,0,0.6,0.3,0.5,0.6l-0.8,2.4 c-0.1,0.4-0.5,0.6-0.9,0.6L25.1,110.3z"/>
                  <path fill="currentColor" d="M49.3,119.5c-0.4,0-0.5-0.3-0.3-0.6l1.4-2.5c0.2-0.3,0.6-0.6,1-0.6h20c0.4,0,0.6,0.3,0.6,0.7l-0.2,2.4 c0,0.4-0.4,0.7-0.7,0.7L49.3,119.5z"/>
                  <path fill="currentColor" d="M153.1,99.3c-6.3,1.6-10.6,2.8-16.8,4.4c-1.5,0.4-1.6,0.5-2.9-1c-1.5-1.7-2.6-2.8-4.7-3.8c-6.3-3.1-12.4-2.2-18.1,1.5 c-6.8,4.4-10.3,10.9-10.2,19c0.1,8,5.6,14.6,13.5,15.7c6.8,0.9,12.5-1.5,17-6.6c0.9-1.1,1.7-2.3,2.7-3.7c-3.6,0-8.1,0-19.3,0 c-2.1,0-2.6-1.3-1.9-3c1.3-3.1,3.7-8.3,5.1-10.9c0.3-0.6,1-1.6,2.5-1.6c5.1,0,23.9,0,36.4,0c-0.2,2.7-0.2,5.4-0.6,8.1 c-1.1,7.2-3.8,13.8-8.2,19.6c-7.2,9.5-16.6,15.4-28.5,17c-9.8,1.3-18.9-0.6-26.9-6.6c-7.4-5.6-11.6-13-12.7-22.2 c-1.3-10.9,1.9-20.7,8.5-29.3c7.1-9.3,16.5-15.2,28-17.3c9.4-1.7,18.4-0.6,26.5,4.9c5.3,3.5,9.1,8.3,11.6,14.1 C154.7,98.5,154.3,99,153.1,99.3z"/>
                  <path fill="currentColor" d="M186.2,154.6c-9.1-0.2-17.4-2.8-24.4-8.8c-5.9-5.1-9.6-11.6-10.8-19.3c-1.8-11.3,1.3-21.3,8.1-30.2 c7.3-9.6,16.1-14.6,28-16.7c10.2-1.8,19.8-0.8,28.5,5.1c7.9,5.4,12.8,12.7,14.1,22.3c1.7,13.5-2.2,24.5-11.5,33.9 c-6.6,6.7-14.7,10.9-24,12.8C191.5,154.2,188.8,154.3,186.2,154.6z M210,114.2c-0.1-1.3-0.1-2.3-0.3-3.3 c-1.8-9.9-10.9-15.5-20.4-13.3c-9.3,2.1-15.3,8-17.5,17.4c-1.8,7.8,2,15.7,9.2,18.9c5.5,2.4,11,2.1,16.3-0.6 C205.2,129.2,209.5,122.8,210,114.2z"/>
                </g>
              </svg>
            </div>
            <button class="close-button" @click="close">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="typewriter-container">
            <div class="typewriter-text">
              <div ref="textContainer"></div>
              <span class="cursor" :class="{ 'typing': isTyping }"></span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="close">Close</button>
          <button v-if="isComplete" class="modal-button reset" @click="resetTypewriter">Replay</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import './styles/ZingProjectModalStyles.css' // Import specific project modal styles

export default {
  name: 'ZingProjectInfoModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // Technical explanation text
      fullText: 'This project showcases my expertise in Solidity and Go by leveraging a cutting-edge web application built with Vue.js, utilizing an AI-powered tool with a cursor-based interface to accelerate development.\n\nThe application\'s backend is powered by a RESTful API written in Golang, hosted on AWS using Lambda and API Gateway, with DynamoDB serving as the storage solution. The API seamlessly interacts with a custom-designed smart contract, authored in Solidity and deployed across multiple blockchain networks using Alchemy\'s infrastructure.',
      isTyping: false,
      isComplete: false,
      typingSpeed: 80, // milliseconds per character (slower)
      charIndex: 0,
      animationFrameId: null
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.resetTypewriter()
            this.startTypewriter()
          }, 300)
        })
      } else {
        this.cancelAnimation()
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    startTypewriter () {
      this.isTyping = true
      this.isComplete = false
      this.charIndex = 0

      const textContainer = this.$refs.textContainer
      textContainer.innerHTML = ''

      // Timestamp to track last typed character
      let lastCharTime = 0

      const typeCharacter = (timestamp) => {
        // Check if animation should continue
        if (this.charIndex >= this.fullText.length) {
          this.isTyping = false
          this.isComplete = true
          return
        }

        // Calculate time elapsed
        const elapsed = timestamp - lastCharTime

        // If enough time has passed, type the next character
        if (elapsed > this.getRandomDelay()) {
          // Get the next character
          const char = this.fullText.charAt(this.charIndex)

          // Use a smart approach to add characters
          // This prevents reflow by adding to an existing text node when possible
          if (textContainer.lastChild && textContainer.lastChild.nodeType === Node.TEXT_NODE) {
            textContainer.lastChild.nodeValue += char
          } else {
            textContainer.appendChild(document.createTextNode(char))
          }

          // Move to next character
          this.charIndex++
          lastCharTime = timestamp
        }

        // Continue the animation
        this.animationFrameId = requestAnimationFrame(typeCharacter)
      }

      // Start the animation using requestAnimationFrame for better performance
      this.animationFrameId = requestAnimationFrame(typeCharacter)
    },
    getRandomDelay () {
      // Random variation in typing speed for more natural effect
      return this.typingSpeed + Math.random() * 60 - 20
    },
    cancelAnimation () {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
    },
    resetTypewriter () {
      this.cancelAnimation()
      if (this.$refs.textContainer) {
        this.$refs.textContainer.innerHTML = ''
      }
      this.charIndex = 0
      this.isComplete = false
    }
  },
  beforeUnmount () {
    // Clean up any ongoing animation when component is destroyed
    this.cancelAnimation()
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  perspective: 1000px;
  overflow: hidden;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
}

.tech-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
  transition: all 0.2s ease;
  cursor: help;
  padding: 3px;
}

.tech-icon:hover {
  background-color: rgba(66, 185, 131, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(66, 185, 131, 0.15);
}

.solidity-icon {
  background-color: rgba(108, 108, 108, 0.1);
}

.solidity-icon:hover {
  background-color: rgba(108, 108, 108, 0.2);
  box-shadow: 0 3px 5px rgba(108, 108, 108, 0.15);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  overscroll-behavior: contain;
}

.typewriter-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #42b983;
  min-height: 200px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.typewriter-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
  display: inline-block;
  width: 100%;
}

.typewriter-text div {
  display: inline;
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #333;
  vertical-align: text-bottom;
  position: relative;
  top: 4px;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
}

.cursor.typing {
  animation: none;
  opacity: 1;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.modal-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(66, 185, 131, 0.3);
}

.modal-button.reset {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.modal-button.reset:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

/* Animation */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Dark Mode Styles */
:deep(.dark-mode) .modal-content {
  background-color: #252525;
}

:deep(.dark-mode) .modal-header {
  border-bottom-color: #333;
}

:deep(.dark-mode) .modal-header h2 {
  color: #fff;
}

:deep(.dark-mode) .close-button {
  color: #aaa;
}

:deep(.dark-mode) .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:deep(.dark-mode) .typewriter-container {
  background-color: #1e1e1e;
  border-left-color: #4fd1a5;
}

:deep(.dark-mode) .typewriter-text,
:deep(.dark-mode) .typewriter-text div {
  color: #e0e0e0;
}

:deep(.dark-mode) .cursor {
  background-color: #e0e0e0;
}

:deep(.dark-mode) .modal-footer {
  border-top-color: #333;
}

:deep(.dark-mode) .modal-button {
  background-color: #4fd1a5;
  color: #121212;
}

:deep(.dark-mode) .modal-button:hover {
  background-color: #3cb28f;
}

:deep(.dark-mode) .modal-button.reset {
  background-color: transparent;
  color: #4fd1a5;
  border-color: #4fd1a5;
}

:deep(.dark-mode) .modal-button.reset:hover {
  background-color: rgba(79, 209, 165, 0.1);
  color: #fff;
}

:deep(.dark-mode) .tech-icon {
  background-color: #ffffff !important;
  color: #42b983 !important;
  border: 2px solid rgba(79, 209, 165, 0.5) !important;
}

:deep(.dark-mode) .tech-icon svg {
  background-color: #ffffff !important;
  border-radius: 50% !important;
}

:deep(.dark-mode) .solidity-icon {
  background-color: #ffffff !important;
}

:deep(.dark-mode) .solidity-icon svg polygon {
  background-color: transparent !important;
}

/* Mobile responsive styles */
@media (max-width: 480px) {
  .password-modal-header h3 {
    font-size: 1.1rem;
  }

  .warning-message {
    padding: 10px;
    gap: 8px;
  }

  .warning-message p {
    font-size: 0.85rem;
  }

  .password-modal-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .cancel-button, .confirm-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
