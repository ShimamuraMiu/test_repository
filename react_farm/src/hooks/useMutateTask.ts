//////////////////////////////////
// TaskのCRUD操作のカスタムフック
//////////////////////////////////

import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
import { useQueryClient, useMutation } from 'react-query'
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice'
import { Task } from '../types/types'
import { useHistory } from 'react-router-dom'

export const useMutateTask = () => {
  // インスタンス化
  const history = useHistory()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  // Create処理
  const createTaskMutation = useMutation(
    // task <- Taskからidを抜いたデータ
    (task: Omit<Task, 'id'>) =>
      // axiosのpostで、todoのエンドポイントにアクセス
      axios.post<Task>(  // 返り値は<Task>型を指定（Generics:使用されるまで型が確定しない）
        `${process.env.REACT_APP_API_URL}/todo`, 
        task, 
        {withCredentials: true, }  // cookie付きの通信を有効
      ),
    {
      // 通信の処理が成功
      onSuccess: (res) => {
        // 既存のキャッシュデータ一覧を取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // 既存のタスクが存在する場合
        if (previousTodos) {
          // 新規タスクを末尾に追加、キャッシュに再登録
          /* res.dataは新規タスク、...previousTodosで配列を展開 */
          queryClient.setQueryData('tasks', [...previousTodos, res.data])
        }
        // 編集中のタスクをリセット
        dispatch(resetEditedTask())
      },
      // 通信の処理が失敗
      onError: (err: any) => {
        // エラーメッセージの表示
        alert(`${err.response.data.detail}\n${err.message}`)
        // JWTまたはCSRF tokenが失効している場合
        if (err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.') {
          // CSRF tokenを再度取得
          dispatch(toggleCsrfState())
          // 編集中のタスクをリセット
          dispatch(resetEditedTask())
          // todoからAuthへページ遷移
          history.push('/')
        }
      },
    }
  )

  // Update処理
  const updateTaskMutation = useMutation(
    (task: Task) =>
      // axiosのputで、todoのエンドポイントにアクセス
      axios.put<Task>(  // 返り値は<Task>型を指定
        `${process.env.REACT_APP_API_URL}/todo/${task.id}`,
        {title: task.title, description: task.description, },
        {withCredentials: true, } // cookie付きの通信を有効
      ),
    {
      // 通信の処理が成功
      onSuccess: (res, variables) => {  // res:useMutationの結果、variables:task
        // 既存のキャッシュデータ一覧を取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // 既存のタスクが存在する場合
        if (previousTodos) {
          // 上書きするタスクのみ書き換えてキャッシュに再登録
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.data : task
            )
          )
        }
        // 編集中のタスクをリセット
        dispatch(resetEditedTask())
      },
      // 通信の処理が失敗
      onError: (err: any) => {
        // エラーメッセージの表示
        alert(`${err.response.data.detail}\n${err.message}`)
        // JWTまたはCSRF tokenが失効している場合
        if (err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.') {
          // CSRF tokenを再度取得
          dispatch(toggleCsrfState())
          // 編集中のタスクをリセット
          dispatch(resetEditedTask())
          // todoからAuthへページ遷移
          history.push('/')
        }
      },
    }
  )

  // Delete処理
  const deleteTaskMutation = useMutation(
    (id: string) =>
      // axiosのdeleteで、todoのエンドポイントにアクセス
      axios.delete(
        `${process.env.REACT_APP_API_URL}/todo/${id}`,
        {withCredentials: true, }  // cookie付きの通信を有効
      ),
    {
      // 通信の処理が成功
      onSuccess: (res, variables) => {
        // 既存のキャッシュデータ一覧を取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // 既存のタスクが存在する場合
        if (previousTodos) {
          // 削除するタスク以外をキャッシュに再登録
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        // 編集中のタスクをリセット
        dispatch(resetEditedTask())
      },
      // 通信の処理が失敗
      onError: (err: any) => {
        // エラーメッセージの表示
        alert(`${err.response.data.detail}\n${err.message}`)
        // JWTまたはCSRF tokenが失効している場合
        if (err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.') {
          // CSRF tokenを再度取得
          dispatch(toggleCsrfState())
          // 編集中のタスクをリセット
          dispatch(resetEditedTask())
          // todoからAuthへページ遷移
          history.push('/')
        }
      },
    }
  )

  // 上記の関数を返してReactのコンポーネントから使用できるようにする
  return {createTaskMutation, updateTaskMutation, deleteTaskMutation, }
}
