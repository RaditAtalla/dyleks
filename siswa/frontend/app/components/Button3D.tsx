import React from 'react';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  children: React.ReactNode;
}

/**
 * Komponen tombol 3D interaktif taktil untuk game edukasi.
 * Menggunakan pergeseran border bawah dan translasi Y saat aktif untuk meniru efek tombol fisik.
 */
export const Button3D: React.FC<Button3DProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "px-6 py-3 font-bold rounded-2xl transition-all duration-100 transform cursor-pointer border-b-4 select-none outline-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-500 text-white border-indigo-700 active:border-b-0 hover:bg-indigo-400 hover:border-indigo-650 active:translate-y-[4px]",
    success: "bg-emerald-500 text-white border-emerald-700 active:border-b-0 hover:bg-emerald-400 hover:border-emerald-650 active:translate-y-[4px]",
    danger: "bg-rose-500 text-white border-rose-700 active:border-b-0 hover:bg-rose-400 hover:border-rose-650 active:translate-y-[4px]",
    secondary: "bg-white text-slate-700 border-slate-200 active:border-b-0 hover:bg-slate-50 hover:border-slate-300 active:translate-y-[4px]"
  };

  const disabledStyle = "bg-slate-100 text-slate-400 border-slate-250 border-b-4 cursor-not-allowed pointer-events-none active:translate-y-0";

  return (
    <button
      className={`${baseStyle} ${disabled ? disabledStyle : variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button3D;
