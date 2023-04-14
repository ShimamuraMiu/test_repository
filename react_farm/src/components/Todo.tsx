//////////////////////////////////
// Todo（全体？）のコンポーネント
//////////////////////////////////

import { LogoutIcon } from '@heroicons/react/outline'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { setEditedTask, selectTask } from '../slices/appSlice'
import { useProcessAuth } from '../hooks/useProcessAuth'
import { useProcessTask } from '../hooks/useProcessTask'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useQueryUser } from '../hooks/useQueryUser'
import { TaskItem } from './TaskItem'

export const Todo = () => {
  const { logout } = useProcessAuth()

  // useQueryのカスタムフックを実行
  const { data: dataUser } = useQueryUser()
  const { data: dataTasks, isLoading: isLoadingTasks } = useQueryTasks()

  // dispathを使えるようにする
  const dispatch = useAppDispatch()
  
  const { processTask } = useProcessTask()
  const editedTask = useAppSelector(selectTask)
  
  return (
    // 中央寄せ、フォント等の指定
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      {/* タイトル部分 */}
      <div className="flex items-center">
        {/* タイトル横のアイコンの設置 */}
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-green-500 cursor-pointer" />
        {/* タイトル文字 */}
        <span className="text-center text-3xl font-extrabold">CRUD tasks</span>
      </div>

      {/* タイトルの下にログインしているE-mailを表示
        * （dataUser? は、存在している場合のみ取得という意味） */}
      <p className="my-3 text-sm">{dataUser?.email}</p>

      {/* logoutアイコンの設置 */}
      <LogoutIcon
        // 上記でカスタムフックから読み込んだlogoutの関数を呼び出す
        onClick={logout}
        className="h-7 w-7 mt-1 mb-5 text-blue-500 cursor-pointer"
      />

      {/* title, discriptionの入力フォーム */}
      {/* submit（送信）ボタンが押下されたときに、
        * カスタムフックから読み込んでいるprocessTaskの関数を呼び出す */}
      <form onSubmit={processTask}>
        {/* titleの入力フォーム */}
        <input
          className="mb-3 mr-3 px-3 py-2 border border-gray-300"
          placeholder="title ?"
          type="text"
          // ユーザーがタイピングしたとき
          onChange={(e) =>
            // title属性の内容のみ書き換える
            dispatch(setEditedTask({ ...editedTask, title: e.target.value }))
          }
          value={editedTask.title}
        />

        {/* descriptionの入力フォーム */}
        <input
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="description ?"
          type="text"
          // ユーザーがタイピングしたとき
          onChange={(e) =>
            // description属性の内容のみ書き換える
            dispatch(setEditedTask({ ...editedTask, description: e.target.value }))
          }
          value={editedTask.description}
        />

        {/* title/descriptionのsubmitボタン */}
        <button
          className="disabled:opacity-40 mx-3 py-2 px-3 text-white bg-indigo-600 rounded"
          // titleかdescriptionが空の場合はボタンを無効化
          disabled={!editedTask.title || !editedTask.description}
        >
          {/* Create/Updateボタンの切り替え */}
          {editedTask.id === '' ? 'Create' : 'Update'}
        </button>
      </form>

      {/* タスクをロード中のとき */}
      {isLoadingTasks ? (
        <p>Loading...</p>
      ) : (
        // ロード中ではない時、タスクの一覧表示
        <ul className="my-5">
          {/* タスクを展開 */}
          {dataTasks?.map((task) => (
            // TaskItem componentに渡す
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
