"use client";

import { addCar } from "@/services/car";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Radio,
  Select,
  Table,
  Upload,
} from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Car = () => {
  const [imageCount, setImageCount] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loadings, setLoadings] = useState([]);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onChange = (info) => {
    if (info.file.status === "done") {
      setValue("images", info.fileList);
      message.success("Image uploaded successfully");
    } else if (info.file.status === "error") {
      message.error("Error uploading image");
    }
    setFileList(info.fileList);
  };

  const resetForm = () => {
    reset({
      model: "",
      price: "",
      phoneNumber: "",
      city: "Lahore",
      images: [],
    });
    setImageCount(1);
    setFileList([]);
  };

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
    try {
      const images = data.images?.length
        ? await Promise.all(
            data.images.map((image) => getBase64(image.originFileObj))
          )
        : [];
      const response = await addCar({ ...data, images });

      if (response.status >= 200 && response.status <= 300) {
        console.log("Car added successfully");
        setFormData({ ...data, images, imagesCount: images.length });
        resetForm();
      } else {
        throw new Error("Failed to add car");
      }
    } catch (error) {
      console.error(error.message || "Error occurred while adding car");
    }
  };

  const columns = [
    { title: "Car Model", dataIndex: "model", key: "model" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Number of Images", dataIndex: "imagesCount", key: "imagesCount" },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Car image ${index + 1}`}
            style={{ width: 50, height: 50, margin: 5 }}
          />
        )),
    },
  ];

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 12,
        }}
        style={{ width: "80%", margin: "auto", padding: "20px" }}
        onFinish={handleSubmit(handleOnFormSubmit)}
      >
        <Form.Item label="Car Model" style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="model"
            rules={{
              required: "Car model is required",
              minLength: {
                value: 3,
                message: "Car model must be at least 3 characters",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  placeholder="Enter car model"
                  {...field}
                  status={fieldState.invalid ? "error" : ""}
                />
                {fieldState.invalid && (
                  <span className="text-red-500">
                    {fieldState?.error?.message}
                  </span>
                )}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Price" style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="price"
            rules={{
              required: "Price is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Price must be a valid number",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  placeholder="Enter car price"
                  {...field}
                  status={fieldState.invalid ? "error" : ""}
                />
                {fieldState.invalid && (
                  <span className="text-red-500">
                    {fieldState?.error?.message}
                  </span>
                )}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Phone Number" style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{11}$/,
                message: "Phone number must be exactly 11 digits",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  placeholder="Enter phone number"
                  {...field}
                  status={fieldState.invalid ? "error" : ""}
                />
                {fieldState.invalid && (
                  <span className="text-red-500">
                    {fieldState?.error?.message}
                  </span>
                )}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="City" style={{ marginBottom: "10px" }}>
          <Controller
            control={control}
            name="city"
            defaultValue="Lahore"
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value="Lahore">Lahore</Radio>
                <Radio value="Karachi">Karachi</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item label="Number of Images" style={{ marginBottom: "10px" }}>
          <Select
            defaultValue={1}
            onChange={(value) => setImageCount(value)}
            style={{ width: 120 }}
          >
            {[...Array(10).keys()].map((_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <Form.Item label="Upload Images">
              <Upload
                multiple
                fileList={fileList}
                accept="image/*"
                listType="picture"
                maxCount={imageCount}
                onChange={onChange}
                onRemove={(file) => {
                  const updatedFileList = fileList.filter(
                    (item) => item.uid !== file.uid
                  );
                  setFileList(updatedFileList);
                  setValue("images", updatedFileList);
                }}
              >
                <Button icon={<PlusOutlined />}>
                  Upload (Max: {imageCount})
                </Button>
              </Upload>
            </Form.Item>
          )}
        />
        {/* <Button type="primary">Add Car</Button> */}
        <Button
          htmlType="submit"
          type="primary"
          loading={loadings[0]}
          onClick={() => enterLoading(0)}
        >
          Submit
        </Button>
      </Form>

      {formData && (
        <div style={{ margin: "40px" }}>
          <Table
            dataSource={[formData]}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.model}
          />
        </div>
      )}
    </>
  );
};

export default Car;
