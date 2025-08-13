import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const AppointmentCard = ({ appointment, patient, doctor, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled": return "scheduled";
      case "in-progress": return "in-progress";
      case "completed": return "completed";
      case "cancelled": return "cancelled";
      default: return "default";
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-5 w-5 text-primary" />
          </div>
          <div>
<h3 className="font-semibold text-gray-900">{patient?.Name || patient?.name}</h3>
            <p className="text-sm text-gray-500">{appointment.type_c || appointment.type}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(appointment.status_c || appointment.status)}>
          {appointment.status_c || appointment.status}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
          <span>{appointment.time_c || appointment.time} ({appointment.duration_c || appointment.duration} min)</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="User2" className="h-4 w-4 mr-2" />
          <span>Dr. {doctor?.Name || doctor?.name}</span>
        </div>
        {(appointment.notes_c || appointment.notes) && (
          <div className="flex items-start">
            <ApperIcon name="FileText" className="h-4 w-4 mr-2 mt-0.5" />
            <span>{appointment.notes_c || appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {appointment.status === "scheduled" && (
          <>
            <Button 
              size="sm" 
              variant="primary"
onClick={() => onStatusChange(appointment.Id, "in-progress")}
            >
              Start
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusChange(appointment.Id, "cancelled")}
            >
              Cancel
            </Button>
          </>
        )}
        {(appointment.status_c || appointment.status) === "in-progress" && (
          <Button 
            size="sm" 
            variant="success"
            onClick={() => onStatusChange(appointment.Id, "completed")}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;