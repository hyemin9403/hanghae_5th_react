import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { Grid, Text, Button } from "../elements";

import { history } from "../redux/configureStore";

import { apiKey } from "../shared/firebase";

const Header = (props) => {
  // 로그인 했는지 여부 체크해서 헤더 보여주기
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  const is_login = useSelector((state) => state.user.is_login);
  const is_session = sessionStorage.getItem(_session_key);

  const dispatch = useDispatch();

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid is_flex padding="4px 16px" width={"500px"} margin_auto>
          <Grid>
            <Text a_href margin="0px" size="24px" bold a_href>
              헬로
            </Text>
          </Grid>

          <Grid is_flex>
            <Button
              text="로그아웃"
              _onClick={() => dispatch(userActions.logoutFB())}
            ></Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px" width={"500px"} margin_auto>
        <Grid>
          <Text margin="0px" size="24px" bold>
            헬로
          </Text>
        </Grid>

        <Grid is_flex>
          <Button
            text="로그인"
            _onClick={() => {
              history.push("/login");
            }}
          ></Button>
          <Button
            text="회원가입"
            _onClick={() => {
              history.push("/signup");
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
