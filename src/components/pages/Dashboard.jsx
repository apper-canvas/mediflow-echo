import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format, isToday } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);

      setPatients(patientsData);
      setDoctors(doctorsData);

      // Filter today's appointments
const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsData.filter(apt => (apt.date_c || apt.date) === today);
      setTodayAppointments(todayAppts);

// Calculate stats
      const inProgressCount = todayAppts.filter(apt => (apt.status_c || apt.status) === "in-progress").length;
      const completedCount = todayAppts.filter(apt => (apt.status_c || apt.status) === "completed").length;

      setStats({
        totalPatients: patientsData.length,
        todayAppointments: todayAppts.length,
        inProgress: inProgressCount,
        completed: completedCount
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      await loadDashboardData();
      toast.success("Appointment status updated successfully!");
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const getPatientById = (id) => patients.find(p => p.Id === id);
  const getDoctorById = (id) => doctors.find(d => d.Id === id);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          color="info"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Completed Today"
          value={stats.completed}
          icon="CheckCircle"
          color="success"
        />
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
          <span className="text-sm text-gray-500">
            {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </span>
        </div>

        {todayAppointments.length === 0 ? (
          <Empty
            title="No appointments today"
            description="You have no appointments scheduled for today. Enjoy your day!"
            icon="Calendar"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                patient={getPatientById(appointment.patient_id_c?.Id || appointment.patient_id_c)}
                doctor={getDoctorById(appointment.doctor_id_c?.Id || appointment.doctor_id_c)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;