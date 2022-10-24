<template>
  <el-dialog
    id="view-task-dialog"
    v-if="dialogVisible && taskObj"
    :title="taskObj.title"
    :visible.sync="dialogVisible"
    :show-close="false"
    :modal-append-to-body="false"
    width="30%"
  >
    <p class="font-normal font-grey">
      {{ taskObj.description }}
    </p>

    <el-form class="sub-task-form" :form="taskObj" label-position="top">
      <el-form-item :label="`Subtask (${subtaskDoneCount})`">
        <el-checkbox 
          v-for="subtask in taskObj.subtasks"
          :key="'subtask_'+subtask.id"
          :value="subtask.isCompleted" 
          :label="subtask.title" 
          border 
          @change="checkSubtask(subtask.id)"
        />
      </el-form-item>
      <el-form-item label="Current Status">
        <el-select :value="taskObj.status" @input="doChangeStatus">
          <el-option
            v-for="item in allStatus"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import cloneDeep from "lodash/cloneDeep"

export default {
  name: "AddEditBoardDialog",
  props: {
    visible: { required: true, type: Boolean },
    taskObj: { type: Object },
  },
  data() {
    return {
      
    }
  },
  watch: {
    // visible(val) {
     
    // }
  },
  computed: {
    ...mapGetters(["activeBoard"]),
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit("update:visible", val) }
    },
    subtaskDoneCount() {
      let total = 0
      let count = 0

      this.taskObj.subtasks.forEach(el => {
        if (el.isCompleted) count++
        total++
      })

      return `${count} of ${total}`
    },
    allStatus() {
      return this.activeBoard.columns.map(el => el.name)
    }
  },
  methods: {
    checkSubtask(id) {
      let newBoard = cloneDeep(this.activeBoard)
      const currentStatus = this.taskObj.status
      let newTask

      newBoard.columns = newBoard.columns
      .map(el => {
        if (el.name === currentStatus) {
          el.tasks = el.tasks.map(task => {
            if (task.id === this.taskObj.id) {
              task.subtasks = task.subtasks.map(sub => {
                if (sub.id === id) sub.isCompleted = !sub.isCompleted
                return sub
              })
            }
            newTask = cloneDeep(task)
            return task
          })
        }
        return el
      })

      this.$emit("update:taskObj", newTask)

      this.$store.commit("board/editBoard", newBoard)
    },
    doChangeStatus(newStatus) {
      let newBoard = cloneDeep(this.activeBoard)
      const currentStatus = this.taskObj.status
      let taskObjToMove

      newBoard.columns = newBoard.columns
      // remove
      .map(el => {
        if (el.name === currentStatus) {
          el.tasks = el.tasks.filter(task => {
            if (task.id === this.taskObj.id) {
              taskObjToMove = cloneDeep(task)
              return false
            } else {
              return true
            }
          })
        }
        return el
      })
      // then add to new col
      .map(el => {
        if (el.name === newStatus) {
          taskObjToMove.status = newStatus
          el.tasks.push(taskObjToMove)
        }
        return el
      })

      this.$emit("update:taskObj", taskObjToMove)

      this.$store.commit("board/editBoard", newBoard)
    }
  }
}
</script>

<style lang="scss">
#view-task-dialog {
  .el-dialog__body {
    padding-top: 15px;
  }

  .sub-task-form {
    margin-top: 2rem;
    .el-checkbox__label {
      white-space: initial;
    }
  }
}
</style>