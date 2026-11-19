
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useContext } from "react";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Niveis from "../pages/Niveis";
import ImoveisTipo from "../pages/ImoveisTipo";
import Locatarios from "../pages/Locatarios";
import Usuarios from "../pages/usuario";

import RotaProtegida from "./RotaProtegida";
import PageLayout from "../layouts/PageLayout";
import { AdminContext } from "../contexts/AdminProvider";

const Rotas = () => {
    const { token } = useContext(AdminContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {token && (
                    <Route
                        path="/painel"
                        element={
                            <RotaProtegida>
                                <PageLayout />
                            </RotaProtegida>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="niveis" element={<Niveis />} />
                        <Route path="imoveis-tipo" element={<ImoveisTipo />} />
                        <Route path="locatarios" element={<Locatarios />} />
                        <Route path="usuarios" element={<Usuarios />} />
                    </Route>
                )}

                <Route path="*" element={<VoltarPraLogin />} />
            </Routes>
        </BrowserRouter>
    );
};

const VoltarPraLogin = () => {
    return <Navigate to="/" />;
};

export default Rotas;
