import React, { useState } from 'react';
import { Field } from '../../functions/types/formTypes';

interface RatingInputProps {
    field: Field;
    answer: string;
    changeValueCB: (id: number, value: string) => void;
}
export default function RatingInput(props: RatingInputProps) {
    const { field, answer, changeValueCB } = props;
    
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(Number(answer) | 0);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        changeValueCB(field.id!, String(newRating));
    }

    return (
        <div className="inline-block">
            <p className="text-xl text-gray-800 font-semibold">{ field.label }</p>
            {[...Array(Number(field.options))].map((star, i) => (
                <button 
                    key={i}
                    type="button" 
                    className={`p-1 bg-transparent border-0 outline-0 cursor-pointer ${i + 1 <= (hover || rating) ? "text-red-600" : "text-gray-400"}`}
                    onClick={() => handleRatingChange(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(rating)}
                >
                    <span className="text-4xl">&#9733;</span>
                </button>
            ))}
            
        </div>
    );
}
