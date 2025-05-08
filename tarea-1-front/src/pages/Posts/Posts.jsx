"use client";
import React from 'react';
import './Posts.css';
import useFetch from '../../hooks/useFetch';

const Posts = ({ }) => {

	const { data: posts } = useFetch("https://jsonplaceholder.typicode.com/posts")
	console.log(posts);

	return (
		<div className='posts'>
			<ul>
				{posts ? posts.map(post =>
					<li key={post.id}>{post.title}</li>
				) : <p>Loading...</p>}
			</ul>
		</div>
	);
};

export default Posts;