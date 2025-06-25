
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
   
    toast.error(`Page not found: ${location.pathname}`, {
      description: "The page you're looking for doesn't exist or was moved.",
      duration: 4000,
    });
  }, [location.pathname]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md w-full px-6 py-12 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">{location.pathname}</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            asChild
          >
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            variant="outline"
            className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is a bug, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
