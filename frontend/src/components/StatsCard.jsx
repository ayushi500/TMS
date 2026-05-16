export default function StatsCard({ title, value }) {
  return (
    <div className='bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg'>
      <h3 className='text-slate-400 text-sm'>{title}</h3>
      <h2 className='text-3xl font-bold mt-2'>{value}</h2>
    </div>
  )
}