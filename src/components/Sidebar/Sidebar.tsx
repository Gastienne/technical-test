'use client';

import { PropsWithChildren, useRef } from 'react';
import useStickyElement from '../hooks/useStickyElement';
import './sidebar.css';

export default function Sidebar({ children }: PropsWithChildren) {
  const ref = useRef<HTMLElement>(null);
  useStickyElement({
    el: ref.current,
    top: 120,
  });

  return (
    <aside ref={ref} className="sidebar sticky">
      {children}
    </aside>
  );
}
