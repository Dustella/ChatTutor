import { type } from 'arktype'
import type { Page } from './page'

export const defineAction = (options: typeof type.object.infer) => type({
  type: 'string',
  options
})

export type Action<T extends object = Record<string, unknown>> = ReturnType<typeof defineAction>['infer'] & {
  options: T
}

export type ActionResolver<
  T extends object = Record<string, unknown>,
  P extends Page = Page
> = (action: Action<T>) => (page: P) => ActionResolverResult
export type ActionResolverResult = {
  success: boolean
  data?: string | Record<string, unknown>
}

export const defineActionResolver = <T extends object = Record<string, unknown>, P extends Page = Page>(resolver: ActionResolver<T, P>) => resolver
