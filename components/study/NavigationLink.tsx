'use client';
import type { ComponentProps } from 'react';
import { useStudy } from './context';

// Document navigation also works when client routing is interrupted at the host.
// Flush pending device edits before leaving; retain normal modified-click behavior.
export default function NavigationLink({ href, onClick, children, ...props }: ComponentProps<'a'> & { href: string }) {
  const { navigate } = useStudy();
  return <a {...props} href={href} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank' || props.download || href.startsWith('#')) return;
    event.preventDefault();
    void navigate(href);
  }}>{children}</a>;
}
