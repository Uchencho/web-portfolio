const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // Disable source maps in production for better performance
  productionSourceMap: false
})
