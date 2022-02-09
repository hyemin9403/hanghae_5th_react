import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import { doc, deleteDoc, getDocs } from "firebase/firestore";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

// action-type(이건 이 이름으로도 쓸 수 있어)
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const LOADING = "LOADING";

const DELETE_POST = "DELETE_POST";

// Action
const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const deletePost = createAction(DELETE_POST, (post) => ({ post }));

// Initial state
const initialState = {
  list: [],
  // infinite scroll의 시작점.
  paging: { start: null, next: null, size: 3 },
  // 로딩중임을 알려줄 것(중복 로딩 방지)
  is_loading: false,
};

const initialPost = {
  image_url:
    "https://blogpfthumb-phinf.pstatic.net/MjAyMTA5MDdfMjIg/MDAxNjMxMDEyNzEwNDQ2.53rmKkH3D6N4VpVfG9IeHnFIkCg0mpy1dDpvewQJb2Eg.An_4bR0Wpd-o4akyamNBMCAfBhoGDa2-5xLTz3xVHYQg.JPEG.gpalstksxk/KakaoTalk_20210808_205039067_02.jpg",
  contents: "",
  comment_cnt: 0,
  // insert_dt: "2021-02-27 10:00:00",
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const deletePostFB = (doc_id) => {
  // 문서를 삭제하려면 delete() 메서드를 사용(특정 필드를 삭제하려면 문서를 업데이트할 때 FieldValue.delete() 메서드를 사용)
  // await deleteDoc(doc(db, "cities", "DC"));

  // 1. doc_id를 불러온다. (성공)
  // 3. 삭제
  return async function (dispatch, getState, { history }) {
    // 2. delete() 메서드를 위해 경로세팅
    const postDB = firestore.collection("post");
    // console.log("post_data임", post_data);

    postDB
      .doc(doc_id)
      .delete()
      .then(() => {
        dispatch(deletePost(doc_id));
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
};

const addPostFB = (contents = "") => {
  // image_url을 가져오려면 먼저 FB에 이미지를 저장 후 download url을 가져와야함.

  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    const _user = getState().user.user;
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    // getState는 스토어에 있는 정보에 접근하게 해준다.
    const _image = getState().image.preview;

    console.log(_image);
    console.log(typeof _image);
    // 파일명 만들기. 중복을 막기위해 uid와 밀리초 활용한다.
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    // 이미지 URL을 뱉어낸다. 퉤~
    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
          // 리턴해준 url을 사용한다.
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");
              //프리뷰 이미지를 비워준다.
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("post 작성에 실패했어요!");
              console.log("post 작성에 실패했어요!, err");
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드 오류입니다.");
          console.log("앗! 이미지 업로드 오류입니다.", err);
        });
    });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;
    // start에는 값이 있는데 마지막에 값이 없으면 리턴해
    if (_paging.start && !_paging.next) {
      window.alert("게시물이 없습니다");
      return;
    }

    const postDB = firestore.collection("post");
    // 로딩상태를 true로 만들어주기
    dispatch(loading(true));
    // 순서대로 정렬해서 가지고오기(한개 더 가져와서 다음 로딩이 있는지 없는지 보기)
    let query = postDB.orderBy("insert_dt", "desc");
    // 처음 가지고오는 거라면 시작점부터 가져오기(스타트 정보가 있으면~)
    if (start) {
      query = query.startAt(start);
    }
    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        // 새로운 페이징 정보
        let paging = {
          start: docs.docs[0],
          // 4개 불렀는데 4개 다 오면 다 불러오고 작은 수가 나오면 null로 return 해라(-1한건 index니까)
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          let _post = {
            id: doc.id,
            ...doc.data(),
          };

          let post = {
            id: doc.id,
            user_info: {
              user_name: _post.user_name,
              user_profile: _post.user_profile,
              user_id: _post.user_id,
            },
            image_url: _post.image_url,
            contents: _post.contents,
            comment_cnt: _post.comment_cnt,
            insert_dt: _post.insert_dt,
          };

          post_list.push(post);
        });
        // 4개 불러왔기 때문에 마지막 하나는 빼고 리턴한다.
        post_list.pop();

        dispatch(setPost(post_list, paging));
      });
  };
};

// Reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
        draft.paging = action.payload.paging;
        draft.is_loading = false;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        // console.log("POST DELETE REDUCER임", state, draft, action);
        window.alert("삭제 완료되었습니다!");
        window.location.reload();
      }),
  },

  initialState
);

const actionCreators = {
  setPost,
  addPost,
  deletePost,
  getPostFB,
  addPostFB,
  deletePostFB,
};

export { actionCreators };
