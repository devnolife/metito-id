import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export const successResponse = <T>(data: T, message?: string, status = 200) => {
  return NextResponse.json({
    success: true,
    data,
    message
  } as ApiResponse<T>, { status })
}

export const errorResponse = (message: string, status = 400, errors?: Record<string, string[]>) => {
  return NextResponse.json({
    success: false,
    error: message,
    errors
  } as ApiResponse, { status })
}

export const unauthorizedResponse = (message = 'Unauthorized') => {
  return errorResponse(message, 401)
}

export const forbiddenResponse = (message = 'Forbidden') => {
  return errorResponse(message, 403)
}

export const notFoundResponse = (message = 'Not found') => {
  return errorResponse(message, 404)
}

export const validationErrorResponse = (errors: Record<string, string[]>) => {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    errors
  } as ApiResponse, { status: 422 })
}

export const serverErrorResponse = (message = 'Internal server error') => {
  return errorResponse(message, 500)
} 
