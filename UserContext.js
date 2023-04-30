let currentUser;

const setUserVariable = (variable) => {
    currentUser = variable;
    console.log("user has been set")
};

const getUserVariable = () => {
  return currentUser;
};

export { setUserVariable, getUserVariable };