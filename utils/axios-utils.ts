export const loadInterceptors = (axios: any, getTokenLocalDb: any) => {
  axios.interceptors.request.use(
    async (request: any) => {
      if (!request.url.includes("/otp")) {
        const token = await getTokenLocalDb();
        request.headers["Authorization"] = `Bearer ${token}`;
      }
      return request;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

export default loadInterceptors;
