export const filterByLoginAndEmail = (login, email: string | RegExp | null) => {
  let filter = {};
  const findArray: {}[] = [];

  if (login) {
    findArray.push({ 'accountData.login': login });
    filter = { $or: findArray };
  }

  if (email) {
    findArray.push({ 'accountData.email': email });
    filter = { $or: findArray };
  }

  return filter;
};

export const loginAndEmailToRegExp = (login, email: string | null) => {
  return {
    login: login ? new RegExp(login, 'i') : null,
    email: email ? new RegExp(email, 'i') : null,
  };
};
