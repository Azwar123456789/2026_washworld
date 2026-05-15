"use client";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
};

export default function Button({
    children,
    onClick,
    variant = "primary",
    size = "md",
}: ButtonProps) {
    const baseStyle = {
        border: "none",
        borderRadius: 10,
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
    };

    const sizeStyles = {
        sm: { fontSize: 14, padding: 8 },
        md: { fontSize: 16, padding: 12 },
        lg: { fontSize: 20, padding: 16 },
    };

    const styles = {
        primary: {
            ...baseStyle,
            ...sizeStyles[size],
            background: "#42BC69",
            color: "white",
        },
        secondary: {
            ...baseStyle,
            ...sizeStyles[size],
            background: "transparent",
            color: "white",
            border: "1px solid white"
        },
    };

    return (
        <button onClick={onClick} style={styles[variant]}>
            {children}
        </button>
    );
}