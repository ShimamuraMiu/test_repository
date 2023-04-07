///////////////////////////////////////////
// ログインボタンが押下されたときに
// 呼び出される関数を定義したカスタムフック
///////////////////////////////////////////

import { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useMutateAuth } from '../hooks/useMutateAuth'

export const useProcessAuth = () => {
  const history = useHistory()
  const queryClient = useQueryClient()

  // ユーザーが入力したEmailとPasswordを保持するためのstateを定義
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  // ログインモードか登録モードかを保持
  const [isLogin, setIsLogin] = useState(true)

  const { loginMutation, registerMutation, logoutMutation } = useMutateAuth()

  // submitボタン押下時の処理
  const processAuth = async (e: FormEvent<HTMLFormElement>) => {
    // リロード禁止
    e.preventDefault()
    // ログインモードの場合
    if (isLogin) {
      // loginMutationを実行
      loginMutation.mutate({
        // オブジェクトの形で渡す
        email: email,
        password: pw,
      })
    // 登録モード
    } else {
      /*
       * 登録できるかどうかを待つ必要があるためawaitを使用する（処理を同期化）
       * awaitが《成功：then / 失敗：catch》の処理が走る
       */
      await registerMutation
        .mutateAsync({
          email: email,
          password: pw,
        })
        // 成功した場合
        .then(() =>
          // 登録に続けてログインする
          loginMutation.mutate({
            email: email,
            password: pw,
          })
        )
        // 失敗した場合
        .catch(() => {
          // EmailとPasswordのstateを初期化
          setPw('')
          setEmail('')
        })
    }
  }

  // logout押下時の処理
  const logout = async () => {
    await logoutMutation.mutateAsync()

    // reactQueryのキャッシュに格納している情報をクリア
    queryClient.removeQueries('tasks')
    queryClient.removeQueries('user')
    queryClient.removeQueries('single')

    // todoからAuthへページ遷移
    history.push('/')
  }

  // Reactのコンポーネント側で使用したいstateと関数を返す
  return {
    email,
    setEmail,
    pw,
    setPw,
    isLogin,
    setIsLogin,
    processAuth,
    registerMutation,
    loginMutation,
    logout,
  }
}
