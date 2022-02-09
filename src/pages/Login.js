import React, { useState } from "react";
import { Text, Input, Grid, Button } from "../elements";
import { getCookie, setCookie, deleteCookie } from "../shared/Cookie";
// user.js의 actionCreators를 userAction이라는 이름으로 가져온다. const actionCreators = { logIn, logOut, getUser.. };
import { actionCreators as userActions } from "../redux/modules/user";
import { useDispatch, useSelector } from "react-redux";

const Login = (props) => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const dispatch = useDispatch();

  const login = () => {
    // console.log("로그인 함수 실행");
    if (id === "" || pwd === "") {
      window.alert("아이디 혹은 비밀번호가 공란입니다! 입력해주세요.");
      return;
    }
    // logIn => (user)
    dispatch(userActions.loginFB(id, pwd));
  };

  return (
    <React.Fragment>
      <Grid padding="16px" width={"500px"} margin_auto>
        <Text size="32px" bold>
          로그인
        </Text>

        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="패스워드"
            type="password"
            placeholder="패스워드 입력해주세요."
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </Grid>

        <Button
          text="로그인하기"
          _onClick={() => {
            login();
          }}
        ></Button>
      </Grid>
    </React.Fragment>
  );
};

export default Login;
