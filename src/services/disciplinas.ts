import { API_URL } from './api';

export type DisciplinaApi = {
    id: number;
    idDisciplina: number;
    nomeDisciplina: string;
};

export async function listarDisciplinas(): Promise<DisciplinaApi[]> {
    const response = await fetch(`${API_URL}/disciplinas`);

    if (!response.ok) {
        throw new Error(
            `Erro ao listar disciplinas: ${response.status}`
        );
    }

    return response.json();
}

export type CriarDisciplinaPayload = {
    idDisciplina: number;
    nomeDisciplina: string;
};

export async function cadastrarDisciplina(
    dados: CriarDisciplinaPayload
): Promise<void> {
    const response = await fetch(`${API_URL}/disciplinas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error(
            `Erro ao cadastrar disciplina: ${response.status}`
        );
    }
}

export type AtualizarDisciplinaPayload = {
    idDisciplina: number;
    nomeDisciplina: string;
};

export async function atualizarDisciplina(
    id: number,
    dados: AtualizarDisciplinaPayload
): Promise<void> {
    const response = await fetch(`${API_URL}/disciplinas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error(
            `Erro ao atualizar disciplina: ${response.status}`
        );
    }
}

export async function apagarDisciplina(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/disciplinas/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Erro ao apagar disciplina: ${response.status}`);
    }
}