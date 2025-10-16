export default function KeyButton({ children, onClick, className, id}: { children: React.ReactNode, onClick?: () => void , className?: string, id? : string}) {
  return (
      <button id={id} className={className} onClick={onClick}> 
          {children}
      </button>
    );
}