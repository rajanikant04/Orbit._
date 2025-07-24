const LoadingSpinner = ({ size = "md" }) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8", 
		lg: "w-12 h-12",
		xl: "w-16 h-16"
	};

	return (
		<div className="flex items-center justify-center">
			<div className={`${sizeClasses[size]} relative`}>
				<div className={`${sizeClasses[size]} rounded-full border-2 border-slate-600/30`}></div>
				<div className={`${sizeClasses[size]} rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin absolute top-0 left-0`}></div>
			</div>
		</div>
	);
};
export default LoadingSpinner;