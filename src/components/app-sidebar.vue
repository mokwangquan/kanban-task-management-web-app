<template>
  <div id="app-sidebar">
    <div class="wrapper" v-if="showSidebar">

      <div>
        <i class="logo-icon custom-icon logo-dark" />
      </div>
      
      <div class="font-s all-board-row">ALL BOARDS ({{ boardNum }})</div>

      <el-row 
        v-for="el in allBoards"
        :key="el.id"
        class="board-row"
        :class="{ active: activeBoardId === el.id }"
        @click.native="$store.commit('app/setActiveBoardId', el.id)"
        type="flex" 
        justify="start" 
        align="middle"
      >
        <i class="custom-icon icon-board" :class="{ 'white-icon': activeBoardId === el.id }" />
        <div class="font-m">{{ el.name }}</div>
      </el-row>

      <el-row 
        class="board-row create"
        @click.native="addBoardDialogVisible=true"
        type="flex" 
        justify="start" 
        align="middle"
      >
        <i class="custom-icon icon-board primary-icon" />
        <div class="font-m"><span class="plus">&plus;</span> Create New Board</div>
      </el-row>

      <div class="bottom-part">
        <el-row class="theme-switch-row" type="flex" justify="center" align="middle">
          <i class="custom-icon icon-light-theme"/>
          <el-switch :value="isDarkTheme" @change="$store.commit('app/toggleTheme')" :active-color="cssVariable.darkBlue" :inactive-color="cssVariable.darkBlue" />
          <i class="custom-icon icon-dark-theme"/>
        </el-row>
        <el-row class="hide-sidebar-row" type="flex" justify="start">
          <i class="custom-icon icon-hide-sidebar" @click="showSidebar=false" />
          <span class="font-m" @click="showSidebar=false">Hide Sidebar</span>
        </el-row>

      </div>
    </div>

    <div v-else class="show-sidebar-icon" @click="showSidebar=true">
      <i class="custom-icon icon-show-sidebar" />
    </div>

    <el-dialog
      title="Add New Board"
      :visible.sync="addBoardDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form ref="boardForm" :model="boardForm" label-position="top" :rules="boardRules">
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
              :value="boardForm.columns[index]" 
              @input="(val) => changeCol(val, index)"
            />
            <i class="custom-icon icon-cross" @click="removeCol(index)" />
          </el-row>
        </el-form-item>
      </el-form>

      <el-button 
        class="secondary w-100" 
        @click="boardForm.columns.push('')"
      >
        <span class="plus">&plus;</span>
        Add New Column
      </el-button>

      <span slot="footer">
        <el-button 
          class="primary w-100" 
          @click="createBoard"
        >Create New Board</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cssVariable from "@/assets/style/_variables.scss"
import cloneDeep from "lodash/cloneDeep"
import { mapState } from "vuex"

const newBoardForm = {
  name: "",
  columns: ["Todo", "Doing"]
}

export default {
  name: "AppSidebar",
  data() {
    return {
      showSidebar: true,
      cssVariable,
      addBoardDialogVisible: false,
      boardForm: cloneDeep(newBoardForm),
      boardRules: {
        name: { required: true, message: "Can't be empty", trigger: "blur" }
      }
    }
  },
  watch: {
    addBoardDialogVisible(val) {
      if (val == true) {
        this.$refs.boardForm?.resetFields()
      }
    }
  },
  computed: {
    boardNum() { return this.allBoards.length },
    ...mapState("app", ["activeBoardId", "isDarkTheme"]),
    ...mapState("board", ["allBoards"]),
  },
  methods: {
    changeCol(val, index) {
      this.$set(this.boardForm.columns, index, val)
    },
    removeCol(index) {
      const newCols = cloneDeep(this.boardForm.columns)
      newCols.splice(index, 1)
      this.boardForm.columns = newCols
    },
    createBoard() {
      this.$refs.boardForm?.validate(res => {
        if (!res) return
        this.boardForm.columns = this.boardForm.columns.filter(el => el && el !== "")
        this.$store.commit("board/addBoard", cloneDeep(this.boardForm))
        // todo, create new board with cols if any

        this.addBoardDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";

#app-sidebar {
  $marginLeft: 2.5rem;
  $sidebarWidth: 20vw;

  .wrapper {
    border-right: 1px solid $skyBlue;
    width: calc($sidebarWidth - $marginLeft);
    height: 100vh;

    margin: 0 $marginLeft;
    >div:first-child { padding-top: 1.5rem }
  }

  .logo-icon {
    margin-bottom: 3rem;
    height: 25px;
    width: 152px;
    background-size: 152px 25px;
  }

  .all-board-row {
    margin-bottom: 1.5rem;
  }

  .board-row {
    cursor: pointer;
    background-color: $white;
    color: $lightGrey;
    border-radius: 0 100px 100px 0;
    position: relative;
    left: -$marginLeft;
    width: 18vw;
    height: 48px;
    &.active {
      background-color: $darkBlue;
      color: $white;
    }
    >i {
      margin-left: $marginLeft;
      margin-right: 1rem;
    }
    &.create {
      color: $darkBlue;
    }
  }
  .plus {
    position: relative;
    bottom: 1px;
  }

  .bottom-part {
    position: absolute;
    bottom: 3rem;
    left: 2rem;
  }
  .theme-switch-row {
    width: calc($sidebarWidth - 2rem - 2rem);
    padding: 1rem 0;
    border-radius: 6px;
    background-color: $skyBlue;
    .el-switch {
      margin: 0 2rem;
    }
  }
  .hide-sidebar-row {
    margin-top: 1rem;
    color: $lightGrey;
    >* { cursor: pointer }
    i { margin-right: 1rem }
  }

  .show-sidebar-icon {
    position: absolute;
    bottom: 2rem;
    left: 0;
    cursor: pointer;
    background-color: $darkBlue;
    width: 56px;
    height: 48px;
    border-radius: 0 100px 100px 0;
    >i {
      position: absolute;
      left: 16px;
      top: 18px;
      width: 20px;
      height: 14px;
      background-size: 20px 14px;
    }
  }
  
}
</style>