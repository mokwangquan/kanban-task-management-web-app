<template>
  <div id="main-content" :class="{ 'with-sidebar': showSidebar }">
    
    <div v-if="!haveCol" class="no-col-view">
      <div class="font-l font-grey">This board is empty. Create a new column to get started.</div>
      <el-button @click="openEditBoardDialog" class="primary">
        <span class="plus">&plus;</span>
        Add New Column
      </el-button>
    </div>

    <el-row 
      v-else
      class="scrollable-cols"
      type="flex"
      justify="start"
    >
      <el-col
        v-for="col, index in activeBoard.columns"
        :key="'col_'+index"
      >
        <board-col 
          :colObj="col"
          :colIndex="index"
        />
      </el-col>
      <el-col>
        <board-col isAdd />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { EventBus } from "@/utils/event-bus.js"
import BoardCol from "@/components/board-col.vue"

export default {
  name: "MainContent",
  components: { BoardCol },
  computed: {
    ...mapState("app", ["showSidebar"]),
    ...mapGetters(["activeBoard"]),
    haveCol() { return this.activeBoard?.columns?.length > 0 }
  },
  methods: {
    openEditBoardDialog() {
      (EventBus || this.$EventBus).$emit("openAddEditBoardDialog");
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";

#main-content {
  background-color: $whiteBlue;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100vw;
  height: calc(100vh - $headerHeight);

  &.with-sidebar {
    width: calc(100vw - $sidebarWidth);
  }


  .no-col-view {
    height: calc(100vh - $headerHeight);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >div:first-child {
      margin-bottom: 2rem;
    }
  }

  .scrollable-cols {
    min-height: calc(100vh - $headerHeight);
    overflow: scroll;
    &::-webkit-scrollbar { display: none } // hide scrollbar
    .el-col {
      margin: 1rem 1rem 0 0;
      width: fit-content;
      height: fit-content;
      &:first-child {
        margin-left: 1rem;
      }
      &:last-child {
        margin-bottom: 4rem;
      }
    }
  }
}
</style>