const getCookie = (name) => {
  let value = "; " + document.cookie;
  let parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  // console.log(value); => is_login=success; user_id=perl; user_pwd=pppp
  // console.log(value.split(";")); => ['is_login=success', ' user_id=perl', ' user_pwd=pppp']
  // console.log(parts); => ['is_login=success; user_id=perl; user_pwd=pppp']
};

const setCookie = (name, value, exp) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) => {
  let date = new Date("2020-01-01").toUTCString();
  //   console.log(document.cookie); => is_login=success; user_pwd=pppp
  document.cookie = name + "=; expires=" + date;
  //   console.log(document.cookie); => is_login=success
};

export { getCookie, setCookie, deleteCookie };
