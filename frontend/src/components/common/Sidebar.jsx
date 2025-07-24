import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // toast.success("Logout Successful")
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="w-20 lg:w-72 flex-shrink-0">
      <div className="fixed h-screen w-20 lg:w-72 flex flex-col p-4 lg:p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center lg:justify-start mb-8 group">
          <div className="flex items-center space-x-3">
            <img 
              src="/orbit.png" 
              className="w-10 h-10 rounded-xl transform transition-transform group-hover:scale-105" 
              alt="Orbit"
            />
            <span className="hidden lg:block text-xl font-bold text-premium">Orbit</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center lg:justify-start space-x-4 p-3 lg:p-4 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group"
          >
            <MdHomeFilled className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium">Home</span>
          </Link>

          <Link
            to="/notifications"
            className="flex items-center justify-center lg:justify-start space-x-4 p-3 lg:p-4 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group"
          >
            <IoNotifications className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium">Notifications</span>
          </Link>

          <Link
            to={`/profile/${authUser?.username}`}
            className="flex items-center justify-center lg:justify-start space-x-4 p-3 lg:p-4 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group"
          >
            <FaUser className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium">Profile</span>
          </Link>
        </nav>

        {/* User Profile */}
        {authUser && (
          <div className="mt-auto">
            <Link
              to={`/profile/${authUser.username}`}
              className="flex items-center justify-center lg:justify-start space-x-3 p-3 lg:p-4 rounded-xl hover:bg-white/5 transition-all duration-200 group relative"
            >
              <div className="relative">
                <img 
                  src={authUser?.profileImg || "/avatar-placeholder.png"} 
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-200"
                  alt={authUser?.fullName}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              
              <div className="hidden lg:flex flex-1 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-white/60 text-xs truncate">
                    @{authUser?.username}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="ml-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group/btn"
                  title="Logout"
                >
                  <BiLogOut className="w-5 h-5 text-white/60 group-hover/btn:text-white transition-colors" />
                </button>
              </div>

              {/* Mobile logout button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="lg:hidden absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
                title="Logout"
              >
                <BiLogOut className="w-4 h-4 text-white" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
