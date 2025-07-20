import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  const NavLinks = () => (
    <>
      <Link to="/wizard" className="block">
        <Button
          variant="ghost"
          className="w-full justify-start md:w-auto"
          onClick={() => setIsOpen(false)}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Dataset
        </Button>
      </Link>
      <Link to="/marketplace" className="block">
        <Button
          variant="ghost"
          className="w-full justify-start md:w-auto"
          onClick={() => setIsOpen(false)}
        >
          Dataset
        </Button>
      </Link>
      <Link to="/bounties" className="block">
        <Button
          variant="ghost"
          className="w-full justify-start md:w-auto"
          onClick={() => setIsOpen(false)}
        >
          Bounties
        </Button>
      </Link>
      {isAdmin && (
        <Link to="/create-bounty" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start md:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Create Bounty
          </Button>
        </Link>
      )}
      {isAdmin && (
        <Link to="/add-contributor" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start md:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Add Contributor
          </Button>
        </Link>
      )}
      {isAdmin && (
        <Link to="/distribute-bounty" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start md:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Distribute Bounty
          </Button>
        </Link>
      )}
      {isAdmin ? (
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
        >
          Sign Out
        </Button>
      ) : (
        <Link to="/signin" className="block">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Button>
        </Link>
      )}
      <Link to="/wizard">
        <Button
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsOpen(false)}
        >
          Get Started
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>SagaSynth</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-primary">
                      SagaSynth
                    </span>
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
