'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    // className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black bg-opacity-70"
                    className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center backdrop-blur-lg bg-black/10"

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    <motion.div
                        className="relative bg-black text-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer z-50 top-4 right-4 text-4xl p-4 rounded-full text-gray-300 hover:text-white transform transition-transform  hover:scale-120"
                        >
                            &times;
                        </button>



                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
