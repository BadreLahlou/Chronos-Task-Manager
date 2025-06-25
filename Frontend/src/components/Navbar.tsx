
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Menu, X, LogIn, UserPlus, User, Settings, LogOut, Bell } from 'lucide-react';
import { toast } from 'sonner';
import ClickOutside from '@/components/ui/click-outside';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Store original body overflow style
  const [originalBodyOverflow, setOriginalBodyOverflow] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      setOriginalBodyOverflow(document.body.style.overflow);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
     
      navigate(`/#${sectionId}`);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-background/90 backdrop-blur-md border-b shadow-sm py-3 dark:border-border' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-all duration-300 hover:opacity-80"
        >
          <Clock className="h-6 w-6 text-primary animate-pulse-subtle" />
          <span className="font-display text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Chronos</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="text-sm font-medium hover:text-primary transition-colors duration-300"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-sm font-medium hover:text-primary transition-colors duration-300"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('solutions')} 
            className="text-sm font-medium hover:text-primary transition-colors duration-300"
          >
            Solutions
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
          
          <Toggle 
            pressed={notificationsEnabled}
            onPressedChange={toggleNotifications}
            aria-label="Toggle notifications"
            variant="outline"
            className={`rounded-full ${notificationsEnabled ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Bell className="h-4 w-4" />
          </Toggle>
          
          <ThemeToggle />
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
            </Button>
            
            {isUserMenuOpen && (
              <ClickOutside onClickOutside={() => setIsUserMenuOpen(false)} className="absolute right-0 mt-2 w-56 z-50">
                <div className="bg-background rounded-md shadow-md border py-1">
                  <div className="px-4 py-2 text-sm font-medium border-b">My Account</div>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </div>
                  </Link>
                </div>
              </ClickOutside>
            )}
          </div>
        </div>

        {/* Mobile Menu Button and User Menu */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          
          <Toggle 
            pressed={notificationsEnabled}
            onPressedChange={toggleNotifications}
            aria-label="Toggle notifications"
            variant="outline"
            className={`rounded-full ${notificationsEnabled ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Bell className="h-4 w-4" />
          </Toggle>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
            </Button>
            
            {isUserMenuOpen && (
              <ClickOutside onClickOutside={() => setIsUserMenuOpen(false)} className="absolute right-0 mt-2 w-56 z-50">
                <div className="bg-background rounded-md shadow-md border py-1">
                  <div className="px-4 py-2 text-sm font-medium border-b">My Account</div>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </div>
                  </Link>
                </div>
              </ClickOutside>
            )}
          </div>
          
          <button 
            className="flex items-center justify-center" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu with fixed positioning and solid background */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background dark:bg-card pt-20 animate-in">
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div ref={mobileMenuRef} className="mobile-menu-container container px-4 flex flex-col gap-4 py-8 pb-20">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-lg font-medium py-3 px-4 hover:bg-accent rounded-md transition-colors duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-lg font-medium py-3 px-4 hover:bg-accent rounded-md transition-colors duration-300"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('solutions')}
              className="text-lg font-medium py-3 px-4 hover:bg-accent rounded-md transition-colors duration-300"
            >
              Solutions
            </button>
            <div className="mt-4 space-y-2">
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
