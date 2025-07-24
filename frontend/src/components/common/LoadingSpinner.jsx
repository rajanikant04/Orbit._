const LoadingSpinner = ({ size = "md" }) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6", 
		lg: "w-8 h-8",
		xl: "w-12 h-12"
	};

	return (
		<div className={`${sizeClasses[size]} animate-spin`}>
			<div className={`${sizeClasses[size]} border-2 border-white/20 border-t-blue-500 rounded-full`}></div>
		</div>
	);
};
export default LoadingSpinner;