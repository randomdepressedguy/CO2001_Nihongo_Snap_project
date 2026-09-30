import { NavLink, Outlet } from 'react-router-dom'
import { features } from '../config/features'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-red-600">Nihongo Snap</h1>
      </header>

      <main className="flex-1 p-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md border-t bg-white">
        {features.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                isActive ? 'text-red-600' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
