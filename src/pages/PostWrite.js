import React, { useState } from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostWrite = (props) => {
  const { history } = props;

  const dispatch = useDispatch();
  // console.log("PostWrite의 props", props);
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);

  const [contents, setContents] = React.useState("");

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    console.log(contents);
    dispatch(postActions.addPostFB(contents));
  };

  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" width={"500px"} margin_auto>
        <Text size="32px" bold>
          로그인 후에만 글을 쓸 수 있어요!
        </Text>
        <Button
          _onClick={() => {
            history.replace("/");
          }}
          text="로그인하러 가기"
        ></Button>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Grid padding="16px" width={"500px"} margin_auto>
        <Text margin="0px" size="36px" bold>
          게시글 작성
        </Text>
        <Upload />
      </Grid>

      <Grid width={"500px"} margin_auto>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>

        <Image
          shape="rectangle"
          src={
            preview
              ? preview
              : "https://www.lifewire.com/thmb/P856-0hi4lmA2xinYWyaEpRIckw=/1920x1326/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
          }
        />
      </Grid>

      <Grid padding="16px" width={"500px"} margin_auto>
        <Input
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px" width={"500px"} margin_auto>
        <Button text="게시글 작성" _onClick={addPost}></Button>
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
