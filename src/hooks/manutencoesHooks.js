import { useMutation, useQuery } from "@tanstack/react-query";
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarManutencoes = () => {
    return useQuery({
        queryKey: ["manutencoes"],
        queryFn: async () => {
            const res = await AXIOS.get("/manutencoes");
            return res.data;
        }
    });
}

export const useCriarManutencao = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/manutencoes", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ queryKey: ["manutencoes"] });
        }
    })
}

export const useEditarManutencao = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/manutencoes/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ queryKey: ["manutencoes"] });
        }
    })
}

export const useDeletarManutencao = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/manutencoes/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ queryKey: ["manutencoes"] });
        }
    })
}