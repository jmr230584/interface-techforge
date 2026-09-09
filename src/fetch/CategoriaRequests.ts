// src/fetch/CategoriaRequests.ts
import type CategoriaDTO from '../dto/CategoriaDTO';

const BASE_URL = 'http://localhost:3000';

export class CategoriaRequests {
  /**
   * Listar todas as categorias
   * Endpoint: GET /categorias
   */
  static async listarTodas(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch(`${BASE_URL}/categorias`);
      if (!response.ok) throw new Error('Erro ao buscar categorias.');

      const dados = await response.json();
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro em CategoriaRequests.listarTodas:', error);
      throw error;
    }
  }

  /**
   * Buscar categoria por ID
   * Endpoint: GET /categoria/:id
   */
  static async buscarPorId(id: number | string): Promise<CategoriaDTO | null> {
    try {
      const response = await fetch(`${BASE_URL}/categoria/${id}`);
      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.error('Erro em CategoriaRequests.buscarPorId:', error);
      return null;
    }
  }

  /**
   * Cadastrar nova categoria
   * Endpoint: POST /categoria
   */
  static async cadastrar(categoria: Partial<CategoriaDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em CategoriaRequests.cadastrar:', error);
      return false;
    }
  }

  /**
   * Atualizar categoria existente
   * Endpoint: PUT /categoria/:id
   */
  static async atualizar(id: number | string, categoria: Partial<CategoriaDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/categoria/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro em CategoriaRequests.atualizar:', error);
      return false;
    }
  }

  static async deletar(id: number | string): Promise<{ sucesso: boolean; mensagem?: string }> {
    try {
        const response = await fetch(`${BASE_URL}/categoria/${id}`, {
            method: 'DELETE',
        });

        const dados = await response.json().catch(() => ({}));

        if (response.ok) {
            return { sucesso: true, mensagem: dados.mensagem || "Categoria excluída com sucesso." };
        }

        return { 
            sucesso: false, 
            mensagem: dados.mensagem || "Erro ao tentar excluir a categoria." 
        };
    } catch (error) {
        console.error('Erro em CategoriaRequests.deletar:', error);
        return { sucesso: false, mensagem: "Erro ao conectar com o servidor para exclusão." };
    }
}
}