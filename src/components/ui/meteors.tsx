import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface MeteorProps {
  number?: number;
  className?: string;
}

interface MeteorStyle {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export const Meteors = ({ number = 6, className }: MeteorProps) => {
  const [meteorStyles, setMeteorStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    // Generate meteor styles on the client side with even distribution
    const styles: MeteorStyle[] = [];
    const meteorsPerSection = Math.floor(number / 3);
    const remainingMeteors = number % 3;

    // Helper function to generate a meteor style for a specific section
    const generateMeteorInSection = (section: 'left' | 'center' | 'right') => {
      const leftRanges = {
        left: [0, 30],
        center: [31, 65],
        right: [66, 100]
      };
      const [min, max] = leftRanges[section];
      return {
        top: `${Math.floor(Math.random() * -20)}%`,
        left: `${Math.floor(Math.random() * (max - min) + min)}%`,
        animationDelay: `${Math.random() * (2 - 0.5) + 0.5}s`,
        animationDuration: `${Math.floor(Math.random() * (15 - 8) + 8)}s`,
      };
    };

    // Generate meteors for each section
    ['left', 'center', 'right'].forEach((section) => {
      for (let i = 0; i < meteorsPerSection; i++) {
        styles.push(generateMeteorInSection(section as 'left' | 'center' | 'right'));
      }
    });

    // Add any remaining meteors randomly
    for (let i = 0; i < remainingMeteors; i++) {
      const sections = ['left', 'center', 'right'];
      const randomSection = sections[Math.floor(Math.random() * sections.length)] as 'left' | 'center' | 'right';
      styles.push(generateMeteorInSection(randomSection));
    }

    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={style}
        />
      ))}
    </>
  );
}; //  
