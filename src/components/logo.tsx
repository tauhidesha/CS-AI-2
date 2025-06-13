'use client';

import { Bike } from 'lucide-react';
import type { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <Bike className="h-7 w-7" />
      <h1 className="text-2xl font-headline font-bold">MotoAssist</h1>
    </div>
  );
};

export default Logo;
