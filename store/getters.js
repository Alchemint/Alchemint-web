const getters = {
  locale: state => state.app.locale,
  currentUser: state => state.app.currentUser,
  users: state => state.app.users,
  env: state => state.app.env,
  typeA: state => state.sarConfig.typeA,
  typeB: state => state.sarConfig.typeB
};
export default getters;
