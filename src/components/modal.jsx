import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const ContactModal = ({ onClose, onSubmit, contact = {} }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      avatar: contact.avatar || "",
    });
  }, [contact, form]);

  const handleFinish = (values) => {
    onSubmit({ ...values, id: contact.id });
    onClose();
  };

  return (
    <Modal
      title={contact.id ? "Редактировать контакт" : "Добавить контакт"}
      visible={true}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item name="firstName" label="Имя" rules={[{ required: true, message: "Введите имя" }]}>
          <Input placeholder="Имя" />
        </Form.Item>

        <Form.Item name="lastName" label="Фамилия" rules={[{ required: true, message: "Введите фамилию" }]}>
          <Input placeholder="Фамилия" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Введите корректный email" }]}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="phone" label="Телефон" rules={[{ required: true, message: "Введите номер телефона" }]}>
          <Input placeholder="Телефон" />
        </Form.Item>

        <Form.Item name="avatar" label="URL аватара">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            {contact.id ? "Сохранить" : "Добавить"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactModal;
