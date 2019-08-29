import React from "react";

import Layout from "../src/components/Layout";
import { fetchWithAuth } from "../src/fetch";
import withAuth from "../src/hoc/withAuth";

function Errors({ errors }) {
  return (
    <Layout current={{ name: "Errors" }}>
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
    </Layout>
  );
}

Errors.getInitialProps = async ({ token }) => {
  const { errors } = await fetchWithAuth(token, "errors");

  return {
    errors
  };
};

export default withAuth(Errors);
