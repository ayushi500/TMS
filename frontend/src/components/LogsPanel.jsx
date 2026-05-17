export default function LogsPanel({ logs }) {
  return (
    <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
      <h2 className='text-xl font-bold mb-4'>Device Logs</h2>

      <div className='space-y-3 max-h-80 overflow-y-auto'>
        {logs.length === 0 ? (
          <p className='text-slate-400'>No logs</p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className='bg-slate-800 p-3 rounded-lg'
            >
              <p>{log.action}</p>
              <span className='text-xs text-slate-400'>
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}