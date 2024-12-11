"use client";
import { login } from "@/services/user";
import { Button, Input, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Login = () => {
  const { handleSubmit, control } = useForm();
  const navigate = useRouter();

  const handleOnFormSubmit = async (data) => {
    const response = await login(data);

    if (response.status >= 200 && response.status <= 300) {
      navigate.push("/car");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <form className="p-6" onSubmit={handleSubmit(handleOnFormSubmit)}>
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                required={true}
                type="email"
                placeholder="Enter your email"
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input.Password
                onChange={onChange}
                value={value}
                required={true}
                placeholder="Enter your password"
              />
            )}
          />
          <div className="flex gap-1">
            <Typography>
              <Paragraph>Create an account!</Paragraph>
            </Typography>
            <Link onClick={() => navigate.push("/signup")}>Signup</Link>
          </div>
        </div>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
