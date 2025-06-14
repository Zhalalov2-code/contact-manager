import axios from "axios";

const API_URL = "https://6849c29445f4c0f5ee72c1a0.mockapi.io/users";

export async function loginUser(email, password) {
    const response = await axios.get(`${API_URL}?email=${email}&password=${password}`);
    return response.data[0];
};

export async function getUserUid(uid) {
    const response = await axios.get(API_URL);
    return response.data.find(user => user.uid === uid);
}

export async function createGoogleUser(user) {
    try {
        const currentUser = await getUserUid(user.uid);
        if (currentUser) {
            return currentUser;
        }

        console.log("Создание нового пользователя:", user);

        const response = await axios.post(API_URL, user);
        return response.data;
    } catch (err) {
        console.error("Ошибка при создании пользователя в MockAPI:", err);
        throw err;
    }
}

export async function registerUser(user) {
    const response = await axios.post(API_URL, user)
    return response.data;
};

export async function deleteUser(uid) {
    const user = await getUserUid(uid);
    if (!user) throw new Error("Пользователь не найден");
    const response = await axios.delete(`${API_URL}/${user.id}`);
    return response.data;
};

export async function updateUSer(uid, updatedData) {
    const response = await axios.put(`${API_URL}/${uid}`, updatedData)
    return response.data;
};
