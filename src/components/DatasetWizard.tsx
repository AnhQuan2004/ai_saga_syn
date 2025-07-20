import { useState } from "react";
import { WizardSidebar } from "./WizardSidebar";
import { WizardHeader } from "./WizardHeader";
import { ProgressBar } from "./ProgressBar";
import { Step1DatasetSelection } from "./steps/Step1DatasetSelection";
import { Step2ConfigureParameters } from "./steps/Step2ConfigureParameters";
import { Step3DefinePrompt } from "./steps/Step3DefinePrompt";
import { Step4FinalizeDetails } from "./steps/Step4FinalizeDetails";
import { Step5GenerateDataset } from "./steps/Step5GenerateDataset";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Select Dataset",
    description: "Choose your source dataset",
    completed: false
  },
  {
    id: 2,
    title: "Configure Parameters",
    description: "Set AI model and generation settings",
    completed: false
  },
  {
    id: 3,
    title: "Define Prompt",
    description: "Create and test your prompt",
    completed: false
  },
  {
    id: 4,
    title: "Finalize Details",
    description: "Set dataset name and pricing",
    completed: false
  },
  {
    id: 5,
    title: "Generate Dataset",
    description: "Create your synthetic dataset",
    completed: false
  }
];

export const DatasetWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(WIZARD_STEPS);
  const [sampleSize, setSampleSize] = useState(50);
  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public-sellable");
  const [price, setPrice] = useState("5");
  const [maxTokens, setMaxTokens] = useState("3000");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [prompt, setPrompt] = useState("Classify the medical transcription into categories and explain: {input}");

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep + 1 || steps[stepId - 1].completed) {
      setCurrentStep(stepId);
    }
  };

  const handleNext = () => {
    // Mark current step as completed
    setSteps(prev => prev.map(step => 
      step.id === currentStep ? { ...step, completed: true } : step
    ));
    
    // Move to next step
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1DatasetSelection onNext={handleNext} />;
      case 2:
        return <Step2ConfigureParameters onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3DefinePrompt onNext={handleNext} onBack={handleBack} prompt={prompt} setPrompt={setPrompt} />;
      case 4:
        return (
          <Step4FinalizeDetails
            onNext={handleNext}
            onBack={handleBack}
            setSampleSize={setSampleSize}
            sampleSize={sampleSize}
            datasetName={datasetName}
            setDatasetName={setDatasetName}
            description={description}
            setDescription={setDescription}
            visibility={visibility}
            setVisibility={setVisibility}
            price={price}
            setPrice={setPrice}
          />
        );
      case 5:
        return (
          <Step5GenerateDataset
            onBack={handleBack}
            sampleSize={sampleSize}
            datasetName={datasetName}
            description={description}
            visibility={visibility}
            price={price}
            maxTokens={maxTokens}
            model={model}
            prompt={prompt}
          />
        );
      default:
        return <Step1DatasetSelection onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WizardHeader />
      
      <div className="flex">
        <WizardSidebar 
          currentStep={currentStep}
          steps={steps}
          onStepClick={handleStepClick}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {steps[currentStep - 1]?.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {WIZARD_STEPS.length}
                </span>
              </div>
              <ProgressBar 
                currentStep={currentStep} 
                totalSteps={WIZARD_STEPS.length}
              />
            </div>

            {/* Current Step Content */}
            <div className="animate-fade-in">
              {renderCurrentStep()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};