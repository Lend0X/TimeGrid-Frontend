'use client';

import { useState } from 'react';
import type { DisciplinaApi } from '@/services/disciplinas';

type DisciplinaModalProps = {
    modo: 'criar' | 'visualizar' | 'editar';
    disciplinaInicial?: DisciplinaApi;

    onClose: () => void;

    onConfirm: (dados: {
        idDisciplina: number;
        nomeDisciplina: string;
    }) => Promise<void>;

    onApagar?: (disciplina: DisciplinaApi) => Promise<void>;
};

export default function DisciplinaModal({
    modo,
    disciplinaInicial,
    onClose,
    onConfirm,
    onApagar,
}: DisciplinaModalProps) {
    const [idDisciplina, setIdDisciplina] = useState(
        disciplinaInicial
            ? String(disciplinaInicial.idDisciplina)
            : ''
    );
    const [nomeDisciplina, setNomeDisciplina] = useState(
        disciplinaInicial?.nomeDisciplina ?? ''
    );
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [modoAtual, setModoAtual] = useState(modo);

    async function handleConfirmar() {
        if (!idDisciplina.trim() || !nomeDisciplina.trim()) {
            setErro('Preencha todos os campos.');
            return;
        }

        const id = Number(idDisciplina);

        if (Number.isNaN(id)) {
            setErro('O ID deve conter apenas números.');
            return;
        }

        try {
            setSalvando(true);
            setErro(null);

            await onConfirm({
                idDisciplina: id,
                nomeDisciplina: nomeDisciplina.trim(),
            });
        } catch (error) {
            console.error(error);
            setErro(
                modoAtual === 'criar'
                    ? 'Não foi possível criar a disciplina.'
                    : 'Não foi possível atualizar a disciplina.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div
            onClick={onClose}
            className="
                absolute inset-0 z-50
                flex items-center justify-center
                bg-black/20
            "
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="
                    relative
                    w-[440px]
                    bg-[#D9D9D9]
                    rounded-[13px]
                    p-[24px]
                    text-black
                "
            >
                {/* Fechar */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="
                        absolute top-[10px] right-[14px]
                        bg-transparent text-black
                        text-[23px] leading-none
                        cursor-pointer
                    "
                >
                    ×
                </button>

                {/* Título */}
                <h2 className="text-[23px] mb-[20px]">
                    {modoAtual === 'criar'
                        ? 'Criar Disciplina'
                        : modoAtual === 'editar'
                            ? 'Editar Disciplina'
                            : 'Disciplina'}
                </h2>

                {/* Informações */}
                {modoAtual === 'visualizar' ? (
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[17px]">ID:</span>

                            <span className="w-[300px] h-[28px] flex items-center px-[7px] text-[17px]">
                                {idDisciplina}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[17px]">
                                Disciplina:
                            </span>

                            <span className="w-[300px] h-[28px] flex items-center px-[7px] text-[17px]">
                                {nomeDisciplina}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="idDisciplina"
                                className="text-[17px]"
                            >
                                ID:
                            </label>

                            <input
                                id="idDisciplina"
                                type="text"
                                value={idDisciplina}
                                onChange={(event) =>
                                    setIdDisciplina(event.target.value)
                                }
                                className="
                                    w-[300px] h-[28px]
                                    rounded-[13px]
                                    bg-[#CCCCCC]
                                    px-[7px] text-[17px]
                                    outline-none
                                "
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="nomeDisciplina"
                                className="text-[17px]"
                            >
                                Disciplina:
                            </label>

                            <input
                                id="nomeDisciplina"
                                type="text"
                                value={nomeDisciplina}
                                onChange={(event) =>
                                    setNomeDisciplina(event.target.value)
                                }
                                className="
                                    w-[300px] h-[28px]
                                    rounded-[13px]
                                    bg-[#CCCCCC]
                                    px-[7px] text-[17px]
                                    outline-none
                                "
                            />
                        </div>
                    </div>
                )}

                {erro && (
                    <p className="mt-[12px] text-[15px] text-red-700">
                        {erro}
                    </p>
                )}

                {/* Botões do Visualizar */}
                {modoAtual === 'visualizar' && (
                    <div className="mt-[24px] flex justify-end gap-[8px]">
                        <button
                            type="button"
                            onClick={() => {
                                if (disciplinaInicial && onApagar) {
                                    void onApagar(disciplinaInicial);
                                }
                            }}
                            disabled={!disciplinaInicial || !onApagar}
                            className="
                                w-[95px] h-[26px]
                                rounded-[5px]
                                bg-[#616161] hover:bg-[#4a4a4a]
                                text-white text-[17px]
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            Apagar
                        </button>

                        <button
                            type="button"
                            onClick={() => setModoAtual('editar')}
                            className="
                                w-[95px] h-[26px]
                                rounded-[5px]
                                bg-[#616161] hover:bg-[#4a4a4a]
                                text-white text-[17px]
                                cursor-pointer
                            "
                        >
                            Editar
                        </button>
                    </div>
                )}

                {/* Botões do Criar e Editar */}
                {modoAtual !== 'visualizar' && (
                    <div className="mt-[24px] flex justify-end gap-[8px]">
                        <button
                            type="button"
                            onClick={() => {
                                if (modoAtual === 'editar' && modo === 'visualizar') {
                                    // Descarta as alterações e retorna à visualização.
                                    setIdDisciplina(
                                        String(disciplinaInicial?.idDisciplina ?? '')
                                    );
                                    setNomeDisciplina(
                                        disciplinaInicial?.nomeDisciplina ?? ''
                                    );
                                    setErro(null);
                                    setModoAtual('visualizar');
                                } else {
                                    onClose();
                                }
                            }}
                            disabled={salvando}
                            className="
                                w-[95px] h-[26px]
                                rounded-[5px]
                                bg-[#616161] hover:bg-[#4a4a4a]
                                text-white text-[17px]
                                cursor-pointer
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmar}
                            disabled={salvando}
                            className="
                                w-[95px] h-[26px]
                                rounded-[5px]
                                bg-[#616161] hover:bg-[#4a4a4a]
                                text-white text-[17px]
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {salvando
                                ? modoAtual === 'criar'
                                    ? 'Criando...'
                                    : 'Salvando...'
                                : modoAtual === 'criar'
                                    ? 'Criar'
                                    : 'Confirmar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}