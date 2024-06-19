import React, {useState, useEffect} from 'react'

function useMenu(btn, menu) {
    const [ isMenuOpen, setIsMenuOpen] = useState(false)

     const handleMenu = (e) => {
       if (
         !btn.current.contains(e.target) &&
         !menu.current.contains(e.target)
       ) {
         setIsMenuOpen(false);
       }
     };

     useEffect(() => {
       if (isMenuOpen) {
         document.body.addEventListener("click", handleMenu);
       }

       return () => {
         document.body.removeEventListener("click", handleMenu);
       };
     }, [isMenuOpen]);

  return {isMenuOpen, setIsMenuOpen}
}

export default useMenu