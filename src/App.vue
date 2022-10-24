
<template>
  <div id="app">
    <app-sidebar />
    <div>
      <app-header />
      <main-content />
    </div>

    <add-edit-board-dialog 
      :visible.sync="addEditBoardDialogVisible"
      :isAdding="isAddingBoard"
    />
  </div>
</template>

<script>
import AppSidebar from "@/components/app-sidebar.vue"
import AppHeader from "@/components/app-header.vue"
import MainContent from "@/components/main-content.vue"
import AddEditBoardDialog from "@/components/add-edit-board-dialog.vue"
import { EventBus } from "@/utils/event-bus.js"

export default {
  components: {
    AppSidebar, AppHeader, MainContent, AddEditBoardDialog
  },
  computed: { },
  data() {
    return {
      addEditBoardDialogVisible: false,
      isAddingBoard: false,
      viewTaskDialogVisible: false,
    }
  },
  watch: { },
  methods: { },
  mounted() {
    EventBus.$on("openAddEditBoardDialog", (isAddingBoard) => {
      this.addEditBoardDialogVisible = true
      this.isAddingBoard = isAddingBoard
    });
    EventBus.$on("openViewTaskDialog", () => {
      this.viewTaskDialogVisible = true
    });
  },
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