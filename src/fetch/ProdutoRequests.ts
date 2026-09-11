import type { ProdutoDTO } from "../dto/ProdutoDTO";

const API_URL = "http://localhost:3000";

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

export class ProdutoRequests {

    /**
     * Rota: GET /produtos
     */
    static async listarTodos(): Promise<ProdutoDTO[]> {
        try {
            const response = await fetch(`${API_URL}/produtos`, {
                headers: getHeaders(false)
            });
            if (response.status === 204) return [];
            if (!response.ok) throw new Error("Erro ao buscar produtos.");
            return await response.json();
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            throw error;
        }
    }

    /**
     * Rota: POST /produto
     */
    static async cadastrar(produto: Partial<ProdutoDTO>): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/produto`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao cadastrar (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao cadastrar produto.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            return false;
        }
    }

    /**
     * Rota: PUT /produto/:id
     * Garante a leitura do id do produto independente do nome da propriedade
     */
    static async atualizar(produto: any): Promise<boolean> {
        try {
            const id = produto.id_produto ?? produto.id;

            if (!id) {
                alert("Não foi possível identificar o ID do produto para atualização.");
                return false;
            }

            const response = await fetch(`${API_URL}/produto/${id}`, {
                method: "PUT",
                headers: getHeaders(true),
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao atualizar (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao atualizar produto.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            return false;
        }
    }

    /**
     * Rota: DELETE /produto/:id
     * Aceita tanto o número do ID direto quanto o objeto do produto
     */
    static async remover(idOuObjeto: any): Promise<boolean> {
        try {
            const id = typeof idOuObjeto === "object" 
                ? (idOuObjeto.id_produto ?? idOuObjeto.id) 
                : idOuObjeto;

            if (!id) {
                alert("Não foi possível identificar o ID do produto para exclusão.");
                return false;
            }

            const response = await fetch(`${API_URL}/produto/${id}`, {
                method: "DELETE",
                headers: getHeaders(false)
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                console.error(`Erro ao remover (${response.status}):`, erro);
                alert(erro.mensagem || "Erro ao remover produto.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            return false;
        }
    }
}