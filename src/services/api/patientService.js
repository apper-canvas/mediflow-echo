class PatientService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'patient_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "medical_id_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "current_medications_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relation_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching patients:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching patients:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "medical_id_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "current_medications_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relation_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching patient with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching patient with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(patientData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: patientData.Name || patientData.name,
          Tags: patientData.Tags || "",
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth,
          gender_c: patientData.gender_c || patientData.gender,
          phone_c: patientData.phone_c || patientData.phone,
          email_c: patientData.email_c || patientData.email,
          address_c: patientData.address_c || patientData.address,
          medical_id_c: patientData.medical_id_c || patientData.medicalId,
          allergies_c: Array.isArray(patientData.allergies) ? 
            patientData.allergies.join(',') : 
            (patientData.allergies_c || patientData.allergies || ""),
          current_medications_c: Array.isArray(patientData.currentMedications) ? 
            patientData.currentMedications.join(',') : 
            (patientData.current_medications_c || patientData.currentMedications || ""),
          emergency_contact_name_c: patientData.emergency_contact_name_c || 
            patientData.emergencyContact?.name || patientData.emergencyContactName || "",
          emergency_contact_phone_c: patientData.emergency_contact_phone_c || 
            patientData.emergencyContact?.phone || patientData.emergencyContactPhone || "",
          emergency_contact_relation_c: patientData.emergency_contact_relation_c || 
            patientData.emergencyContact?.relation || patientData.emergencyContactRelation || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create patient ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create patient record");
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating patient:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating patient:", error.message);
        throw error;
      }
    }
  }

  async update(id, patientData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: patientData.Name || patientData.name,
          Tags: patientData.Tags || "",
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth,
          gender_c: patientData.gender_c || patientData.gender,
          phone_c: patientData.phone_c || patientData.phone,
          email_c: patientData.email_c || patientData.email,
          address_c: patientData.address_c || patientData.address,
          medical_id_c: patientData.medical_id_c || patientData.medicalId,
          allergies_c: Array.isArray(patientData.allergies) ? 
            patientData.allergies.join(',') : 
            (patientData.allergies_c || patientData.allergies || ""),
          current_medications_c: Array.isArray(patientData.currentMedications) ? 
            patientData.currentMedications.join(',') : 
            (patientData.current_medications_c || patientData.currentMedications || ""),
          emergency_contact_name_c: patientData.emergency_contact_name_c || 
            patientData.emergencyContact?.name || patientData.emergencyContactName || "",
          emergency_contact_phone_c: patientData.emergency_contact_phone_c || 
            patientData.emergencyContact?.phone || patientData.emergencyContactPhone || "",
          emergency_contact_relation_c: patientData.emergency_contact_relation_c || 
            patientData.emergencyContact?.relation || patientData.emergencyContactRelation || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update patient ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update patient record");
        }
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating patient:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating patient:", error.message);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete patient ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete patient record");
        }
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting patient:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting patient:", error.message);
        throw error;
      }
    }
  }
}

export const patientService = new PatientService();