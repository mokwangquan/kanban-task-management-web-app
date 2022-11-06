
const state = {
  activeBoardId: 1,
  isDarkTheme: true,
  showSidebar: true,
}

const mutations = {
  toggleTheme(state) {
    state.isDarkTheme = !state.isDarkTheme
  },
  setActiveBoardId(state, id) {
    state.activeBoardId = id
  },
  toggleSidebar(state) {
    state.showSidebar = !state.showSidebar
  }
}

export default {
  namespaced: true,
  state,
  mutations,
};
  