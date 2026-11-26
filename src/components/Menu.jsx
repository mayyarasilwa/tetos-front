
import { NavLink } from "react-router";

const Menu = () => {
    return (
        <header className="w-full md:w-55 h-auto md:h-screen bg-blue-500 p-4">
            <h1 className="text-4xl font-semibold text-white mb-5">
                Tetos
            </h1>

            <nav className="flex flex-col *:leading-10 *:font-semibold *:text-white! *:rounded *:duration-200! *:pl-4 *:[&.active]:bg-white! *:[&.active]:text-blue-500!">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink to="/painel/niveis">Níveis</NavLink>
                <NavLink to="/painel/imoveis-tipo">Imóveis Tipo</NavLink>
                <NavLink to="/painel/imoveis">Imóveis</NavLink>
                <NavLink to="/painel/locatarios">Locatários</NavLink>
                <NavLink to="/painel/usuarios">Usuários</NavLink>
            </nav>
        </header>
    );
};

export default Menu;
