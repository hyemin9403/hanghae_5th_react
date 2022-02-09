import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  // 스토어에서 브라우저 히스토리 다 저장하게 함.
  router: connectRouter(history),
});

// redux-thunk는 action creator가 object나 function을 반환하게 해준다
// withExtraArgument는 다른 인수(history)를 넘겨줄게 라는 것.
// 이제 action이 실행되고 reducer가 실행되기 전 단계에서 history를 사용할 수 있게 된다.(비동기 다녀와서 .then 하고 히스토리 받아와서 쓸 수 있음.)
const middlewares = [thunk.withExtraArgument({ history: history })];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서만! 로거라는 걸 하나만 더 써볼게요.(require를 쓰는이유. 배포때는 포함안시키려고)
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// redux devtool 쓰는 법
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 미들웨어 묶기(지금까지 만든 모든 미들웨어를 사용해준다 설정. 근데 당연함. applyMiddleware 실행을 안했으니까)
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
