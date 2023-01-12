// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import authSlice from './authSlice'
import searchBar from './searchBar'

const rootReducer = {
  // auth,
  navbar,
  auth:authSlice,
  search: searchBar ,
  layout
}

export default rootReducer
