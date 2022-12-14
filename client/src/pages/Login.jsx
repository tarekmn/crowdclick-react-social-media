import { useState } from "react";
import Cookie from "js-cookie";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useAppContext } from "../utils/AppContext";
import { useEffect } from "react";
import LogoSection from "../component/LogoSection";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { appState, setAppState } = useAppContext();

  const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });
  const [formMessage, setFormMessage] = useState({ type: "", msg: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", msg: "" });

    const authCheck = await fetch("/api/users/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginCreds),
    });
    const authResult = await authCheck.json();

    // If the login was good, save the returned token as a cookie
    if (authResult.result === "success") {
      Cookie.set("auth-token", authResult.token);

      const update = { ...appState, user: authResult.user._doc };

      setAppState(update);
    } else {
      setFormMessage({
        type: "danger",
        msg: "We could not log you in with the credentials provided.",
      });
    }
    setLoginCreds({ email: "", password: "" });
  };

  const navigate = useNavigate();
  const navigateToSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (appState && appState.user) {
      window.location.href = "/";
    }
  }, [appState]);

  return (
    <>
      <Container style={{}}>
        <Form onSubmit={handleLogin}>
          <LogoSection />
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={loginCreds.email}
              onChange={(e) =>
                setLoginCreds({
                  ...loginCreds,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={loginCreds.password}
              onChange={(e) =>
                setLoginCreds({
                  ...loginCreds,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button className="postBtn" type="submit">
            Submit
          </Button>{" "}
          {"      "}
          <Button
            // variant="outline-danger"
            className="signupBtn"
            type="click"
            onClick={navigateToSignUp}
          >
            Sign-up
          </Button>
        </Form>

        {formMessage.msg.length > 0 && (
          <Alert variant={formMessage.type} style={{ marginTop: "2em" }}>
            {formMessage.msg}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default Login;
