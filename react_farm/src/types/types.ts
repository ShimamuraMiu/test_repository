// タスクのデータ型
export interface Task {
  id: string
  title: string
  description: string
}

// APIから取得するユーザー情報の型
export interface UserInfo {
  email: string
}

// ログイン時（フロントエンド→RestAPI）に渡す情報の型
export interface User {
  email: string
  password: string
}

// CSRF tokenのデータ型
export interface CsrfToken {
  csrf_token: string
}
