
// wrapper for completion of item in redux logic
export const completeLogic = (dispatch, objToDispatch, done) => {
  dispatch(objToDispatch)
  done()
}
