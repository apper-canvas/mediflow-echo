class DoctorService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'doctor_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "specialization_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "availability_c" } }
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
        console.error("Error fetching doctors:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching doctors:", error.message);
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
          { field: { Name: "specialization_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "availability_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching doctor with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching doctor with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(doctorData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: doctorData.Name || doctorData.name,
          Tags: doctorData.Tags || "",
          specialization_c: doctorData.specialization_c || doctorData.specialization,
          email_c: doctorData.email_c || doctorData.email,
          phone_c: doctorData.phone_c || doctorData.phone,
          availability_c: typeof(doctorData.availability) === 'object' ? 
            JSON.stringify(doctorData.availability) : 
            (doctorData.availability_c || doctorData.availability || "")
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
          console.error(`Failed to create doctor ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create doctor record");
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating doctor:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating doctor:", error.message);
        throw error;
      }
    }
  }

  async update(id, doctorData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: doctorData.Name || doctorData.name,
          Tags: doctorData.Tags || "",
          specialization_c: doctorData.specialization_c || doctorData.specialization,
          email_c: doctorData.email_c || doctorData.email,
          phone_c: doctorData.phone_c || doctorData.phone,
          availability_c: typeof(doctorData.availability) === 'object' ? 
            JSON.stringify(doctorData.availability) : 
            (doctorData.availability_c || doctorData.availability || "")
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
          console.error(`Failed to update doctor ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update doctor record");
        }
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating doctor:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating doctor:", error.message);
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
          console.error(`Failed to delete doctor ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete doctor record");
        }
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting doctor:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting doctor:", error.message);
        throw error;
      }
    }
  }
}

export const doctorService = new DoctorService();