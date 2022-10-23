
const state = {
  allBoards: [
    { id: 0, name: "Platform Launch" },
    { id: 1, name: "Marketing Plan" },
    { id: 2, name: "Roadmap" },
  ],
}

const mutations = {
  addBoard(state, board) {
    const newId = Math.max.apply(Math, state.allBoards.map(el => el.id))
    console.log(newId)
    board.id = newId+1
    state.allBoards.push(board)
    console.log(state.allBoards)
  }
}

export default {
  namespaced: true,
  state,
  mutations
};
  