const intialState = {
  name: null,
};
const UserReducer = (state = intialState, action) => {
  switch (action.type) {
    case "USERNAME":
      return {
        ...state,
        name: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
