<template>
  <div id="app-sidebar">
    <div class="wrapper" v-if="showSidebar">

      <div>
        <i class="logo-icon custom-icon logo-dark" :class="{ 'logo-light': isDarkTheme }" />
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
        @click.native="EventBus.$emit('openAddEditBoardDialog', true)"
        type="flex" 
        justify="start" 
        align="middle"
      >
        <i class="custom-icon icon-board primary-icon" />
        <div class="font-m font-primary"><span class="plus">&plus;</span> Create New Board</div>
      </el-row>

      <div class="bottom-part">
        <el-row class="theme-switch-row" type="flex" justify="center" align="middle">
          <i class="custom-icon icon-light-theme"/>
          <el-switch :value="isDarkTheme" @change="$store.commit('app/toggleTheme')" :active-color="cssVariable.darkBlue" :inactive-color="cssVariable.darkBlue" />
          <i class="custom-icon icon-dark-theme"/>
        </el-row>
        <el-row class="hide-sidebar-row" type="flex" justify="start">
          <i class="custom-icon icon-hide-sidebar" @click="$store.commit('app/toggleSidebar')" />
          <span class="font-m" @click="$store.commit('app/toggleSidebar')">Hide Sidebar</span>
        </el-row>

      </div>
    </div>

    <div v-else class="show-sidebar-icon" @click="$store.commit('app/toggleSidebar')">
      <i class="custom-icon icon-show-sidebar" />
    </div>
    
  </div>
</template>

<script>
import cssVariable from "@/assets/style/_variables.scss"
import { mapState } from "vuex"
import { EventBus } from "@/utils/event-bus.js"

export default {
  name: "AppSidebar",
  data() {
    return {
      cssVariable,
      EventBus,
    }
  },
  watch: {
  },
  computed: {
    boardNum() { return this.allBoards.length },
    ...mapState("app", ["activeBoardId", "isDarkTheme", "showSidebar"]),
    ...mapState("board", ["allBoards"]),
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";

#app-sidebar {
  $marginLeft: 2.5rem;
  background-color: $white;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;

  .wrapper {
    border-right: 1px solid $skyBlue;
    width: calc($sidebarWidth - $marginLeft);
    height: 100%;

    margin-left: $marginLeft;
    >div:first-child { padding-top: 1.5rem }
  }

  .logo-icon {
    margin-bottom: 3rem;
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
    }
  }
  
}

.dark #app-sidebar {
  background-color: $darkGrey;

  .wrapper {
    border-color: $grey;
  }

  .board-row {
    background-color: $darkGrey;
    color: $lightGrey;
    &.active {
      background-color: $darkBlue;
      color: $white;
    }
  }
  .theme-switch-row {
    background-color: $lightBlack;
  }
}
</style>