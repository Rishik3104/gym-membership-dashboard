// src/components/EditMember.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Member {
  _id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  membershipStartDate: string;
  membershipExpiryDate: string;
  paymentStatus: string;
  notes?: string;
}

interface EditMemberProps {
  memberId: string;
  onClose: () => void;
}

const EditMember: React.FC<EditMemberProps> = ({ memberId, onClose }) => {
  const [member, setMember] = useState<Member>({
    _id: '',
    fullName: '',
    contactNumber: '',
    email: '',
    membershipStartDate: '',
    membershipExpiryDate: '',
    paymentStatus: 'Paid',
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/members/${memberId}`);
        setMember(response.data);
      } catch (error) {
        console.error('Error fetching member:', error);
        alert('Failed to fetch member.');
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/members/${memberId}`, member);
      console.log(response.data);
      alert('Member updated successfully!');
      onClose(); // Close the form after updating
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member.');
    }
  };

  return (
    <div className="edit-member-container">
      <h2>Edit Member</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={member.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={member.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Membership Start Date</label>
          <input
            type="date"
            name="membershipStartDate"
            value={member.membershipStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Membership Expiry Date</label>
          <input
            type="date"
            name="membershipExpiryDate"
            value={member.membershipExpiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Status</label>
          <select
            name="paymentStatus"
            value={member.paymentStatus}
            onChange={handleChange}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={member.notes || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button">Update Member</button>
        <button type="button" className="button cancel" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditMember;
