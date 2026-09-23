'use client';

import ManagementTable, {
    type ManagementTableAction,
    type ManagementTableColumn,
} from "@/components/ManagementTable";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    excluirUsuario,
    listarUsuarios,
    type UsuarioApi,
} from '@/services/usuarios';

export default function UsuariosPage() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const dados = await listarUsuarios();
                setUsuarios(dados);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar os usuários.');
            } finally {
                setCarregando(false);
            }
        }

        carregarUsuarios();
    }, []);

    const handleVisualizar = (usuario: UsuarioApi) => {
        router.push(`/dashboard/usuarios/${usuario.id}`);
    };

    const handleEditar = (usuario: UsuarioApi) => {
        router.push(`/dashboard/usuarios/${usuario.id}?modo=editar`);
    };

    const handleApagar = async (usuario: UsuarioApi) => {
        const confirmou = window.confirm(
            `Deseja realmente apagar o usuário "${usuario.nome}"?`
        );

        if (!confirmou) {
            return;
        }

        try {
            await excluirUsuario(usuario.id);

            setUsuarios((usuariosAtuais) =>
                usuariosAtuais.filter(
                    (usuarioAtual) => usuarioAtual.id !== usuario.id
                )
            );
        } catch (error) {
            console.error(error);

            window.alert(
                'Não foi possível apagar o usuário.'
            );
        }
    };

    
    function formatarPerfil(perfil: UsuarioApi['nivelAutoridade']) {
        switch (perfil) {
            case 'ALUNO':
                return 'Aluno';

            case 'PROFESSOR':
                return 'Professor';

            case 'COORDENADOR':
                return 'Coordenador';

            case 'ADMINISTRADOR_TECNICO':
                return 'Administrador Técnico';
        }
    }

    const columns: ManagementTableColumn<UsuarioApi>[] = [
        {
            header: 'Perfil',
            width: 146,
            render: (usuario) => formatarPerfil(usuario.nivelAutoridade),
        },
        {
            header: 'Usuário',
            width: 178,
            render: (usuario) => usuario.nome,
        },
        {
            header: 'ID Matrícula',
            width: 165,
            render: (usuario) => usuario.matricula,
        },
    ];

    const actions: ManagementTableAction<UsuarioApi>[] = [
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

    if(carregando){
        return(
            <div className="text-black text-[23px]">
                Carregando usuários...
            </div>
        );
    }

    if(erro){
        return(
            <div className="text-black text-[23px]">
                {erro}
            </div>
        );
    }

    return (
        <>
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
                data={usuarios}
                columns={columns}
                getRowKey={(usuario) => usuario.id}
                actions={actions}
                actionsWidth={172}
            />
        </>
    );
}