import axios from "axios";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const API_URL = "https://6849c29445f4c0f5ee72c1a0.mockapi.io/users";

export async function loginUser(email, password) {
  const response = await axios.get(`${API_URL}?email=${email}&password=${password}`);
  return response.data[0];
}

export async function getUserByUid(uid) {
  const response = await axios.get(API_URL);
  return response.data.find(user => user.uid === uid);
}

export async function createGoogleUser(user) {
  const existingUser = await getUserByUid(user.uid);
  if (existingUser) return existingUser;

  const response = await axios.post(API_URL, user);
  return response.data;
}

export const registerUser = async (form) => {
  const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
  const firebaseUser = res.user;

  const newUser = {
    uid: firebaseUser.uid,
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    avatar: form.avatar,
    createdAt: new Date().toISOString(),
  };
  const response = await axios.post("https://6849c29445f4c0f5ee72c1a0.mockapi.io/users", newUser);
  return response.data;
};

export async function deleteUserFromMockApi(uid) {
  const user = await getUserByUid(uid);
  if (!user) throw new Error("Пользователь не найден в MockAPI");
  const response = await axios.delete(`${API_URL}/${user.id}`);
  return response.data;
}

export async function updateUser(uid, updatedData) {
  const response = await axios.put(`${API_URL}/${uid}`, updatedData);
  return response.data;
}