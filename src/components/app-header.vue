<template>
  <div id="app-header" :class="{ 'with-sidebar-hidden': !showSidebar }">
    <el-row type="flex" justify="space-between" align="middle">
      <el-row type="flex" justify="start" align="middle">
        <span v-if="!showSidebar" class="logo-wrapper">
          <i class="custom-icon logo-dark" :class="{ 'logo-light': isDarkTheme }" />
        </span>
        <el-divider v-if="!showSidebar" direction="vertical" />
        <span class="font-xl">{{ name }}</span>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle">
        <el-button 
          class="primary"
          :class="{ disabled: !canAddTask }"
          :disabled="!canAddTask"
          @click="EventBus.$emit('openAddEditTaskDialog')"
        >
          <span class="plus">&plus;</span>
          Add New Task
        </el-button>
        <el-dropdown trigger="click">
          <i class="custom-icon icon-vertical-ellipsis" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              class="font-l font-grey" 
              @click.native="EventBus.$emit('openAddEditBoardDialog')"
            >Edit Board</el-dropdown-item>
            <el-dropdown-item 
              class="font-l font-red"
              @click.native="deleteBoard"
            >Delete Board</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { EventBus } from "@/utils/event-bus.js"

export default {
  name: "AppHeader",
  data() {
    return {
      EventBus,
    }
  },
  computed: {
    ...mapState("app", ["showSidebar", "isDarkTheme"]),
    ...mapGetters(["activeBoard"]),
    name() {
      return this.activeBoard?.name
    },
    canAddTask() {
      return this.activeBoard?.columns?.length > 0
    }
  },
  methods: {
    deleteBoard() {
      this.$confirm(
        `Are you sure you want to delete the '${this.name}' board? This action will remove all columns and tasks and cannot be reversed.`,
        "Delete this board?",
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
          this.$store.dispatch("board/deleteBoard")
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";

#app-header {
  height: $headerHeight;
  width: calc(100vw - $sidebarWidth);
  border-bottom: 1px solid $skyBlue;
  background-color: $white;
  position: sticky;
  top: 0;
  left: $sidebarWidth;

  &.with-sidebar-hidden {
    width: calc(100vw);
    left: 0;
  }

  >.el-row {
    height: 100%;
    margin: 0 1.5rem;
    .el-divider.el-divider--vertical { 
      height: 100%;
      background-color: $skyBlue;
      margin: 0 2rem;
    }
    >.el-row {
      &:first-child {
        width: 100%;
      }
      height: 100%;
      .icon-vertical-ellipsis {
        padding: 14px;
        margin-top: 8px;
        cursor: pointer;
        margin-left: 1.5rem
      }
    }
  }

}

.dark #app-header {
  background-color: $darkGrey;
  color: $white;
  border-color: $grey;

  >.el-row {
    .el-divider.el-divider--vertical { 
      background-color: $grey;
    }
  }

}
</style>