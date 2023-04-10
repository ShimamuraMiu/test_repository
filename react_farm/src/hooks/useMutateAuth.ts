////////////////////////////
// 認証関係のカスタムフック
////////////////////////////

import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice'
import { User } from '../types/types'

export const useMutateAuth = () => {
  // インスタンス化
  const history = useHistory()
  const dispatch = useAppDispatch()

  // login処理
  const loginMutation = useMutation(
    // axiosのpostで、loginのエンドポイントにアクセス（EmailとPasswordを渡す）
    async (user: User) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, user, {
        // cookie付きの通信を有効
        withCredentials: true,
      }),
    {
      // 通信の処理が成功
      onSuccess: () => {
        // todoのコンポーネントに飛ぶ
        history.push('/todo')
      },
      // 通信の処理が失敗
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (err.response.data.detail === 'The CSRF token has expired.') {
          dispatch(toggleCsrfState())
        }
      },
    }
  )

  // register処理
  const registerMutation = useMutation(
    // axiosのpostで、registerのエンドポイントにアクセス（EmailとPasswordを渡す）
    async (user: User) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, user),
    {
      // 通信の処理が失敗
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        // CSRF tokenが失効している場合
        if (err.response.data.detail === 'The CSRF token has expired.') {
          // CSRF tokenを再度取得
          dispatch(toggleCsrfState())
        }
      },
    }
  )

  // logout処理
  const logoutMutation = useMutation(
    // axiosのpostで、logoutのエンドポイントにアクセス
    async () =>
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
        {},  // 渡すデータは無し                
        {withCredentials: true, }  // cookie付きの通信を有効
      ),
    {
      // 通信の処理が成功
      onSuccess: () => {
      // todoからAuthへ遷移して、ログインを再度促す
        history.push('/')
      },
      // 通信の処理が失敗
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        // CSRF tokenが失効している場合
        if (err.response.data.detail === 'The CSRF token has expired.') {
          // CSRF tokenを再度取得
          dispatch(toggleCsrfState())
          // ユーザーが入力中のタスクをリセット
          dispatch(resetEditedTask())
          // todoからAuthへ遷移して、ログインを再度促す
          history.push('/')
        }
      },
    }
  )

  // 上記の関数を返してReactのコンポーネントから使用できるようにする
  return { loginMutation, registerMutation, logoutMutation }
}
