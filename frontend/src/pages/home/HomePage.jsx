import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-slate-700/30 min-h-screen glass'>
				{/* Header */}
				<div className='flex w-full border-b border-slate-700/30 glass sticky top-0 z-10 shadow-lg backdrop-blur-xl'>
					<div
						className={
							`flex justify-center flex-1 p-5 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer relative group ${
								feedType === "forYou" ? "text-white" : "text-slate-400"
							}`
						}
						onClick={() => setFeedType("forYou")}
					>
						<span className='font-semibold text-lg group-hover:text-white transition-colors duration-200 relative z-10'>For you</span>
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'></div>
						)}
						<div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
					</div>
					<div
						className={
							`flex justify-center flex-1 p-5 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer relative group ${
								feedType === "following" ? "text-white" : "text-slate-400"
							}`
						}
						onClick={() => setFeedType("following")}
					>
						<span className='font-semibold text-lg group-hover:text-white transition-colors duration-200 relative z-10'>Following</span>
						{feedType === "following" && (
							<div className='absolute bottom-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'></div>
						)}
						<div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;