"use client";
import { useParams } from 'react-router-dom';
import './Posts.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../../store/slices/postSlice';

const PostsDetail = () => {
	const [post, setPost] = useState(null)
	const { postId } = useParams()
	const { items: posts, status, error } = useSelector((state) => state.posts)
	const dispatch = useDispatch()

	useEffect(() => {
		if (status == "idle") dispatch(fetchPosts())
		if (status == "succeeded") {
			setPost(posts.find(post => post.id == parseInt(postId)))
			console.log(post, status);
		}
	}, [status, dispatch])

	console.log(post, status);
	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;

	return (
		<div className='postsdetail'>
			{post
				? <p>Title: {post.title}
					<br />Id:  {post.id}
					<br />Body:  {post.body}
				</p>
				: <p>no se ha encontrado ningun post con id: {postId}</p>}
			{/* TODO: cuando pongo numero muy alto me devuelve objeto vacio y pasa condición de no ser null */}
		</div>
	);
};

export default PostsDetail;