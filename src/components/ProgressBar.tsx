import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn("w-full bg-muted rounded-full h-2", className)}>
      <div 
        className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};