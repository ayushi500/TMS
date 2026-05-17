export default function AlertPanel({ alerts }) {
  return (
    <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
      <h2 className='text-xl font-bold mb-4'>Alerts</h2>

      <div className='space-y-3 max-h-80 overflow-y-auto'>
        {alerts.length === 0 ? (
          <p className='text-slate-400'>No alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className='bg-red-500/20 border border-red-500 p-3 rounded-lg'
            >
              <p className='font-semibold'>{alert.message}</p>
              <span className='text-sm text-slate-300'>
                Severity: {alert.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}