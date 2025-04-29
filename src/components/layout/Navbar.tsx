
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="caremeds-container py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl text-caremeds-blue">
            CareMeds
          </Link>
          <span className="px-2 py-0.5 rounded-full bg-caremeds-lightGreen text-caremeds-green text-xs font-medium">
            Marketplace
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-caremeds-blue transition-colors">
            Home
          </Link>
          <Link to="/medicines" className="text-gray-700 hover:text-caremeds-blue transition-colors">
            Medicines
          </Link>
          <Link to="/stores" className="text-gray-700 hover:text-caremeds-blue transition-colors">
            Pharmacies
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === "user" && (
                <Link to="/cart">
                  <Button variant="outline" className="border-caremeds-blue text-caremeds-blue hover:bg-caremeds-lightBlue">
                    Cart
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-caremeds-blue text-caremeds-blue hover:bg-caremeds-lightBlue">
                    {user?.name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user?.role === "user" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/user/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/user/orders">My Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {user?.role === "seller" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/dashboard">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/products">Manage Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/orders">Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/stores">Manage Stores</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/reports">Reports</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-caremeds-blue text-caremeds-blue hover:bg-caremeds-lightBlue">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-caremeds-blue hover:bg-blue-600">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
