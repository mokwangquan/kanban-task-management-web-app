<template>
  <el-dialog
    id="view-task-dialog"
    v-if="dialogVisible && taskObj"
    :visible.sync="dialogVisible"
    :show-close="false"
    :modal-append-to-body="false"
    width="30%"
  >
    <el-row slot="title" type="flex" justify="space-between" align="middle">
      <div>{{ taskObj.title }}</div>
      <el-dropdown trigger="click">
        <i class="custom-icon icon-vertical-ellipsis" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item 
            class="font-l font-grey" 
            @click.native="EventBus.$emit('openAddEditTaskDialog', taskObj)"
          >Edit Task</el-dropdown-item>
          <el-dropdown-item 
            class="font-l font-red"
            @click.native="deleteTask"
          >Delete Task</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>

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
import { EventBus } from "@/utils/event-bus.js"
import cloneDeep from "lodash/cloneDeep"

export default {
  name: "ViewTaskDialog",
  props: {
    visible: { required: true, type: Boolean },
    taskObj: { type: Object },
  },
  data() {
    return {
      EventBus
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

      newBoard.columns = newBoard.columns
      .map(el => {
        if (el.name === currentStatus) {
          el.tasks = el.tasks.map(task => {
            if (task.id === this.taskObj.id) {
              task.subtasks = task.subtasks.map(sub => {
                if (sub.id === id) {
                  sub.isCompleted = !sub.isCompleted
                }
                return sub
              })
              this.$emit("update:taskObj", cloneDeep(task))
            }
            return task
          })
        }
        return el
      })


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
    },
    deleteTask() {
      this.$confirm(
        `Are you sure you want to delete this task? This action will remove all subtasks and cannot be reversed.`,
        "Delete this task?",
        {
          confirmButtonText: 'Delete',
          confirmButtonClass: 'danger w-100',
          cancelButtonText: 'Cancel',
          cancelButtonClass: "secondary w-100",
          customClass: "danger",
          showClose: false,
        }
      )
      .then(yes => {
        if (yes) {
          const newBoard = cloneDeep(this.activeBoard)

          newBoard.columns = newBoard.columns.map(col => {
            if (col.name === this.taskObj.status) {
              col.tasks = col.tasks.filter(el => {
                return el.id !== this.taskObj.id
              })
            }
            return col
          })

          this.$store.commit("board/editBoard", newBoard)

          this.dialogVisible = false
        }
      })
    },
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

  .custom-icon.icon-vertical-ellipsis {
    padding: 10px;
    margin-right: 5px;
  }
}
</style>