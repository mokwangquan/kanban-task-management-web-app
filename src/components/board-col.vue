<template>
  <div class="board-col">
    <template v-if="isAdd">
      <div class="adding-col" @click="EventBus.$emit('openAddEditBoardDialog')">
        <div class="font-xl font-grey">
          <span class="plus">&plus;</span>
          New Column
        </div>
      </div>
    </template>

    <template v-else>
      <el-row 
        class="title-row"
        type="flex"
        justify="start"
      >
        <div 
          class="colored-dot"
          :style="`background-color: ${colObj.color}`"
        >&nbsp;</div>
        <div class="font-s">{{ colObj.name }} ({{ noOfTask }})</div>
      </el-row>

      <!-- Task -->
      <el-row
        v-for="task, index in colObj.tasks"
        :key="'col_'+colIndex+'_task_'+index"
        class="task-block"
        @click.native="EventBus.$emit('openViewTaskDialog', task)"
      >
        <div class="font-m">{{ task.title }}</div>
        <div class="font-normal">{{ getSubDoneCount(task) }} subtasks</div>
      </el-row>
    </template>
  </div>
</template>

<script>
import { EventBus } from "@/utils/event-bus.js"

export default {
  name: "BoardCol",
  props: {
    colObj: { type: Object },
    colIndex: { type: Number },
    isAdd: { type: Boolean, default: false },
  },
  data() {
    return {
      EventBus,
    }
  },
  computed: {
    noOfTask() {
      return this.colObj?.tasks?.length || 0
    }
  },
  methods: {
    getSubDoneCount(task) {
      let total = 0
      let count = 0
      task.subtasks.forEach(el => {
        if (el.isCompleted) count++
        total++
      })
      return `${count} of ${total}`
    },
  }
}
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";

.board-col {
  height: calc(100% - 4rem);
  width: 23vw;

  .adding-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $skyBlue;
    margin-top: 3rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .title-row {
    margin-bottom: 2rem;
    text-transform: uppercase;
    .colored-dot {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 1rem;
    }
  }
  
  .task-block {
    background-color: $white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: 2px 5px 5px $skyBlue;
    cursor: pointer;
    >div:first-child {
      margin-bottom: 0.5rem;
    }
  }
}
</style>