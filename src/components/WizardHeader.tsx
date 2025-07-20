import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const WizardHeader = () => {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">SagaSynth</h1>
        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
          v1.0
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};