'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type SelectionOption<T extends string> = {
    value: T;
    label: string;
};

type SelectionDropdownProps<T extends string> = {
    value: T;
    options: readonly SelectionOption<T>[];
    onChange: (value: T) => void;

    searchable?: boolean;

    contentWidth: number;
    buttonWidth: number;

    maxVisibleOptions?: number;
    emptyMessage?: string;
};

export default function SelectionDropdown<T extends string>({
    value,
    options,
    onChange,
    searchable = false,
    contentWidth,
    buttonWidth,
    maxVisibleOptions = 5,
    emptyMessage = 'Nenhuma opção',
}: SelectionDropdownProps<T>) {
    const [aberto, setAberto] = useState(false);
    const [textoCampo, setTextoCampo] = useState('');
    const [filtro, setFiltro] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);

    const opcaoSelecionada = options.find(
        (option) => option.value === value
    );

    const textoSelecionado = opcaoSelecionada?.label ?? value;

    const larguraTotal = contentWidth + 2 + buttonWidth;

    const opcoesFiltradas = useMemo(() => {
        if (!searchable || filtro.trim() === '') {
            return options;
        }

        return options.filter((option) =>
            option.label
                .toLowerCase()
                .includes(filtro.toLowerCase())
        );
    }, [options, filtro, searchable]);

    const precisaScroll = opcoesFiltradas.length > maxVisibleOptions;

    /*
     * Mantém o texto mostrado sincronizado
     * com o valor realmente selecionado.
     */
    useEffect(() => {
        if (!aberto) {
            setTextoCampo(textoSelecionado);
            setFiltro('');
        }
    }, [textoSelecionado, aberto]);

    /*
     * Fecha o dropdown se clicar fora dele.
     */
    useEffect(() => {
        function handleCliqueFora(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setAberto(false);
                setTextoCampo(textoSelecionado);
                setFiltro('');
            }
        }

        document.addEventListener('mousedown', handleCliqueFora);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleCliqueFora
            );
        };
    }, [textoSelecionado]);

    function alternarDropdown() {
        setAberto((estadoAtual) => {
            const novoEstado = !estadoAtual;

            // A seta abre todas as opções sem apagar visualmente o valor selecionado.
            setTextoCampo(textoSelecionado);
            setFiltro('');

            return novoEstado;
        });
    }

    function selecionarOpcao(option: SelectionOption<T>) {
        onChange(option.value);

        setTextoCampo(option.label);
        setFiltro('');
        setAberto(false);
    }

    return (
        <div
            ref={containerRef}
            className="relative h-[28px]"
            style={{ width: `${larguraTotal}px` }}
        >
            {/* Controle principal */}
            <div
                className={`
                    flex
                    h-[28px]
                    overflow-hidden
                    bg-[#CCCCCC]
                    ${
                        aberto
                            ? 'rounded-t-[13px] rounded-br-[13px]'
                            : 'rounded-[13px]'
                    }
                `}
                style={{ width: `${larguraTotal}px` }}
            >
                {searchable ? (
                    <input
                        type="text"
                        value={textoCampo}
                        onFocus={(event) => {
                            setAberto(true);
                            setFiltro('');
                            event.currentTarget.select();
                        }}
                        onChange={(event) => {
                            setTextoCampo(event.target.value);
                            setFiltro(event.target.value);
                            setAberto(true);
                        }}
                        className="
                            h-[28px]
                            bg-[#CCCCCC]
                            pl-[7px]
                            pr-0
                            text-[23px]
                            outline-none
                        "
                        style={{ width: `${contentWidth}px` }}
                    />
                ) : (
                    <div
                        className="
                            h-[28px]
                            pl-[7px]
                            flex
                            items-center
                            text-[23px]
                        "
                        style={{ width: `${contentWidth}px` }}
                    >
                        {textoSelecionado}
                    </div>
                )}

                {/* Divisória */}
                <div
                    className="
                        w-[2px]
                        h-[28px]
                        shrink-0
                        bg-[#B0B0B0]
                    "
                />

                {/* Botão da seta */}
                <button
                    type="button"
                    onClick={alternarDropdown}
                    aria-expanded={aberto}
                    className="
                        h-[28px]
                        shrink-0
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                    "
                    style={{ width: `${buttonWidth}px` }}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1 3.5L6 8.5L11 3.5"
                            stroke="black"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Lista */}
            {aberto && (
                <div
                    className={`
                        absolute
                        top-[28px]
                        left-0
                        overflow-y-auto
                        overflow-x-hidden
                        bg-[#CCCCCC]
                        rounded-b-[13px]
                        z-50
                        ${
                            precisaScroll
                                ? 'overflow-y-auto'
                                : 'overflow-y-hidden'
                        }
                    `}
                    style={{
                        width: `${contentWidth}px`,
                        maxHeight: `${maxVisibleOptions * 28}px`,
                    }}
                >
                    {opcoesFiltradas.length > 0 ? (
                        opcoesFiltradas.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    selecionarOpcao(option)
                                }
                                className="
                                    w-full
                                    h-[28px]
                                    shrink-0
                                    pl-[7px]
                                    flex
                                    items-center
                                    text-left
                                    text-[23px]
                                    cursor-pointer
                                    hover:bg-[#B0B0B0]
                                "
                            >
                                {option.label}
                            </button>
                        ))
                    ) : (
                        <div
                            className="
                                w-full
                                h-[28px]
                                pl-[7px]
                                flex
                                items-center
                                text-[23px]
                            "
                        >
                            {emptyMessage}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}