import {Outlet, Navigate, useLocation} from 'react-router-dom' 

function RequireAuth({allowedRoles}){
    const location = useLocation();
return(
    // getItem("property naem") === first value in the array
    localStorage.getItem("userTypes") === allowedRoles[0] ?
    // placeholder to return the specific route
    <Outlet />
    // false condition with usertype presetn but not matching the allowed role
    :localStorage.getItem("userTypes") 
    //navigate the user unauthorised page
    ? <Navigate to ="/unauthorized" state={{from : location}} replace />
  : <Navigate to="/" state={{ from: location }} replace />
)

}
export default RequireAuth;