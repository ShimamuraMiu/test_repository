//////////////////////////////////////////////
// Getメソッドでタスクを取得するカスタムフック
//////////////////////////////////////////////

import { useQuery } from 'react-query'
import axios from 'axios'
import { Task } from '../types/types'

export const useQueryTasks = () => {
  // タスク取得処理
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      // axiosのgetで、todoのエンドポイントにアクセス
      `${process.env.REACT_APP_API_URL}/todo`,
      {
        // cookie付きの通信を有効
        withCredentials: true,
      }
    )
    // 取得したデータ（Task[]）を返す
    return data
  }

  // useQueryを実行した結果を返す
  return useQuery<Task[], Error>({
    // キャッシュに格納するときのキー
    queryKey: 'tasks',
    queryFn: getTasks,
    // キャッシュのデータを永遠に最新とみなす（再フェッチを行わない）
    staleTime: Infinity,
  })
}
