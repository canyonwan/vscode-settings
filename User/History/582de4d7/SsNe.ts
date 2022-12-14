import { Store as VuexStore, CommitOptions, DispatchOptions, Module } from 'vuex'
import { RootState } from '@/store'
import { state } from './state'
import { mutations, Mutations } from './mutations'
import type { BannerState, imgUrlsType } from './state'

export { BannerState, imgUrlsType }

export type BannerStore<S = BannerState<imgUrlsType>> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
}

export const store: Module<BannerState<imgUrlsType>, RootState> = {
  state,
  actions,
  mutations,
}
