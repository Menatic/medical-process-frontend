import { useAuth } from '../context/AuthContext';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }, [isAuthenticated]);

    return isAuthenticated ? <Component {...props} /> : null;
  };
}