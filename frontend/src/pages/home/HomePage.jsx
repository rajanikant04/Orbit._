import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<div className='sticky top-0 z-10 backdrop-blur-xl border-b transition-colors duration-300' 
				 style={{ 
					 background: 'var(--bg-elevated)', 
					 borderColor: 'var(--border-primary)' 
				 }}>
				<div className='flex'>
					<button
						className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 relative hover:bg-white/5 ${
							feedType === "forYou" 
								? "" 
								: "hover:bg-white/5"
						}`}
						style={{ 
							color: feedType === "forYou" ? 'var(--text-primary)' : 'var(--text-secondary)' 
						}}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full'></div>
						)}
					</button>
					<button
						className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 relative hover:bg-white/5 ${
							feedType === "following" 
								? "" 
								: "hover:bg-white/5"
						}`}
						style={{ 
							color: feedType === "following" ? 'var(--text-primary)' : 'var(--text-secondary)' 
						}}
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