import React from 'react';

const UserContext = React.createContext({
  signedIn: false,
  username: '',
});

export default UserContext;
