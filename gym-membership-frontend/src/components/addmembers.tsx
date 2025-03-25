// src/components/AddMember.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Member {
  fullName: string;
  contactNumber: string;
  email: string;
  membershipStartDate: string;
  membershipExpiryDate: string;
  paymentStatus: string;
  notes?: string;
}

const AddMember: React.FC = () => {
  const [member, setMember] = useState<Member>({
    fullName: '',
    contactNumber: '',
    email: '',
    membershipStartDate: '',
    membershipExpiryDate: '',
    paymentStatus: 'Paid',
    notes: '', // Initialize notes field
  });

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
      const response = await axios.post('http://localhost:5000/api/members/add', member);
      console.log(response.data);
      alert('Member added successfully!');
      setMember({
        fullName: '',
        contactNumber: '',
        email: '',
        membershipStartDate: '',
        membershipExpiryDate: '',
        paymentStatus: 'Paid',
        notes: '', // Reset notes field
      });
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member.');
    }
  };

  return (
    <div className="add-member-container">
      <h2>Add Member</h2>
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
        <button type="submit" className="button">Add Member</button>
      </form>
    </div>
  );
};

export default AddMember;
