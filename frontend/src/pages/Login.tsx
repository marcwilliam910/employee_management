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

  const onFinish = async (values: LoginForm) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", values);
      login(res.data.user, res.data.token);
      message.success("Login successful");
      navigate("/employees");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{display: "flex", justifyContent: "center", marginTop: 100}}>
      <Card title="Login" style={{width: 350}}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: "Username is required"}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: "Password is required"}]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
