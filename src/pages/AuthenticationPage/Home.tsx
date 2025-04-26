import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <p className="mt-4 text-gray-600">
          You are successfully authenticated!
        </p>
      </div>
    </div>
  )
}