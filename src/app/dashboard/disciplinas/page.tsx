'use client';

import { useEffect, useState } from 'react';
import DisciplinaModal from '@/components/DisciplinaModal';

import ManagementTable, {
    type ManagementTableAction,
    type ManagementTableColumn,
} from '@/components/ManagementTable';

import {
    apagarDisciplina,
    atualizarDisciplina,
    cadastrarDisciplina,
    listarDisciplinas,
    type DisciplinaApi,
    type CriarDisciplinaPayload,
    type AtualizarDisciplinaPayload,
} from '@/services/disciplinas';

export default function DisciplinasPage() {  
    const [disciplinas, setDisciplinas] = useState<DisciplinaApi[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalCriarAberto, setModalCriarAberto] = useState(false);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<DisciplinaApi | null>(null);
    const [modoDisciplina, setModoDisciplina] = useState<
        'visualizar' | 'editar'    
    >('visualizar');

    useEffect(() => {
        async function carregarDisciplinas() {
            try {
                const dados = await listarDisciplinas();
                setDisciplinas(dados);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar as disciplinas.');
            } finally {
                setCarregando(false);
            }
        }

        carregarDisciplinas();
    }, []);

    const handleVisualizar = (disciplina: DisciplinaApi) => {
        setModoDisciplina('visualizar');
        setDisciplinaSelecionada(disciplina);
    };

    const handleEditar = (disciplina: DisciplinaApi) => {
        setModoDisciplina('editar');
        setDisciplinaSelecionada(disciplina);
    };

    const handleApagar = async (disciplina: DisciplinaApi) => {
        const confirmou = window.confirm(
            `Deseja apagar a disciplina "${disciplina.nomeDisciplina}"?`
        );

        if(!confirmou) return;

        try{
            await apagarDisciplina(disciplina.id);

            const disciplinasAtualizadas = await listarDisciplinas();
            setDisciplinas(disciplinasAtualizadas);
            setDisciplinaSelecionada(null);
        } catch (error) {
            console.error(error);
            window.alert('Não foi possível apagar a disciplina.');
        }
    };

    const handleCriar = () => {
        setModalCriarAberto(true);
    };

    const handleConfirmarCriacao = async (
        dados: CriarDisciplinaPayload
    ) => {
        await cadastrarDisciplina(dados);

        const disciplinasAtualizadas = await listarDisciplinas();

        setDisciplinas(disciplinasAtualizadas);
        setModalCriarAberto(false);
    };

    const handleConfirmarEdicao = async (
        dados: AtualizarDisciplinaPayload
    ) => {
        if (!disciplinaSelecionada) return;

        await atualizarDisciplina(
            disciplinaSelecionada.id,
            dados
        );

        const disciplinasAtualizadas = await listarDisciplinas();

        setDisciplinas(disciplinasAtualizadas);
        setDisciplinaSelecionada(null);
    };

    const columns: ManagementTableColumn<DisciplinaApi>[] = [
        {
            header: 'Disciplina',
            render: (disciplina) => disciplina.nomeDisciplina,
        },
        {
            header: 'ID Disciplina',
            render: (disciplina) => disciplina.idDisciplina,
        },
    ];

    const actions: ManagementTableAction<DisciplinaApi>[] = [
        {
            label: 'Visualizar',
            onClick: handleVisualizar,
        },
        {
            label: 'Editar',
            onClick: handleEditar,
        },
        {
            label: 'Apagar',
            onClick: handleApagar,
        },
    ];

    if (carregando) {
        return (
            <div className="text-black text-[23px]">
                Carregando disciplinas...
            </div>
        );
    }

    if (erro) {
        return (
            <div className="text-black text-[23px]">
                {erro}
            </div>
        );
    }

    return (
        <>
            <div className='w-[667px] -translate-y-[20px]'>
                {/* Barra de Pesquisa */}
                <div className="w-[667px] h-[47px] flex rounded-[13px] overflow-hidden mb-[15px] shrink-0">
                    <button
                        type="button"
                        className="w-[55px] h-full bg-[#B0B0B0] flex items-center justify-center border-none cursor-pointer"
                    >
                        <img
                            src="/lupa.png"
                            alt="Pesquisar"
                            className="w-[36px] h-[36px] object-contain"
                        />
                    </button>

                    <input
                        type="text"
                        className="flex-1 bg-white outline-none px-4 text-[18px] text-black border-none"
                    />

                    <button
                        type="button"
                        className="w-[133px] h-full bg-[#AF5757] hover:bg-[#904545] text-white text-[24px] font-normal flex items-center justify-center border-none cursor-pointer transition-colors"
                    >
                        Filtros
                    </button>
                </div>

                <ManagementTable
                    data={disciplinas}
                    columns={columns}
                    getRowKey={(disciplina) => disciplina.id}
                    actions={actions}
                    createAction={{
                        label: 'Criar',
                        onClick: handleCriar,
                    }}
                />
            </div>

            {modalCriarAberto && (
                <DisciplinaModal
                    modo='criar'
                    onClose={() => setModalCriarAberto(false)}
                    onConfirm={handleConfirmarCriacao}
                />
            )}

            {disciplinaSelecionada && (
                <DisciplinaModal
                    key={disciplinaSelecionada.id}
                    modo={modoDisciplina}
                    disciplinaInicial={disciplinaSelecionada}
                    onClose={() => setDisciplinaSelecionada(null)}
                    onConfirm={handleConfirmarEdicao}
                    onApagar={handleApagar}
                />
            )}
        </>
    );
}