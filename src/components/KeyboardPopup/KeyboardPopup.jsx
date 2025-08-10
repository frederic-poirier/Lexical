import { useState, useEffect, useLayoutEffect, useRef } from "react";

export default function KeyboardPopup({ children, keyboard }) {
    const [popupHeight, setPopupHeight] = useState(null)
    const [visual, setVisual] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        offsetTop: 0,
    });

    const wrapperRef = useRef(null)
    
    useEffect(() => {
        const onResize = () => {
            const vv = window.visualViewport;
            setVisual({
                width: vv?.width ?? window.innerWidth,
                height: vv?.height ?? window.innerHeight,
                offsetTop: vv?.offsetTop ?? 0,
            });
        };

        window.addEventListener("resize", onResize);
        const vv = window.visualViewport;
        vv?.addEventListener("resize", onResize);
        onResize();

        return () => {
            window.removeEventListener("resize", onResize);
            vv?.removeEventListener("resize", onResize);
        };
    }, []);

    useLayoutEffect(() => {
        if (wrapperRef.current) setPopupHeight(wrapperRef.current.offsetHeight)
    }, [wrapperRef, keyboard?.popupState]) // Utilise keyboard.popupState au lieu de popupState

    // Affichage conditionnel selon keyboard.popupState
    if (keyboard?.popupState === 'closed') {
        return null; // Ou display: none
    }


    const style = {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        transform: `translateY(${(visual.offsetTop ?? 0) + (visual.height ?? window.innerHeight) - (popupHeight || 0)}px)`,
        // Optionnel: hauteur différente selon l'état
        transition: 'all 0.3s ease',
        backgroundColor: '#333'
    };

    return (
        <div ref={wrapperRef} style={style} >
            {children}
        </div>
    )
}