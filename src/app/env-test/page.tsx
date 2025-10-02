import { config } from '@/lib/config'

export default function EnvTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Google Maps API Key:</h3>
          <p className="text-sm text-gray-600">
            {config.googleMaps.apiKey ? 
              `${config.googleMaps.apiKey.substring(0, 20)}...` : 
              'NOT CONFIGURED'
            }
          </p>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-semibold">API URL:</h3>
          <p className="text-sm text-gray-600">{config.apiUrl}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Stripe Key:</h3>
          <p className="text-sm text-gray-600">
            {config.stripe.publishableKey ? 
              `${config.stripe.publishableKey.substring(0, 20)}...` : 
              'NOT CONFIGURED'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
