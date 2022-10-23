const getters = {
  activeBoard: state => state.board.allBoards.find(el => el.id === state.app.activeBoardId),
}
export default getters