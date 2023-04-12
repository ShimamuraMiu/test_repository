////////////////////////////////////////////////
// Getメソッドでログインしているユーザーの情報を
// 取得するカスタムフック
////////////////////////////////////////////////

import { useQuery } from 'react-query'
import axios from 'axios'
import { UserInfo } from '../types/types'
import { useHistory } from 'react-router-dom'

export const useQueryUser = () => {
  // インスタンス化
  const history = useHistory()

  // ログインユーザーの情報取得処理
  const getCurrentUser = async () => {
    const { data } = await axios.get<UserInfo>(
      // axiosのgetで、userのエンドポイントにアクセス
      `${process.env.REACT_APP_API_URL}/user`,
      {
        // cookie付きの通信を有効
        withCredentials: true,
      }
    )
    // 取得したデータ（UserInfo）を返す
    return data
  }

  // useQueryを実行した結果を返す
  return useQuery({
    // キャッシュに格納するときのキー
    queryKey: 'user',
    queryFn: getCurrentUser,
    // キャッシュのデータを永遠に最新とみなす（再フェッチを行わない）
    staleTime: Infinity,
    // get通信が失敗した場合、todoからauthへ遷移
    onError: () => history.push('/'),
  })
}
