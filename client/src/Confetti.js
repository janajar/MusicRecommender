import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import './Confetti.css'; // Make sure to import your CSS file

const Confetti = () => {
    const [windowDimen, setDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

    const detectSize = () => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }

    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => {
            window.removeEventListener('resize', detectSize);
        }
    }, [windowDimen]);

    return (
        <div className="confetti-container">
            <ReactConfetti
                width={windowDimen.width}
                height={windowDimen.height}
                numberOfPieces={100}
                recycle={true}
                colors={['#25f4ee', '#fe2c55', '#ffffff']}
                tweenDuration={1000}
            />
        </div>
    );
};

export default Confetti;
