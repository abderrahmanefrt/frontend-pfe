import React from "react";
import { Link } from "react-router-dom";
import ListGroup, { ListGroupItem } from "./ListGroup";
import StarRating from "./StarRating";

interface DoctorCardProps {
  doctorInfo: ListGroupItem[];
  doctorId: number; // Ensure we pass the doctor's ID as a prop
  doctorName: string;
  rating?: number; // Optional rating prop (defaults to 0 if not provided)
}
const DoctorCard = ({
  doctorInfo,
  doctorId,
  doctorName,
  rating = 0,
}: DoctorCardProps) => {
  const handleSelectedItem = (item: ListGroupItem) => {
    console.log(item);
  };

  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <img src="..." className="card-img-top" alt={doctorName} />
        <div className="card-body">
          <h5 className="card-title">{doctorName}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            Card subtitle
          </h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <ListGroup
            items={doctorInfo}
            heading="Doctor Information"
            onSelectItem={handleSelectedItem}
          />
          {/* StarRating component integrated here */}
          <div className="mt-2 d-flex justify-content-center">
            <StarRating
              value={rating}
              onRate={(newRating) => console.log("New rating:", newRating)}
              readOnly
            />
          </div>
          <hr />

          <div className="d-flex justify-content-center">
            {/* Link to the detailed DoctorProfile page */}
            <Link to={`/doctor/${doctorId}`} className="btn btn-primary">
              View Profile
            </Link>
          </div>

          <hr />

          <div className="d-flex justify-content-center">
            <button className="btn btn-outline-success">
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorCard;
