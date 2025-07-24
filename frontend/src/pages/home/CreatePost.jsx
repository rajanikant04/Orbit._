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
		<div className='flex p-8 items-start gap-5 border-b border-slate-700/30 glass animate-fade-in-up'>
			<div className='avatar flex-shrink-0'>
				<div className='w-14 h-14 rounded-full ring-2 ring-slate-600/50 overflow-hidden hover:ring-blue-500/50 transition-all duration-300'>
					<img 
						src={authUser.profileImg || "/avatar-placeholder.png"} 
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
			<form className='flex flex-col gap-6 w-full' onSubmit={handleSubmit}>
				<textarea
					className='w-full p-5 text-lg resize-none glass rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[140px] font-medium leading-relaxed'
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-full max-w-lg mx-auto'>
						<button
							type="button"
							className='absolute top-3 right-3 text-white glass hover:bg-red-500/20 hover:text-red-400 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 shadow-lg backdrop-blur-sm'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						>
							<IoCloseSharp className='w-5 h-5' />
						</button>
						<img src={img} className='w-full max-h-96 object-cover rounded-2xl shadow-2xl border border-slate-600/30' />
					</div>
				)}

				<div className='flex justify-between items-center pt-4 border-t border-slate-700/30'>
					<div className='flex gap-2 items-center'>
						<button
							type="button"
							className='p-3 glass rounded-full hover:shadow-lg hover:border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 group'
							onClick={() => imgRef.current.click()}
						>
							<CiImageOn className='w-6 h-6 group-hover:scale-110 transition-transform duration-200' />
						</button>
						<button
							type="button"
							className='p-3 glass rounded-full hover:shadow-lg hover:border-yellow-500/30 text-yellow-400 hover:text-yellow-300 transition-all duration-300 group'
						>
							<BsEmojiSmileFill className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
						</button>
					</div>
					<input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
					<button 
						className='btn-premium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base'
						disabled={isPending || (!text.trim() && !img)}
					>
						{isPending ? (
							<div className='flex items-center gap-3'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
								<span className='font-medium'>Posting...</span>
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