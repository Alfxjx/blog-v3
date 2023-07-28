import React, { HTMLAttributes } from 'react';

export function Tag({
  children,
  className, 
  ...props
}: { children: React.ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return <span className={`block bordered rounded px-1 mx-1 whitespace-nowrap ${className}`} {...props}>{children}</span>;
}
