import { useEffect, useState } from "react";
import { Modal, Form, Input, Avatar, Button } from "antd";

const ProfileModal = ({ user, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setAvatarUrl(user.avatar || "");
    }
  }, [user, form]);

  const handleFinish = (values) => {
    onSubmit({ ...user, ...values });
    onClose();
  };

  const handleAvatarChange = (e) => {
    setAvatarUrl(e.target.value);
  };

  return (
    <Modal
      title="Редактировать профиль"
      open={true}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Имя" name="firstName" rules={[{ required: true, message: "Введите имя" }]}>
          <Input placeholder="Имя" />
        </Form.Item>

        <Form.Item label="Фамилия" name="lastName" rules={[{ required: true, message: "Введите фамилию" }]}>
          <Input placeholder="Фамилия" />
        </Form.Item>

        <Form.Item label="Телефон" name="phone" rules={[{ required: true, message: "Введите номер" }]}>
          <Input placeholder="Телефон" />
        </Form.Item>

        <Form.Item label="URL аватара" name="avatar">
          <Input placeholder="URL аватара" onChange={handleAvatarChange} />
        </Form.Item>

        {avatarUrl && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar src={avatarUrl} size={80} />
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Сохранить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
