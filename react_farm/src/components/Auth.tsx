import { RefreshIcon } from '@heroicons/react/solid'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { useProcessAuth } from '../hooks/useProcessAuth'

export const Auth = () => {
  // state & 必要な関数を読み込む
  const {
    pw,
    setPw,
    email,
    setEmail,
    isLogin,
    setIsLogin,
    registerMutation,
    loginMutation,
    processAuth,
  } = useProcessAuth()

  // 通信中の「loding」を表示
  /* registerまたはloginが通信中のとき */
  if (registerMutation.isLoading || loginMutation.isLoading) {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen ">
        <h1 className="text-xl text-gray-600 font-mono">Loading...</h1>
      </div>
    )
  }

  return (    
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      {/* タイトル */}
      <div className="flex items-center">
        {/* アイコンの設定（h:縦、w:横、mr:マージ）*/}
        <BadgeCheckIcon className="h-8 w-8 mr-2 text-blue-500" />
        {/* フォントの設定 */}
        <span className="text-center text-3xl font-extrabold">
          FARM Stack web app
        </span>
      </div>

      {/* SignIn or SignUp 文字 */}
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>

      {/* submit（送信）ボタンが押下されたときに、
        * カスタムフックから読み込んでいるprocessAuthの関数を呼び出す */}
      <form onSubmit={processAuth}>
        {/* E-mailの入力フォーム */}
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="email"
            type="email"
            autoFocus
            placeholder="Email address"
            // タイピングするごとにstateを更新する（上記で読み込んだ関数を使用）
            onChange={(e) => setEmail(e.target.value)}
            // 上記でカスタムフックから読み込んだstateを割り当てる
            value={email}
          />
        </div>

        {/* Passwordの入力フォーム */}
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            // タイピングするごとにstateを更新する（上記で読み込んだ関数を使用）
            onChange={(e) => setPw(e.target.value)}
            // 上記でカスタムフックから読み込んだstateを割り当てる
            value={pw}
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center my-2">
          <button
            className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600"
            // E-mailかPasswordが空の時、ボタンを無効化
            disabled={!email || !pw}
            type="submit"
          >
            {/* ボタン表記（Login or Sign Up） */}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>

      {/* 入力フォーム（Login or Sign Up）の切り替えアイコン */}
      <RefreshIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-8 w-8 my-2 text-blue-500 cursor-pointer"
      />
    </div>
  )
}
