import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaRegStar, FaFilter } from 'react-icons/fa';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import '../styles/global.css';

const DoctorPage = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterSpecialty, setFilterSpecialty] = useState('All');

    // Mock doctors data
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Addiction Specialist',
            experience: 10,
            rating: 4.8,
            reviews: 124,
            location: 'New York Medical Center',
            available: ['Monday', 'Wednesday', 'Friday'],
            imageUrl: 'https://randomuser.me/api/portraits/women/76.jpg',
            about: 'Dr. Sarah Johnson is a board-certified addiction specialist with over 10 years of experience helping patients overcome substance dependence, including tobacco addiction. She specializes in holistic approaches combining medication and behavioral therapy.'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Pulmonologist',
            experience: 15,
            rating: 4.5,
            reviews: 98,
            location: 'San Francisco Health Center',
            available: ['Tuesday', 'Thursday', 'Saturday'],
            imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
            about: 'Dr. Michael Chen is a pulmonologist with expertise in respiratory health and smoking-related conditions. With 15 years of experience, he helps patients improve lung function and manage the physical aspects of quitting smoking.'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Behavioral Therapist',
            experience: 8,
            rating: 4.9,
            reviews: 156,
            location: 'Chicago Wellness Center',
            available: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            imageUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
            about: 'Dr. Emily Rodriguez is a behavioral therapist specializing in addiction psychology. She helps patients understand the psychological aspects of smoking addiction and develops personalized strategies to break the habit.'
        },
        {
            id: 4,
            name: 'Dr. James Wilson',
            specialty: 'General Practitioner',
            experience: 12,
            rating: 4.6,
            reviews: 87,
            location: 'Boston Medical Group',
            available: ['Wednesday', 'Thursday', 'Saturday'],
            imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            about: 'Dr. James Wilson is a general practitioner with a focus on preventive care and smoking cessation. He provides comprehensive health assessments and tailored quitting plans based on individual health needs.'
        },
        {
            id: 5,
            name: 'Dr. Lisa Thompson',
            specialty: 'Addiction Specialist',
            experience: 14,
            rating: 4.7,
            reviews: 142,
            location: 'Seattle Health Partners',
            available: ['Monday', 'Wednesday', 'Friday'],
            imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
            about: 'Dr. Lisa Thompson is an addiction specialist who integrates traditional medical approaches with mindfulness techniques. She has helped hundreds of patients successfully quit smoking through her comprehensive approach.'
        }
    ];

    // Filtered doctors based on specialty
    const filteredDoctors = filterSpecialty === 'All'
        ? doctors
        : doctors.filter(doctor => doctor.specialty === filterSpecialty);

    // Get unique specialties for filter
    const specialties = ['All', ...new Set(doctors.map(doctor => doctor.specialty))];

    // Function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-warning" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-warning" />);
            }
        }
        return stars;
    };

    // Function to open doctor modal
    const openDoctorModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    return (
        <div className="doctor-page">
            <Header isLoggedIn={true} />
            <SecondaryNavigation />

            <main className="container py-6">
                <h1 className="mb-6">Consult with Our Doctors</h1>

                {/* Filter Section */}
                <div className="filter-section mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center">
                        <FaFilter className="mr-2 text-primary" />
                        <span className="font-semibold mr-4">Filter by Specialty:</span>
                        <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty, index) => (
                                <button
                                    key={index}
                                    onClick={() => setFilterSpecialty(specialty)}
                                    className={`btn ${filterSpecialty === specialty ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {specialty}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Doctors List */}
                <div className="doctors-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card bg-white p-6 rounded-lg shadow-md">
                            <div className="doctor-header flex items-start mb-4">
                                <div className="doctor-image mr-4">
                                    <img
                                        src={doctor.imageUrl}
                                        alt={doctor.name}
                                        className="rounded-full w-20 h-20 object-cover"
                                    />
                                </div>
                                <div className="doctor-info flex-1">
                                    <h2 className="doctor-name mb-1">{doctor.name}</h2>
                                    <div className="doctor-specialty mb-1 text-primary">{doctor.specialty}</div>
                                    <div className="doctor-experience mb-1">
                                        {doctor.experience} years of experience
                                    </div>
                                    <div className="doctor-rating flex items-center mb-1">
                                        <div className="stars flex mr-2">
                                            {renderStars(doctor.rating)}
                                        </div>
                                        <span className="rating-value">{doctor.rating}</span>
                                        <span className="reviews-count text-gray-500 ml-2">
                                            ({doctor.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="doctor-details mb-4">
                                <div className="location flex items-center mb-2">
                                    <FaMapMarkerAlt className="mr-2 text-primary" />
                                    <span>{doctor.location}</span>
                                </div>
                                <div className="availability flex items-start">
                                    <FaCalendarAlt className="mr-2 text-primary mt-1" />
                                    <div>
                                        <div className="mb-1 font-semibold">Available on:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.available.map((day, index) => (
                                                <span key={index} className="availability-badge">
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="doctor-actions flex gap-2">
                                <button
                                    className="btn btn-primary flex-1"
                                    onClick={() => openDoctorModal(doctor)}
                                >
                                    View Profile
                                </button>
                                <button className="btn btn-outline flex-1">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Doctor Modal */}
            {showModal && selectedDoctor && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>

                        <div className="doctor-modal p-6">
                            <div className="doctor-modal-header flex items-center mb-6">
                                <img
                                    src={selectedDoctor.imageUrl}
                                    alt={selectedDoctor.name}
                                    className="rounded-full w-24 h-24 object-cover mr-4"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{selectedDoctor.name}</h2>
                                    <div className="text-primary font-semibold mb-1">
                                        {selectedDoctor.specialty}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="stars flex mr-2">
                                            {renderStars(selectedDoctor.rating)}
                                        </div>
                                        <span className="rating-value">{selectedDoctor.rating}</span>
                                        <span className="reviews-count text-gray-500 ml-2">
                                            ({selectedDoctor.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="doctor-modal-body mb-6">
                                <h3 className="text-xl font-semibold mb-2">About</h3>
                                <p className="mb-4">{selectedDoctor.about}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="info-item">
                                        <div className="font-semibold mb-1">Location</div>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-primary" />
                                            <span>{selectedDoctor.location}</span>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="font-semibold mb-1">Experience</div>
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-primary" />
                                            <span>{selectedDoctor.experience} years</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="availability mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Availability</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDoctor.available.map((day, index) => (
                                            <div key={index} className="availability-item p-2 rounded bg-primary-light">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
                                <div className="booking-calendar bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="text-center mb-4">
                                        <FaCalendarAlt className="text-3xl text-primary mx-auto mb-2" />
                                        <p>Select a date and time for your consultation</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 font-semibold">Select Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold">Select Time</label>
                                            <select className="w-full p-2 border rounded">
                                                <option value="">Select a time slot</option>
                                                <option value="9:00">9:00 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="14:00">2:00 PM</option>
                                                <option value="15:00">3:00 PM</option>
                                                <option value="16:00">4:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="doctor-modal-footer flex justify-end">
                                <button className="btn btn-outline mr-2" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPage; 