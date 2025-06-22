import React, { useState, useRef } from "react";
import './index.css';


const MedicationTracker = ({ date, isTaken, onMarkTaken, isToday, medications =[]}) => {
  const [selectedImages, setSelectedImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRefs = useRef({});

  const handleImageSelect = (event, medicationId) => {
    const file = event.target.files?.[0];
    console.log(medications)
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({ ...prev, [medicationId]: e.target?.result }));
        setSelectedImages((prev) => ({ ...prev, [medicationId]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkTaken = (medicationId) => {
    const selectedImage = selectedImages[medicationId];
    onMarkTaken(date, medicationId, selectedImage || undefined);
    setSelectedImages((prev) => ({ ...prev, [medicationId]: null }));
    setImagePreviews((prev) => ({ ...prev, [medicationId]: null }));
  };

  return (
    <div className="tracker-form">
      {medications.map((med, index) => (
        <div key={med.id} className="medication-card">
          <div className="medication-info">
            <div className="left">
              <div className="circle blue">{index + 1}</div>
              <div>
                <h4>{med.name}</h4>
                <p>{med.dosage} | {med.frequency}</p>
              </div>
            </div>
            <div className="badge">⏰ 8:00 AM</div>
          </div>

          <div className="upload-card">
            <div className="text-center">
              <div className="upload-icon">🖼️</div>
              <h3>Add Proof Photo (Optional)</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, med.id)}
                ref={(el) => (fileInputRefs.current[med.id] = el)}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRefs.current[med.id]?.click()}>
                {selectedImages[med.id] ? "Change Photo" : "Take Photo"}
              </button>

              {imagePreviews[med.id] && (
                <div className="preview">
                  <img src={imagePreviews[med.id]} alt="Preview" />
                  <p>Photo selected: {selectedImages[med.id]?.name}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleMarkTaken(med.id)}
            disabled={!isToday}
            className="submit-btn"
          >
            ✔ {isToday ? "Mark as Taken" : "Cannot mark future dates"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MedicationTracker;
