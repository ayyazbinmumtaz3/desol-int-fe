"use client";
import { signUp } from "@/services/user";
import { Button, Form, Input, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Signup = () => {
  const { handleSubmit, control } = useForm();
  const navigate = useRouter();

  const handleOnFormSubmit = async (data) => {
    const response = await signUp(data);

    if (response.status >= 200 && response.status <= 300) {
      navigate.push("/car");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      {/* <Typography>
        <Title level={3}>Sign Up</Title>
      </Typography> */}
      <form onSubmit={handleSubmit(handleOnFormSubmit)}>
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input
                required={true}
                onChange={onChange}
                value={value}
                placeholder="Enter your name"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                type="email"
                required={true}
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
              <Form.Item>
                <Input.Password
                  onChange={onChange}
                  value={value}
                  placeholder="Enter your password"
                  required={true}
                />
              </Form.Item>
            )}
          />
        </div>

        <div className="flex gap-1">
          <Typography>
            <Paragraph>
              <p>Already have an account?</p>
            </Paragraph>
          </Typography>
          <Link onClick={() => navigate.push("/login")}>Login</Link>
        </div>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Signup
          </Button>
        </Form.Item>
      </form>
    </div>
  );
};

export default Signup;
