//////////////////////////////////////////
// タスクの詳細を1つ取得するカスタムフック
//////////////////////////////////////////

import { useQuery } from 'react-query'
import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice'
import { Task } from '../types/types'
import { useHistory } from 'react-router-dom'

export const useQuerySingleTask = (id: string) => {  // 取得したいIDを受け取る
  // インスタンス化
  const history = useHistory()
  const dispatch = useAppDispatch()

  // タスク詳細取得処理
  const getSingleTask = async (id: string) => {
    // axiosのgetで、todo/idのエンドポイントにアクセス
    const { data } = await axios.get<Task>(  // 返り値は<Task>型を指定（Generics:使用されるまで型が確定しない）
      `${process.env.REACT_APP_API_URL}/todo/${id}`,
      {
        // cookie付きの通信を有効
        withCredentials: true,
      }
    )
    // 取得したデータ（）を返す
    return data
  }

  // useQueryを実行した結果を返す
  return useQuery({
    // キャッシュに格納するときのキー（'single'という文字列とid）
    queryKey: ['single', id],
    queryFn: () => getSingleTask(id),
    // useQueryの機能を有効化/無効化
    enabled: !!id,  // IDが設定されるとTrue
    // キャッシュのデータを永遠に最新とみなす（再フェッチを行わない）
    staleTime: Infinity,

    // キャッシュに格納しているタスクの情報が消えるまでの時間（default: 5min）
    //cacheTime: 300000,
    
    // get通信が失敗した場合
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
  })
}
