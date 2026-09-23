'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
    const router = useRouter();

    const [user, setUser] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = (e?: React.SyntheticEvent) => {
        if(e) e.preventDefault();

        if(!user.trim() || !senha.trim()){
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        setErro(''); // limpa mensagens de erro

        // placeholder de chamada do backend
        console.log('Dados de login:', { user, senha });
        alert(`Login efetuado com sucesso para o usuário: ${user}`);
        router.push('/dashboard');
    };

    return (
        <main 
            className='min-h-screen flex items-center justify-center p-4'
            style={{
                background: 'linear-gradient(45deg, #F29400 43%, #F2D000 89%)'
            }}
        >   
            <div className='bg-[#D9D9D9] rounded-[63px] w-[555px] h-[529px] p-8 flex flex-col justify-between shadow-xl text-black'>
        
                <div className='flex justify-between w-full px-4'>
                    <Image 
                        src='/Unifil_Logo_Isolado_Horizontal-01.png' 
                        alt='Logo UniFil' 
                        width={200}
                        height={10}
                        className='object-contain'
                    />
                    <Image
                        src='/npi.png'
                        alt='Logo NPI'
                        width={190}
                        height={20} 
                        className='object-contain'
                    />
                </div>

                <div className='text-center'>
                    <h1 className='text-[40px] font-medium leading-none'>TimeGrid</h1>
                    <h2 className='text-[32px] font-medium leading-tight mt-4'>Login</h2>
                </div>

                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-3 px-6'>
                    <div className='h-[5px] flex items-center justify-center'>
                        {erro && (
                            <p className='text-red-600 text-sm text-center font-medium'>{erro}</p>
                        )}
                    </div>

                    <div className='flex items-center gap-4'>
                        <label className='text-[24px] font-medium w-24 text-right'>User:</label>
                        <input
                            type='text'
                            value={user}
                            onChange={(e) => setUser(e.target.value)} 
                            className='flex-1 bg-[#CCCCCC] rounded-[13px] h-[38px] px-4 outline-none border-none text-black text-[18px]'
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <label className='text-[24px] font-medium w-24 text-right'>Senha:</label>
                        <input 
                            type='password'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                            className='flex-1 bg-[#CCCCCC] rounded-[13px] h-[38px] px-4 outline-none border-none text-black text-[18px]'
                        />
                    </div>

                    <div className='flex justify-between text-[16px] font-medium mt-2'>
                        <div className='flex flex-col'>
                            <span>É novo aqui?</span>
                            <span>Esqueceu a senha?</span>
                        </div>
                        <div className='flex flex-col text-right'>
                            <Link href='/cadastro' className='text-black no-underline hover:underline'>
                                Cadastre-se
                            </Link>
                            <button type='button' className='text-black bg-transparent border-none p-0 cursor-pointer text-right hover:underline font-medium text-[16px]'>
                                Clique aqui
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-center mt-3'>
                        <button 
                            type='submit'
                            className='w-[174px] h-[47px] bg-[#616161] hover:bg-[#4a4a4a] text-white text-[24px] font-medium rounded-[13px] border-none cursor-pointer flex items-center justify-center transition-colors'
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}