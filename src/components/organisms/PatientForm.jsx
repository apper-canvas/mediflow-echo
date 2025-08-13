import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const PatientForm = ({ patient = null, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: patient?.name || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "Male",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    allergies: patient?.allergies || [],
    currentMedications: patient?.currentMedications?.join(", ") || "",
    emergencyContactName: patient?.emergencyContact?.name || "",
    emergencyContactPhone: patient?.emergencyContact?.phone || "",
    emergencyContactRelation: patient?.emergencyContact?.relation || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dateOfBirth || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const patientData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(",").map(item => item.trim()) : [],
        currentMedications: formData.currentMedications ? formData.currentMedications.split(",").map(item => item.trim()) : [],
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation
        },
        medicalId: patient?.medicalId || `MED${Date.now()}`
      };

      await onSubmit(patientData);
      toast.success(patient ? "Patient updated successfully!" : "Patient registered successfully!");
    } catch (error) {
      toast.error("Failed to save patient information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        
        <Input
          label="Date of Birth *"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          required
        />

        <div>
          <label className="form-label">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="form-input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Phone Number *"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

<div className="space-y-4">
        <div>
          <label className="form-label">Allergies</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {[
              "Penicillin",
              "Shellfish", 
              "Latex",
              "Peanuts",
              "Sulfa drugs",
              "Iodine",
              "Codeine",
              "Morphine",
              "Contrast dye"
            ].map((allergy) => (
              <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={(e) => {
                    const newAllergies = e.target.checked
                      ? [...formData.allergies, allergy]
                      : formData.allergies.filter(a => a !== allergy);
                    handleChange("allergies", newAllergies);
                  }}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-700">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Current Medications (comma separated)"
          value={formData.currentMedications}
          onChange={(e) => handleChange("currentMedications", e.target.value)}
          placeholder="Aspirin, Metformin, etc."
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Contact Name"
            value={formData.emergencyContactName}
            onChange={(e) => handleChange("emergencyContactName", e.target.value)}
          />
          
          <Input
            label="Contact Phone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
          />
          
          <Input
            label="Relationship"
            value={formData.emergencyContactRelation}
            onChange={(e) => handleChange("emergencyContactRelation", e.target.value)}
            placeholder="Spouse, Parent, etc."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {patient ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;