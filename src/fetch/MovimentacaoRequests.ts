import type MovimentacaoDTO from "../dto/MovimentacaoDTO";

//const API_URL = "http://localhost:3000";
import { API_URL } from '../config/api';

function getHeaders(includeContentType = true): HeadersInit {
    const headers: Record<string, string> = {};
    if (includeContentType) {
        headers["Content-Type"] = "application/json";
    }
    const token = localStorage.getItem("@TechForge:token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

export class MovimentacaoRequests {

    /**
     * Rota: GET /movimentacoes
     */
    static async listarTodas(): Promise<MovimentacaoDTO[]> {
        try {
            const response = await fetch(`${API_URL}/movimentacoes`, {
                headers: getHeaders(false)
            });
            if (response.status === 204) return [];
            if (!response.ok) throw new Error("Erro ao buscar movimentações.");
            return await response.json();
        } catch (error) {
            console.error("Erro ao listar movimentações:", error);
            throw error;
        }
    }

    /**
     * Rota: POST /movimentacoes
     */
    static async cadastrar(movimentacao: Partial<MovimentacaoDTO>): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/movimentacoes`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(movimentacao)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao cadastrar (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao cadastrar movimentação.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao cadastrar movimentação:", error);
            return false;
        }
    }

    /**
     * Rota: PUT /movimentacoes/:id
     */
    static async atualizar(movimentacao: any): Promise<boolean> {
        try {
            const id = movimentacao.id_movimentacao ?? movimentacao.id;

            if (!id) {
                alert("Não foi possível identificar o ID da movimentação para atualização.");
                return false;
            }

            const response = await fetch(`${API_URL}/movimentacoes/${id}`, {
                method: "PUT",
                headers: getHeaders(true),
                body: JSON.stringify(movimentacao)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao atualizar (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao atualizar movimentação.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao atualizar movimentação:", error);
            return false;
        }
    }

    /**
     * Rota: DELETE /movimentacoes/:id
     */
    static async remover(idOuObjeto: any): Promise<boolean> {
        try {
            const id = typeof idOuObjeto === "object"
                ? (idOuObjeto.id_movimentacao ?? idOuObjeto.id)
                : idOuObjeto;

            if (!id) {
                alert("Não foi possível identificar o ID da movimentação para exclusão.");
                return false;
            }

            const response = await fetch(`${API_URL}/movimentacoes/${id}`, {
                method: "DELETE",
                headers: getHeaders(false)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao remover (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao remover movimentação.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao remover movimentação:", error);
            return false;
        }
    }
}