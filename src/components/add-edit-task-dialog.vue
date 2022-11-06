<template>
  <el-dialog
    id="add-task-dialog"
    v-if="dialogVisible"
    :title="isAdding ? 'Add New Task' : 'Edit Task'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="30%"
  >
    <el-form 
      ref="taskForm" 
      :model="taskForm" 
      label-position="top" 
      :rules="taskRules"
      @submit.native.prevent="handleSubmit"
    >
      <el-form-item prop="title" label="Title">
        <el-input placeholder="e.g. Take coffee break" v-model="taskForm.title" />
      </el-form-item>
      <el-form-item prop="description" label="Description">
        <el-input 
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little." 
          v-model="taskForm.description" 
        />
      </el-form-item>
      <el-form-item prop="subtasks" label="Subtasks" class="subtask-container">
        <el-row 
          type="flex" 
          justify="space-between"
          align="middle"
          v-for="col, index in taskForm.subtasks"
          :key="index"
        >
          <el-input 
            placeholder="e.g. Todo" 
            :value="col.title" 
            @input="(val) => changeSubtask(val, index)"
          />
          <i class="custom-icon icon-cross" @click="removeSubtask(index)" />
        </el-row>

        <el-button native-type="submit" style="display: none;"/>
      </el-form-item>

      <el-button 
        class="secondary add-new-task-btn w-100" 
        @click="taskForm.subtasks.push({ title: '' })"
      >
        <span class="plus">&plus;</span>
        Add New Subtask
      </el-button>

      <el-form-item label="Status">
        <el-select v-model="taskForm.status">
          <el-option
            v-for="item in allAvailableStatus"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button 
        class="primary w-100" 
        @click="handleSubmit"
      >{{ isAdding ? "Create Task" : "Save Changes"}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { EventBus } from "@/utils/event-bus.js"
import cloneDeep from "lodash/cloneDeep"

const newTaskForm = {
  title: "",
  description: "",
  subtasks: [
    { title: "" }
  ],
  status: ""
}

export default {
  name: "AddEditTaskDialog",
  props: {
    visible: { required: true, type: Boolean },
    taskObj: { type: Object }
  },
  data() {
    return {
      taskForm: {},
      taskRules: {
        title: { required: true, message: "Can't be empty", trigger: "blur" }
      }
    }
  },
  computed: {
    ...mapGetters(["activeBoard"]),
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit("update:visible", val) }
    },
    isAdding() {
      return !this.taskObj
    },
    allAvailableStatus() {
      return this.activeBoard.columns.map(el => el.name)
    }
  },
  watch: {
    visible(val) {
      if (val == true) {
        if (this.isAdding) {
          this.$refs.taskForm?.resetFields()
          this.taskForm = cloneDeep(newTaskForm)
          this.taskForm.status = this.allAvailableStatus[0]
        } else {
          this.taskForm = cloneDeep(this.taskObj)
        }
      }
    }
  },
  methods: {
    changeSubtask(val, index) {
      const newSubtask = this.taskForm.subtasks[index]
      newSubtask.title = val
      this.$set(this.taskForm.subtasks, index, newSubtask)
    },
    removeSubtask(index) {
      const newSubtasks = cloneDeep(this.taskForm.subtasks)
      newSubtasks.splice(index, 1)
      this.taskForm.subtasks = newSubtasks
    },
    handleSubmit() {
      this.$refs.taskForm?.validate(res => {
        if (!res) return
        this.parseDetail()

        if (this.isAdding) {
          this.createTaskOnCurrentBoard()
          this.taskForm = cloneDeep(newTaskForm)
        } else {
          this.editTaskOnCurrentBoard()
          EventBus.$emit('openViewTaskDialog', cloneDeep(this.taskForm))
        }
        this.dialogVisible = false
      })
    },
    parseDetail() {
      this.taskForm.subtasks = this.taskForm.subtasks.filter(el => el.title && el.title !== "")

      let newId = 1
      const subTasksWithId = this.taskForm.subtasks.filter(el => el.id)
      if (subTasksWithId.length > 1) {
        newId = Math.max.apply(Math, subTasksWithId.map(el => el.id)) + 1
      }

      this.taskForm.subtasks = this.taskForm.subtasks.map(el => {
        return {
          id: el.id || newId++,
          title: el.title,
          isCompleted: el.isCompleted || false
        }
      })
    },
    createTaskOnCurrentBoard() {
      const newBoard = cloneDeep(this.activeBoard)
      const editedTask = cloneDeep(this.taskForm)
      const boardCol = newBoard.columns.find(el => el.name === this.taskForm.status)

      let newId = 1
      if (boardCol.tasks?.length > 0) {
        newId = Math.max.apply(Math, boardCol.tasks.map(el => el.id)) + 1
      }
      editedTask.id = newId

      newBoard.columns = newBoard.columns.map(col => {
        if (col.name === editedTask.status) {
          if (col.tasks) {
            col.tasks.push(editedTask)
          } else {
            col.tasks = [editedTask]
          }
        }
        return col
      })

      this.$emit("update:taskObj", editedTask)

      this.$store.commit("board/editBoard", newBoard)
    },
    editTaskOnCurrentBoard() {
      const newBoard = cloneDeep(this.activeBoard)
      const newStatus = this.taskForm.status
      const oldStatus = this.taskObj.status
      const editedTask = cloneDeep(this.taskForm)
      const boardCol = newBoard.columns.find(el => el.name === newStatus)

      let newId = 1
      if (boardCol.tasks.length > 0) {
        newId = Math.max.apply(Math, boardCol.tasks.map(el => el.id)) + 1
      }
      

      if (newStatus !== oldStatus) {
        newBoard.columns = newBoard.columns.map(col => {
          if (col.name === oldStatus) {
            // remove old first
            col.tasks = col.tasks.filter(el => {
              return el.id !== this.taskForm.id
            })

          } else if (col.name === this.taskForm.status) {
            // add new
            editedTask.id = newId
            col.tasks.push(editedTask)
          }
          return col
        })

      } else {
        // editing only
        newBoard.columns = newBoard.columns.map(col => {
          if (col.name === newStatus) {
            col.tasks = col.tasks.map(el => {
              if (el.id === this.taskForm.id) {
                return editedTask
              } else {
                return el
              }
            })
          }
          return col
        })
      }

      this.$emit("update:taskObj", editedTask)

      this.$store.commit("board/editBoard", newBoard)
    }
  }
}
</script>

<style lang="scss">
#add-task-dialog {
  .el-dialog__body {
    padding-top: 15px;
  }

  .sub-task-form {
    margin-top: 2rem;
    .el-checkbox__label {
      white-space: initial;
    }
  }
  .add-new-task-btn {
    margin-bottom: 2rem;
  }
  .subtask-container {
    .el-form .el-form-item__error {
      right: 50px;
    }
  }

}
</style>