import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Posts } from "../pages/Posts";
import { NotFound } from "../pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import PostsDetail from "../pages/Posts/PostsDetail";
import { Login } from "../pages/Login";
import { useEffect, useState } from "react";
import { Pokemons } from "../pages/Pokemons";
import PokemonDetail from "../pages/Pokemons/PokemonDetail";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { TorneoTest } from "../pages/TorneoTest";
import { Users } from "../pages/Users";
import { refreshAccessToken } from "../store/thunks/authThunks";
import UsersDetail from "../pages/Users/UsersDetail";
import { MainLayout } from "../layouts/MainLayout";


export function AppRoutes() {
    const dispatch = useAppDispatch()
    const { token } = useAppSelector(state => state.auth)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        // console.log(token);

        if (!token) {
            dispatch(refreshAccessToken()).finally(() => setAuthChecked(true))
        }
    }, [token, dispatch])

    if (!authChecked) return <p>Cargando usuario...</p>


    return (
        <Routes>
            {/* <Route element={<MainLayout />}> */}
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute isAllowed={!!token} redirectPath="/login" />}>
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:postId" element={<PostsDetail />} />
                {/* other protected routes */}
                <Route path="/users" element={<Users />} />
                <Route path="/users/:userId" element={<UsersDetail />} />
            </Route>

            <Route path="/pokemons" element={<Pokemons />} />
            <Route path="/pokemons/:pokemonName" element={<PokemonDetail />} />
            <Route path="/prueba-back" element={<TorneoTest />} />

            <Route path='*' element={<NotFound />} />
            {/* </Route> */}
        </Routes>
    )
}