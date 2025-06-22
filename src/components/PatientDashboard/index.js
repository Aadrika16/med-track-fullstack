import React, { useState, useEffect,useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"
import MedicationTracker from "../MedicationTracker";
import "./index.css";

const PatientDashboard = () => {
  const { userId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [medications, setMedications] = useState([]);

  const dateKey = selectedDate.toISOString().split("T")[0];
  const isToday = new Date().toDateString() === selectedDate.toDateString();
  const isTaken = medicationLogs.some(log => log.date_taken === dateKey);

  // ✅ Define fetchLogs BEFORE useEffect or usage
   const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/medication_logs/${userId}`);
      const data = await res.json();
      setMedicationLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  }, [userId]);
  const fetchMedications = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/medications/${userId}`);
      const data = await res.json();
      setMedications(data);
    } catch (err) {
      console.error("Failed to fetch medications", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchLogs();
    fetchMedications();
  }, [fetchLogs, fetchMedications]);

  // ✅ Use both functions after declaration
  

  const handleMarkTaken = async (date , medicationId , image) => {
    try { 
      const jwtToken = Cookies.get("jwt_token");
      const res = await fetch("https://med-track-backend.onrender.com/medication_logs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ user_id: userId, medication_id:medicationId , date_taken: dateKey })
      });
      if (res.ok) {
        await fetchLogs(); // ✅ Will work now
      } else {
        const err = await res.json();
        alert(err.message || "Failed to mark as taken");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="greeting-banner">
        <div>
          <h2>Welcome Back! </h2>
          <p>Let's stay consistent with your meds 🌿</p>
        </div>
        <div className="today-status">
          <span>{isTaken ? "✅ Taken" : "⚠️ Missed"}</span>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="left-panel">
          <h3>Track Medication</h3>
          <MedicationTracker
            date={dateKey}
            isTaken={isTaken}
            isToday={isToday}
            onMarkTaken={handleMarkTaken}
            medications={medications} 
            userId={userId}
          />
        </div>

        <div className="right-panel">
          <h3>Select Date</h3>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />

          <h4 className="log-title">Medication Logs</h4>
          <ul className="log-list">
            {medications.length === 0 && <li>No medications found</li>}
            {medications.map((med, index) => {
              const taken = medicationLogs.some(log => log.medication_name === med.name && log.date_taken === dateKey);
              return (
                <li key={index} className={taken ? "log-taken" : "log-missed"}>
                  {med.name} / {med.dosage} / {med.frequency} - {taken ? "Taken" : "Not Taken"}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
