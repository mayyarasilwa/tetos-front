
import { App, Button, Drawer, Form, Input, Popconfirm, Table, Select } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import {
    useBuscarUsuario,
    useCriarUsuario,
    useDeletarUsuario,
    useEditarUsuario
} from "../hooks/usuarioHooks";
import { useState } from "react";
import { useBuscarNiveis } from "../hooks/niveisHooks";

const Usuarios = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const { data: usuarios, isLoading: loadingUsuarios } = useBuscarUsuario();
    const { data: niveis } = useBuscarNiveis();
    const { mutate: criarUsuario, isLoading: loadingCriar } = useCriarUsuario();
    const { mutate: editarUsuario, isLoading: loadingEditar } = useEditarUsuario();
    const { mutate: deletarUsuario } = useDeletarUsuario();
    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarUsuario(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarCriar(false);
                formCriar.resetFields();

                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        });
    }

    function editar(dados) {
        editarUsuario(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);

                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        });
    }

    function deletar(id) {
        deletarUsuario(id, {
            onSuccess: ({ type, description }) => {
                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        });
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Usuários</h2>

                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => {
                        formCriar.resetFields();
                        setMostrarCriar(true);
                    }}
                >
                    Novo usuário
                </Button>
            </div>

            <div>
                <Table
                    dataSource={usuarios || []}
                    loading={loadingUsuarios}
                    rowKey="id"
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />

                    <Table.Column
                        title="Nível"
                        dataIndex={["nivel", "nome"]}
                    />

                    <Table.Column
                        title="Email"
                        dataIndex="email"
                    />

                    <Table.Column
                        title="Ações"
                        className="w-25"
                        render={(_, linha) => (
                            <div className="flex gap-2">
                                <Button
                                    icon={<LuPencil />}
                                    type="primary"
                                    onClick={() => {
                                        formEditar.setFieldsValue({
                                            id: linha.id,
                                            nome: linha.nome,
                                            email: linha.email,
                                            nivel_id: linha.nivel_id,
                                            senha: ""
                                        });

                                        setMostrarEditar(true);
                                    }}
                                />

                                <Popconfirm
                                    title="Aviso:"
                                    description="Deseja realmente apagar?"
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button
                                        icon={<LuTrash2 />}
                                        type="primary"
                                    />
                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>
            </div>

            <Drawer
                title="Criar usuário"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    form={formCriar}
                    onFinish={criar}
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Input placeholder="Nome do usuário" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Campo obrigatório" },
                            { type: "email", message: "Informe um email válido" }
                        ]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Input.Password placeholder="Digite a senha" />
                    </Form.Item>

                    <Form.Item
                        label="Nível"
                        name="nivel_id"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Select
                            placeholder="Escolha um nível"
                            options={(niveis || []).map(nivel => ({
                                label: nivel.nome,
                                value: nivel.id
                            }))}
                        />
                    </Form.Item>

                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingCriar}
                        >
                            Enviar
                        </Button>
                    </div>
                </Form>
            </Drawer>

            <Drawer
                title="Editar usuário"
                open={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Input placeholder="Nome do usuário" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Campo obrigatório" },
                            { type: "email", message: "Informe um email válido" }
                        ]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Input.Password placeholder="Digite a nova senha" />
                    </Form.Item>

                    <Form.Item
                        label="Nível"
                        name="nivel_id"
                        rules={[
                            { required: true, message: "Campo obrigatório" }
                        ]}
                    >
                        <Select
                            placeholder="Escolha um nível"
                            options={(niveis || []).map(nivel => ({
                                label: nivel.nome,
                                value: nivel.id
                            }))}
                        />
                    </Form.Item>

                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingEditar}
                        >
                            Enviar
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
};

export default Usuarios;
