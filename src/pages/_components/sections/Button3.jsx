import React from "react"
import styles3 from './button3.module.css'

export default function Button3({
    href,
    content,
    variant,
    sx,
    width,
    type = 'button',
    disabled = false,
    startIcon = false,
    endIcon = false,
    classname = ''
}) {

    // Helper to render the inner spans and icons to keep code dry
    const InnerContent = () => (
        <>
            <span className={`${styles3['span']} ${styles3[`span-${variant}`]}`}></span>
            {startIcon && startIcon}
            <span className={`${styles3['content']} ${styles3[`content-${variant}`]}`}>{content}</span>
            {endIcon && endIcon}
        </>
    );

    // Block 1: The standard Link button (Type is 'button' and has href)
    if (type === 'button' && href) {
        return (
            <a href={href} className={`${styles3.button3} ${styles3[variant]} ${classname}`} style={{ 
                textDecoration: 'none', 
                width: width, 
                display: 'inline-flex', // Ensures it looks like the button
                ...sx 
            }}>
                <InnerContent />
            </a>
        );
    }

    // Block 2 & 3: Submit or Reset (Pure buttons, no <a> wrapper)
    return (
        <button 
            type={type} 
            className={`${styles3.button3} ${styles3[variant]} ${classname}`} 
            style={{ width: width, ...sx }} 
            disabled={disabled}
        >
            <InnerContent />
        </button>
    );
}