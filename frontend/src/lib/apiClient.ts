// import axios from 'axios';

// const api = axios.create({
//     // SỬA Ở ĐÂY:
//     baseURL: '/api', // Chỉ cần tiền tố /api
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Thêm logic để tự động đính kèm token (nếu cần)
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;