import {useState} from "react";
import {Form, Input, Button, Card, message} from "antd";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import {useAuth} from "../context/AuthContext";
import type {LoginResponse} from "../types";

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/auth/login", values);
      login(res.data.user, res.data.token);
      message.success("Login successful");
      navigate("/employees");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card title="Employee Management" style={{width: 360}}>
        <Form onFinish={onFinish} layout="vertical" disabled={loading}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: "Username is required"}]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: "Password is required"}]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
