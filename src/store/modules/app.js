
const state = {
  activeBoardId: 0,
  isDarkTheme: false,
}

const mutations = {
  toggleTheme(state) {
    state.isDarkTheme = !state.isDarkTheme
  },
  setActiveBoardId(state, id) {
    state.activeBoardId = id
  }
}

export default {
  namespaced: true,
  state,
  mutations,
};
  