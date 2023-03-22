import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  showIcon?: boolean;
  isCartButton?: boolean;
}

export function CustomButton({ 
  children, 
  className,
  variant = 'default',
  showIcon = true,
  isCartButton = false,
  ...props 
}: CustomButtonProps) {
  return (
    <button
      className={cn(
        'group cta relative px-[18px] py-[12px] transition-all duration-200 ease-in-out border-none bg-transparent cursor-pointer w-full',
        'before:content-[""] before:absolute before:top-0 before:left-0 before:block before:rounded-[50px]',
        'before:w-[45px] before:h-[45px] before:transition-all before:duration-300 before:ease-in-out before:z-0',
        'before:bg-button hover:before:w-full active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:before:w-[45px] disabled:active:scale-100',
        className
      )}
      {...props}
    >
      <span className="relative z-10 font-ubuntu text-[18px] font-bold tracking-[0.05em] text-button-text">
        {children}
      </span>
      {showIcon && (
        isCartButton ? (
          <ShoppingCart 
            className="relative z-10 inline-block ml-[10px] w-5 h-5 transform -translate-x-[5px] transition-transform duration-300 ease-in-out group-hover:translate-x-0"
            stroke="#234567"
          />
        ) : (
          <svg 
            className="relative z-10 top-0 ml-[10px] inline-block transform -translate-x-[5px] transition-transform duration-300 ease-in-out group-hover:translate-x-0"
            width="15" 
            height="10" 
            viewBox="0 0 13 10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#234567"
            strokeWidth="2"
          >
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        )
      )}
    </button>
  );
} //  
