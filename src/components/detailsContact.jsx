import { Modal } from "antd";

const ContactDetailModal = ({ contact, onClose }) => {
  if (!contact) return null;

  return (
    <Modal
      open={!!contact}
      onCancel={onClose}
      footer={null}
      title="Детали контакта"
    >
      <div style={{ textAlign: "center" }}>
        <img
          src={contact.avatar}
          alt="avatar"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 20,
          }}
        />
        <p><strong>Имя:</strong> {contact.firstName}</p>
        <p><strong>Фамилия:</strong> {contact.lastName}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Телефон:</strong> {contact.phone}</p>
        <p><strong>Дата создания:</strong> {new Date(contact.createdAt).toLocaleString()}</p>
      </div>
    </Modal>
  );
};

export default ContactDetailModal;
