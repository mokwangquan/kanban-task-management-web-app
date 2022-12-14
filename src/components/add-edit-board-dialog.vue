<template>
  <el-dialog
    v-if="dialogVisible"
    :title="isAdding ? 'Add New Board' : 'Edit Board'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="30%"
  >
    <el-form 
      ref="boardForm" 
      :model="boardForm" 
      label-position="top" 
      :rules="boardRules"
      @submit.native.prevent="handleSubmit"
    >
      <el-form-item prop="name" label="Name">
        <el-input placeholder="e.g. Web Design" v-model="boardForm.name" />
      </el-form-item>
      <el-form-item prop="columns" label="Columns">
        <el-row 
          type="flex" 
          justify="space-between"
          align="middle"
          v-for="col, index in boardForm.columns"
          :key="index"
        >
          <el-input 
            placeholder="e.g. Todo" 
            :value="col.name" 
            @input="(val) => changeCol(val, index)"
          />
          <i class="custom-icon icon-cross" @click="removeCol(index)" />
        </el-row>

        <el-button native-type="submit" style="display: none" />
      </el-form-item>
    </el-form>

    <el-button 
      class="secondary w-100" 
      @click="boardForm.columns.push({ name: '' })"
    >
      <span class="plus">&plus;</span>
      Add New Column
    </el-button>

    <span slot="footer">
      <el-button 
        class="primary w-100" 
        @click="handleSubmit"
      >{{ isAdding ? "Create New Board" : "Save Changes"}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cloneDeep from "lodash/cloneDeep"
import { mapGetters } from "vuex"

const newBoardForm = {
  name: "",
  columns: [
    { name: "Todo" }, 
    { name: "Doing" }
  ]
}

export default {
  name: "AddEditBoardDialog",
  props: {
    visible: { required: true, type: Boolean },
    isAdding: { type: Boolean, default: false },
  },
  data() {
    return {
      boardForm: cloneDeep(newBoardForm),
      boardRules: {
        name: { required: true, message: "Can't be empty", trigger: "blur" }
      }
    }
  },
  watch: {
    visible(val) {
      if (val == true) {
        if (this.isAdding) {
          this.$refs.boardForm?.resetFields()
        } else {
          this.boardForm = cloneDeep(this.activeBoard)
        }
      }
    }
  },
  computed: {
    ...mapGetters(["activeBoard"]),
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit("update:visible", val) }
    }
  },
  methods: {
    changeCol(val, index) {
      const newCol = this.boardForm.columns[index]
      newCol.name = val
      this.$set(this.boardForm.columns, index, newCol)
    },
    async removeCol(index) {
      const newCols = cloneDeep(this.boardForm.columns)
      let canProceed = false

      if (newCols[index]?.tasks?.length > 0) {
        await this.$confirm(
          `Are you sure you want to delete the '${newCols[index].name}' column? This action will remove all task(s) inside and cannot be reversed.`,
          "Delete this column?",
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
            canProceed = true
          }
        })
        .catch(() => {})
        
      } else {
        canProceed = true
      }

      if (canProceed) {
        newCols.splice(index, 1)
        this.boardForm.columns = newCols
      }
    },
    handleSubmit() {
      this.$refs.boardForm?.validate(res => {
        if (!res) return
        if (this.isAdding) {
          this.createBoard()
          this.boardForm = cloneDeep(newBoardForm)
        } else {
          this.editBoard()
        }
        this.dialogVisible = false
      })
    },
    createBoard() {
      this.boardForm.columns = this.boardForm.columns
                      .filter(el => el.name && el.name !== "")
                      .map(el => {
                        el.color = this.$randomColor()
                        return el
                      })
      this.$store.dispatch("board/addBoard", cloneDeep(this.boardForm))
    },
    editBoard() {
      this.boardForm.columns = this.boardForm.columns.filter(el => el.name && el.name !== "")
      this.$store.commit("board/editBoard", cloneDeep(this.boardForm))
    }
  }
}
</script>

<style lang="scss">

</style>