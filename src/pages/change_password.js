import { useState } from "react";

import { fetchWithAuth } from "../fetch";
import Form from "../components/Form";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Label from "../components/Label";
import Loading from "../components/Loading";
import Message from "../components/Message";
import useInput from "../hooks/useInput";
import withAuth, { useAuth, logout } from "../hoc/withAuth";

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
      <Form onSubmit={handleSubmit}>
        {error && <Message>{error}</Message>}

        {loading && <Loading />}

        <Label>
          Current Password
          <Input
            name="current_password"
            type="password"
            {...currentPassword.bind}
          />
        </Label>

        <br />
        <Label>
          New Password
          <Input name="password" type="password" {...password.bind} />
        </Label>

        <Label
          error={
            confirmPassword.value &&
            arePasswordsDifferent() &&
            "Passwords are different"
          }
        >
          Confirm Password
          <Input
            name="confirm_password"
            type="password"
            {...confirmPassword.bind}
          />
        </Label>

        <div style={{ textAlign: "right" }}>
          <button
            className="Button Button--big"
            disabled={loading || !password.value || arePasswordsDifferent()}
          >
            Change
          </button>
        </div>
      </Form>
    </Layout>
  );
}

export default withAuth(ChangePassword);
