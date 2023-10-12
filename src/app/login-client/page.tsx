'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import React from 'react'
import Messages from './messages'

type State = {
  email: string
  password: string
  error?: string
  message?: string
}

type Action =
  | {
      type: 'EMAIL' | 'PASSWORD'
      payload: string
    }
  | {
      type: 'ERROR' | 'MESSAGE'
      payload?: string
    }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'EMAIL':
      return { ...state, email: action.payload }
    case 'PASSWORD':
      return { ...state, password: action.payload }
    case 'ERROR':
      return { ...state, error: action.payload, message: undefined }
    case 'MESSAGE':
      return { ...state, message: action.payload, error: undefined }
    default:
      return state
  }
}

const initialState: State = {
  email: '',
  password: '',
}

export default function Login() {
  const supabase = createClientComponentClient()
  const [{ email, password, error, message }, dispatch] = React.useReducer(
    reducer,
    initialState
  )

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const signUp = async () => {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (response.error) {
        dispatch({ type: 'ERROR', payload: response.error.message })
        return
      }
      dispatch({
        type: 'MESSAGE',
        payload: 'Check your email for the confirmation link.',
      })
    }
    signUp()
  }

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const signIn = async () => {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (response.error) {
        dispatch({ type: 'ERROR', payload: response.error.message })
        return
      }
      dispatch({
        type: 'MESSAGE',
        payload: 'You have signed in successfully.',
      })
    }
    signIn()
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={handleSignIn}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => dispatch({ type: 'EMAIL', payload: e.target.value })}
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) =>
            dispatch({ type: 'PASSWORD', payload: e.target.value })
          }
          required
        />
        <button
          className="bg-green-700 rounded px-4 py-2 text-white mb-2"
          type="submit"
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="border border-gray-700 rounded px-4 py-2 text-black mb-2"
        >
          Sign Up
        </button>
        <Messages error={error} message={message} />
      </form>
    </div>
  )
}
