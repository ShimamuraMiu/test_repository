///////////////////////////////////////////
// Createボタン（送信）が押下されたときに
// 呼び出される関数を定義したカスタムフック
///////////////////////////////////////////

import { FormEvent } from 'react'
import { useAppSelector } from '../app/hooks'
import { useMutateTask } from '../hooks/useMutateTask'
import { selectTask } from '../slices/appSlice'

export const useProcessTask = () => {
  // Reduxの中のstateを読み込む
  const editedTask = useAppSelector(selectTask)
  // 作成したカスタムフックから読み込む
  const { createTaskMutation, updateTaskMutation } = useMutateTask()

  // submitボタン押下時の処理
  const processTask = (e: FormEvent<HTMLFormElement>) => {
    // リロード禁止
    e.preventDefault()
    // タスクの新規作成の場合
    if (editedTask.id === '')
      createTaskMutation.mutate({
        title: editedTask.title,
        description: editedTask.description,
      })
    // タスクの更新の場合
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }

  // Reactのコンポーネント側で使用したい関数を返す
  return { processTask }
}
