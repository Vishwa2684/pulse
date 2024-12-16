import React from "react";
import Carousel from "./Carousel";
import dev1 from "../../assets/Team/Pranay.png";
import dev2 from "../../assets/Team/Rajesh.png";
import dev3 from "../../assets/Team/TarikAli.png";
import dev4 from "../../assets/Team/Viswa.png";
import dev5 from "../../assets/Team/Amit.png";
import "./Team.css"; // Assuming you have other styles here

const MeetTheTeam = () => {
  const developers = [
    {
      name: "PRANAY JUMBARTI",
      img: dev1,
      role: "Full-stack Developer The mastermind behind Pulse AI, Pranay is a full-stack developer with a love for learning and innovation.",
    },
    {
      name: "Charan Pagadala",
      img: dev2,
      role: "Frontend ReactJs Developer Helps to build a robust and scalable platform",
    },
    // {
    //   name: "TARIK ALI",
    //   img: dev3,
    //   role: "Backend Expert Excels at solving complex problems and streamlining data management.",
    // },
    {
      name: "Vishnu Tej",
      img: dev4,
      role: "Full-stack Developer Ensures that Pulse AI delivers a seamless user experience.",
    },
    {
      name: "AMIT KUMAR RAM",
      img: dev5,
      role: "Passionate graphic designer with a strong focus on UI/UX, currently responsible for designing the Pulse AI website.",
    },
  ];

  return (
    <div className="devs-main">
      <div className="meet-the-team-header">
        <span className="meet-word">MEET </span>
        <span className="the-word">THE </span>
        <span className="team-word">TEAM</span>
      </div>
      <Carousel items={developers} />
    </div>
  );
};

export default MeetTheTeam;
