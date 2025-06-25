
import { useAuth } from './useAuth';

export function useSessionStatus() {
  const { sessionStatus } = useAuth();
  return sessionStatus;
}
