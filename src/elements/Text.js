import React from "react";
import styled from "styled-components";

const Text = (props) => {
  const { bold, color, size, children, margin, a_href } = props;

  const styles = { bold: bold, color: color, size: size, margin };

  if (a_href) {
    return (
      <A href="/" {...styles}>
        {children}
      </A>
    );
  }

  return <P {...styles}>{children}</P>;
};

Text.defaultProps = {
  children: null,
  bold: false,
  color: "#222831",
  size: "14px",
  margin: false,
  a_href: false,
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
`;

const A = styled.a`
  text-decoration: none;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
`;

export default Text;
