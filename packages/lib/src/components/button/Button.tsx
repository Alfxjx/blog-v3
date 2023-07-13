import { AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export interface ButtonProps {
  label: string;
  size?: 'medium' | 'small' | 'large' | 'block';
  onClick?: () => void;
}

const LOADING_WIDTH = 100;

/**
 * Primary UI component for user interaction
 */
export const Button = ({ label, onClick, ...props }: ButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [startX, setInitX] = useState(0);
  const [endX, setEndX] = useState(0);

  const constraintsRef = useRef(null);

  const handleDragStart = (e: PointerEvent) => {
    setInitX(e.clientX);
  };

  const handleDragEnd = (e: PointerEvent) => {
    setEndX(e.clientX);
    if (e.clientX - startX > LOADING_WIDTH) {
      setLoading(true);
      onClick && onClick();
      setTimeout(() => {
        setLoading(false);
        setEndX(0);
        setInitX(0);
      }, 1000);
    }
  };

  return (
    <div
      className={`rounded-lg p-2 flex justify-start w-36 transition-colors ${
        endX - startX > LOADING_WIDTH
          ? 'bg-green-500'
          : 'transparent border-gray-100 border'
      }`}
      title={label}
    >
      <div ref={constraintsRef} className="w-full">
        <motion.div
          drag="x"
          whileDrag={{ scale: 1.05 }}
          dragConstraints={constraintsRef}
          dragSnapToOrigin={true}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`bg-gray-400 active:bg-gray-700 h-6 w-6 text-white rounded-full flex justify-center items-center ${
            endX - startX > LOADING_WIDTH ? 'bg-gray-700' : ''
          }`}
          {...props}
        >
          {loading ? <Loading></Loading> : <AiOutlineArrowRight />}
        </motion.div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <span className="animate-spin">
      <AiOutlineLoading />
    </span>
  );
};
