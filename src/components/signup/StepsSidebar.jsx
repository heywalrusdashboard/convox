import { CheckCircle, Circle } from "lucide-react";

const steps = [
  "About Your Business",
  "Create a Companion",
  "Create an Account",
];

const StepSidebar = ({ currentStep }) => {
  return (
    <div className="w-full lg:w-1/3 bg-gray-100 p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <div key={label} className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <Circle
                  className={isActive ? "text-blue-500" : "text-gray-400"}
                />
              )}
              <span
                className={`text-sm ${
                  isActive ? "font-semibold" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepSidebar;
