import { useEffect, useRef } from "react";

const useAnimationFrame = (callback: Function) => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef(0);
    const previousTimeRef = useRef(0);

    const animate = (time: any) => {
        if (previousTimeRef.current === undefined) {
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
            return
        } else {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime)
        }

    }
    
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once
}

export default useAnimationFrame