export function SocketConnectedActions(state) {
  return {
    type: "SOCKET:OPEN",
    payload: state,
  };
}

export function SocketIDActions(state) {
  return {
    type: "SOCKETID",
    payload: state,
  };
}
