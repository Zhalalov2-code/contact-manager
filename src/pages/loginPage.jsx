import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../utils/auth";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { auth, provider, signInWithPopup } from "../firebase/firebase";
import { createGoogleUser } from "../utils/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Неверный формат email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const user = await loginUser(email, password);
      if (user) {
        login(user);
        toast.success(`Добро пожаловать, ${user.firstName}!`);
        navigate("/");
      } else {
        toast.error("Неверный email или пароль");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast.error("Ошибка при входе");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result?.user;

      if (!firebaseUser) {
        toast.error("Ошибка: Google не вернул пользователя");
        return;
      }

      const newUser = {
        firstName: firebaseUser.displayName?.split(" ")[0] || "Google",
        lastName: firebaseUser.displayName?.split(" ")[1] || "",
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        uid: firebaseUser.uid,
        phone: "",
        password: "",
        createdAt: new Date().toISOString()
      };

      const user = await createGoogleUser(newUser);
      login(user);
      toast.success(`Добро пожаловать, ${user.firstName}!`);
      navigate("/");
    } catch (err) {
      console.error("Ошибка Google-входа:", err);
      toast.error("Ошибка входа через Google");
    }
  };


  return (
    <div className="login-container">
      <div>
        <h1>Вход на страницу</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Войти</button>
      </div>
      <br />
      <div>
        <Link className="linkRegister" to="/register">Зарегистрироваться</Link>
      </div>
      <br />
      <div>
        <p>ИЛИ</p>
        <button onClick={handleGoogleLogin}>Войти через Google</button>
      </div>
    </div>
  );
}

export default Login;
