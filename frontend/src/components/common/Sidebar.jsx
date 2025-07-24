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
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col glass border-r border-slate-700/30 w-20 md:w-full shadow-xl">
        <Link to="/" className="flex justify-center md:justify-start p-6 group">
          <div className="relative">
            <img 
              src="/orbit.png" 
              className="h-12 w-12 rounded-xl hover:scale-110 transition-all duration-500 drop-shadow-2xl filter saturate-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </div>
        </Link>
        
        <nav className="flex flex-col gap-3 mt-4 px-3">
          <NavItem 
            to="/" 
            icon={<MdHomeFilled className="w-7 h-7" />} 
            text="Home" 
          />
          <NavItem 
            to="/notifications" 
            icon={<IoNotifications className="w-6 h-6" />} 
            text="Notifications" 
          />
          <NavItem 
            to={`/profile/${authUser?.username}`} 
            icon={<FaUser className="w-6 h-6" />} 
            text="Profile" 
          />
        </nav>
        
        <div className="flex-1"></div>
        
        {authUser && (
          <div className="mb-6 mx-3">
            <Link
              to={`/profile/${authUser.username}`}
              className="flex gap-3 items-center p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-blue-500/30"
            >
              <div className="avatar">
                <div className="w-12 h-12 rounded-full ring-2 ring-slate-600/50 group-hover:ring-blue-500/50 transition-all duration-300 overflow-hidden">
                  <img 
                    src={authUser?.profileImg || "/avatar-placeholder.png"} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="hidden md:flex justify-between flex-1 items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-slate-400 text-xs truncate">@{authUser?.username}</p>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 ml-2 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  title="Sign out"
                >
                  <BiLogOut className="w-4 h-4" />
                </button>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, text }) => {
  return (
    <li className="flex justify-center md:justify-start">
      <Link
        to={to}
        className="flex gap-4 items-center p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-blue-500/30 w-full md:w-auto relative overflow-hidden"
      >
        <div className="text-slate-400 group-hover:text-blue-400 transition-colors duration-200 relative z-10">
          {icon}
        </div>
        <span className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors duration-200 hidden md:block relative z-10">
          {text}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </li>
  );
};

export default Sidebar;
