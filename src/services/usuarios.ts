import { API_URL } from './api';

export type NivelAutoridadeApi =
    | 'ALUNO'
    | 'PROFESSOR'
    | 'COORDENADOR'
    | 'ADMINISTRADOR_TECNICO';

export type UsuarioApi = {
    id: number;
    nome: string;
    email: string;
    representante: boolean;
    matricula: number;
    nivelAutoridade: NivelAutoridadeApi;
};

export type CriarUsuarioPayload = {
    nome: string;
    email: string;
    senha: string;
    representante: boolean;
    matricula: number;
    nivelAutoridade: NivelAutoridadeApi;
};

export type AtualizarUsuarioPayload = {
    nome: string;
    email: string;
    senha?: string;
    representante: boolean;
    matricula: number;
    nivelAutoridade: NivelAutoridadeApi;
};

export async function listarUsuarios(): Promise<UsuarioApi[]> {
    const response = await fetch(`${API_URL}/usuarios`);

    if (!response.ok) {
        throw new Error(
            `Erro ao listar usuários: ${response.status}`
        );
    }

    return response.json();
}

export async function buscarUsuarioPorId(
    id: number
): Promise<UsuarioApi | null> {
    const response = await fetch(`${API_URL}/usuarios/${id}`);

    if (response.status === 404 || response.status === 204) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Erro ao buscar usuário: ${response.status}`
        );
    }

    const texto = await response.text();

    if (!texto.trim()) {
        return null;
    }

    return JSON.parse(texto) as UsuarioApi;
}

export async function cadastrarUsuario(
    dados: CriarUsuarioPayload
): Promise<UsuarioApi> {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error(
            `Erro ao cadastrar usuário: ${response.status}`
        );
    }

    return response.json();
}

export async function atualizarUsuario(
    id: number,
    dados: AtualizarUsuarioPayload
): Promise<UsuarioApi | null> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error(
            `Erro ao atualizar usuário: ${response.status}`
        );
    }

    return response.json();
}

export async function excluirUsuario(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(
            `Erro ao excluir usuário: ${response.status}`
        );
    }
}