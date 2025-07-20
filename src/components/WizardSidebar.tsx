import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface WizardSidebarProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepId: number) => void;
}

export const WizardSidebar = ({ currentStep, steps, onStepClick }: WizardSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Dataset Generation Wizard
        </h2>
        
        <nav className="space-y-2">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const canClick = step.completed || step.id <= currentStep + 1;
            
            return (
              <button
                key={step.id}
                onClick={() => canClick && onStepClick(step.id)}
                disabled={!canClick}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                  isActive 
                    ? "bg-accent text-accent-foreground shadow-card" 
                    : canClick 
                      ? "hover:bg-muted/50" 
                      : "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                      isActive 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : "border-muted-foreground text-muted-foreground"
                    )}>
                      {step.id}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium text-sm",
                    isActive ? "text-accent-foreground" : "text-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-xs mt-1",
                    isActive ? "text-accent-foreground/70" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};