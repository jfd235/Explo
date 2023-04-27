let currentUser;

const setUserVariable = (variable) => {
    currentUser = variable;
};

const getUserVariable = () => {
  return currentUser;
};

export { setUserVariable, getUserVariable };