class AppointmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'appointment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "patient_id_c" } },
          { field: { Name: "doctor_id_c" } }
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
        console.error("Error fetching appointments:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching appointments:", error.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "patient_id_c" } },
          { field: { Name: "doctor_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching appointment with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching appointment with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(appointmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: appointmentData.Name || appointmentData.name || "Appointment",
          Tags: appointmentData.Tags || "",
          date_c: appointmentData.date_c || appointmentData.date,
          time_c: appointmentData.time_c || appointmentData.time,
          duration_c: parseInt(appointmentData.duration_c || appointmentData.duration || 30),
          type_c: appointmentData.type_c || appointmentData.type,
          status_c: appointmentData.status_c || appointmentData.status || "scheduled",
          notes_c: appointmentData.notes_c || appointmentData.notes || "",
          patient_id_c: parseInt(appointmentData.patient_id_c || appointmentData.patientId),
          doctor_id_c: parseInt(appointmentData.doctor_id_c || appointmentData.doctorId)
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
          console.error(`Failed to create appointment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create appointment record");
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating appointment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating appointment:", error.message);
        throw error;
      }
    }
  }

  async update(id, appointmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: appointmentData.Name || appointmentData.name || "Appointment",
          Tags: appointmentData.Tags || "",
          date_c: appointmentData.date_c || appointmentData.date,
          time_c: appointmentData.time_c || appointmentData.time,
          duration_c: appointmentData.duration_c ? parseInt(appointmentData.duration_c) : (appointmentData.duration ? parseInt(appointmentData.duration) : undefined),
          type_c: appointmentData.type_c || appointmentData.type,
          status_c: appointmentData.status_c || appointmentData.status,
          notes_c: appointmentData.notes_c || appointmentData.notes,
          patient_id_c: appointmentData.patient_id_c ? parseInt(appointmentData.patient_id_c) : (appointmentData.patientId ? parseInt(appointmentData.patientId) : undefined),
          doctor_id_c: appointmentData.doctor_id_c ? parseInt(appointmentData.doctor_id_c) : (appointmentData.doctorId ? parseInt(appointmentData.doctorId) : undefined)
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
          console.error(`Failed to update appointment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update appointment record");
        }
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating appointment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating appointment:", error.message);
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
          console.error(`Failed to delete appointment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete appointment record");
        }
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting appointment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting appointment:", error.message);
        throw error;
      }
    }
  }
}

export const appointmentService = new AppointmentService();