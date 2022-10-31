// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import authSlice from './authSlice'

const rootReducer = {
  // auth,
  navbar,
  auth:authSlice,
  layout
}

export default rootReducer
