import { combineReducers } from "redux";
import SocketReducer from "./SocketReducer/SocketReducer";
import UserReducer from "./UserReducer/UserReducer";
const rootReducer = combineReducers({
  Socket: SocketReducer,
  User: UserReducer,
});

export default rootReducer;
