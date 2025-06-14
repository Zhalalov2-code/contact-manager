import "../css/main.css";
import { useAuth } from "../context/authContext";
import { auth } from "../firebase/firebase";
import { deleteUser } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteUserFromMockApi } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Pagination, Input, Select } from 'antd';
import ContactModal from "../components/modal";
import ProfileModal from "../components/userModal";
import ContactDetailModal from "../components/detailsContact";


function Main() {
    const { user, logout, login } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [sortType, setSortType] = useState('');
    const [modalState, setModalState] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const { Option } = Select;
    const [selectedContact, setSelectedContact] = useState(null);


    const fetchContact = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://6849c29445f4c0f5ee72c1a0.mockapi.io/contacts`);
            if (response.status === 200) {
                setContacts(response.data);
            }
        } catch (err) {
            console.error('Не удалось загрузить данные', err);
            toast.error('Не удалось загрузить контакты');
        } finally {
            setLoading(false);
        }
    };

    const deleteContact = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить контакт?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://6849c29445f4c0f5ee72c1a0.mockapi.io/contacts/${id}`);
            toast.success("Контакт удалён");
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("Ошибка удаления", err);
            toast.error("Не удалось удалить контакт");
        }
    };

    const deleteCurrentUser = async () => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить свой аккаунт?');
        if (!confirmDelete) return;

        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
            toast.error("Пользователь в Firebase не найден");
            return;
        }

        try {
            await deleteUserFromMockApi(firebaseUser.uid);
            await deleteUser(firebaseUser);
            toast.success("Ваш аккаунт удалён");
            logout();
            navigate('/login');
        } catch (err) {
            console.error("Ошибка при удалении:", err);
            toast.error("Не удалось удалить аккаунт");
        }
    };


    const addContact = async (contact) => {
        try {
            const newContact = { ...contact, createdAt: new Date().toISOString() };
            const response = await axios.post("https://6849c29445f4c0f5ee72c1a0.mockapi.io/contacts", newContact);
            toast.success("Контакт успешно добавлен");
            setContacts(a => [...a, response.data]);
        } catch (err) {
            console.error("Ошибка при добавлении контакта", err);
            toast.error("Не удалось добавить контакт");
        }
    };

    const updateContact = async (contact) => {
        try {
            const response = await axios.put(`https://6849c29445f4c0f5ee72c1a0.mockapi.io/contacts/${contact.id}`, contact);
            toast.success("Контакт обновлён");
            setContacts(prev => prev.map(c => c.id === contact.id ? response.data : c));
        } catch (err) {
            console.error("Ошибка обновления контакта", err);
            toast.error("Не удалось обновить контакт");
        }
    };

    const updateCurrentUser = async (updatedData) => {
        try {
            const response = await axios.put(`https://6849c29445f4c0f5ee72c1a0.mockapi.io/users/${user.id}`, updatedData);
            toast.success("Профиль обновлён");
            localStorage.setItem("authUser", JSON.stringify(response.data));
            login(response.data);
            setIsProfileModalOpen(false);
        } catch (err) {
            toast.error("Ошибка при обновлении профиля");
            console.error(err);
        }
    };

    const filteredContacts = contacts
        .filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortType === "name-asc") {
                return a.firstName.localeCompare(b.firstName);
            } else if (sortType === "name-desc") {
                return b.firstName.localeCompare(a.firstName);
            } else if (sortType === "date-asc") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortType === "date-desc") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return 0;
            }
        });

    useEffect(() => {
        fetchContact();
    }, []);

    return (
        <div className="body-main">
            <div className="profile-section">
                <div className="blok1">
                    <img src={user?.avatar} alt="avatar" className="profile-avatar" />
                    <div className="profile-info">
                        <h2>{user?.firstName} {user?.lastName}</h2>
                        <p>Ваш Email: {user?.email}</p>
                        <p>Ваш номер телефона: {user?.phone}</p>
                        <Button
                            danger
                            type="primary"
                            onClick={logout}
                            style={{ marginTop: 12 }}
                            icon={<LogoutOutlined />}
                        >
                            Выйти
                        </Button>

                        <Button
                            danger
                            type="default"
                            onClick={() => deleteCurrentUser(user.id)}
                            style={{ marginTop: 12, marginLeft: 12 }}
                            icon={<DeleteOutlined />}
                        >
                            Удалить аккаунт
                        </Button>

                        <Button
                            type="primary"
                            onClick={() => setIsProfileModalOpen(true)} s
                            style={{ marginTop: 5, marginLeft: 10 }}
                            icon={<EditOutlined />}
                        >
                            Редактировать профиль
                        </Button>
                    </div>
                </div>

                <div className="filter-bar">
                    <div>
                        <Input
                            placeholder="Поиск по имени, фамилии и по email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="filter-input"
                            allowClear
                        />
                        <br />
                        <Select
                            defaultValue=""
                            onChange={(value) => setSortType(value)}
                            className="sort-select"
                            style={{ width: 220 }}
                        >
                            <Option value="">Без сортировки</Option>
                            <Option value="name-asc">Имя: A → Z</Option>
                            <Option value="name-desc">Имя: Z → A</Option>
                            <Option value="date-asc">Дата: Старые → Новые</Option>
                            <Option value="date-desc">Дата: Новые → Старые</Option>
                        </Select>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalState(true)}
                            className="add-button"
                        >
                            Добавить контакт
                        </Button>
                    </div>

                    {modalState && (
                        <ContactModal onClose={() => { setModalState(false); setEditingContact(null); }} onSubmit={editingContact ? updateContact : addContact} contact={editingContact || {}} />
                    )}
                    {isProfileModalOpen && (
                        <ProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} onSubmit={updateCurrentUser} />
                    )}

                </div>
            </div>

            <div>
                {!loading && <h1>Список контактов</h1>}
            </div>

            <div className="contacts-list">
                {loading ? (
                    <div className="loader">Загрузка...</div>
                ) : (
                    <>
                        {filteredContacts
                            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                            .map(contact => (
                                <div key={contact.id} className="contact-card">
                                    <img src={contact.avatar} alt="avatar" />
                                    <div>
                                        <h4>{contact.firstName} {contact.lastName}</h4>
                                        <p>Email: {contact.email}</p>
                                        <p>Сотовый номер: {contact.phone}</p>
                                        <p>Дата: {contact.createdAt}</p>
                                        <DeleteOutlined onClick={() => deleteContact(contact.id)} style={{ color: 'red', fontSize: '18px', marginTop: 10 }} />
                                        <EditOutlined style={{ color: 'blue', fontSize: '18px', marginLeft: 10, cursor: "pointer" }} onClick={() => { setEditingContact(contact); setModalState(true); }} />
                                        <Button
                                            type="link"
                                            onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); }}
                                        >
                                            Подробнее
                                        </Button>
                                    </div>
                                </div>
                            ))}

                    </>
                )}
            </div>
            {filteredContacts.length > pageSize && (
                <div className="blok-pagination">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredContacts.length}
                        onChange={(page) => setCurrentPage(page)}
                        className="pagination"
                    />
                </div>
            )}
            {selectedContact && (
                <ContactDetailModal
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                />
            )}

        </div>
    );
}

export default Main;
