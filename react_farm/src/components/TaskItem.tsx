//////////////////////////////
// タスク部分のコンポーネント
//////////////////////////////

import React, { FC, memo } from 'react'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { Task } from '../types/types'
import { useAppDispatch } from '../app/hooks'
import { setEditedTask } from '../slices/appSlice'
import { useMutateTask } from '../hooks/useMutateTask'

const TaskItemMemo: FC<Task> = ({ id, title, description }) => {
  // dispathを使えるようにする
  const dispatch = useAppDispatch()
  
  const { deleteTaskMutation } = useMutateTask()

  return (
    <li>
      {/* タイトル */}
      <span className="font-bold cursor-pointer">
        {title}
      </span>

      <div className="flex float-right ml-20">
        {/* タスク編集処理(アイコンが押下されたとき) */}
        <PencilAltIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            dispatch(
              setEditedTask({
                id: id,
                title: title,
                description: description,
              })
            )
          }}
        />
        
        {/* タスク削除処理(アイコンが押下されたとき)  */}
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteTaskMutation.mutate(id)
          }}
        />
      </div>
    </li>
  )
}

// メモ化してexportする（メモ化：1回目に実行した結果を残しておくみたいなやつ）
export const TaskItem = memo(TaskItemMemo)
