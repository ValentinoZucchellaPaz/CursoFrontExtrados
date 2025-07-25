import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Login";
import { useEffect, useState } from "react";
import { Pokemons } from "../pages/Pokemons";
import PokemonDetail from "../pages/Pokemons/PokemonDetail";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Users } from "../pages/Users";
import { refreshAccessTokenThunk } from "../store/thunks/authThunks";
import UsersDetail from "../pages/Users/UsersDetail";
import CreateUser from "../pages/CreateUser/CreateUser";
import { CircularProgress } from "@mui/joy";
import EditUser from "../pages/Users/EditUser";
import { AddToCollection } from "../pages/AddToCollection";


export function AppRoutes() {
    const dispatch = useAppDispatch()
    const { token, userRole } = useAppSelector(state => state.auth)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        if (!token) {
            dispatch(refreshAccessTokenThunk()).finally(() => setAuthChecked(true))
        }
    }, [token, dispatch])

    if (!authChecked) return <div className="loader-container">
        <CircularProgress thickness={2} variant="plain" />
    </div>


    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute isAllowed={!!token} redirectPath="/login" />}>
                <Route path="/users" element={<Users />} />
                <Route path="/users/:userId" element={<UsersDetail />} />
            </Route>

            <Route element={<ProtectedRoute isAllowed={!!token && userRole === 'admin'} redirectPath="/login" />}>
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/users/:userId/editar" element={<EditUser />} />
                <Route path="/users/:userId/coleccion" element={<AddToCollection />} />
            </Route>

            <Route path="/pokemons" element={<Pokemons />} />
            <Route path="/pokemons/:pokemonName" element={<PokemonDetail />} />

            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}