import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/patients/${patient.Id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="card hover:shadow-elevated cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-6 w-6 text-primary" />
          </div>
          <div>
<h3 className="text-lg font-semibold text-gray-900">{patient.Name || patient.name}</h3>
            <p className="text-sm text-gray-500">ID: {patient.medical_id_c || patient.medicalId}</p>
          </div>
        </div>
        <Badge variant="primary">{patient.gender_c || patient.gender}</Badge>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          <span>Born: {format(new Date(patient.date_of_birth_c || patient.dateOfBirth), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
          <span>{patient.phone_c || patient.phone}</span>
        </div>
        {(() => {
          const allergies = patient.allergies_c || patient.allergies;
          const allergyArray = allergies ? 
            (typeof allergies === 'string' ? allergies.split(',').map(a => a.trim()) : allergies) : 
            [];
          return allergyArray.length > 0 && (
            <div className="flex items-start text-gray-600">
              <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-2 mt-0.5 text-warning" />
              <span>Allergies: {allergyArray.join(", ")}</span>
            </div>
          );
        })()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
          <span>Last visit: 2 days ago</span>
        </div>
        <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default PatientCard;