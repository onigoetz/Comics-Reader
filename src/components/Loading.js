import React from "react";

export function RawLoading({ children }) {
  return (
    <div className="Loading">
      <div className="Loading__container">
        <h1 className="Loading__block">{children}</h1>
      </div>
    </div>
  );
}

export default function Loading() {
  return <RawLoading>Loading...</RawLoading>;
}
