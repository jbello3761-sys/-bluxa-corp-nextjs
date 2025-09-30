import { getSession, getUser } from '@/lib/supabaseServer'

export default async function DebugAuth() {
  const session = await getSession()
  const user = await getUser()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Auth (Server Component)</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Session Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Data</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Data</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Authentication Status</h3>
            <div className="space-y-2 text-blue-800">
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <>
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Full Name:</strong> {user?.user_metadata?.full_name || 'Not set'}</p>
                  <p><strong>Role:</strong> {user?.user_metadata?.role || 'customer'}</p>
                  <p><strong>Email Verified:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="btn-primary inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
