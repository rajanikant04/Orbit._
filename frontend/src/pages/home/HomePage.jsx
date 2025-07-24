import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-slate-700/50 min-h-screen bg-slate-900/30'>
				{/* Header */}
				<div className='flex w-full border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-10'>
					<div
						className={
							`flex justify-center flex-1 p-4 hover:bg-slate-800/50 transition duration-300 cursor-pointer relative group ${
								feedType === "forYou" ? "text-white" : "text-slate-400"
							}`
						}
						onClick={() => setFeedType("forYou")}
					>
						<span className='font-semibold group-hover:text-white transition-colors duration-200'>For you</span>
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
						)}
					</div>
					<div
						className={
							`flex justify-center flex-1 p-4 hover:bg-slate-800/50 transition duration-300 cursor-pointer relative group ${
								feedType === "following" ? "text-white" : "text-slate-400"
							}`
						}
						onClick={() => setFeedType("following")}
					>
						<span className='font-semibold group-hover:text-white transition-colors duration-200'>Following</span>
						{feedType === "following" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
						)}
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