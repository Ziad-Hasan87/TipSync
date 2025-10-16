import { motion, AnimatePresence } from "framer-motion";
import KeyButton from "./keybutton";
import type { KeyRow } from "~/types/keys";

export default function KeySequence({ keyrows }: { keyrows: KeyRow[] }) {
    return (
        <div className="overflow-hidden h-full flex flex-col justify-end">
            <AnimatePresence initial={false}>
                {keyrows.map((keyrow) => (
                    <motion.div
                        key={keyrow.index}
                        data-row-id={keyrow.index}
                        initial={{ y: "-100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex justify-center h-25"
                    >
                        {keyrow.keys.map((key, index) => {
                            if (key === "") {
                                return <div key={`${keyrow.index}-${index}`} data-key-id={`${keyrow.index}-${index}`} className="key-empty"></div>;
                            }
                            return (
                                <div key={`${keyrow.index}-${index}`} data-key-id={`${keyrow.index}-${index}`} className="key-border">
                                    <KeyButton className="key-button">
                                        {key.toUpperCase()}
                                    </KeyButton>
                                </div>
                            );
                        })}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
