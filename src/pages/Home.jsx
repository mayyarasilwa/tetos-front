import imgHome from "../assets/img-home.jpg";

const Home = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Seja bem-vindo ao Tetos!</h1>
            <p className="text-gray-500 mb-6">Sistema de gerenciamento de imóveis</p>

            <div className="w-full">
                <img src={imgHome} alt="Bairro residencial" className=" w-full h-[450px] object-cover rounded-2xl" />
            </div>

        </div>
    );
}

export default Home;