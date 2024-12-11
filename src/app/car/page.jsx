"use client";

import { addCar } from "@/services/car";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  notification,
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
  const { handleSubmit, control, setValue } = useForm();

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
    });
  };

  const onChange = (info) => {
    if (info.file.status === "done") {
      setValue("images", info.fileList);
      message.success("success");
    } else if (info.file.status === "error") {
      message.error("error");
    }
    setFileList(info.fileList);
  };

  const handleOnFormSubmit = async (data) => {
    try {
      const images =
        data.images && data.images.length > 0
          ? await Promise.all(
              data.images.map((image) => getBase64(image.originFileObj))
            )
          : [];

      console.log("Submitting data: ", { ...data, images });

      const response = await addCar({ ...data, images });

      if (response.status >= 200 && response.status < 300) {
        message.success("Car added successfully");

        const savedData = { ...data, images };
        setFormData(savedData);
      } else {
        message.error("Failed to add car");
      }
    } catch (error) {
      message.error("Error occurred while adding car");
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
    <div style={{ width: "60%", margin: "auto", padding: "20px" }}>
      <form onSubmit={handleSubmit(handleOnFormSubmit)}>
        <Form.Item label="Car Model">
          <Controller
            control={control}
            name="model"
            rules={{ required: "Car model is required" }}
            render={({ field }) => (
              <Input placeholder="Enter car model" {...field} />
            )}
          />
        </Form.Item>

        <Form.Item label="Price">
          <Controller
            control={control}
            name="price"
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <Input placeholder="Enter car price" {...field} />
            )}
          />
        </Form.Item>

        <Form.Item label="Phone Number">
          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <Input placeholder="Enter phone number" {...field} />
            )}
          />
        </Form.Item>

        <Form.Item label="City">
          <Controller
            control={control}
            name="city"
            rules={{ required: "City is required" }}
            defaultValue="Lahore"
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value="Lahore">Lahore</Radio>
                <Radio value="Karachi">Karachi</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item label="Number of Images">
          <Select
            defaultValue={1}
            onChange={setImageCount}
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

        <Form.Item>
          <Button
            onClick={() => openNotificationWithIcon("success")}
            type="primary"
            htmlType="submit"
          >
            Add Car
          </Button>
        </Form.Item>
      </form>

      {/* Show Table after successful submission */}
      {formData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Form Data in Table:</h3>
          <Table
            dataSource={[formData]}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.model}
          />
        </div>
      )}
    </div>
  );
};

export default Car;
