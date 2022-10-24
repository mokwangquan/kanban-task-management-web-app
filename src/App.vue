
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
    <view-task-dialog
      :visible.sync="viewTaskDialogVisible"
      :taskObj.sync="viewingTask"
    />
  </div>
</template>

<script>
import AppSidebar from "@/components/app-sidebar.vue"
import AppHeader from "@/components/app-header.vue"
import MainContent from "@/components/main-content.vue"
import AddEditBoardDialog from "@/components/add-edit-board-dialog.vue"
import ViewTaskDialog from "@/components/view-task-dialog.vue"
import { EventBus } from "@/utils/event-bus.js"

export default {
  components: {
    AppSidebar, AppHeader, MainContent, AddEditBoardDialog, ViewTaskDialog
  },
  computed: { },
  data() {
    return {
      addEditBoardDialogVisible: false,
      isAddingBoard: false,
      viewTaskDialogVisible: false,
      viewingTask: {},
    }
  },
  watch: { },
  methods: { },
  mounted() {
    EventBus.$on("openAddEditBoardDialog", (isAddingBoard) => {
      this.addEditBoardDialogVisible = true
      this.isAddingBoard = isAddingBoard
    });
    EventBus.$on("openViewTaskDialog", (viewingTask) => {
      this.viewTaskDialogVisible = true
      this.viewingTask = viewingTask
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