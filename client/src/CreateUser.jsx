import React, { useState } from 'react';
import axios from 'axios';

function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null); // State to store the selected image file
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(); // Create a FormData object
    formData.append('name', name);
    formData.append('email', email);
    formData.append('status', status);
    formData.append('image', image); // Append the image file to the form data

    try {
      const response = await axios.post('http://localhost:3001/create/student', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
        },
      });
      setSuccessMessage('Student registered successfully'); // Set success message
      // Clear form fields and selected file
      setName('');
      setEmail('');
      setStatus('active');
      setImage(null);
      // Reset the file input field
      document.getElementById('image').value = ''; // Clear the selected file
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error registering student:', error);
    }
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Add Student</h2>
          {successMessage && <div className='alert alert-success'>{successMessage}</div>} {/* Display success message */}
          <div className='mb-2'>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' value={name} onChange={handleNameChange} placeholder='Enter Name' className='form-control' />
          </div>
          <div className='mb-2'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={handleEmailChange} placeholder='Enter Email' className='form-control' />
          </div>
          <div className='mb-2'>
            <label htmlFor='image'>Image</label>
            <input type='file' id='image' onChange={handleImageChange} accept='image/*' className='form-control' /> {/* Input field for image upload */}
          </div>
          <div className='mb-2'>
            <label htmlFor='status'>Status</label>
            <select id='status' value={status} onChange={handleStatusChange} className='form-control'>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
          <button type='submit' className='btn btn-success'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
