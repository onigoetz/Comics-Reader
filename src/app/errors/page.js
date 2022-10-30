import React from "react";

import { checkAuth } from "../../serverutils";
import comicsIndex from "../../../server/comics";

export default async function Page() {
  checkAuth();

  const errors = comicsIndex.errors;

  return (
    <ol>
      {errors.length === 0 && (
        <li>No error while indexing, enjoy all your books !</li>
      )}
      {errors.map(item => {
        return (
          <li key={item[0]}>
            <strong>{item[0]}</strong>
            <br />
            <p>{item[1].message}</p>
            <pre>{item[1].stack}</pre>
          </li>
        );
      })}
    </ol>
  );
}
