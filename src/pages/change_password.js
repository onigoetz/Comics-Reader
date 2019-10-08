/* global process */
import React, { useState } from "react";

import { fetchWithAuth } from "../fetch";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import useInput from "../hooks/useInput";
import withAuth, { useAuth, logout } from "../hoc/withAuth";
import withDBMode from "../hoc/withDBMode";

function ChangePassword() {
  const currentPassword = useInput();
  const password = useInput();
  const confirmPassword = useInput();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const arePasswordsDifferent = () => confirmPassword.value !== password.value;

  const handleSubmit = event => {
    event.preventDefault();
    if (arePasswordsDifferent()) {
      return;
    }

    fetchWithAuth(token, "change_password", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword.value,
        password: password.value
      })
    })
      .then(() => {
        setLoading(false);
        setError(null);

        logout();
      })
      .catch(e => {
        setLoading(false);
        setError("Change password failed");
      });

    setLoading(true);
    setError(null);
  };

  return (
    <Layout current={{ name: "Change Password" }}>
      <form className="Form" onSubmit={handleSubmit}>
        {error && <div className="Message Message--error">{error}</div>}

        {loading && <Loading />}

        <label className="Label">
          Current Password
          <input
            className="Input"
            name="current_password"
            type="password"
            {...currentPassword.bind}
          />
        </label>

        <br />
        <label className="Label">
          New Password
          <input
            className="Input"
            name="password"
            type="password"
            {...password.bind}
          />
        </label>

        <label className="Label">
          Confirm Password
          <input
            className="Input"
            name="confirm_password"
            type="password"
            {...confirmPassword.bind}
          />
          {confirmPassword.value && arePasswordsDifferent() && (
            <span className="Label__text">Passwords are different</span>
          )}
        </label>

        <div style={{ textAlign: "right" }}>
          <button
            className="Button Button--big"
            disabled={loading || !password.value || arePasswordsDifferent()}
          >
            Change
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default withDBMode(withAuth(ChangePassword));
