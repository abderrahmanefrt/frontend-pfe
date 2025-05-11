import React, { useState } from "react";
import { User } from "../context/AuthContext";

interface EditPatientProfileProps {
  initialData: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    image: string;
    biography: string;
  };
  onUpdate: (updatedUserData: Partial<User>) => void;
  onCancel: () => void;
}

const EditPatientProfile: React.FC<EditPatientProfileProps> = ({
  initialData,
  onUpdate,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstname" value={formData.firstname} onChange={handleChange} />
      <input name="lastname" value={formData.lastname} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="phone" value={formData.phone} onChange={handleChange} />
      <input name="image" value={formData.image} onChange={handleChange} />
      <textarea name="biography" value={formData.biography} onChange={handleChange} />
      <button type="submit">Update</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditPatientProfile;
