import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;

  const _handleScroll = _.throttle(() => {
    //로딩중에는 callNext 다시 샐행되지않게함
    if (loading) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 200) {
      // 아래 스크롤이 200 이하로 남았으면 다음 next할거 불러라
      callNext();
    }
  }, 300);
  // 이건 기억 날리지 않고 기억해야 하는 함수야 라고 해주는 것
  const handleScroll = React.useCallback(_handleScroll, [loading]);

  // 좋아요 할때도 이거랑 똑같이 하면 되지 않을까?
  React.useEffect(() => {
    // addEventListener(type, listener);
    if (loading) {
      return;
    }

    if (is_next) {
      window.addEventListener("scroll", handleScroll);
    } else {
      // 클린업(함수형 컴포넌트가 화면에서 사라질 때 return에 있는 구문이 실행된다. 언마운트와 비슷하게 동작)
      window.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]);

  // props.children은 그냥 내가 감싸고 있는거 안에 있는 내용물을 전부 리턴해(보여줘) 라는뜻
  return (
    <>
      {props.children}
      {is_next && <Spinner />}
      {loading && <Spinner />}
    </>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
