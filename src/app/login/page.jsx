"use client";
import { login } from "@/services/user";
import { Button, Form, Input, message, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useRouter();

  const handleOnFormSubmit = async (data) => {
    const response = await login(data);

    if (response.status >= 200 && response.status <= 300) {
      message.success("Signin Successfully");
      navigate.push("/car");
    } else {
      return message.error("Error while logging in");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 18,
        }}
        style={{
          width: "30%",
          margin: "auto",
          padding: "20px",
        }}
        onFinish={handleSubmit(handleOnFormSubmit)}
      >
        <Form.Item style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                type="email"
                placeholder="Enter your email"
                onChange={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input.Password
                onChange={onChange}
                value={value}
                placeholder="Enter your password"
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </Form.Item>

        <div className="flex gap-1">
          <Typography>
            <Paragraph>Create an account!</Paragraph>
          </Typography>
          <Link onClick={() => navigate.push("/signup")}>Signup</Link>
        </div>

        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
