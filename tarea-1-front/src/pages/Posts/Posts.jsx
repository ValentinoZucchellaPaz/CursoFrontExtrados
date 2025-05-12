"use client";
import './Posts.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPosts } from '../../store/slices/postSlice';

const Posts = ({ }) => {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { items: posts, status, error } = useSelector((state) => state.posts)
	console.log(posts);

	useEffect(() => {
		console.log("use effect de posts");
		console.log(status);
		console.log(posts);


		if (status == "idle") {
			dispatch(fetchPosts())
		}
	}, [status, dispatch])


	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;

	return (
		<div className='posts'>
			<ul>
				{posts && posts?.map(post =>
					<li key={post.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/posts/${post.id}`)}>{post.title}</li>
				)}
			</ul>
		</div>
	);
}


export default Posts;