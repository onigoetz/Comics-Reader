import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import Form from "../components/Form";
import Loading from "../components/Loading";
import Layout from "../components/Layout";
import Message from "../components/Message";
import Label from "../components/Label";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import { login, tryLoginWithLocalStorage } from "../auth/auth";
import apiFetch from "../fetch";

function Login() {
  const usernameField = useInput();
  const passwordField = useInput();

  const [errorMessage, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tryLoginWithLocalStorage(navigate);
  }, [navigate]);

  const doLogin = (username: string, password: string) => {
    setLoading(true);
    setError(null);

    return apiFetch<{ token: string }>("token", {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doLogin(usernameField.value, passwordField.value).then(token => {
      if (token) {
        login(navigate, token);
      }
    });
  };

  return (
    <Layout current={{ name: "Login" }}>
      <Form onSubmit={handleSubmit}>
        {errorMessage && <Message>{errorMessage}</Message>}

        {loading && <Loading />}

        <Label>
          Username
          <Input name="username" {...usernameField.bind} />
        </Label>

        <Label>
          Password
          <Input name="password" type="password" {...passwordField.bind} />
        </Label>

        <div style={{ textAlign: "right" }}>
          <button className="Button Button--big">Submit</button>
        </div>
      </Form>
    </Layout>
  );
}

export const Route = createFileRoute("/login")({
  component: Login
});
