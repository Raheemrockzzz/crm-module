import React from 'react';
import { CSidebar, CSidebarNav, CNavTitle,CNavItem } from '@coreui/react';
import { useNavigate} from 'react-router-dom';

function Sidebar() {

    const navigate = useNavigate();

    const logoutFn=()=>{
        localStorage.clear();
        navigate('/');
        // window.location.href="/";
    }
    return(
        <CSidebar unfoldable className='vh-100 bg-black'>
            <CSidebarNav>
                <CNavItem className='bg-dark d-flex'>
                <i className='bi bi-bar-chart-fill text-white mx-3 m-2'></i>
                    <h5 className='text-white fw-bolder mx-3 my-1'>TETHERX</h5>
                </CNavItem>
                <CNavTitle className='text-light fw-normal'>
                    A CRM app for all your needs...
                </CNavTitle>
                <CNavItem className='bg-dark d-flex'>
                    <i className='bi bi-house-fill text-white mx-3 m-2'></i>
                    <div className='text-white fw-bolder mx-3 my-1'>Home</div>
                </CNavItem>
                <div onClick={logoutFn}>
                <CNavItem className='bg-dark d-flex'>
                    <i className='bi bi-box-arrow-left text-white mx-3 m-2'></i>
                    <div className='text-white fw-bolder mx-3 my-1'>Logout</div>
                </CNavItem>
                </div>
            </CSidebarNav>
        </CSidebar>
    )
}
export default Sidebar;