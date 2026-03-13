import React from "react";
import "../styles/about.css";
import family from "../images/family.png";
import Footer from "../components/Footer";
import team1 from "../images/blood.jpg";
import team2 from "../images/blood.jpg";
import team3 from "../images/blood.jpg";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-content">
          <span className="subtitle">Our Mission</span>
          <h1>Empowering Families Through Genetic Clarity</h1>
          <p>
            Lebanon Gene is committed to reducing the impact of Sickle Cell Disease through 
            innovative screening tools and community-driven education.
          </p>
        </div>
      </section>
      </div>

      {/* OVERLAPPING PURPOSE SECTION */}
      <section className="section overlap-section">
        <div className="section-image main-img">
          <img src={family} alt="Genetic Research" />
        </div>
        <div className="section-text card-effect">
          <span className="section-label">Our Purpose</span>
          <h2>A Vision for a Healthier Lebanon</h2>
          <p>
            Sickle Cell Disease (SCD) affects thousands of families across Lebanon. 
            Our platform bridges the gap between complex genetic data and family planning.
          </p>
          <p>
            By providing accessible, data-driven probability mapping, we empower 
            parents to make the most informed decisions for their future children.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <img src={team1} alt="Researcher 1" />
            <h4>Dr. Ali Nader</h4>
            <p>Genetic Researcher</p>
          </div>
          <div className="team-card">
            <img src={team2} alt="Researcher 2" />
            <h4>Dr. Leila Saab</h4>
            <p>Medical Consultant</p>
          </div>
          <div className="team-card">
            <img src={team3} alt="Researcher 3" />
            <h4>Samir Fares</h4>
            <p>Data Analyst</p>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  );
}

export default About;