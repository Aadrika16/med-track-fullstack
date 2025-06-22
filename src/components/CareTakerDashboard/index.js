import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './index.css';

const CaretakerDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://med-track-backend.onrender.com/users')
      .then(res => res.json())
      .then(data => {
        const patientList = data.filter(p => p.role === 'patient');
        setPatients(patientList);
      })
      .catch(err => {
        console.error('Failed to fetch users', err);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(p =>
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient); // reset on new patient selection
    fetch(`https://med-track-backend.onrender.com/medication_logs/${patient.id}`)
      .then(res => res.json())
      .then(data => setMedicationLogs(data))
      .catch(err => console.error('Failed to fetch medication logs', err));
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const jwtToken = Cookies.get("jwt_token");
      const res = await fetch('https://med-track-backend.onrender.com/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          user_id: selectedPatient.id,
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency
        })
      });

      if (res.ok) {
        alert('Medication added successfully');
        setFormData({ name: '', dosage: '', frequency: '' });
        handleSelectPatient(selectedPatient); // refresh logs
         // show button
      } else {
        const errorData = await res.json();
        alert(errorData?.error || 'Failed to add medication');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const goToPatientDashboard = () => {
    if (selectedPatient) {
      navigate(`/patient-dashboard/${selectedPatient.id}`);
    }
  };

  return (
    <div className="caretaker-container">
      <header className="caretaker-header">
        <h1>Welcome, Caretaker</h1>
        <input
          type="text"
          placeholder="Search Patient by Username..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </header>

      <section className="dashboard-section">
        <div className="patient-list">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => handleSelectPatient(patient)}
            >
              <h3>{patient.username}</h3>
              <p>ID: {patient.id}</p>
            </div>
          ))}
        </div>

        {selectedPatient && (
          <div className="medication-panel">
            <h2>Add Medication for {selectedPatient.username}</h2>
            <form onSubmit={handleAddMedication} className="medication-form">
              <input
                type="text"
                placeholder="Medication Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Dosage"
                value={formData.dosage}
                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Frequency"
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                required
              />
              <button type="submit">Add Medication</button>
            </form>
              <button
                onClick={goToPatientDashboard}
                className="view-dashboard-btn"
                style={{ marginTop: '10px', backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
              >
                View Patient Dashboard
              </button>
            <h3>Medication Logs</h3>
            {medicationLogs.length === 0 ? (
              <p>No logs found.</p>
            ) : (
              <table className="medication-logs-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Medication</th>
                    <th>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {medicationLogs.map((log, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{log.medication_name}</td>
                      <td>{log.date_taken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CaretakerDashboard;
