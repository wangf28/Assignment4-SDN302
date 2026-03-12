import axios from "../utils/axios";

// Auth APIs
export const authAPI = {
  login: (credentials) => axios.post("/auth/login", credentials),
  register: (userData) => axios.post("/auth/register", userData),
  getCurrentUser: () => axios.get("/auth/me"),
};

// User APIs
export const userAPI = {
  getAllUsers: () => axios.get("/users"),
  getUserById: (id) => axios.get(`/users/${id}`),
  updateUser: (id, userData) => axios.put(`/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};

// Question APIs
export const questionAPI = {
  getAllQuestions: () => axios.get("/questions"),
  getQuestionById: (id) => axios.get(`/questions/${id}`),
  createQuestion: (questionData) => axios.post("/questions", questionData),
  updateQuestion: (id, questionData) =>
    axios.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => axios.delete(`/questions/${id}`),
};

// Quiz APIs
export const quizAPI = {
  getAllQuizzes: () => axios.get("/quizzes"),
  getQuizById: (id) => axios.get(`/quizzes/${id}`),
  createQuiz: (quizData) => axios.post("/quizzes", quizData),
  updateQuiz: (id, quizData) => axios.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => axios.delete(`/quizzes/${id}`),
  submitQuiz: (id, answers) => axios.post(`/quizzes/${id}/submit`, { answers }),
};

export default {
  auth: authAPI,
  user: userAPI,
  question: questionAPI,
  quiz: quizAPI,
};
