import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<div className='sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/8'>
				<div className='flex'>
					<button
						className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 relative ${
							feedType === "forYou" 
								? "text-white" 
								: "text-white/60 hover:text-white hover:bg-white/5"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full'></div>
						)}
					</button>
					<button
						className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 relative ${
							feedType === "following" 
								? "text-white" 
								: "text-white/60 hover:text-white hover:bg-white/5"
						}`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full'></div>
						)}
					</button>
				</div>
			</div>

			{/* CREATE POST INPUT */}
			<CreatePost />

			{/* POSTS */}
			<Posts feedType={feedType}/>
		</div>
	);
};
export default HomePage;