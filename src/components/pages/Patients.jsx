import React, { useState, useEffect } from "react";
import PatientCard from "@/components/molecules/PatientCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import PatientForm from "@/components/organisms/PatientForm";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const loadPatients = async () => {
    try {
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

const filtered = patients.filter(patient =>
      (patient.Name || patient.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone_c || patient.phone || "").includes(searchTerm) ||
      (patient.medical_id_c || patient.medicalId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email_c || patient.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleCreatePatient = async (patientData) => {
    try {
      await patientService.create(patientData);
      await loadPatients();
      setShowForm(false);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon="Plus">
          New Patient
        </Button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Register New Patient</h2>
            <p className="text-gray-600 mt-1">Enter patient information to create a new record</p>
          </div>
          <PatientForm
            onSubmit={handleCreatePatient}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search patients by name, phone, ID, or email..."
                />
              </div>
            </div>

            {filteredPatients.length === 0 ? (
              searchTerm ? (
                <Empty
                  title="No patients found"
                  description={`No patients match your search for "${searchTerm}"`}
                  icon="Search"
                />
              ) : (
                <Empty
                  title="No patients registered"
                  description="Start by registering your first patient to begin managing medical records."
                  action={{
                    label: "Register Patient",
                    onClick: () => setShowForm(true),
                    icon: "Plus"
                  }}
                  icon="Users"
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.Id} patient={patient} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Patients;