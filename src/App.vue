
<template>
  <div id="app">
    <app-sidebar />
  </div>
</template>

<script>
import AppSidebar from "@/components/app-sidebar.vue"

export default {
  components: {
    AppSidebar
  },
  computed: { },
  data() {
    return {
      
    }
  },
  watch: { },
  methods: { },
  mounted() { },
};
</script>

<style lang="scss">
// import third party first
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
@import "@/assets/style/element-variables.scss";

// Then only import local, to allow overriding
@import "@/assets/style/main.scss";
@import "@/assets/style/_variables.scss";


</style>