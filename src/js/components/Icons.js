import React from "react";
import PropTypes from "prop-types"
const Icon = ({ children, color, style, ...props }) => {
  return (
    <svg
      children={children}
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      {...props}
      style={{
        verticalAlign: "middle",
        color: color,
        ...style
      }}
    />
  )
};

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object
};

export const IoIosArrowBack = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <g><path d="m27.5 10l-9.9 10 9.9 10-2.5 2.5-12.5-12.5 12.5-12.5z"/></g>
  </Icon>
);

export const IoIosArrowForward = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <g><path d="m12.5 10l2.5-2.5 12.5 12.5-12.5 12.5-2.5-2.5 9.9-10z"/></g>
  </Icon>
);

export const IoIosHome = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <g><path d="m20 8.8l12.5 10v16.2h-8.7v-10h-7.5v10h-8.8v-16.2z m0-3.8l15 12-0.9 0.9-14.1-11.3-14.1 11.3-0.9-0.9 2.5-2v-7.5h5v3.5z"/></g>
  </Icon>
);
