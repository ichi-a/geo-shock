export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-white font-mono mb-6 text-center">
          GEO Lab / Admin
        </h1>
        <form action="/api/admin/login" method="POST" className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="管理者パスワード"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-500"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-medium text-sm py-3 rounded-lg hover:bg-gray-100"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
