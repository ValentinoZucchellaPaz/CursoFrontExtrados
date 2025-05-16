"use client";
import React from 'react';
import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useParams } from 'react-router-dom';


const UsersDetail = ({ }) => {

    const { userId } = useParams()

    const { data: user, loading, error } = useAxios<APIUserProps>({ url: `http://localhost:5125/info/usuarios/${userId}` })
    console.log(user);

    if (loading) return <p>Cargando...</p>
    if (error) return <p>{error.message}</p>
    return (
        <div className='users'>
            {user ? <p >{user.id} {user.alias} {user.email} {user.name} {user.role}</p> : "Error encontrando el usuario con id" + userId}
        </div>
    );
};

export default UsersDetail;
