"use client";
import { signUp } from "@/services/user";
import { Button, Flex, Form, Input, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Signup = () => {
  const [loadings, setLoadings] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useRouter();

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  const handleOnFormSubmit = async (data) => {
    const response = await signUp(data);

    if (response.status >= 200 && response.status <= 300) {
      navigate.push("/car");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Form
        style={{ width: "30%", margin: "auto", padding: "20px" }}
        onFinish={handleSubmit(handleOnFormSubmit)}
      >
        <Form.Item style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="fullName"
            rules={{
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
              maxLength: {
                value: 20,
                message: "Full name can't be more than 20 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                placeholder="Enter your name"
              />
            )}
          />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}
        </Form.Item>

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

        <Flex gap={3}>
          <Typography>
            <Paragraph>
              <p>Already have an account?</p>
            </Paragraph>
          </Typography>
          <Link onClick={() => navigate.push("/login")}>Login</Link>
        </Flex>

        <Button
          type="primary"
          loading={loadings[0]}
          onClick={() => enterLoading(0)}
          htmlType="submit"
        >
          Signup
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
