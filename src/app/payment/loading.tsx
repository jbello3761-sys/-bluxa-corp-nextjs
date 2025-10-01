export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card">
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Payment Page</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
