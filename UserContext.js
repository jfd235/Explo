let currentUser;

const setUserVariable = (variable) => {
    currentUser = variable;
    console.log("user has been set")
    console.log({currentUser})
};

const getUserVariable = () => {
    console.log(currentUser)
  return currentUser;
};

export { setUserVariable, getUserVariable };