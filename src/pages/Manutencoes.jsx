import { App, Button, Drawer, Form, Input, Popconfirm, Table, Select } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarManutencoes, useCriarManutencao, useEditarManutencao, useDeletarManutencao } from "../hooks/manutencoesHooks";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useState } from "react";

const Manutencoes = () => {
    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);

    const { notification } = App.useApp();

    const { data: manutencoes, isLoading: loadingManutencoes } = useBuscarManutencoes();
    const { data: imoveis } = useBuscarImovel();

    const { mutate: criarManutencao, isPending: loadingCriar } = useCriarManutencao();
    const { mutate: editarManutencao, isPending: loadingEditar } = useEditarManutencao();
    const { mutate: deletarManutencao } = useDeletarManutencao();

    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarManutencao(dados, {
            onSuccess: ({ type, description }) => {
                if (type === "success") {
                    setMostrarCriar(false);
                    formCriar.resetFields();
                }

                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: (error) => {
                notification.error({
                    description: error.response?.data?.description || error.message
                });
            }
        })
    }

    function editar(dados) {
        editarManutencao(dados, {
            onSuccess: ({ type, description }) => {
                if (type === "success") {
                    setMostrarEditar(false);
                }

                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: (error) => {
                notification.error({
                    description: error.response?.data?.description || error.message
                });
            }
        })
    }

    function deletar(id) {
        deletarManutencao(id, {
            onSuccess: ({ type, description }) => {
                notification[type]({
                    description,
                    placement: "bottomRight"
                });
            },
            onError: (error) => {
                notification.error({
                    description: error.response?.data?.description || error.message
                });
            }
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Manutenções</h2>

                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >
                    Nova manutenção
                </Button>
            </div>

            <Table
                dataSource={Array.isArray(manutencoes) ? manutencoes : []}
                loading={loadingManutencoes}
                rowKey="id"
                scroll={{ x: "max-content" }}
            >
                <Table.Column
                    title="Imóvel"
                    render={(_, linha) =>
                        `${linha.imoveis.logradouro}, ${linha.imoveis.numero}`
                    }
                />

                <Table.Column
                    title="Descrição"
                    dataIndex="descricao"
                />

                <Table.Column
                    title="Valor"
                    dataIndex="valor"
                    render={(valor) =>
                        valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })
                    }
                />

                <Table.Column
                    title="Data"
                    dataIndex="data"
                    render={(data) =>
                        data.slice(0, 10).split("-").reverse().join("/")
                    }
                />

                <Table.Column
                    title="Ações"
                    render={(_, linha) => (
                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                icon={<LuPencil />}
                                onClick={() => {
                                    formEditar.setFieldsValue({
                                        ...linha,
                                        data: linha.data.slice(0, 10)
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
                                    type="primary"
                                    icon={<LuTrash2 />}
                                />
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>

            <Drawer
                title="Criar manutenção"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                    form={formCriar}
                >
                    <Form.Item
                        label="Imóvel"
                        name="imovel_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Selecione o imóvel"
                            options={imoveis?.map(imovel => ({
                                label: `${imovel.logradouro}, ${imovel.numero}`,
                                value: imovel.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="descricao"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.TextArea placeholder="Descrição da manutenção" />
                    </Form.Item>

                    <Form.Item
                        label="Valor"
                        name="valor"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="Data"
                        name="data"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
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
                title="Editar manutenção"
                open={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                forceRender
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Imóvel"
                        name="imovel_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Selecione o imóvel"
                            options={imoveis?.map(imovel => ({
                                label: `${imovel.logradouro}, ${imovel.numero}`,
                                value: imovel.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="descricao"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.TextArea placeholder="Descrição da manutenção" />
                    </Form.Item>

                    <Form.Item
                        label="Valor"
                        name="valor"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="Data"
                        name="data"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
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
}

export default Manutencoes;