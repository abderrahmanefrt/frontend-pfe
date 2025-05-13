import React from "react";
import { Link } from "react-router-dom";
import ListGroup, { ListGroupItem } from "./ListGroup";
import StarRating from "./StarRating";

interface DoctorCardProps {
  doctorInfo: ListGroupItem[];
  doctorId: number;
  doctorName: string;
  photo?: string;
  rating?: number;
  onScheduleClick?: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctorInfo,
  doctorId,
  doctorName,
  photo,
  rating = 0,
  onScheduleClick
}) => {
  const handleSelectedItem = (item: ListGroupItem) => {
    console.log(item);
  };

  const handleScheduleClick = () => {
    if (onScheduleClick) {
      onScheduleClick(doctorId);
    }
  };

  return (
    <div className="card h-100">
      <img
  src={
    photo
      ? `${import.meta.env.VITE_API_URL}/${photo.replace(/\\/g, '/')}`
      : "/doctor-placeholder.jpg"
  }
  className="card-img-top"
  alt={doctorName}
  style={{ height: "200px", objectFit: "cover", borderRadius: "8px" }}
/>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{doctorName}</h5>
        <ListGroup
          items={doctorInfo}
          heading="Doctor Information"
          onSelectItem={handleSelectedItem}
        />

        <div className="mt-2 mb-3 d-flex justify-content-center">
          <StarRating
            value={rating}
            onRate={(newRating) => console.log("New rating:", newRating)}
            readOnly
          />
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
          <Link to={`/users/doctor/${doctorId}`} className="btn btn-primary">
  View Profile
</Link>


            <Link 
  to={`/appointments/${doctorId}`} 
  className="btn btn-outline-success"
>
  Schedule Appointment
</Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;