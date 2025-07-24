import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);


	const {data:authUser } = useQuery({queryKey:["authUser"]});
	const queryClient = useQueryClient();

	const {mutate:createPost,isPending, isError, error } = useMutation({
		mutationFn: async({text,img}) => {
			try {
				const res = await fetch("/api/posts/create" , {
					method:"POST" , 
					headers: {
						"Content-Type":"application/json",
					},
					body: JSON.stringify({text,img}),
				})
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: () =>{
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({queryKey: ["posts"]});
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text,img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='border-b border-white/12 p-6'>
			<div className='flex space-x-4'>
				<div className='flex-shrink-0'>
					<img 
						src={authUser.profileImg || "/avatar-placeholder.png"} 
						className='w-12 h-12 rounded-xl object-cover ring-2 ring-white/10'
						alt={authUser.fullName}
					/>
				</div>
				
				<form className='flex-1' onSubmit={handleSubmit}>
					<div className="space-y-4">
						<textarea
							className='w-full bg-transparent text-xl placeholder-white/40 resize-none border-none focus:outline-none min-h-[120px] leading-relaxed'
							placeholder="What's on your mind?"
							value={text}
							onChange={(e) => setText(e.target.value)}
							rows={3}
						/>
						
						{img && (
							<div className='relative inline-block'>
								<img 
									src={img} 
									className='max-h-80 rounded-2xl border border-white/10 object-cover' 
									alt="Upload preview"
								/>
								<button
									type="button"
									className='absolute top-3 right-3 w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-colors'
									onClick={() => {
										setImg(null);
										imgRef.current.value = null;
									}}
								>
									<IoCloseSharp className='w-5 h-5 text-white' />
								</button>
							</div>
						)}
					</div>

					<div className='flex items-center justify-between pt-4 border-t border-white/12 mt-4'>
						<div className='flex items-center space-x-4'>
							<button
								type="button"
								className='flex items-center justify-center w-10 h-10 rounded-xl hover:bg-blue-500/10 text-blue-500 hover:text-blue-400 transition-all duration-200 group'
								onClick={() => imgRef.current.click()}
							>
								<CiImageOn className='w-6 h-6 group-hover:scale-110 transition-transform' />
							</button>
							<button
								type="button"
								className='flex items-center justify-center w-10 h-10 rounded-xl hover:bg-yellow-500/10 text-yellow-500 hover:text-yellow-400 transition-all duration-200 group'
							>
								<BsEmojiSmileFill className='w-5 h-5 group-hover:scale-110 transition-transform' />
							</button>
						</div>

						<button 
							type="submit"
							disabled={isPending || (!text.trim() && !img)}
							className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						>
							{isPending ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
									<span>Posting...</span>
								</div>
							) : (
								'Post'
							)}
						</button>
					</div>

					<input 
						type='file' 
						accept="image/*" 
						hidden 
						ref={imgRef} 
						onChange={handleImgChange} 
					/>
				</form>
			</div>
		</div>
	);
};
export default CreatePost;