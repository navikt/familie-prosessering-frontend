import * as React from 'react';

export type Statusvariant = 'feil' | 'ok' | 'manuell' | 'info';

interface IProps {
    variant: Statusvariant;
    tekst: string;
}

const Statuspill: React.FC<IProps> = ({ variant, tekst }) => (
    <span className={`statuspill statuspill--${variant}`}>
        <span className="statuspill__ikon">
            {variant === 'ok' ? (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M3 8.5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </span>
        {tekst}
    </span>
);

export default Statuspill;
