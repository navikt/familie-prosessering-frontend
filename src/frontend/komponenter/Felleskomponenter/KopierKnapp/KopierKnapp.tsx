import React, { useState } from 'react';

interface IProps {
    verdi: string;
    etikett: string;
}

const KopierKnapp: React.FC<IProps> = ({ verdi, etikett }) => {
    const [erKopiert, settErKopiert] = useState(false);

    const håndterKlikk = async () => {
        try {
            await navigator.clipboard.writeText(verdi);
        } catch {
            const tempInput = document.createElement('textarea');
            tempInput.value = verdi;
            document.body.appendChild(tempInput);
            tempInput.select();
            try {
                document.execCommand('copy');
            } catch {
                // ignorerer feil ved fallback
            }
            document.body.removeChild(tempInput);
        }
        settErKopiert(true);
        setTimeout(() => settErKopiert(false), 1400);
    };

    return (
        <button
            type="button"
            className={`kopier-knapp ${erKopiert ? 'kopiert' : ''}`}
            onClick={håndterKlikk}
            aria-label={erKopiert ? `Kopiert ${etikett}` : `Kopier ${etikett}`}
            title={erKopiert ? 'Kopiert!' : `Kopier ${etikett}`}
        >
            {erKopiert ? (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect
                        x="5"
                        y="5"
                        width="8.5"
                        height="8.5"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                    />
                    <path
                        d="M3 11V3.5A1.5 1.5 0 014.5 2H10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </button>
    );
};

export default KopierKnapp;
