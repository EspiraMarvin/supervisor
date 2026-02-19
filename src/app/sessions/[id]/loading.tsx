export default function SessionLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header skeleton */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </header>

      {/* content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* session info skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* transcript skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
