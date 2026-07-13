export default function NotificationSettings() {
  return (
    <div className="p-4 sm:p-8 flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-300 mt-8">
      <div className="p-4 bg-purple-500/10 rounded-full mb-2 border border-purple-500/20">
        <span className="text-3xl">🔔</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Notifications</h1>
      <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md">
        Manage your alerts, period reminders, and app notifications. This feature is coming soon!
      </p>
    </div>
  )
}
