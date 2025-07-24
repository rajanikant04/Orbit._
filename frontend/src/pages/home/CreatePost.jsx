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
		<div className='flex p-6 items-start gap-4 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm'>
			<div className='avatar flex-shrink-0'>
				<div className='w-12 h-12 rounded-full ring-2 ring-slate-600'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
				<textarea
					className='w-full p-4 text-lg resize-none border border-slate-600/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px]'
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-full max-w-md mx-auto'>
						<button
							type="button"
							className='absolute top-2 right-2 text-white bg-slate-900/80 hover:bg-red-600/80 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200 z-10'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						>
							<IoCloseSharp className='w-5 h-5' />
						</button>
						<img src={img} className='w-full max-h-80 object-cover rounded-xl border border-slate-600/50' />
					</div>
				)}

				<div className='flex justify-between items-center pt-2 border-t border-slate-700/50'>
					<div className='flex gap-3 items-center'>
						<button
							type="button"
							className='p-2 rounded-full hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200'
							onClick={() => imgRef.current.click()}
						>
							<CiImageOn className='w-6 h-6' />
						</button>
						<button
							type="button"
							className='p-2 rounded-full hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 transition-all duration-200'
						>
							<BsEmojiSmileFill className='w-5 h-5' />
						</button>
					</div>
					<input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
					<button 
						className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						disabled={isPending || (!text.trim() && !img)}
					>
						{isPending ? (
							<div className='flex items-center gap-2'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
								Posting...
							</div>
						) : "Post"}
					</button>
				</div>
				{isError && (
					<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
						<p className="text-red-400 text-sm">{error.message}</p>
					</div>
				)}
			</form>
		</div>
	);
};
export default CreatePost;