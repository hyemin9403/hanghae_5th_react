import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Grid } from "../elements";
import { storage } from "./firebase";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const fileInput = React.useRef();
  const is_uploading = useSelector((state) => state.image.uploading);

  const selectFile = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.files[0]);

    console.log(fileInput.current.files[0]);
    // input에 파일이라는 객체를 읽어오는 방법.
    const reader = new FileReader();
    const file = fileInput.current.files[0];
    // 어떤걸 읽고싶은지 ( )에 넣고 readAsDataUrl 메소드 사용
    reader.readAsDataURL(file);
    // 업로드가 끝날 때 하는일
    reader.onloadend = () => {
      console.log(reader.result);
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    let image = fileInput.current.files[0];
    const _upload = storage.ref(`images/${image.name}`).put(image);

    _upload.then((snapshot) => {
      console.log(snapshot);

      snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
      });
    });
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      />
      <Button _onClick={uploadFB} text="업로드하기"></Button>
    </React.Fragment>
  );
};

export default Upload;
