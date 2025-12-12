import React, { useState } from "react";
import "./Onboarding.css";

// Helper function to dynamically apply CSS classes and colors based on the slide index
const getSlideColors = (index) => {
  switch (index) {
    case 0: // Welcome to Voyloo (Purple/Pink - Step 1/5)
      return {
        buttonClass: "btn-primary",
        mainColor: "#7d3cff",
        titleGradient: "gradient-primary-title",
      };
    case 1: // Secure Document Vault (Green/Teal - Step 3/5)
      return {
        buttonClass: "btn-secondary",
        mainColor: "#00c897", 
        titleGradient: "gradient-secondary-title",
      };
    case 2: // Never Miss a Deadline (Red/Orange - Step 4/5)
      return {
        buttonClass: "btn-tertiary", 
        mainColor: "#ff5733", 
        titleGradient: "gradient-tertiary-title",
      };
    case 3: // AI Immigration Guide (Purple/Blue - Step 4/4)
      return {
        buttonClass: "btn-quaternary", 
        mainColor: "#6a29ff", // Main purple/blue color
        titleGradient: "gradient-quaternary-title",
      };
    default:
      return {
        buttonClass: "btn-primary",
        mainColor: "#7d3cff",
        titleGradient: "gradient-primary-title",
      };
  }
};

export default function Onboarding({ onComplete }) {
  const slides = [
    {
      type: "content", // Step 1/5
      icon: "V", 
      title: "Welcome to Voyloo",
      subtitle: "Your Immigration Journey Starts Here",
      description:
        "Track your visa timeline, manage your documents, get personalized reminders, and receive AI support throughout your immigration process.",
      disclaimer: "Voyloo is-not a law firm. We provide guidance, not legal advice.",
    },
    {
      type: "content", // Step 3/5: Secure Document Vault (Note: No Step 2 image provided)
      icon: "Shield", 
      title: "Secure Document Vault",
      subtitle: "Encrypted. PIN-Locked. Always in your control.",
      description:
        "Store all your immigration and identity documents in one protected vault. Upload, organize, and access them anytime, anywhere.",
      disclaimer:
        "Your documents are encrypted. Voyloo never shares anything without your permission.",
    },
    {
      type: "content", // Step 4/5: Never Miss a Deadline
      icon: "Bell",
      title: "Never Miss a Deadline",
      subtitle: "Smart Reminders & Alerts",
      description:
        "Get reminders for key immigration deadlines like OPT, STEM, and W-1B so you stay informed and organized.",
      disclaimer:
        "Always confirm timelines with your DSO or attorney.",
    },
    {
      type: "content", // Step 5/5: AI Immigration Guide
      icon: "Robot",
      title: "AI Immigration Guide",
      subtitle: "Smart Help for Your Visa Questions",
      description:
        "Ask anything about visas, timelines, and documents. Get personalized 24/7 AI guidance tailored to you. Not a substitute for legal advice.",
      disclaimer:
        "Voyloo provides general information. For legal matters, we connect you with licensed attorneys.",
    },
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const skipToLast = () => {
    setIndex(slides.length - 1);
  };

  const currentSlide = slides[index];
  const colors = getSlideColors(index);

  return (
    <div className="onboard-container">
      <div className="onboard-card">
        {/* Conditional Rendering for Slide Content */}
        {currentSlide.type === "image" ? (
          <img src={currentSlide.img} alt="slide" className="onboard-image" />
        ) : (
          <div className="onboard-content-wrapper">
            {/* Logo/Icon Area (Dynamic Colors) */}
            <div className="onboard-logo-area">
              <div
                className={`logo-icon ${colors.buttonClass}`}
                style={{
                  background:
                    colors.buttonClass === "btn-primary"
                      ? "linear-gradient(135deg, #d3c4ff, #8250fa)"
                      : colors.buttonClass === "btn-secondary"
                      ? "linear-gradient(135deg, #00d287, #00966a)"
                      : colors.buttonClass === "btn-tertiary"
                      ? "linear-gradient(135deg, #ff8c42, #ff5733)"
                      : colors.buttonClass === "btn-quaternary"
                      ? "linear-gradient(135deg, #6a29ff, #d3c4ff)"
                      : "linear-gradient(135deg, #d3c4ff, #8250fa)",
                  boxShadow: `0 10px 40px ${colors.mainColor}30`,
                  borderRadius: index === 1 ? "50%" : "20px",
                }}
              >
                {/* Icons */}
                {index === 0 && currentSlide.icon} 
                {index === 1 && ( // Shield Icon
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 6V18L12 22L21 18V6L12 2ZM12 4.19L19 7.39V16.61L12 19.81L5 16.61V7.39L12 4.19ZM7 11.5L10.5 15L17 8.5L15.5 7L10.5 12L8.5 10L7 11.5Z"
                        fill="white"
                      />
                    </svg>
                )}
                {index === 2 && ( // Bell Icon
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.93 6 11V16L4 18V19H20V18L18 16Z"
                            fill="white"
                        />
                    </svg>
                )}
                {index === 3 && ( // Robot Icon
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.5 16.5H6.5V15H17.5V16.5ZM12 11.5C10.61 11.5 9.5 10.39 9.5 9C9.5 7.61 10.61 6.5 12 6.5C13.39 6.5 14.5 7.61 14.5 9C14.5 10.39 13.39 11.5 12 11.5Z"
                            fill="white"
                        />
                    </svg>
                )}
              </div>
            </div>

            {/* Title & Subtitle (Dynamic Subtitle Color) */}
            <h1 className={`onboard-title title-slide-${index}`}>{currentSlide.title}</h1>
            <p className="onboard-subtitle" style={{ color: colors.mainColor }}>
              {currentSlide.subtitle}
            </p>
            {/* Description */}
            <p className="onboard-description">{currentSlide.description}</p>

            {/* Disclaimer */}
            {currentSlide.disclaimer && (
                <p className="onboard-disclaimer">{currentSlide.disclaimer}</p>
            )}

          </div>
        )}

        {/* Dots (Dynamic Active Color) */}
        <div className="dots">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              style={i === index ? { background: colors.mainColor, width: i === index ? '22px' : '8px' } : {}}
            ></div>
          ))}
        </div>

        {/* Buttons (Dynamic Gradient) */}
        <button
          className={`btn ${colors.buttonClass}`}
          onClick={
            index === slides.length - 1 ? onComplete : nextSlide
          }
        >
          {index === slides.length - 1 ? "Get Started" : "Continue"}
        </button>

        <div className="skip" onClick={skipToLast}>
          Skip
        </div>

        <div className="step-text">
          Step {index + 1} of {slides.length}
        </div>
      </div>
    </div>
  );
}
