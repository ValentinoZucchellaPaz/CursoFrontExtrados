import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Posts } from "../pages/Posts";
import { NotFound } from "../pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import PostsDetail from "../pages/Posts/PostsDetail";
import Login from "../pages/Login/Login";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setAuthToken } from "../services/apiClient";
import Pokemons from "../pages/Pokemons/Pokemons";
import PokemonDetail from "../pages/Pokemons/PokemonDetail";

export function AppRoutes() {

    const user = useSelector(state => state.user)

    useEffect(() => {
        if (user?.token) {
            setAuthToken(user.token)
        }
    }, [user])


    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute isAllowed={!!user} redirectPath="/login" />}>
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:postId" element={<PostsDetail />} />
                {/* other protected routes */}
            </Route>

            <Route path="/pokemons" element={<Pokemons />} />
            <Route path="/pokemons/:pokemonName" element={<PokemonDetail />} />

            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}