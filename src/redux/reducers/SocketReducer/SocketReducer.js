const intialState = {
  socket: null,
  socketid: null,
};
const SocketReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SOCKET:OPEN":
      return {
        ...state,
        socket: action.payload,
      };
    case "SOCKETID":
      return {
        ...state,
        socketid: action.payload,
      };

    default:
      return state;
  }
};

export default SocketReducer;
