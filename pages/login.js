import React, { useState, useEffect } from "react";

import Loading from "../src/components/Loading";
import Layout from "../src/components/Layout";
import useInput from "../src/hooks/useInput";
import { login, tryLoginWithLocalStorage } from "../src/hoc/withAuth";
import withDBMode from "../src/hoc/withDBMode";
import apiFetch from "../src/fetch";

function Login() {
  const usernameField = useInput();
  const passwordField = useInput();

  const [errorMessage, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tryLoginWithLocalStorage();
  }, []);

  const doLogin = (username, password) => {
    setLoading(true);
    setError(null);

    return apiFetch("token", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        setLoading(false);
        return response.token;
      })
      .catch(error => {
        setLoading(false);
        setError("Invalid username or password");
        return null;
      });
  };

  const handleSubmit = event => {
    event.preventDefault();

    doLogin(usernameField.value, passwordField.value).then(token => {
      if (token) {
        login(token);
      }
    });
  };

  return (
    <Layout current={{ name: "Login" }}>
      <form className="Form" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="Message Message--error">{errorMessage}</div>
        )}

        {loading && <Loading />}

        <label className="Label">
          Username
          <input className="Input" name="username" {...usernameField.bind} />
        </label>

        <label className="Label">
          Password
          <input
            className="Input"
            name="password"
            type="password"
            {...passwordField.bind}
          />
        </label>

        <div style={{ textAlign: "right" }}>
          <button className="Button Button--big">Submit</button>
        </div>
      </form>
    </Layout>
  );
}

export default withDBMode(Login);
