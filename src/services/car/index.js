import { axiosInstance } from '../http';

export const addCar = async (data) => {
  try {
    const response = await axiosInstance.post('/car/add-car', data);

    return response;
  } catch (error) {
    throw error;
  }
};
