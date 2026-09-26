import { useState, useEffect, useCallback } from "react";

interface FlashCard {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const initialFlashcards: FlashCard[] = [
    {
        id: "1",
        category: "Core Concept",
        question: "What is React?",
        answer: "A JavaScript library for building user interfaces based on reusable components."
    },
    {
        id: "2",
        category: "Components",
        question: "What is a component in React?",
        answer: "A self-contained, reusable piece of UI that encapsulates its own markup, styling, and state logic."
    },
    {
        id: "3",
        category: "Syntax",
        question: "What is JSX?",
        answer: "A syntax extension for JavaScript that allows you to write HTML-like element trees within JS files."
    },
    {
        id: "4",
        category: "Data Flow",
        question: "What is a prop in React?",
        answer: "Read-only input data passed from a parent component down to a child component."
    },
    {
        id: "5",
        category: "State Management",
        question: "What is state in React?",
        answer: "Internal mutable data managed by a component that triggers a re-render when modified."
    },
    {
        id: "6",
        category: "Hooks",
        question: "What is useState?",
        answer: "A React Hook that allows functional components to declare and update local state variables."
    },
    {
        id: "7",
        category: "Hooks",
        question: "What is useEffect?",
        answer: "A React Hook used for managing side effects like data fetching, subscriptions, and DOM manipulations."
    },
    {
        id: "8",
        category: "Hooks",
        question: "What is a React Hook?",
        answer: "A special function (prefixed with 'use') that lets functional components hook into React state and lifecycle."
    },
    {
        id: "9",
        category: "Architecture",
        question: "What is the Virtual DOM?",
        answer: "A lightweight in-memory representation of the real DOM that React diffs to perform minimal, efficient UI updates."
    },
    {
        id: "10",
        category: "Performance",
        question: "Why are keys used in React lists?",
        answer: "Keys provide persistent identities to elements across renders, enabling React to detect additions, removals, and reorders efficiently."
    },
    {
        id: "11",
        category: "Patterns",
        question: "What is conditional rendering?",
        answer: "Techniques (such as ternary operators or &&) to render different UI elements based on state or prop conditions."
    },
    {
        id: "12",
        category: "Events",
        question: "What is event handling in React?",
        answer: "React wraps native browser events in SyntheticEvents to provide cross-browser consistency with camelCase handlers."
    },
    {
        id: "13",
        category: "Forms",
        question: "What is a controlled component?",
        answer: "An input element whose value is driven and managed directly by React state."
    },
    {
        id: "14",
        category: "Forms",
        question: "What is an uncontrolled component?",
        answer: "An input element whose state is kept in the DOM itself, accessed via React refs rather than component state."
    },
    {
        id: "15",
        category: "Architecture",
        question: "What is lifting state up?",
        answer: "Moving state to the closest common ancestor so multiple sibling components can share and synchronize data."
    },
    {
        id: "16",
        category: "State Management",
        question: "What is React Context?",
        answer: "A mechanism to pass data through the component tree without manually passing props at every intermediate level."
    },
    {
        id: "17",
        category: "Performance",
        question: "What is useMemo?",
        answer: "A Hook that memoizes the output of an expensive computation, recomputing it only when specified dependencies change."
    },
    {
        id: "18",
        category: "Performance",
        question: "What is useCallback?",
        answer: "A Hook that returns a memoized version of a callback function, preventing unnecessary re-creations across renders."
    },
    {
        id: "19",
        category: "Reactivity",
        question: "What causes a React component to re-render?",
        answer: "A re-render is triggered by changes to local state, changes to received props, context updates, or a parent component re-rendering."
    },
    {
        id: "20",
        category: "Ecosystem",
        question: "What is React Router?",
        answer: "A standard library providing declarative, client-side routing and view switching in React web applications."
    }
];

function Cards() {
    const [cards, setCards] = useState<FlashCard[]>(initialFlashcards);
    const [currentCard, setCurrentCard] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const card = cards[currentCard];
    const totalCards = cards.length;
    const progress = ((currentCard + 1) / totalCards) * 100;
    const isMastered = card ? masteredIds.has(card.id) : false;

    const handlePrevious = useCallback((): void => {
        if (currentCard > 0) {
            setIsFlipped(false);
            setCurrentCard((prev) => prev - 1);
        }
    }, [currentCard]);

    const handleNext = useCallback((): void => {
        if (currentCard < totalCards - 1) {
            setIsFlipped(false);
            setCurrentCard((prev) => prev + 1);
        } else {
            setIsCompleted(true);
        }
    }, [currentCard, totalCards]);

    const handleFlip = useCallback((): void => {
        setIsFlipped((prev) => !prev);
    }, []);

    const toggleMastered = useCallback((id: string, e: React.MouseEvent): void => {
        e.stopPropagation();
        setMasteredIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleShuffle = useCallback((): void => {
        setIsFlipped(false);
        setCards((prev) => {
            const shuffled = [...prev];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        });
        setCurrentCard(0);
        setIsCompleted(false);
    }, []);

    const handleRestart = useCallback((): void => {
        setIsFlipped(false);
        setCurrentCard(0);
        setIsCompleted(false);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Ignore if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.code === "Space" || e.key === "Enter" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                handleFlip();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleFlip, handleNext, handlePrevious]);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10">
            {/* Background Ambient Glows */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* App Header */}
            <header className="text-center mb-6 w-full">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner backdrop-blur-md mb-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        React Mastery Deck
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                        v2.0
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Master Core <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">React Concepts</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                    Click the card or press <kbd className="px-1.5 py-0.5 text-xs bg-slate-800 text-slate-300 border border-slate-700 rounded font-mono">Space</kbd> to flip between question and answer.
                </p>
            </header>

            {/* Centered Progress Bar Section */}
            <section className="w-full max-w-lg mb-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/20">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2.5">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                            Card {currentCard + 1} of {totalCards}
                        </span>
                        {masteredIds.size > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {masteredIds.size} Mastered
                            </span>
                        )}
                    </div>
                    <span className="font-mono font-semibold text-slate-300 text-xs sm:text-sm">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </section>

            {/* Flashcard with 3D Flip */}
            {!isCompleted ? (
                <div
                    onClick={handleFlip}
                    className="card-perspective w-full h-[320px] sm:h-[350px] cursor-pointer group select-none"
                    role="button"
                    tabIndex={0}
                    aria-label="Flashcard. Click or press Space to flip."
                >
                    <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
                        {/* FRONT FACE (Question) */}
                        <div className="card-face bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 border border-slate-700/70 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 group-hover:shadow-indigo-500/10">
                            {/* Card Top Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                        Question
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/40">
                                        {card.category}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => toggleMastered(card.id, e)}
                                    title={isMastered ? "Mark as unlearned" : "Mark as mastered"}
                                    className={`p-2 rounded-full transition-all ${isMastered
                                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                                            : "text-slate-500 hover:text-amber-400 bg-slate-800/50 hover:bg-amber-400/10 border border-slate-700/40"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill={isMastered ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Card Center: Question */}
                            <div className="my-auto py-4 text-center px-2">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                                    {card.question}
                                </h2>
                            </div>

                            {/* Card Bottom Hint */}
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-800/60">
                                <svg className="w-3.5 h-3.5 text-indigo-400 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Click anywhere or press Space to reveal answer</span>
                            </div>
                        </div>

                        {/* BACK FACE (Answer) */}
                        <div className="card-face card-back bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-slate-900/95 border border-indigo-500/40 hover:border-indigo-400/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-indigo-950/50 backdrop-blur-xl transition-all duration-300">
                            {/* Card Top Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        Answer
                                    </span>
                                    <span className="text-xs text-indigo-300/80 font-medium px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40">
                                        {card.category}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => toggleMastered(card.id, e)}
                                    title={isMastered ? "Mark as unlearned" : "Mark as mastered"}
                                    className={`p-2 rounded-full transition-all ${isMastered
                                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                                            : "text-slate-500 hover:text-amber-400 bg-slate-800/50 hover:bg-amber-400/10 border border-slate-700/40"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill={isMastered ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Card Center: Answer */}
                            <div className="my-auto py-4 text-center px-3 sm:px-6">
                                <p className="text-base sm:text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
                                    {card.answer}
                                </p>
                            </div>

                            {/* Card Bottom Hint */}
                            <div className="flex items-center justify-center gap-2 text-xs text-indigo-300/70 font-medium pt-2 border-t border-indigo-900/50">
                                <svg className="w-3.5 h-3.5 text-indigo-400 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Click anywhere to flip back to question</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Completion Celebration Screen */
                <div className="w-full bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/80 border border-slate-700/80 rounded-3xl p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Deck Completed! 🎉
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-sm mx-auto mb-6">
                        You reviewed all {totalCards} cards.
                        {masteredIds.size > 0 && (
                            <span className="block mt-1 font-semibold text-emerald-400">
                                You mastered {masteredIds.size} of {totalCards} concepts!
                            </span>
                        )}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold transition-all active:scale-95 shadow-md"
                        >
                            Review Again
                        </button>
                        <button
                            type="button"
                            onClick={handleShuffle}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/25"
                        >
                            Shuffle & Restart
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation and Action Bar */}
            <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Secondary Actions (Shuffle / Restart) */}
                <div className="flex items-center gap-2 order-2 sm:order-1">
                    <button
                        type="button"
                        onClick={handleShuffle}
                        title="Shuffle Cards"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Shuffle
                    </button>
                    <button
                        type="button"
                        onClick={handleRestart}
                        title="Restart from Card 1"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                        </svg>
                        Restart
                    </button>
                </div>

                {/* Primary Card Controls */}
                <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-center">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentCard === 0}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md shadow-black/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Previous</span>
                    </button>

                    {/* Flip Card Action Button */}
                    <button
                        type="button"
                        onClick={handleFlip}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-indigo-300 text-sm font-semibold border border-indigo-500/30 hover:border-indigo-500/60 transition-all active:scale-95 shadow-md shadow-indigo-950/30"
                    >
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Flip</span>
                    </button>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        <span>{currentCard === totalCards - 1 ? "Finish" : "Next"}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Keyboard Shortcuts Footer */}
            <footer className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-400">←</kbd>
                    <span>Prev</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-400">Space</kbd>
                    <span>Flip</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-400">→</kbd>
                    <span>Next</span>
                </span>
            </footer>
        </div>
    );
}

export default Cards;