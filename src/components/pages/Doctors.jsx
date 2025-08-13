import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { doctorService } from "@/services/api/doctorService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [doctorsData, appointmentsData] = await Promise.all([
        doctorService.getAll(),
        appointmentService.getAll()
      ]);

      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

const getDoctorAppointments = (doctorId) => {
    return appointments.filter(apt => (apt.doctor_id_c?.Id || apt.doctor_id_c || apt.doctorId) === doctorId);
  };

  const getTodayAppointments = (doctorId) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      (apt.doctor_id_c?.Id || apt.doctor_id_c || apt.doctorId) === doctorId && 
      (apt.date_c || apt.date) === today);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles and availability</p>
        </div>
      </div>

      {doctors.length === 0 ? (
        <Empty
          title="No doctors registered"
          description="No doctors have been added to the system yet."
          icon="UserCheck"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const totalAppointments = getDoctorAppointments(doctor.Id).length;
            const todayAppointments = getTodayAppointments(doctor.Id);
            
            return (
              <div key={doctor.Id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" className="h-6 w-6 text-primary" />
                    </div>
                    <div>
<h3 className="text-lg font-semibold text-gray-900">Dr. {doctor.Name || doctor.name}</h3>
                      <Badge variant="primary">{doctor.specialization_c || doctor.specialization}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.email_c || doctor.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.phone_c || doctor.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                    <p className="text-sm text-gray-500">Total Appointments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
                    <p className="text-sm text-gray-500">Today's Schedule</p>
                  </div>
                </div>

{(doctor.availability_c || doctor.availability) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const availability = doctor.availability_c || doctor.availability;
                        const availabilityObj = typeof availability === 'string' ? 
                          JSON.parse(availability || '{}') : availability;
                        return Object.entries(availabilityObj).map(([day, hours]) => (
                          hours && (
                            <Badge key={day} variant="outline">
                              {day}: {hours}
                            </Badge>
                          )
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Doctors;