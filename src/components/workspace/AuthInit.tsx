import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../../stores/auth';

// 在应用启动时初始化 auth 监听
export default function AuthInit({ children }: { children: ReactNode }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return <>{children}</>;
}
