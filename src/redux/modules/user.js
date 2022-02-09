import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase";
import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

// action-type(이건 이 이름으로도 쓸 수 있어)
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
// 로그인과 회원가입 둘다 리덕스에 들어가야하기 때문에 SET_USER로 통일
const SET_USER = "SET_USER";

// action creators(액션 생성 함수 - 객체를 리턴한다.)
// createAction으로도 가능 => (type, (parameter) => ({parameter}))
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

// user 형식을 맞춰주기 위한 initial
const user_initial = {
  user_name: "haley",
};

// middleware actions
const loginAction = (user) => {
  // redux thunk는 2개의 인자를 받는데 dispatch와 getState이다. getState는 state에 있는거에 접근하게 해준다.
  // withExtraArgumentfh 다른 인자(history)를 추가했기 때문에 사용가능.
  return function (dispatch, getState, { history }) {
    // console.log(history);
    dispatch(setUser(user));
    history.push("/");
  };
};

const loginFB = (id, pwd) => {
  // console.log("loginFB 미들웨어 실행", id, pwd);

  return function (dispatch, getState, { history }) {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, id, pwd)
          .then((userCredential) => {
            const user = userCredential.user;
            // setUser = (user)
            dispatch(
              setUser({
                user_name: user.displayName,
                id: id,
                user_profile: "",
              }),
              history.push("/")
            );
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode, errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });

    signInWithEmailAndPassword(auth, id, pwd)
      .then((userCredential) => {
        const user = userCredential.user;
        // setUser = (user)
        dispatch(
          setUser({
            user_name: user.displayName,
            id: id,
            user_profile: "",
            uid: user.uid,
          }),
          history.push("/")
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };
};

// 회원가입을 위한 middleware
const signupFB = (id, pwd, user_name) => {
  // console.log("signupFB 미들웨어 실행");

  return function (dispatch, getState, { history }) {
    createUserWithEmailAndPassword(auth, id, pwd)
      .then((userCredential) => {
        const user = userCredential.user;

        // 사용자 프로필 업데이트
        updateProfile(auth.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            // 업데이트 성공했을 때. setUser = (user)
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.uid,
              }),
              history.push("/")
            );
          })
          .catch((error) => {});
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };
};

const loginCheckFB = () => {
  // console.log("로그인 체크 실행!");
  return function (dispatch, getState, { history }) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace("/");
    });
  };
};

// reducer
// handleActions로도 가능
export default handleActions(
  {
    // immer를 사용해서 불변성을 유지해주면서, produce(state, () => {})로 draft(원본값)를 전달하고 이 값으로 뭘하고싶은지도 옆에 전달.
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        // setCookie = (name, value, exp)
        setCookie("is_login", "success", 3);
        // 여기서 state는 user와 is_login 두개
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        // deleteCookie = (name)
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),

    [GET_USER]: (state, action) => {},
  },
  initialState
);

const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
