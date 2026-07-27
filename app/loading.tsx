export default function Loading() {
  return <main className="min-h-screen bg-slate-50 px-5 py-16"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-8 w-40 rounded bg-slate-200" /><div className="mt-8 h-14 max-w-2xl rounded bg-slate-200" /><div className="mt-12 grid gap-5 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-72 rounded-3xl bg-slate-200" />)}</div></div></main>;
}
