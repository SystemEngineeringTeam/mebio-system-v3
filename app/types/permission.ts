import type { AnyModel } from '@/types/model';

export interface Permission {
  operator: AnyModel;
  target: AnyModel;
}
