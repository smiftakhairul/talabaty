const NavHeader = () => {
  return (
    <>
      <div className="nav-header">
        <a href="#" onClick={(e) => e.preventDefault()} className="brand-logo">
          <svg className="logo-abbr" width="39" height="31" viewBox="0 0 39 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.125 21.125L26.9952 23.2623C27.6771 24.0417 28.8616 24.1206 29.6409 23.4387C29.7036 23.3839 29.7625 23.325 29.8173 23.2623L31.6875 21.125H36.375C35.2848 26.5762 30.4985 30.5 24.9393 30.5H14.0607C8.5015 30.5 3.71523 26.5762 2.625 21.125H25.125Z"
              fill="var(--primary)"
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M36.375 9.875H2.625C3.71523 4.4238 8.5015 0.5 14.0607 0.5H24.9393C30.4985 0.5 35.2848 4.4238 36.375 9.875Z" fill="var(--primary)" />
            <path
              opacity="0.3"
              d="M36.375 13.625H2.625C1.58947 13.625 0.75 14.4645 0.75 15.5C0.75 16.5355 1.58947 17.375 2.625 17.375H36.375C37.4105 17.375 38.25 16.5355 38.25 15.5C38.25 14.4645 37.4105 13.625 36.375 13.625Z"
              fill="var(--primary)"
            />
          </svg>
          <div className="ms-3">
            <img src="/images/talabaty.png" width="147" height="30" alt="" />
          </div>
        </a>
        {/* <div className="nav-control">
          <div className="hamburger"><span className="line"></span><span className="line"></span><span className="line"></span></div>
        </div> */}
      </div>
    </>
  );
}
 
export default NavHeader;