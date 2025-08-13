import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AppointmentForm from "@/components/organisms/AppointmentForm";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      await appointmentService.create(appointmentData);
      await loadData();
      setShowForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      await appointmentService.update(editingAppointment.Id, appointmentData);
      await loadData();
      setEditingAppointment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      await loadData();
      toast.success("Appointment status updated successfully!");
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      await appointmentService.delete(appointmentId);
      await loadData();
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

const getPatientById = (id) => patients.find(p => p.Id === id);
  const getDoctorById = (id) => doctors.find(d => d.Id === id);

  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter === "all") return true;
    return appointment.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled": return "scheduled";
      case "in-progress": return "in-progress";
      case "completed": return "completed";
      case "cancelled": return "cancelled";
      default: return "default";
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon="Plus">
          New Appointment
        </Button>
      </div>

      {(showForm || editingAppointment) && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingAppointment ? "Edit Appointment" : "Schedule New Appointment"}
            </h2>
            <p className="text-gray-600 mt-1">
              {editingAppointment ? "Update appointment details" : "Create a new appointment for a patient"}
            </p>
          </div>
          <AppointmentForm
            appointment={editingAppointment}
            onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
            onCancel={() => {
              setShowForm(false);
              setEditingAppointment(null);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <Empty
            title="No appointments found"
            description={statusFilter === "all" ? 
              "No appointments have been scheduled yet. Create your first appointment to get started." :
              `No ${statusFilter} appointments found.`
            }
            action={statusFilter === "all" ? {
              label: "Schedule Appointment",
              onClick: () => setShowForm(true),
              icon: "Plus"
            } : undefined}
            icon="Calendar"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
{filteredAppointments.map((appointment) => {
                  const patient = getPatientById(appointment.patient_id_c?.Id || appointment.patient_id_c);
                  const doctor = getDoctorById(appointment.doctor_id_c?.Id || appointment.doctor_id_c);
                  
                  return (
                    <tr key={appointment.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{patient?.Name || patient?.name}</div>
                          <div className="text-sm text-gray-500">{patient?.medical_id_c || patient?.medicalId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">Dr. {doctor?.Name || doctor?.name}</div>
                          <div className="text-sm text-gray-500">{doctor?.specialization_c || doctor?.specialization}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {format(new Date(appointment.date_c || appointment.date), "MMM dd, yyyy")}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.time_c || appointment.time} ({appointment.duration_c || appointment.duration} min)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{appointment.type_c || appointment.type}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusColor(appointment.status_c || appointment.status)}>
                          {appointment.status_c || appointment.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingAppointment(appointment)}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Edit2" className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAppointment(appointment.Id)}
                            className="p-2 text-gray-600 hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </button>
                          {(appointment.status_c || appointment.status) === "scheduled" && (
                            <button
                              onClick={() => handleStatusChange(appointment.Id, "in-progress")}
                              className="px-3 py-1 text-xs bg-warning text-white rounded-full hover:bg-yellow-600 transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {(appointment.status_c || appointment.status) === "in-progress" && (
                            <button
                              onClick={() => handleStatusChange(appointment.Id, "completed")}
                              className="px-3 py-1 text-xs bg-success text-white rounded-full hover:bg-green-600 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;