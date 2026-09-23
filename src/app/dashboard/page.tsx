'use client';

import { useState } from 'react';
import ManagementTable, {
    type ManagementTableAction,
    type ManagementTableColumn,
} from '@/components/ManagementTable';

type PerfilAcesso =
    | 'ALUNO'
    | 'PROFESSOR'
    | 'COORDENADOR'
    | 'TECNICO';

type Grade = {
    id: number;
};

export default function GradesPage() {
    // SIMULAÇÃO: Muda valor para testar (ALUNO, PROFESSOR, COORDENADOR, TECNICO)
    const [perfilAcesso] = useState<PerfilAcesso>('COORDENADOR');

    const quantidadeGrades = perfilAcesso === 'ALUNO' ? 1 : 10;

    const grades: Grade[] = Array.from(
        { length: quantidadeGrades },
        (_, index) => ({
            id: index,
        })
    );

    const podeGerenciar =
        perfilAcesso === 'COORDENADOR' ||
        perfilAcesso === 'TECNICO';

    const podePesquisar = perfilAcesso !== 'ALUNO';

    const handleVisualizar = (grade: Grade, index: number) => {
        // Lógica para abrir a visualização da grade da turma
        console.log(`Visualizar turma na linha ${index}`, grade);
    };

    const handleEditar = (grade: Grade, index: number) => {
        console.log(`Editar turma na linha ${index}`, grade);
    };

    const handleApagar = (grade: Grade, index: number) => {
        console.log(`Apagar turma na linha ${index}`, grade);
    };

    const columns: ManagementTableColumn<Grade>[] = [
        {
            header: 'Turma (ID)',
            render: () => '',
        },
        {
            header: 'Representante',
            render: () => '',
        },
        {
            header: 'Curso',
            render: () => '',
        },
    ];

    const actions: ManagementTableAction<Grade>[] = podeGerenciar
        ? [
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
        ]
        : [
            {
                label: 'Visualizar',
                onClick: handleVisualizar,
            },
        ];

    return (
        <>
            {/* Barra de Pesquisa */}
            {podePesquisar ? (
                <div className="w-[667px] h-[47px] flex rounded-[13px] overflow-hidden mb-[15px] shrink-0">
                    <button className="w-[55px] h-full bg-[#B0B0B0] flex items-center justify-center border-none cursor-pointer">
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

                    <button className="w-[133px] h-full bg-[#AF5757] hover:bg-[#904545] text-white text-[24px] font-normal flex items-center justify-center border-none cursor-pointer transition-colors">
                        Filtros
                    </button>
                </div>
            ) : (
                <div className="h-[47px] mb-[15px] shrink-0 flex items-center">
                    <span className="text-[20px] font-medium text-black">
                        Sua Turma
                    </span>
                </div>
            )}

            <ManagementTable
                data={grades}
                columns={columns}
                getRowKey={(grade) => grade.id}
                actions={actions}
            />
        </>
    );
}