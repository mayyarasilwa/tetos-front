import { App, Button, Drawer, Form, Input, Popconfirm, Table, Select } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarHistoricoImovel, useCriarHistoricoImovel, useEditarHistoricoImovel, useDeletarHistoricoImovel } from "../hooks/historicoImovelHooks";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { useState } from "react";

const HistoricoImovel = () => {
    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);

    const { notification } = App.useApp();

    const { data: historicos, isLoading: loadingHistoricos } = useBuscarHistoricoImovel();
    const { data: imoveis } = useBuscarImovel();
    const { data: locatarios } = useBuscarLocatarios();

    const { mutate: criarHistorico, isPending: loadingCriar } = useCriarHistoricoImovel();
    const { mutate: editarHistorico, isPending: loadingEditar } = useEditarHistoricoImovel();
    const { mutate: deletarHistorico } = useDeletarHistoricoImovel();

    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarHistorico(dados, {
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
        editarHistorico(dados, {
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
        deletarHistorico(id, {
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
                <h2 className="text-3xl font-bold">Histórico de Imóveis</h2>

                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >
                    Novo histórico
                </Button>
            </div>

            <Table
                dataSource={Array.isArray(historicos) ? historicos : []}
                loading={loadingHistoricos}
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
                    title="Locatário"
                    dataIndex={["locatarios", "nome"]}
                />

                <Table.Column
                    title="Descrição"
                    dataIndex="descricao"
                />

                <Table.Column
                    title="Data de entrada"
                    dataIndex="data_entrada"
                    render={(data) =>
                        data.slice(0, 10).split("-").reverse().join("/")
                    }
                />

                <Table.Column
                    title="Data de saída"
                    dataIndex="data_saida"
                    render={(data) =>
                        data.slice(0, 10).split("-").reverse().join("/")
                    }
                />

                <Table.Column
                    title="Aluguel"
                    dataIndex="valor_aluguel"
                    render={(valor) =>
                        valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })
                    }
                />

                <Table.Column
                    title="IPTU"
                    dataIndex="valor_iptu"
                    render={(valor) =>
                        valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })
                    }
                />

                <Table.Column
                    title="Condomínio"
                    dataIndex="valor_condominio"
                    render={(valor) =>
                        valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })
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
                                        data_entrada: linha.data_entrada.slice(0, 10),
                                        data_saida: linha.data_saida.slice(0, 10)
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
                title="Criar histórico"
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
                        label="Locatário"
                        name="locatario_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Selecione o locatário"
                            options={locatarios?.map(locatario => ({
                                label: locatario.nome,
                                value: locatario.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="descricao"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.TextArea placeholder="Descrição do histórico" />
                    </Form.Item>

                    <Form.Item
                        label="Data de entrada"
                        name="data_entrada"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Data de saída"
                        name="data_saida"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Valor do aluguel"
                        name="valor_aluguel"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="IPTU"
                        name="valor_iptu"
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="Condomínio"
                        name="valor_condominio"
                    >
                        <Input type="number" step="0.01" min="0" />
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
                title="Editar histórico"
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
                        label="Locatário"
                        name="locatario_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Selecione o locatário"
                            options={locatarios?.map(locatario => ({
                                label: locatario.nome,
                                value: locatario.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="descricao"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.TextArea placeholder="Descrição do histórico" />
                    </Form.Item>

                    <Form.Item
                        label="Data de entrada"
                        name="data_entrada"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Data de saída"
                        name="data_saida"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Valor do aluguel"
                        name="valor_aluguel"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="IPTU"
                        name="valor_iptu"
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="Condomínio"
                        name="valor_condominio"
                    >
                        <Input type="number" step="0.01" min="0" />
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

export default HistoricoImovel;