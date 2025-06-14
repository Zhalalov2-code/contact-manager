import { useState } from "react";
import { registerUser } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../css/register.css"
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
  });
  const { login } = useAuth();

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "Имя обязательно";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Фамилия обязательна";
    }

    if (!form.email.includes("@") || !form.email.includes(".")) {
      newErrors.email = "Некорректный email";
    }

    if (!/^\d{10,}$/.test(form.phone)) {
      newErrors.phone = "Телефон должен содержать минимум 10 цифр";
    }

    try {
      new URL(form.avatar);
    } catch {
      newErrors.avatar = "Ссылка на изображение некорректна";
    }

    if (!form.password.match(/[A-Z]/)) {
      newErrors.password = "Пароль должен содержать заглавную букву";
    } else if (!form.password.match(/[0-9]/)) {
      newErrors.password = "Пароль должен содержать цифру";
    } else if (!form.password.match(/[!.-]/)) {
      newErrors.password = "Пароль должен содержать символ (!.-)";
    }

    setErrors(newErrors);
    toast.error(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await registerUser(form);
      toast.success("Регистрация прошла успешно")
      login(user);
      navigate("/");
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Ошибка при регистрации");
    }
  };

  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="Имя" value={form.firstName} onChange={handleChange} />
        {errors.firstName && <div className="error">{errors.firstName}</div>}

        <input name="lastName" placeholder="Фамилия" value={form.lastName} onChange={handleChange} />
        {errors.lastName && <div className="error">{errors.lastName}</div>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error">{errors.email}</div>}

        <input name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} />
        {errors.phone && <div className="error">{errors.phone}</div>}

        <input name="avatar" placeholder="Ссылка на фото" value={form.avatar} onChange={handleChange} />
        {errors.avatar && <div className="error">{errors.avatar}</div>}

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error">{errors.password}</div>}

        <button type="submit">Зарегистрироваться</button>
      </form>
      <br />
      <Link className="linkLogin" to={`/login`}>У вас уже есть аккаунт?</Link>
    </div>
  );
}

export default Register;
