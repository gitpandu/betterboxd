import { X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    danger = true
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--color-bg-card)',
                width: '100%',
                maxWidth: '380px',
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                border: '1px solid var(--color-border)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: danger ? '#eb5757' : 'var(--color-text-primary)'
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex'
                        }}
                    >
                        <X size={18} color="var(--color-text-muted)" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem'
                    }}>
                        {message}
                    </p>

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '0.625rem 1rem',
                                borderRadius: '4px',
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            style={{
                                padding: '0.625rem 1rem',
                                borderRadius: '4px',
                                background: danger ? '#eb5757' : 'var(--color-accent-green)',
                                border: 'none',
                                color: danger ? '#fff' : '#050709',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
