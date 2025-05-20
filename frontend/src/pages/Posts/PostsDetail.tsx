import { useParams } from 'react-router-dom';
import './Posts.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Post } from '../../store/types';
import { fetchPosts } from '../../store/thunks/postsThunks';
import { Card } from '../../components/Card';

const PostsDetail = () => {
	const [post, setPost] = useState<Post | null>(null)
	const { postId } = useParams()
	const { items: posts, status, error } = useAppSelector((state) => state.posts)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (postId == undefined) return
		if (status == "idle") dispatch(fetchPosts())
		if (status == "succeeded") {
			setPost(posts.find(post => post.id == parseInt(postId)) ?? null)
			console.log(post, status);
		}
	}, [status, dispatch])

	console.log(post, status);
	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;

	return (
		<div className='post-detail-container'>

			{post
				?
				<Card title={`Title: ${post.title}`} description={post.body} footer={`Post ID: ${post.id}`} />
				: <p>no se ha encontrado ningun post con id: {postId}</p>}
			{/* TODO: cuando pongo numero muy alto me devuelve objeto vacio y pasa condición de no ser null */}
		</div>
	);
};

export default PostsDetail;