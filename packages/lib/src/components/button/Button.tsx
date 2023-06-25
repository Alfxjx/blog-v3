import { AiOutlineArrowRight } from 'react-icons/ai';
import { motion } from "framer-motion"

interface ButtonProps {
  label: string
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  label,
  ...props
}: ButtonProps) => {

  return (
    <div className='rounded-lg p-2 flex justify-start bg-gray-200 w-20' title={label}>
      <motion.button
        type="button"
        className='bg-blue-500 active:bg-blue-700 h-6 w-6 text-white rounded-full flex justify-center items-center'
        {...props}

      >
        <AiOutlineArrowRight />
      </motion.button>
    </div>
  );
};
