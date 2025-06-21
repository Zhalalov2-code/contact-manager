import { Modal, Form, Input } from 'antd';

const ContactModal = ({ contact = {}, onSubmit, onClose }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onSubmit({ ...contact, ...values });
        onClose();
      })
      .catch((errorInfo) => {
        console.log("Ошибка валидации:", errorInfo);
      });
  };

  return (
    <Modal
      title={contact?.id ? "Редактировать контакт" : "Добавить контакт"}
      open={true}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          avatar: contact.avatar || '',
        }}
      >
        <Form.Item
          label="Имя"
          name="firstName"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="lastName"
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Неверный формат email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[
            { required: true, message: 'Введите номер телефона' },
            {
              pattern: /^\+?[0-9]{7,10}$/,
              message: 'Неверный формат телефона'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="URL аватара"
          name="avatar"
          rules={[
            { required: true, message: 'Введите ссылку на аватар' },
            {
              type: 'url',
              message: 'Введите корректный URL (например: https://example.com/avatar.jpg)',
            },
            {
              pattern: /\.(jpeg|jpg|png|gif|webp)$/i,
              message: 'Ссылка должна оканчиваться на .jpg, .jpeg, .png, .gif или .webp',
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactModal;
