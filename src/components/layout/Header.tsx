import { Logo } from '../Logo'
import { useAuth } from '../../contexts/AuthContext'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sm:px-10">
      <Logo className="text-base" />
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-neutral-500 sm:inline">
          {user?.username}
        </span>
        <button
          onClick={logout}
          className="border border-neutral-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600 transition-colors hover:border-black hover:text-black"
        >
          Esci
        </button>
      </div>
    </header>
  )
}
