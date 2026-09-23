'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cadastrarUsuario } from '@/services/usuarios';

export default function Cadastro() {
    const router = useRouter();

    const [erro, setErro] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [id, setId] = useState('');
    const [informarTurma, setInformarTurma] = useState(false);
    const [turma, setTurma] = useState('');

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();

        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim() || !id.trim()) {
            setErro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }
        
        if (Number.isNaN(Number(id))) {
            setErro('O ID deve conter apenas números.');
            return;
        }

        try {
            setErro('');

            await cadastrarUsuario({
                nome: nome.trim(),
                email: email.trim(),
                senha,
                representante: false,
                matricula: Number(id),
                nivelAutoridade: 'ALUNO',
            });

            alert(`Cadastro efetuado com sucesso para: ${nome}`);
            router.push('/login');
        } catch (error) {
            console.error(error);
            setErro('Não foi possível realizar o cadastro.');
        }
    };

    return (
        <main 
            className="min-h-screen flex items-center justify-center p-4"
            style={{
            background: 'linear-gradient(45deg, #F29400 43%, #F2D000 89%)'
            }}
        >
            <div className="bg-[#D9D9D9] rounded-[63px] w-[717px] min-h-[529px] p-8 flex flex-col justify-between shadow-xl text-black">
            
            <div className="text-center">
                <h1 className="text-[40px] font-medium leading-none">TimeGrid</h1>
                <h2 className="text-[32px] font-medium leading-tight mt-2">Cadastro</h2>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col px-4 flex-1 justify-center mt-2">

                <div className="h-5 flex items-center justify-center mb-2">
                {erro && (
                    <p className="text-red-600 text-sm font-medium">{erro}</p>
                )}
                </div>

                <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px]" />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">E-mail:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px]" />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">Senha:</label>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px]" />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">Confirmar senha:</label>
                    <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px]" />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">ID:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px]" />
                </div>

                {!informarTurma ? (
                    <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">Informar Turma?</label>
                    <div className="flex items-center gap-6 flex-1 h-[36px]">
                        <label className="flex items-center gap-2 cursor-pointer text-[20px] font-medium">
                        <input type="radio" name="turma" onChange={() => setInformarTurma(true)} className="w-5 h-5 cursor-pointer accent-[#616161]" /> Sim
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[20px] font-medium">
                        <input type="radio" name="turma" defaultChecked className="w-5 h-5 cursor-pointer accent-[#616161]" /> Não
                        </label>
                    </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                    <label className="text-[20px] font-medium w-[180px] text-right">Turma:</label>
                    <select value={turma} onChange={(e) => setTurma(e.target.value)} className="flex-1 bg-[#CCCCCC] rounded-[13px] h-[36px] px-4 outline-none border-none text-black text-[18px] cursor-pointer appearance-none">
                        <option value="">Selecione uma turma...</option>
                        <option value="1A">Turma 1A</option>
                        <option value="1B">Turma 1B</option>
                    </select>
                    </div>
                )}
                </div>

                <div className="flex justify-center mt-6">
                <button 
                    type="submit" 
                    className="w-[174px] h-[47px] bg-[#616161] hover:bg-[#4a4a4a] text-white text-[24px] font-medium rounded-[13px] border-none cursor-pointer flex items-center justify-center transition-colors"
                >
                    Cadastrar
                </button>
                </div>
            </form>
            </div>
        </main>
    );
}