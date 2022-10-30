import cloneDeep from "lodash/cloneDeep"

const state = {
  allBoards: [],
}

const actions = {
  addBoard({ state, commit }, board) {
    if (!board.id) {
      if (state.allBoards.length > 1) {
        const newId = Math.max.apply(Math, state.allBoards.map(el => el.id))
        board.id = newId+1
      } else {
        board.id = 1
      }
    }
    commit("addBoard", board)
    commit('app/setActiveBoardId', board.id, { root: true })
  },
  deleteBoard({ state, commit, rootState }) {
    const deleteId = rootState.app.activeBoardId

    let nextBoardIndex = state.allBoards.findIndex(el => el.id === deleteId) + 1
    if (!state.allBoards[nextBoardIndex]) nextBoardIndex = 0
    const nextBoardId = state.allBoards[nextBoardIndex]?.id

    const newList = cloneDeep(state.allBoards).filter(el => el.id !== deleteId)

    commit("replaceAllBoards", newList)
    if (nextBoardId) {
      commit('app/setActiveBoardId', nextBoardId, { root: true })
    }
  }
}

const mutations = {
  addBoard(state, board) {
    state.allBoards.push(board)
  },
  editBoard(state, board) {
    state.allBoards = state.allBoards.map(el => {
      if (el.id === board.id) {
        return board
      } else {
        return el
      }
    })
  },
  replaceAllBoards(state, allBoards) {
    state.allBoards = allBoards
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
  