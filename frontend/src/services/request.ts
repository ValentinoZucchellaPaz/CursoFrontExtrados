// src/services/request.ts
import apiClient from './apiClient';
import { AxiosRequestConfig } from 'axios';

export const request = async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient(config);
    return response.data;
};
