import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text, Button } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import { useSelector, useDispatch } from "react-redux";

const Post = (props) => {
  console.log(props);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.image_url} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
          </Grid>
        </Grid>

        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid padding="16px">
          <Text bold>댓글 {props.comment_cnt}개</Text>
        </Grid>
        <Grid padding="16px">
          <Button
            text={"삭제"}
            _onClick={() => dispatch(postActions.deletePostFB(props.id))}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "mean0",
    user_profile:
      "https://blogpfthumb-phinf.pstatic.net/MjAyMTA5MDdfMjIg/MDAxNjMxMDEyNzEwNDQ2.53rmKkH3D6N4VpVfG9IeHnFIkCg0mpy1dDpvewQJb2Eg.An_4bR0Wpd-o4akyamNBMCAfBhoGDa2-5xLTz3xVHYQg.JPEG.gpalstksxk/KakaoTalk_20210808_205039067_02.jpg",
  },
  image_url:
    "https://blogpfthumb-phinf.pstatic.net/MjAyMTA5MDdfMjIg/MDAxNjMxMDEyNzEwNDQ2.53rmKkH3D6N4VpVfG9IeHnFIkCg0mpy1dDpvewQJb2Eg.An_4bR0Wpd-o4akyamNBMCAfBhoGDa2-5xLTz3xVHYQg.JPEG.gpalstksxk/KakaoTalk_20210808_205039067_02.jpg",
  contents: "고양이네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
};

export default Post;
