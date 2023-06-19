import { useEffect, useState } from "react";

const PreLoader = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 800);
  })

  return (
    <>
      {show && <div id="preloader">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>}
    </>
  );
}
 
export default PreLoader;