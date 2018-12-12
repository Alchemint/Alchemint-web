const app = {
  state: {
    locales: ['en', 'zh'],
    locale: 'en',
    currentUser: null,
    users: null
  },
  mutations: {
    SET_LANG(state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
      }
    },
    SET_CURRENT_USER: (state, user) => {
      state.currentUser = user;
    },
    SET_USERS: (state, users) => {
      state.users = users;
    }
  },
};

export default app
