import React from 'react';

interface LiquidPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'darker';
}

const LiquidPanel = React.forwardRef<HTMLDivElement, LiquidPanelProps>(
    ({ children, className = '', variant = 'default', ...props }, ref) => {
        
        // Define base styles for the liquid glass effect
        const baseStyle = `backdrop-blur-3xl backdrop-saturate-150 border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] rounded-[24px]`;
        
        const backgroundStyle = variant === 'darker' 
            ? 'bg-[var(--glass-bg-darker)]' 
            : 'bg-[var(--glass-bg)]';

        return (
            <div 
                ref={ref}
                className={`${baseStyle} ${backgroundStyle} ${className}`}
                style={{ 
                    WebkitBackdropFilter: 'blur(64px) saturate(1.5)', 
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)'
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);

LiquidPanel.displayName = 'LiquidPanel';

export default LiquidPanel;
