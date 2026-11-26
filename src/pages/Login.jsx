import { App, Button, Form, Input } from "antd";
import { useLogin } from "../hooks/usuarioHooks";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AdminContext } from "../contexts/AdminProvider";
import casaSimples from "../assets/casa-simples.png";
import { MdOutlineHomeWork } from "react-icons/md";


const Login = () => {

    const navigate = useNavigate();
    const { notification } = App.useApp();
    const { mutate: login, isPending: loginPending } = useLogin();
    const { setToken } = useContext(AdminContext);

    function logar(dados) {
        login(dados, {
            onSuccess: ({ type, description, usuario, token }) => {
                notification[type]({
                    description
                });
                if (type == "success") {
                    setToken(token);
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("usuario", JSON.stringify(usuario));
                    navigate("/painel");
                }
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    return (
        <div className="h-screen flex bg-blue-500">

            <div className="w-[55%] h-full">
                <img
                    src={casaSimples}
                    alt="Casa residencial"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-[45%] flex justify-center items-center">

                <div className="w-75 p-4 bg-white rounded-2xl">

                    <div className="flex justify-center items-center gap-2 text-blue-500 mb-4">
                        <MdOutlineHomeWork className="text-3xl" />
                        <h1 className="text-3xl font-bold">tetos.</h1>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">
                            Seja bem-vindo!
                        </h2>
                        <p className="text-gray-500">
                            Acesse sua conta
                        </p>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={logar}
                    >
                        <Form.Item
                            label="Email"
                            name={"email"}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                        >
                            <Input placeholder="email@email.com" />
                        </Form.Item>

                        <Form.Item
                            label="Senha"
                            name={"senha"}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                        >
                            <Input.Password placeholder="*********" />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full mt-4"
                            loading={loginPending}
                        >Enviar</Button>

                    </Form>
                </div>

            </div>

        </div>
    );
}

export default Login;