export const navigateToPage = (navigate, pageIndex) => {
  switch (pageIndex) {
    case 0:
      navigate('/');
      break;
    case 1:
      navigate('/groups');
      break;
    // case 2:
    //   navigate('/messages');
    //   break;
    default:
      break;
  }
};
