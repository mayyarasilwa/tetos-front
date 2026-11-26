import { App, Button, Drawer, Form, Input, Popconfirm, Table, Select, Image } from "antd";
import { LuPencil, LuPlus, LuTrash2, LuImageOff } from "react-icons/lu";
import { useBuscarImovel, useCriarImovel, useDeletarImovel, useEditarImovel } from "../hooks/imoveisHooks";
import { useState } from "react";
import { useBuscarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { APIURL } from "../services";

const Imoveis = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [imagem, setImagem] = useState(null);

    const { notification } = App.useApp();

    const { data: imoveis, isLoading: loadingImovel } = useBuscarImovel();
    const { data: tipos } = useBuscarImoveisTipo();
    const { data: locatarios } = useBuscarLocatarios();

    const { mutate: criarImovel, isPending: loadingCriar } = useCriarImovel();
    const { mutate: editarImovel, isPending: loadingEditar } = useEditarImovel();
    const { mutate: deletarImovel } = useDeletarImovel();

    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();

    function criar(dados) {

        const formData = new FormData();

        Object.keys(dados).forEach(campo => {
            if (dados[campo] !== undefined && dados[campo] !== null) {
                formData.append(campo, dados[campo]);
            }
        });

        if (imagem) {
            formData.append("imagem", imagem);
        }

        criarImovel(formData, {
            onSuccess: ({ type, description }) => {
                if (type === "success") {
                    setMostrarCriar(false);
                    formCriar.resetFields();
                    setImagem(null);
                }
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: (error) => {
                notification.error({
                    description: error.response?.data?.description || "Não foi possível cadastrar o imóvel."
                });
            }
        })
    }

    function editar(dados) {
        editarImovel(dados, {
            onSuccess: ({ type, description }) => {
                if (type === "success") {
                    setMostrarEditar(false);
                }
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    function deletar(id) {
        deletarImovel(id, {
            onSuccess: ({ type, description }) => {
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Imóveis</h2>

                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >
                    Novo imóvel
                </Button>
            </div>

            <Table
                dataSource={Array.isArray(imoveis) ? imoveis : []}
                loading={loadingImovel}
                rowKey="id"
            >
                <Table.Column
                    title="Foto"
                    render={(_, linha) => (
                        linha.imagem ? (
                            <Image
                                width={80}
                                height={60}
                                src={`${APIURL}/uploads/imoveis/${encodeURIComponent(linha.imagem)}`}
                                className="object-cover rounded"
                            />
                        ) : (
                            <LuImageOff className="text-3xl text-gray-400" />
                        )
                    )}
                />

                <Table.Column
                    title="Endereço"
                    render={(_, linha) => (
                        `${linha.logradouro} ${linha.numero} ${linha.complemento ? linha.complemento : ""}, ${linha.bairro}, ${linha.cidade}-${linha.estado}`
                    )}
                />

                <Table.Column
                    title="Quartos"
                    dataIndex="quartos"
                    align="center"
                />

                <Table.Column
                    title="Banheiros"
                    dataIndex="banheiros"
                    align="center"
                />

                <Table.Column
                    title="Garagens"
                    render={(_, linha) => linha.garagens ?? "---"}
                    align="center"
                />

                <Table.Column
                    title="Tipo"
                    dataIndex={["imoveis_tipo", "nome"]}
                />

                <Table.Column
                    title="Aluguel"
                    dataIndex="valor_aluguel"
                />

                <Table.Column
                    title="Locatário"
                    render={(_, linha) => (
                        linha.locatarios ? linha.locatarios.nome : "Disponível"
                    )}
                />

                <Table.Column
                    title="Ações"
                    render={(_, linha) => (
                        <div className="flex gap-2">
                            <Button
                                icon={<LuPencil />}
                                type="primary"
                                onClick={() => {
                                    formEditar.setFieldsValue(linha);
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

            <Drawer
                title="Criar imóvel"
                open={mostrarCriar}
                onClose={() => {
                    setMostrarCriar(false);
                    setImagem(null);
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                    form={formCriar}
                >
                    <Form.Item label="Fotografia do imóvel">
                        <Input
                            key={mostrarCriar ? "aberto" : "fechado"}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e => setImagem(e.target.files[0] || null)}
                        />
                    </Form.Item>

                    <Form.Item label="Matrícula" name="matricula">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Logradouro" name="logradouro"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Número" name="numero"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Complemento" name="complemento">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Bairro" name="bairro"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Cidade" name="cidade"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Estado" name="estado"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input maxLength={2} placeholder="CE" />
                    </Form.Item>

                    <Form.Item label="CEP" name="cep"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Metragem" name="metragem"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Quartos" name="quartos"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Suítes" name="suites"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Banheiros" name="banheiros"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Garagens" name="garagens">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Valor do aluguel" name="valor_aluguel"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="IPTU" name="iptu">
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="Condomínio" name="valor_condominio">
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="Tipo de imóvel" name="tipo_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Select
                            options={tipos?.map(tipo => ({
                                label: tipo.nome,
                                value: tipo.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Locatário" name="locatario_id">
                        <Select
                            allowClear
                            options={locatarios?.map(locatario => ({
                                label: locatario.nome,
                                value: locatario.id
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
                title="Editar imóvel"
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

                    <Form.Item label="Matrícula" name="matricula">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Logradouro" name="logradouro"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Número" name="numero"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Complemento" name="complemento">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Bairro" name="bairro"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Cidade" name="cidade"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Estado" name="estado"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input maxLength={2} />
                    </Form.Item>

                    <Form.Item label="CEP" name="cep"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Metragem" name="metragem"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Quartos" name="quartos"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Suítes" name="suites"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Banheiros" name="banheiros"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Garagens" name="garagens">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Valor do aluguel" name="valor_aluguel"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="IPTU" name="iptu">
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="Condomínio" name="valor_condominio">
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item label="Tipo de imóvel" name="tipo_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}>
                        <Select
                            options={tipos?.map(tipo => ({
                                label: tipo.nome,
                                value: tipo.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Locatário" name="locatario_id">
                        <Select
                            allowClear
                            options={locatarios?.map(locatario => ({
                                label: locatario.nome,
                                value: locatario.id
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
}

export default Imoveis;