import { LogoutIcon } from '@heroicons/react/outline'
import { useProcessAuth } from '../hooks/useProcessAuth'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useQueryUser } from '../hooks/useQueryUser'

export const Todo = () => {
  const { logout } = useProcessAuth()

  // useQueryのカスタムフックを実行
  const { data: dataUser } = useQueryUser()
  const { data: dataTasks, isLoading: isLoadingTasks } = useQueryTasks()

  return (
    // 中央寄せ、フォント等の指定
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      {/* logoutアイコンの設置 */}
      <LogoutIcon
        // 上記でカスタムフックから読み込んだlogoutの関数を呼び出す
        onClick={logout}
        className="h-7 w-7 mt-1 mb-5 text-blue-500 cursor-pointer"
      />
    </div>
  )
}
