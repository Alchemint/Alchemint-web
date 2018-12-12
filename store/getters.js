const getters = {
  locale: state => state.app.locale,
  currentUser: state => state.app.currentUser,
  users: state => state.app.users,
  env: state => state.app.env
};
export default getters;
