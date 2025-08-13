class MedicalRecordService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'medical_record_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "patient_id_c" } },
          { field: { Name: "visit_date_c" } },
          { field: { Name: "diagnosis_c" } },
          { field: { Name: "treatment_c" } },
          { field: { Name: "doctor_id_c" } },
          { field: { Name: "medication_c" } },
          { field: { Name: "dosage_c" } },
          { field: { Name: "duration_c" } }
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
        console.error("Error fetching medical records:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching medical records:", error.message);
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
          { field: { Name: "patient_id_c" } },
          { field: { Name: "visit_date_c" } },
          { field: { Name: "diagnosis_c" } },
          { field: { Name: "treatment_c" } },
          { field: { Name: "doctor_id_c" } },
          { field: { Name: "medication_c" } },
          { field: { Name: "dosage_c" } },
          { field: { Name: "duration_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching medical record with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching medical record with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "patient_id_c" } },
          { field: { Name: "visit_date_c" } },
          { field: { Name: "diagnosis_c" } },
          { field: { Name: "treatment_c" } },
          { field: { Name: "doctor_id_c" } },
          { field: { Name: "medication_c" } },
          { field: { Name: "dosage_c" } },
          { field: { Name: "duration_c" } }
        ],
        where: [
          {
            FieldName: "patient_id_c",
            Operator: "EqualTo",
            Values: [parseInt(patientId)],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching medical records for patient ${patientId}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching medical records for patient ${patientId}:`, error.message);
        throw error;
      }
    }
  }

  async create(recordData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: recordData.Name || recordData.name || "Medical Record",
          Tags: recordData.Tags || "",
          patient_id_c: parseInt(recordData.patient_id_c || recordData.patientId),
          visit_date_c: recordData.visit_date_c || recordData.visitDate,
          diagnosis_c: recordData.diagnosis_c || recordData.diagnosis,
          treatment_c: recordData.treatment_c || recordData.treatment,
          doctor_id_c: parseInt(recordData.doctor_id_c || recordData.doctorId || 1),
          medication_c: recordData.medication_c || recordData.medication || 
            (recordData.prescriptions && recordData.prescriptions.length > 0 ? 
              recordData.prescriptions.map(p => p.medication).join(', ') : ""),
          dosage_c: recordData.dosage_c || recordData.dosage || 
            (recordData.prescriptions && recordData.prescriptions.length > 0 ? 
              recordData.prescriptions.map(p => p.dosage).join(', ') : ""),
          duration_c: recordData.duration_c || recordData.duration || 
            (recordData.prescriptions && recordData.prescriptions.length > 0 ? 
              recordData.prescriptions.map(p => p.duration).join(', ') : "")
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
          console.error(`Failed to create medical record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create medical record");
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating medical record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating medical record:", error.message);
        throw error;
      }
    }
  }

  async update(id, recordData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: recordData.Name || recordData.name || "Medical Record",
          Tags: recordData.Tags || "",
          patient_id_c: recordData.patient_id_c ? parseInt(recordData.patient_id_c) : (recordData.patientId ? parseInt(recordData.patientId) : undefined),
          visit_date_c: recordData.visit_date_c || recordData.visitDate,
          diagnosis_c: recordData.diagnosis_c || recordData.diagnosis,
          treatment_c: recordData.treatment_c || recordData.treatment,
          doctor_id_c: recordData.doctor_id_c ? parseInt(recordData.doctor_id_c) : (recordData.doctorId ? parseInt(recordData.doctorId) : undefined),
          medication_c: recordData.medication_c || recordData.medication,
          dosage_c: recordData.dosage_c || recordData.dosage,
          duration_c: recordData.duration_c || recordData.duration
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update medical record ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update medical record");
        }
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating medical record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating medical record:", error.message);
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
          console.error(`Failed to delete medical record ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete medical record");
        }
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting medical record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting medical record:", error.message);
        throw error;
      }
    }
  }

  async createPrescription(patientId, prescriptionData) {
    const recordData = {
      patientId: parseInt(patientId),
      visitDate: prescriptionData.visitDate || new Date().toISOString().split('T')[0],
      diagnosis: prescriptionData.diagnosis,
      treatment: prescriptionData.treatment,
      doctorId: prescriptionData.doctorId || 1,
      prescriptions: prescriptionData.prescriptions || []
    };

    return this.create(recordData);
  }

  async getCommonMedications() {
    // Return static common medications since we can't easily extract from database
    return [
      "Lisinopril", "Amlodipine", "Metformin", "Atorvastatin", "Omeprazole",
      "Levothyroxine", "Albuterol inhaler", "Prednisone", "Ibuprofen", 
      "Acetaminophen", "Amoxicillin", "Azithromycin", "Hydrochlorothiazide",
      "Losartan", "Gabapentin", "Sertraline", "Escitalopram", "Pantoprazole",
      "Vitamin D3", "Prenatal vitamins", "Aspirin", "Clopidogrel", "Warfarin",
      "Insulin", "Glipizide", "Furosemide", "Carvedilol", "Simvastatin"
    ].sort();
  }
}

export const medicalRecordService = new MedicalRecordService();