import React from 'react'
// {"id":5,"userName":"Roki","email":null,"mobileNo":"8653458679","profileUrl":null,"address":null,"roles":[{"id":1,"roleName":"USER"}],"cart":null}
const UserInfo = ({ userDto }) => {

      if(!userDto) {
            return (
                  <div>
                        <p>Loading ... . . . . .</p>
                  </div>
            );
      }

  return (
    <div className='flex justify-around bg-slate-400 border-dashed border-blue-500 border-2'>
      <p>ID: {userDto.id}</p>
      <p>Name: {userDto.userName}</p>
      <p>Email: {userDto.email || "No email provided"}</p>
      <p>Mobile: {userDto.mobileNo}</p>
    </div>
  );
};

export default UserInfo