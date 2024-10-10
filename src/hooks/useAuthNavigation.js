import { useNavigate } from 'react-router-dom';

import { useAuthState, handleSignIn } from '../utils/firebase';

export const useAuthNavigation = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.uid}`);
    }
  };

  const signInAndCheckFirstTimeUser = () => {
    handleSignIn().then((user) => {
      if (!user) {
        navigate('/edit-profile');
      }
    });
  };

  return { user, handleProfileClick, signInAndCheckFirstTimeUser };
};
