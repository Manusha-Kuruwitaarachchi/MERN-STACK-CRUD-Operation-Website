import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css'; // Import the CSS file for dashboard styling

function DashBoard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editData, setEditData] = useState({});
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Add this line

  useEffect(() => {
    fetchStudents();
  }, [confirmEdit, deleteSuccess]); // Fetch students again when confirmEdit or deleteSuccess changes

  const fetchStudents = () => {
    fetch('http://localhost:3001/show/students')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        return response.json();
      })
      .then(data => {
        setStudents(data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setError(error.message);
      });
  };

  const handleEdit = (index, student) => {
    setEditingIndex(index);
    // Deep clone the student object
    const clonedStudent = JSON.parse(JSON.stringify(student));
    setEditData(clonedStudent);
  };

  const handleSave = async () => {
    if (!confirmEdit && !window.confirm('Are you sure you want to save changes?')) {
      return; // Do not save changes if user cancels confirmation
    }

    try {
      const response = await fetch(`http://localhost:3001/update/student/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      setEditingIndex(-1);
      setConfirmEdit(false);
      setSuccessMessage('Student successfully updated');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
      fetchStudents(); // Fetch students again to reflect changes instantly
    } catch (error) {
      console.error('Error updating student:', error);
      setError(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // Handle file upload
  };

  const handleConfirmEdit = () => {
    setConfirmEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:3001/delete/student/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        // Remove the deleted student from the list
        setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        setSuccessMessage('Student successfully deleted');
        setDeleteSuccess(true);
        setTimeout(() => {
          setSuccessMessage('');
          setDeleteSuccess(false);
        }, 3000); // Clear success message after 3 seconds
      } catch (error) {
        console.error('Error deleting student:', error);
        setError(error.message);
      }
    }
  };

  const handleSignout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className='w-50 bg-white rounded p-3'>
        <div className="d-flex justify-content-between mb-3">
          <Link to="/createUser" className="btn btn-success">ADD</Link>
          <button onClick={handleSignout} className="btn btn-danger">Sign Out</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{student._id}</td>
                <td>
                  {editingIndex === index ? (
                    <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                  ) : (
                    student.name
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                  ) : (
                    student.email
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <div>
                      <input type="file" onChange={handleImageChange} />
                      <img src={`data:image/jpeg;base64,${editData.image}`} alt="Student Avatar" onClick={handleImageChange} className="dashboard-image" />
                    </div>
                  ) : (
                    <img src={`data:image/jpeg;base64,${student.image}`} alt="Student Avatar" className="dashboard-image" />
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    student.status
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <div>
                      <button onClick={handleSave}>Save</button>
                      {confirmEdit && (
                        <div>
                          Are you sure you want to save changes?
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => handleEdit(index, student)}>Edit</button>
                      <button onClick={() => handleDelete(student._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {successMessage && <div className={`alert ${deleteSuccess ? 'alert-danger' : 'alert-success'}`}>{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default DashBoard;
