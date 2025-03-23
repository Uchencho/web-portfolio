<template>
  <zing-dashboard />
</template>

<script>
import ZingDashboard from '../components/zing/ZingDashboard.vue'

export default {
  name: 'ProjectDetailView',
  components: {
    ZingDashboard
  },
  mounted () {
    // Check if we should show transactions after navigation
    if (this.$root.showTransactionsAfterNavigation) {
      // Reset the flag
      this.$root.showTransactionsAfterNavigation = false

      // Get a reference to the ZingDashboard component
      this.$nextTick(() => {
        if (this.$children && this.$children.length > 0) {
          const dashboard = this.$children.find(child => child.$options.name === 'ZingDashboard')
          if (dashboard) {
            dashboard.openTransactionsModal()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* No additional styles needed as they are contained in the components */
</style>
