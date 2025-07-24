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
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-lg w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start p-4 group">
          <div className="relative">
            <img 
              src="/orbit.png" 
              className="px-2 h-12 w-12 rounded-full hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
        
        <nav className="flex flex-col gap-2 mt-6 px-2">
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
        
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-6 mx-2 flex gap-3 items-center p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group border border-transparent hover:border-slate-700/50"
          >
            <div className="avatar">
              <div className="w-10 h-10 rounded-full ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-300">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="hidden md:flex justify-between flex-1 items-center">
              <div>
                <p className="text-white font-semibold text-sm truncate max-w-[120px]">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-400 text-xs">@{authUser?.username}</p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 group"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                <BiLogOut className="w-5 h-5" />
              </button>
            </div>
          </Link>
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
        className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group border border-transparent hover:border-slate-700/50 hover:shadow-lg w-full md:w-auto"
      >
        <div className="text-slate-400 group-hover:text-white transition-colors duration-200">
          {icon}
        </div>
        <span className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors duration-200 hidden md:block">
          {text}
        </span>
      </Link>
    </li>
  );
};

export default Sidebar;
