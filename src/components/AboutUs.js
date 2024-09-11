// src/components/AboutUs.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <motion.div
        className="max-w-5xl bg-white p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">About MITS</h1>

        {/* Introduction */}
        <p className="text-lg text-textColor mb-6">
          <strong>Madanapalle Institute of Technology & Science (MITS)</strong> is an autonomous institution established in 1998 under the auspices of the Ratakonda Ranga Reddy Educational Academy, located in the serene environment of Madanapalle, Andhra Pradesh. 
          MITS is approved by the All India Council for Technical Education (AICTE), New Delhi, and is accredited by the National Assessment and Accreditation Council (NAAC).
        </p>

        {/* Vision */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-primary mb-3">Vision</h2>
          <p className="text-lg text-textColor">
            To become a globally recognized research and academic institution and thereby contribute to technological and socio-economic development at the global level.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-primary mb-3">Mission</h2>
          <p className="text-lg text-textColor">
            - To provide state-of-the-art infrastructural facilities that aid in the academic growth and development of the institution. <br />
            - To offer educational programs that lead to the successful professional careers of students in engineering, management, and other fields. <br />
            - To instill ethical values and contribute to the betterment of society by offering technologically sound graduates.
          </p>
        </div>

        {/* History */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-primary mb-3">History</h2>
          <p className="text-lg text-textColor">
            MITS was founded in 1998 under the Ratakonda Ranga Reddy Educational Academy to provide quality education in engineering and technology. Over the years, MITS has grown to become a premier institution in Andhra Pradesh with autonomous status, state-of-the-art facilities, and highly qualified faculty.
          </p>
        </div>

        {/* Affiliations */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-primary mb-3">Affiliations and Accreditations</h2>
          <p className="text-lg text-textColor">
            - Affiliated with Jawaharlal Nehru Technological University, Anantapur (JNTUA). <br />
            - Accredited by NAAC with an ‘A’ grade. <br />
            - Recognized by AICTE and UGC for its quality education and research facilities.
          </p>
        </div>

        {/* Infrastructure */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-primary mb-3">State-of-the-Art Infrastructure</h2>
          <p className="text-lg text-textColor">
            MITS is equipped with modern labs, a well-stocked library, and excellent infrastructure for both academic and extracurricular activities. The institution constantly upgrades its facilities to stay on par with the latest trends and developments in education.
          </p>
        </div>

        {/* Conclusion */}
        <div>
          <p className="text-lg text-textColor">
            With a strong focus on research, innovation, and student-centric development, MITS continues to strive towards its vision of being a globally recognized institution, contributing to technological and socio-economic advancements.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
