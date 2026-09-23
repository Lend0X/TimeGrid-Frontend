'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    atualizarUsuario,
    buscarUsuarioPorId,
    type UsuarioApi,
} from '@/services/usuarios';
import Image from 'next/image';
import SelectionDropdown, {
    type SelectionOption,
} from '@/components/SelectionDropdown';

export default function UsuarioPage() {
    const params = useParams<{ id: string }>();
    
    const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroEdicao, setErroEdicao] = useState<string | null>(null);

    const [formulario, setFormulario] = useState({
        perfil: 'ALUNO' as UsuarioApi['nivelAutoridade'],
        nome: '',
        matricula: '',
        email: '',
        novaSenha: '',
        turma: '',
    });

    useEffect(() => {
        setModoEdicao(
            new URLSearchParams(window.location.search).get('modo') === 'editar'
        );

        async function carregarUsuario() {
            try {
                const dados = await buscarUsuarioPorId(
                    Number(params.id)
                );

                if (!dados) {
                    setErro('Usuário não encontrado.');
                    return;
                }

                setUsuario(dados);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar o usuário.');
            } finally {
                setCarregando(false);
            }
        }

        carregarUsuario();
    }, [params.id]);

    useEffect(() => {
        if (!usuario) return;

        setFormulario({
            perfil: usuario.nivelAutoridade,
            nome: usuario.nome,
            matricula: String(usuario.matricula),
            email: usuario.email,
            novaSenha: '',
            turma: '',
        });
    }, [usuario]);

    async function handleConfirmarMudancas() {
        if (!usuario) {
            return;
        }

        try {
            setSalvando(true);
            setErroEdicao(null);

            const usuarioAtualizado = await atualizarUsuario(
                usuario.id,
                {
                    nome: formulario.nome,
                    email: formulario.email,

                    ...(formulario.novaSenha.trim() !== ''
                        ? { senha: formulario.novaSenha }
                        : {}),

                    representante: usuario.representante,

                    matricula: Number(formulario.matricula),

                    nivelAutoridade: formulario.perfil,
                }
            );

            if (!usuarioAtualizado) {
                setErroEdicao('Não foi possível atualizar o usuário.');
                return;
            }

            setUsuario(usuarioAtualizado);
            setModoEdicao(false);
        } catch (error) {
            console.error(error);
            setErroEdicao('Não foi possível atualizar o usuário.');
        } finally {
            setSalvando(false);
        }
    }
    if (carregando) {
        return (
            <div className="text-black text-[23px]">
                Carregando usuário...
            </div>
        );
    }

    if (erro || !usuario) {
        return (
            <div className="text-black text-[23px]">
                {erro ?? 'Usuário não encontrado.'}
            </div>
        );
    }

    const configuracaoPerfil = {
        ALUNO: {
            label: 'Aluno',
            icone: '/studante.png',
            larguraIcone: 112,
            alturaIcone: 140,
            topIcone: 52,
            leftIcone: 319,
            topCampos: 214,
        },

        PROFESSOR: {
            label: 'Professor',
            icone: '/prof.png',
            larguraIcone: 134,
            alturaIcone: 136,
            topIcone: 54,
            leftIcone: 308,
            topCampos: 246,
        },

        COORDENADOR: {
            label: 'Coordenador',
            icone: '/cord.png',
            larguraIcone: 135,
            alturaIcone: 142,
            topIcone: 52,
            leftIcone: 307,
            topCampos: 246,
        },

        ADMINISTRADOR_TECNICO: {
            label: 'Adm. Técnico',
            icone: '/admin.png',
            larguraIcone: 135,
            alturaIcone: 138,
            topIcone: 54,
            leftIcone: 307,
            topCampos: 246,
        },
    } as const;

    const opcoesPerfil: SelectionOption<
        'ALUNO' | 'PROFESSOR' | 'COORDENADOR'
    >[] = [
        {
            value: 'ALUNO',
            label: 'Aluno',
        },
        {
            value: 'PROFESSOR',
            label: 'Professor',
        },
        {
            value: 'COORDENADOR',
            label: 'Coordenador',
        },
    ];
    
    // mock de turmas
    const turmas = [
        'TADS-01',
        'TADS-02',
        'TADS-03',
        'TADS-04',
        'TADS-05',
        'TADS-06',
        'TADS-07',
        'TADS-08',
    ];

    const opcoesTurma: SelectionOption<string>[] = turmas.map(
        (turma) => ({
            value: turma,
            label: turma,
        })
    );

    const perfilAtual = configuracaoPerfil[usuario.nivelAutoridade];
    const perfilEdicao = configuracaoPerfil[formulario.perfil];

    if (modoEdicao) {
        return (
            <div className="absolute inset-0 text-black">
                {/* Ícone do usuário */}
                <Image
                    src={perfilEdicao.icone}
                    alt={perfilEdicao.label}
                    width={perfilEdicao.larguraIcone}
                    height={perfilEdicao.alturaIcone}
                    className="absolute"
                    style={{
                        top: `${perfilEdicao.topIcone}px`,
                        left: `${perfilEdicao.leftIcone}px`,
                    }}
                />

                {/* Ícone de quem está administrando */}
                <Image
                    src="/cord.png"
                    alt="Coordenador"
                    width={63}
                    height={66}
                    className="absolute top-[36px] left-[29px]"
                />

                {/* Tipo de Perfil */}
                <span className="absolute top-[62px] left-[497px] text-[23px] leading-[28px]">
                    Tipo de Perfil:
                </span>

                <div className="absolute top-[100px] left-[474px]">
                    <SelectionDropdown
                        value={formulario.perfil}
                        options={opcoesPerfil}
                        onChange={(perfil) =>
                            setFormulario({
                                ...formulario,
                                perfil,
                            })
                        }
                        contentWidth={164}
                        buttonWidth={39}
                    />
                </div>

                {/* Rótulos */}
                <div
                    className="
                        absolute
                        right-[513px]
                        flex
                        flex-col
                        items-end
                        gap-[23px]
                        text-[23px]
                        leading-[28px]
                    "
                    style={{
                        top: `${perfilEdicao.topCampos}px`,
                    }}
                >
                    <span>{perfilEdicao.label}:</span>
                    <span>ID:</span>
                    <span>E-mail:</span>
                    <span>Senha:</span>
                        {formulario.perfil === 'ALUNO' && (
                            <>
                                <span>Turma:</span>
                                <span>Representante:</span>
                            </>
                        )}
                </div>

                {/* Campos */}
                <div
                    className="
                        absolute
                        left-[275px]
                        flex
                        flex-col
                        gap-[23px]
                    "
                    style={{
                        top: `${perfilEdicao.topCampos}px`,
                    }}
                >
                    <input
                        type="text"
                        value={formulario.nome}
                        onChange={(event) =>
                            setFormulario({
                                ...formulario,
                                nome: event.target.value,
                            })
                        }
                        className="
                            w-[347px]
                            h-[28px]
                            rounded-[13px]
                            bg-[#CCCCCC]
                            px-[7px]
                            text-[23px]
                            outline-none
                        "
                    />

                    <input
                        type="text"
                        value={formulario.matricula}
                        onChange={(event) =>
                            setFormulario({
                                ...formulario,
                                matricula: event.target.value,
                            })
                        }
                        className="
                            w-[347px]
                            h-[28px]
                            rounded-[13px]
                            bg-[#CCCCCC]
                            px-[7px]
                            text-[23px]
                            outline-none
                        "
                    />

                    <input
                        type="email"
                        value={formulario.email}
                        onChange={(event) =>
                            setFormulario({
                                ...formulario,
                                email: event.target.value,
                            })
                        }
                        className="
                            w-[347px]
                            h-[28px]
                            rounded-[13px]
                            bg-[#CCCCCC]
                            px-[7px]
                            text-[23px]
                            outline-none
                        "
                    />

                    <input
                        type="password"
                        value={formulario.novaSenha}
                        onChange={(event) =>
                            setFormulario({
                                ...formulario,
                                novaSenha: event.target.value,
                            })
                        }
                        placeholder="*****"
                        className="
                            w-[347px]
                            h-[28px]
                            rounded-[13px]
                            bg-[#CCCCCC]
                            px-[7px]
                            text-[23px]
                            outline-none
                        "
                    />

                    {formulario.perfil === 'ALUNO' && (
                        <>
                            <SelectionDropdown
                                value={formulario.turma}
                                options={opcoesTurma}
                                onChange={(turma) =>
                                    setFormulario({
                                        ...formulario,
                                        turma,
                                    })
                                }
                                searchable
                                contentWidth={302}
                                buttonWidth={43}
                                maxVisibleOptions={5}
                                emptyMessage="Nenhuma turma"
                            />

                            <span className="h-[28px] pl-[7px] text-[23px] leading-[28px]">
                                -
                            </span>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleConfirmarMudancas}
                    disabled={salvando}
                    className="
                        absolute
                        top-[519px]
                        left-[253px]
                        w-[244px]
                        h-[43px]
                        rounded-[10px]
                        bg-[#616161]
                        text-white
                        text-[23px]
                        font-normal
                        cursor-pointer
                    "
                >
                    {salvando ? 'Salvando...' : 'Confirmar Mudanças'}
                </button>

                {erroEdicao && (
                    <span
                        className="
                            absolute
                            top-[570px]
                            left-0
                            w-full
                            text-center
                            text-[16px]
                            text-red-700
                        "
                    >
                        {erroEdicao}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="absolute inset-0 text-black">
            {/* Ícone do usuário visualizado */}
            <Image
                src={perfilAtual.icone}
                alt={perfilAtual.label}
                width={perfilAtual.larguraIcone}
                height={perfilAtual.alturaIcone}
                className="absolute"
                style={{
                    top: `${perfilAtual.topIcone}px`,
                    left: `${perfilAtual.leftIcone}px`,
                }}
            />

            {/* Ícone de quem está administrando */}
            <Image
                src="/cord.png"
                alt="Coordenador"
                width={63}
                height={66}
                className="absolute top-[36px] left-[29px]"
            />

            {/* Rótulos */}
            <div
                className="
                    absolute
                    right-[513px]
                    flex
                    flex-col
                    items-end
                    gap-[23px]
                    text-[23px]
                    leading-[28px]
                "
                style={{
                    top: `${perfilAtual.topCampos}px`,
                }}
            >
                <span>{perfilAtual.label}:</span>
                <span>ID:</span>
                <span>E-mail:</span>
                <span>Senha:</span>
                
                {usuario.nivelAutoridade === 'ALUNO' && (
                    <>
                        <span>Turma:</span>
                        <span>Representante:</span>
                    </>
                )}
            </div>

            {/* Valores */}
            <div
                className="
                    absolute
                    left-[282px]
                    flex
                    flex-col
                    items-start
                    gap-[23px]
                    text-[23px]
                    leading-[28px]
                "
                style={{
                    top: `${perfilAtual.topCampos}px`,
                }}
            >
                <span>{usuario.nome}</span>
                <span>{usuario.matricula}</span>
                <span>{usuario.email}</span>
                <span>*****</span>

                {usuario.nivelAutoridade === 'ALUNO' && (
                    <>
                        <span>-</span>
                        <span>-</span>
                    </>
                )}
            </div>

            <button
                type="button"
                onClick={() => setModoEdicao(true)}
                className="
                    absolute
                    top-[519px]
                    left-[253px]
                    w-[244px]
                    h-[43px]
                    rounded-[10px]
                    bg-[#616161]
                    text-white
                    text-[23px]
                    font-normal
                    cursor-pointer
                "
            >
                Alterar Informações
            </button>
        </div>
    );
}