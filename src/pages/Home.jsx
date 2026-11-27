import { Card, Statistic } from "antd";
import { LuHouse, LuUsers, LuWrench, LuClipboardList } from "react-icons/lu";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { useBuscarManutencoes } from "../hooks/manutencoesHooks";
import { useBuscarHistoricoImovel } from "../hooks/historicoImovelHooks";
import imgHome from "../assets/img-home.jpg";

const Home = () => {

    const { data: imoveis, isLoading: loadingImoveis } = useBuscarImovel();
    const { data: locatarios, isLoading: loadingLocatarios } = useBuscarLocatarios();
    const { data: manutencoes, isLoading: loadingManutencoes } = useBuscarManutencoes();
    const { data: historicos, isLoading: loadingHistoricos } = useBuscarHistoricoImovel();

    return (
        <div
            className="min-h-screen bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: `url(${imgHome})` }}
        >
            <div className="min-h-screen bg-black/40 rounded-2xl p-4 md:p-10">

                <h1 className="text-3xl font-bold mb-2 text-white">
                    Seja bem-vindo ao Tetos!
                </h1>

                <p className="text-white mb-6">
                    Sistema de gerenciamento de imóveis
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

                    <Card loading={loadingImoveis}>
                        <LuHouse className="text-3xl text-blue-500 mb-3" />
                        <Statistic
                            title="Imóveis"
                            value={imoveis?.length || 0}
                            styles={{ content: { color: "#3b82f6" } }}
                        />
                        <p className="text-gray-500">Total de registros</p>
                    </Card>

                    <Card loading={loadingLocatarios}>
                        <LuUsers className="text-3xl text-blue-500 mb-3" />
                        <Statistic
                            title="Locatários"
                            value={locatarios?.length || 0}
                            styles={{ content: { color: "#3b82f6" } }}
                        />
                        <p className="text-gray-500">Total de registros</p>
                    </Card>

                    <Card loading={loadingManutencoes}>
                        <LuWrench className="text-3xl text-blue-500 mb-3" />
                        <Statistic
                            title="Manutenções"
                            value={manutencoes?.length || 0}
                            styles={{ content: { color: "#3b82f6" } }}
                        />
                        <p className="text-gray-500">Total de registros</p>
                    </Card>

                    <Card loading={loadingHistoricos}>
                        <LuClipboardList className="text-3xl text-blue-500 mb-3" />
                        <Statistic
                            title="Histórico de Imóveis"
                            value={historicos?.length || 0}
                            styles={{ content: { color: "#3b82f6" } }}
                        />
                        <p className="text-gray-500">Total de registros</p>
                    </Card>

                </div>

            </div>
        </div>
    );
}

export default Home;