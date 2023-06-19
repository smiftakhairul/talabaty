import axios from "axios";
import { env } from "../utils/constants/common";
import { useSetRecoilState } from "recoil";
import { isHttpLoadingStateAtom } from "../utils/states/common";

const useAxios = () => {
  const axiosConfig = {baseURL: env.VITE_API_BASE_URL};
  const api = axios.create(axiosConfig);
  const setIsHttpLoadingState = useSetRecoilState(isHttpLoadingStateAtom);

  api.interceptors.request.use(axiosConfig => {
    setIsHttpLoadingState(true);
    return axiosConfig;
  })

  api.interceptors.response.use(
    response => {
      setIsHttpLoadingState(false);
      return response;
    },
    error => {
      setIsHttpLoadingState(false);
      return Promise.reject(error);
    }
  )

  const apiClient = (method, url, body = null, headers = null) => {
    return api
      .request({method, url, data: body, headers})
      // .then(response => {
      //   return response || null;
      // })
      // .catch(error => {
      //   console.log(`API Request Error: ${error}`);
      //   return null;
      // });
  }

  return {apiClient};
};

export default useAxios;