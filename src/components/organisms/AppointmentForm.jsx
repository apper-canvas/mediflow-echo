import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";

const AppointmentForm = ({ appointment = null, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    patientId: appointment?.patient_id_c?.Id || appointment?.patient_id_c || appointment?.patientId || "",
    doctorId: appointment?.doctor_id_c?.Id || appointment?.doctor_id_c || appointment?.doctorId || "",
    date: appointment?.date_c || appointment?.date || "",
    time: appointment?.time_c || appointment?.time || "",
    duration: appointment?.duration_c || appointment?.duration || 30,
    type: appointment?.type_c || appointment?.type || "Consultation",
    notes: appointment?.notes_c || appointment?.notes || ""
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        duration: parseInt(formData.duration),
        status: appointment?.status || "scheduled"
      });
      toast.success(appointment ? "Appointment updated successfully!" : "Appointment scheduled successfully!");
    } catch (error) {
      toast.error("Failed to save appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Patient *</label>
          <select
            value={formData.patientId}
            onChange={(e) => handleChange("patientId", e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select a patient</option>
{patients.map((patient) => (
              <option key={patient.Id} value={patient.Id}>
                {patient.Name || patient.name} - {patient.medical_id_c || patient.medicalId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Doctor</label>
          <select
            value={formData.doctorId}
            onChange={(e) => handleChange("doctorId", e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.Id} value={doctor.Id}>
                Dr. {doctor.Name || doctor.name} - {doctor.specialization_c || doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Date *"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label="Time *"
          type="time"
          value={formData.time}
          onChange={(e) => handleChange("time", e.target.value)}
          required
        />

        <Input
          label="Duration (minutes)"
          type="number"
          value={formData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          min="15"
          max="120"
          step="15"
        />

        <div>
          <label className="form-label">Appointment Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="form-input"
          >
            <option value="Consultation">Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Check-up">Check-up</option>
            <option value="Emergency">Emergency</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          className="form-input resize-none"
          placeholder="Additional notes or instructions..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {appointment ? "Update Appointment" : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;