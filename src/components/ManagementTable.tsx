'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type RowKey = string | number;

export type ManagementTableColumn<T> = {
    header: string;
    width?: number;
    render: (item: T, index: number) => ReactNode;
};

export type ManagementTableAction<T> = {
    label: string;
    onClick: (item: T, index: number) => void;
}

export type ManagementTableCreateAction = {
    label: string;
    onClick: () => void;
};

type ManagementTableProps<T> = {
    data: T[];
    columns: ManagementTableColumn<T>[];
    getRowKey: (item: T, index: number) => RowKey;
    actions?: ManagementTableAction<T>[];
    actionsHeader?: string;
    actionsWidth?: number;
    createAction?: ManagementTableCreateAction;
};

type ActionControlProps<T> = {
    item: T;
    index: number;
    rowKey: RowKey;
    actions: ManagementTableAction<T>[];
    menuAberto: RowKey | null;
    setMenuAberto: (rowKey: RowKey | null) => void;
};

function ActionControl<T>({
    item,
    index,
    rowKey,
    actions,
    menuAberto,
    setMenuAberto,
}: ActionControlProps<T>) {
    const menuEstaAberto = menuAberto === rowKey;

    const triggerRef = useRef<HTMLDivElement>(null);

    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
    });

    const acaoPrincipal = actions[0];
    const acoesSecundarias = actions.slice(1);

    const atualizarPosicaoDropdown = () => {
        if (!triggerRef.current){
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom,
            left: rect.left,
        });
    };

    const executarAcaoPrincipal = () => {
        setMenuAberto(null);
        acaoPrincipal.onClick(item, index);
    };

    const alternarDropdown = () => {
        if (menuEstaAberto){
            setMenuAberto(null);
            return;
        }

        atualizarPosicaoDropdown();
        setMenuAberto(rowKey);
    };

    useEffect(() => {
        if (!menuEstaAberto){
            return;
        }

        const atualizar = () => {
            atualizarPosicaoDropdown();
        };

        window.addEventListener('scroll', atualizar, true);
        window.addEventListener('resize', atualizar);

        return () => {
            window.removeEventListener('scroll', atualizar, true);
            window.removeEventListener('resize', atualizar);
        };
    }, [menuEstaAberto]);

    if (actions.length === 1) {
        return(
            <button
                type="button"
                onClick={executarAcaoPrincipal}
                className='
                    w-[95px]
                    h-[26px]
                    bg-[#616161]
                    hover:bg-[#4a4a4a]
                    text-white
                    text-[17px]
                    font-normal
                    rounded-[5px]
                    border-none
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    transition-colors
                '
            >
                {acaoPrincipal.label}
            </button>
        );
    }

    return(
        <div
            ref={triggerRef}
            className={`relative w-[127px] h-[26px] ${
                menuEstaAberto ? 'z-50' : 'z-0'
            }`}
        >
            {/*Controle principal: Visualizar + seta */}
            <div
                className={`
                    w-[127px]
                    h-[26px]
                    flex
                    bg-[#616161]
                    overflow-hidden
                    ${
                        menuEstaAberto
                            ? 'rounded-t-[5px] rounded-br-[5px]'
                            : 'rounded-[5px]'
                    }
                `}
            >
                {/*Visualizar */}
                <button
                    type="button"
                    onClick={executarAcaoPrincipal}
                    className='
                        w-[95px]
                        h-[26px]
                        bg-transparent
                        hover:bg-[#4a4a4a]
                        text-white
                        text-[17px]
                        font-normal
                        border-none
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        transition-colors
                    '
                >
                    {acaoPrincipal.label}
                </button>

                {/* Seta*/}
                <button
                    type="button"
                    onClick={alternarDropdown}
                    aria-expanded={menuEstaAberto}
                    aria-haspopup="menu"
                    aria-label="Mostrar outras ações"
                    className="
                        w-[32px]
                        h-[26px]
                        bg-transparent
                        hover:bg-[#4a4a4a]
                        text-white
                        border-none
                        border-l-[2px]
                        border-l-[#494949]
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        transition-colors
                    "
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        {menuEstaAberto ? (
                            <polyline points="18 15 12 9 6 15" />
                        ) : (
                            <polyline points="6 9 12 15 18 9" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Dropdown */}
            {menuEstaAberto &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        role="menu"
                        className="
                            fixed
                            w-[95px]
                            bg-[#616161]
                            rounded-b-[5px]
                            overflow-hidden
                            z-[9999]
                        "

                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                    >
                        {/* Separação Visualizar -> primeira opção */}
                        <div className="w-[95px] h-[2px] bg-[#494949]" />

                        {acoesSecundarias.map((action, actionIndex) => (
                            <div key={`${action.label}-${actionIndex}`}>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setMenuAberto(null);
                                        action.onClick(item, index);
                                    }}
                                    className='
                                        w-[95px]
                                        h-[26px]
                                        bg-[#616161]
                                        hover:bg-[#4a4a4a]
                                        text-white
                                        text-[17px]
                                        font-normal
                                        border-none
                                        cursor-pointer
                                        flex
                                        items-center
                                        justify-center
                                        transition-colors
                                    '
                                >
                                    {action.label}
                                </button>

                                {actionIndex < acoesSecundarias.length - 1 && (
                                    <div className="w-[95px] h-[2px] bg-[#494949]" />
                                )}
                            </div>
                        ))}
                    </div>,
                    document.body
                )
            }
        </div>
    );
}

export default function ManagementTable<T>({
    data,
    columns,
    getRowKey,
    actions = [],
    actionsHeader = 'Ações',
    actionsWidth,
    createAction,
}: ManagementTableProps<T>) {
    const [menuAberto, setMenuAberto] = useState<RowKey | null>(null);

    const possuiAcoes = actions.length > 0;

    return(
        <div className='w-[667px]'>
            {/*Tabela*/}
            <div
                className='
                    w-[667px]
                    h-[464px]
                    shrink-0
                    bg-black
                    rounded-[13px]
                    overflow-hidden
                    font-normal
                    relative
                '
            >
                <table
                    className='
                        w-[667px]
                        table-auto
                        border-collapse
                        text-center
                    '
                >
                    {/* Cabeçalho */}
                    <thead>
                        <tr className='h-[47px] bg-black text-white text-[20px] font-normal'>
                            {columns.map((column, index) => (
                                <th
                                    key={`${column.header}-${index}`}
                                    style={
                                        column.width
                                            ? { width: `${column.width}px` }
                                            : undefined
                                    }
                                    className={`
                                        h-[47px]
                                        font-normal
                                        px-2
                                        ${
                                            index > 0
                                                ? 'border-l-[2px] border-white'
                                                : ''
                                        }
                                    `}
                                >
                                    {column.header}
                                </th>
                            ))}

                            {possuiAcoes && (
                                <th
                                    style={
                                        actionsWidth
                                            ? { width: `${actionsWidth}px` }
                                            : undefined
                                    }
                                    className='
                                        h-[47px]
                                        font-normal
                                        px-2
                                        border-l-[2px]
                                        border-white
                                    '
                                >
                                    {actionsHeader}
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Separação entre cabeçalho e corpo */}
                        <tr className='h-[5px]'>
                            <td
                                colSpan={columns.length + (possuiAcoes ? 1 : 0)}
                                className="h-[5px] p-0 bg-white"
                            />
                        </tr>

                        {/* Linhas */}
                        {data.map((item, index) => {
                            const rowKey = getRowKey(item, index);
                            const linhaPreta = index % 2 === 0;

                            return (
                                <tr
                                    key={rowKey}
                                    className={`
                                        h-[40px]
                                        text-center
                                        font-normal
                                        ${
                                            linhaPreta
                                                ? 'bg-black text-white'
                                                : 'bg-[#B0B0B0] text-black'
                                        }
                                    `}
                                >
                                    {columns.map((column, columnIndex) => (
                                        <td
                                            key={`${column.header}-${columnIndex}`}
                                            className={`
                                                h-[40px]
                                                p-0
                                                ${
                                                    columnIndex > 0
                                                        ? 'border-l-[2px] border-l-white'
                                                        : ''
                                                }
                                            `}
                                        >
                                            {column.render(item, index)}
                                        </td>
                                    ))}

                                    {possuiAcoes && (
                                        <td
                                            className='
                                                h-[40px]
                                                p-0
                                                border-l-[2px]
                                                border-l-white
                                                relative
                                            '
                                        >
                                            <div className="w-full h-[40px] flex items-center justify-center overflow-visible">
                                                <ActionControl
                                                    item={item}
                                                    index={index}
                                                    rowKey={rowKey}
                                                    actions={actions}
                                                    menuAberto={menuAberto}
                                                    setMenuAberto={setMenuAberto}
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {createAction && (
                <div className='mt-[6px] flex justify-end'>
                    <button
                        type='button'
                        onClick={createAction.onClick}
                        className='
                            w-[95px]
                            h-[26px]
                            rounded-[5px]
                            bg-[#616161]
                            hover:bg-[#4a4a4a]
                            text-white
                            text-[17px]
                            font-normal
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        '
                    >
                        {createAction.label}
                    </button>
                </div>
            )}
        </div>
    );
}