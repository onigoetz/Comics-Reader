import React from "react";
import PropTypes from "prop-types";

const Icon = ({ children, color, style, ...props }) => {
  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      {...props}
      style={{
        verticalAlign: "middle",
        color,
        ...style
      }}
    >
      <g>
        {children}
      </g>
    </svg>
  );
};

Icon.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  style: PropTypes.object
};

export const IoIosArrowBack = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <path d="m27.5 10l-9.9 10 9.9 10-2.5 2.5-12.5-12.5 12.5-12.5z"/>
  </Icon>
);

export const IoIosArrowForward = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <path d="m12.5 10l2.5-2.5 12.5 12.5-12.5 12.5-2.5-2.5 9.9-10z"/>
  </Icon>
);

export const IoIosHome = props => (
  <Icon viewBox="0 0 40 40" {...props}>
    <path d="m20 8.8l12.5 10v16.2h-8.7v-10h-7.5v10h-8.8v-16.2z m0-3.8l15 12-0.9 0.9-14.1-11.3-14.1 11.3-0.9-0.9 2.5-2v-7.5h5v3.5z"/>
  </Icon>
);

export const IoIosSearch = props => (
  <Icon viewBox="0 0 50 50" {...props}>
    <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z "/>
  </Icon>
);
