
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
    <add-edit-task-dialog
      :visible.sync="addEditTaskDialogVisible"
      :taskObj.sync="editingTask"
    />
  </div>
</template>

<script>
import AppSidebar from "@/components/app-sidebar.vue"
import AppHeader from "@/components/app-header.vue"
import MainContent from "@/components/main-content.vue"
import AddEditBoardDialog from "@/components/add-edit-board-dialog.vue"
import ViewTaskDialog from "@/components/view-task-dialog.vue"
import AddEditTaskDialog from "@/components/add-edit-task-dialog.vue"
import { EventBus } from "@/utils/event-bus.js"
import dummyData from "@/constants/data.json"
import cloneDeep from "lodash/cloneDeep"

export default {
  components: {
    AppSidebar, AppHeader, MainContent, AddEditBoardDialog, ViewTaskDialog, AddEditTaskDialog
  },
  computed: { },
  data() {
    return {
      addEditBoardDialogVisible: false,
      isAddingBoard: false,
      viewTaskDialogVisible: false,
      viewingTask: {},
      addEditTaskDialogVisible: false,
      editingTask: {},
    }
  },
  watch: { },
  methods: { 
    resetDialog() {
      this.addEditBoardDialogVisible = false
      this.isAddingBoard = false
      this.viewTaskDialogVisible = false
      this.viewingTask = {}
      this.addEditTaskDialogVisible = false
      this.editingTask = {}
    }

  },
  mounted() {
    EventBus.$on("openAddEditBoardDialog", (isAddingBoard) => {
      this.resetDialog()

      this.addEditBoardDialogVisible = true
      this.isAddingBoard = isAddingBoard
    });
    EventBus.$on("openViewTaskDialog", (viewingTask) => {
      this.resetDialog()

      this.viewTaskDialogVisible = true
      this.viewingTask = viewingTask
    });
    EventBus.$on("openAddEditTaskDialog", (editingTask) => {
      this.resetDialog()

      this.addEditTaskDialogVisible = true
      this.editingTask = editingTask
    });

    dummyData.boards.forEach(board => {
      board.columns = board.columns.map(el => {
        el.color = this.$randomColor()
        return el
      })
      this.$store.dispatch("board/addBoard", cloneDeep(board))
    })
    this.$store.commit('app/setActiveBoardId', dummyData.boards[0].id)
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