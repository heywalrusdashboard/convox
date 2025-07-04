import React, { useState } from "react";
import StepSidebar from "@/components/signup/StepsSidebar";
import SignupForm from "@/components/signup/SignupForm";
import { Link } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      {/* Show heading only for steps 1–3 */}
      {step < 4 && (
        <div className="text-center max-w-xl my-20">
          <h1 className="text-3xl font-bold">Welcome to Walrus!</h1>
          <p className="text-lg text-gray-600">
            Let's get started by telling us a bit about your business.
          </p>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row w-full ${
          step === 4 ? "max-w-7xl h-[calc(100vh-4rem)]" : "max-w-5xl"
        } bg-white shadow-lg rounded-xl overflow-hidden`}
      >
        <StepSidebar currentStep={step} />
        <SignupForm step={step} setStep={setStep} />
      </div>

      {/* Hide login link on step 4 */}
      {step < 4 && (
        <div className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Signup;
