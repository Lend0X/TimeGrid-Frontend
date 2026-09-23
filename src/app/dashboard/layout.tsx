'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { it } from 'node:test';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // SIMULAÇÃO: Mudar valor para testar (ALUNO, PROFESSOR, COORDENADOR, TECNICO)
  const [perfilAcesso] = useState('COORDENADOR');
  const podeGerenciar = perfilAcesso === 'COORDENADOR' || perfilAcesso === 'TECNICO';
  const [submenuGerenciarAberto, setSubmenuGerenciarAberto] = useState(false);

  const pathname = usePathname();
  const gradesAtivo = pathname === '/dashboard';
  const perfilAtivo = pathname === '/dashboard/perfil';

  const itensGerenciamento = [
    { label: 'Usuário', href: '/dashboard/usuarios' },
    { label: 'Turma', href: '/dashboard/turmas' },     
    { label: 'Sala', href: '/dashboard/salas' },
    { label: 'Disciplina', href: '/dashboard/disciplinas' },
  ] as const;

  const gerenciamentoAtual = itensGerenciamento.find((item) =>
    pathname.startsWith(item.href)
  );

  const gerenciamentoAtivo = gerenciamentoAtual !== undefined;

  const gerenciarSelecionado = submenuGerenciarAberto || gerenciamentoAtivo;

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(45deg, #F29400 43%, #F2D000 89%)' }}
    >
      <div className="w-[1029px] h-[599px] flex rounded-[63px] overflow-hidden shadow-2xl">
        
        {/*Menu Lateral*/}
        <aside className="w-[279px] h-full bg-[#F8AD34] flex flex-col items-center py-12 relative">
          <h1 className="text-[40px] font-medium text-black mb-16">TimeGrid</h1>
          
          <nav className="absolute bottom-[123px] flex flex-col gap-[28px] w-full items-center">
            <Link href="/dashboard" className={`w-[178px] h-[47px] text-[24px] font-normal rounded-[13px] flex items-center justify-center no-underline transition-colors ${
              gradesAtivo
                ? 'bg-[#9E9E9E] text-black'
                : 'bg-[#616161] text-white hover:bg-[#4a4a4a]'
            }`}>
              Grades
            </Link>

            <Link href="/dashboard/perfil" className={`w-[178px] h-[47px] text-[24px] font-normal rounded-[13px] flex items-center justify-center no-underline transition-colors ${
              perfilAtivo
                ? 'bg-[#9E9E9E] text-black'
                : 'bg-[#616161] text-white hover:bg-[#4a4a4a]'
            }`}>
              Perfil
            </Link>

            {podeGerenciar && (
              <div className="relative">
                <button
                  onClick={() => setSubmenuGerenciarAberto((aberto) => !aberto)}
                  className={`w-[178px] h-[47px] text-[24px] font-normal rounded-[13px] flex items-center justify-center transition-colors ${
                    gerenciarSelecionado
                      ? 'bg-[#9E9E9E] text-black'
                      : 'bg-[#616161] text-white hover:bg-[#4a4a4a]'
                  }`}
                >
                  {submenuGerenciarAberto
                    ? 'Gerenciar'
                    : gerenciamentoAtual
                        ? `Ger: ${gerenciamentoAtual.label}`
                        : 'Gerenciar'}
                </button>

                {submenuGerenciarAberto && (
                  <div className="absolute left-[228px] top-1/2 -translate-y-1/2 w-[181px] h-[256px] bg-[#F8AD34] rounded-r-[13px] flex flex-col items-center justify-center gap-[12px] z-10">
                    {itensGerenciamento.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSubmenuGerenciarAberto(false)}
                        className={`w-[140px] h-[41px] text-[23px] font-normal rounded-[9px] flex items-center justify-center no-underline transition-colors ${
                          pathname.startsWith(item.href)
                            ? 'bg-[#9E9E9E] text-black'
                            : 'bg-[#616161] text-white hover:bg-[#4a4a4a]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="absolute bottom-12">
            <Link href="/login" className="w-[178px] h-[47px] bg-[#616161]/50 hover:bg-[#616161]/70 text-black text-[24px] font-normal rounded-[13px] flex items-center justify-center gap-3 transition-colors no-underline">
              <img src="/logout.png" alt="Sair" className="w-[36px] h-[36px] object-contain" />
              Logout
            </Link>
          </div>
        </aside>

        <section className="w-[750px] h-full bg-[#D9D9D9] flex flex-col items-center py-10 px-10 relative">
          {children}
        </section>

      </div>
    </main>
  );
}