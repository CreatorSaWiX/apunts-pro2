import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Book, Terminal, Calculator, ChevronLeft, ChevronRight, RefreshCw, MoveHorizontal } from 'lucide-react';
import { m as motion, AnimatePresence, useMotionTemplate, useMotionValue, MotionConfig } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useShortcut } from '../hooks/useShortcut';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTopicNotes } from '../hooks/useTopicNotes';
import { getTopicSolutionRoute, getTopicSolutionLabel, isProgrammingSubject } from '../utils/solutionUtils';

const SpotlightCard = React.memo(({
    children,
    className = "",
    isActive = false,
    isMenuOpen = false,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    isMenuOpen?: boolean;
    [key: string]: unknown;
}) => {
    const isMobile = useIsMobile();
    const shouldDisable = isMobile && isMenuOpen;
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          650px circle at ${mouseX}px ${mouseY}px,
          rgba(var(--primary-rgb), 0.15),
          transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        if (shouldDisable) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group/card relative border border-white/10 overflow-hidden transform-gpu ${className}`}
            style={{
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)'
            }}
            onMouseMove={handleMouseMove}
            {...props}
        >
            {!shouldDisable && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
                    style={{ background: backgroundStyle }}
                />
            )}
            {children}
        </div>
    );
});

interface DesktopDragCursorProps {
    isVisible: boolean;
    isDragging: boolean;
    cursorX: MotionValue<number>;
    cursorY: MotionValue<number>;
    label: string;
}

const DesktopDragCursor = React.memo(({
    isVisible,
    isDragging,
    cursorX,
    cursorY,
    label
}: DesktopDragCursorProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={{ x: cursorX, y: cursorY }}
                    initial={{ opacity: 0, scale: 0.88, filter: 'blur(3px)' }}
                    animate={{
                        opacity: 1,
                        scale: isDragging ? 0.95 : 1,
                        filter: 'blur(0px)'
                    }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(2px)', transition: { duration: 0.15, ease: 'easeOut' } }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={`
                        hidden md:flex pointer-events-none select-none fixed top-0 left-0 z-50 transform-gpu
                        translate-x-3.5 translate-y-3.5 items-center gap-1.5 px-2.5 py-1 rounded-full
                        bg-slate-950/85 backdrop-blur-md border border-white/10
                        shadow-[0_4px_14px_rgba(0,0,0,0.35)]
                        transition-colors duration-150
                        ${isDragging ? 'border-primary/40 text-accent' : 'text-slate-300'}
                    `}
                    aria-hidden="true"
                >
                    <MoveHorizontal size={11} className={isDragging ? 'text-accent' : 'text-slate-400'} />
                    <span className="text-[11px] font-medium text-slate-200 tracking-tight leading-none pt-[0.5px] whitespace-nowrap">
                        {label}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

DesktopDragCursor.displayName = 'DesktopDragCursor';

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const TopicCarousel: React.FC<TopicCarouselProps> = React.memo(({ isMenuOpen = false, subjectOverride }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { subject: contextSubject } = useSubjectStore();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    const { shortcuts } = useSettingsStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(activeIndex);
    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);
    const [allPersonalNotes, setAllPersonalNotes] = useState<any[]>([]);

    useEffect(() => {
        import('content-collections').then(m => setAllPersonalNotes(m.allPersonalNotes)).catch(console.error);
    }, []);

    const enterShortcut = shortcuts?.carouselEnter || { key: 'Enter', meta: false };
    const leftShortcut = shortcuts?.carouselLeft || { key: 'ArrowLeft', meta: false };
    const rightShortcut = shortcuts?.carouselRight || { key: 'ArrowRight', meta: false };

    const formatShortcut = useCallback((shortcut: { key: string, meta: boolean }) => {
        if (!shortcut.key) return '';
        let key = shortcut.key.toUpperCase();
        if (shortcut.key === ' ') key = 'SPACE';
        if (shortcut.key === 'ArrowLeft') key = '←';
        if (shortcut.key === 'ArrowRight') key = '→';
        if (shortcut.key === 'ArrowUp') key = '↑';
        if (shortcut.key === 'ArrowDown') key = '↓';
        if (shortcut.key === 'Enter') key = 'ENTER';
        return shortcut.meta ? `⌘ ${key}` : key;
    }, []);
    const carouselWrapperRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const restoringRef = useRef(true);
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const seenNewTopicsSet = useMemo(() => new Set(seenNewTopics), [seenNewTopics]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});
    const metricsRef = useRef<{ center: number, index: number }[]>([]);

    const { sortedTopics, topicMeta } = useTopicNotes(allPersonalNotes, subject, preferredLang);

    // -------------------------------------------------------------------------
    // Desktop Custom Drag Cursor & Drag-to-Scroll State Machine (120fps)
    // -------------------------------------------------------------------------
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showPan, setShowPan] = useState(false);

    const isHoveringCarouselRef = useRef(false);
    const isHoveringInteractiveRef = useRef(false);
    const isDraggingRef = useRef(false);
    const showPanRef = useRef(false);

    const isPointerDownRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const suppressNextClickRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);
    const dragStartIndexRef = useRef(0);
    const pointerHistoryRef = useRef<{ x: number; time: number }[]>([]);

    const panTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearPanTimer = useCallback(() => {
        if (panTimerRef.current) {
            clearTimeout(panTimerRef.current);
            panTimerRef.current = null;
        }
    }, []);

    const startPanTimer = useCallback((durationMs = 700) => {
        clearPanTimer();
        panTimerRef.current = setTimeout(() => {
            if (!isDraggingRef.current) {
                showPanRef.current = false;
                setShowPan(false);
            }
        }, durationMs);
    }, [clearPanTimer]);

    // Reset when subject changes
    useEffect(() => {
        clearPanTimer();
        showPanRef.current = false;
        setShowPan(false);
        isHoveringCarouselRef.current = false;
        setIsHoveringCarousel(false);
    }, [subject, clearPanTimer]);

    // Cleanup all timers on unmount
    useEffect(() => {
        return () => {
            clearPanTimer();
            if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
        };
    }, [clearPanTimer]);

    // Save activeIndex to session storage whenever it updates (skip during restoration)
    useEffect(() => {
        if (restoringRef.current) return;
        sessionStorage.setItem(`topic-carousel-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);

    // Load seen topics from localStorage on mount
    useEffect(() => {
        try {
            // Migració de claus antigues per no perdre el progrés de l'usuari
            const oldNew = localStorage.getItem('v1_seen-new-topics');
            if (oldNew && !localStorage.getItem('seen-new-topics')) {
                localStorage.setItem('seen-new-topics', oldNew);
                localStorage.removeItem('v1_seen-new-topics');
            }

            const oldVersions = localStorage.getItem('v1_seen-topic-versions');
            if (oldVersions && !localStorage.getItem('seen-topic-versions')) {
                localStorage.setItem('seen-topic-versions', oldVersions);
                localStorage.removeItem('v1_seen-topic-versions');
            }

            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) {
                setSeenNewTopics(JSON.parse(savedNew));
            }
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) {
                setSeenVersions(JSON.parse(savedVersions));
            }
        } catch (e) {
            console.debug('LocalStorage read silenced:', e);
        }
    }, []);

    const markAsSeen = useCallback((slug: string, version?: number) => {
        try {
            // Mark as new-seen
            const savedNew = localStorage.getItem('seen-new-topics');
            const prevNew = savedNew ? JSON.parse(savedNew) : [];
            if (!prevNew.includes(slug)) {
                const updatedNew = [...prevNew, slug];
                localStorage.setItem('seen-new-topics', JSON.stringify(updatedNew));
                // We don't update state here to avoid the badge disappearing before navigation
            }

            // Mark version as seen
            if (version !== undefined) {
                const savedVersions = localStorage.getItem('seen-topic-versions');
                const prevVersions = savedVersions ? JSON.parse(savedVersions) : {};
                if (prevVersions[slug] !== version) {
                    const updatedVersions = { ...prevVersions, [slug]: version };
                    localStorage.setItem('seen-topic-versions', JSON.stringify(updatedVersions));
                    // We don't update state here to avoid the badge disappearing before navigation
                }
            }
        } catch (e) {
            console.debug('LocalStorage write silenced:', e);
        }
    }, []);

    // Pre-calculate card metrics for ultra-fast scroll performance
    const updateMetrics = useCallback(() => {
        if (isMobile && isMenuOpen) return;
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const children = container.children;
        const newMetrics: { center: number, index: number }[] = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (child.classList.contains('carousel-card')) {
                const indexStr = child.getAttribute('data-index');
                if (indexStr !== null) {
                    newMetrics.push({
                        center: child.offsetLeft + child.clientWidth / 2,
                        index: parseInt(indexStr, 10)
                    });
                }
            }
        }
        metricsRef.current = newMetrics;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Recalculate metrics when topic list changes (async data load)
    useEffect(() => {
        if (sortedTopics.length === 0) return;
        // Wait for DOM to update with new cards before measuring
        requestAnimationFrame(() => {
            updateMetrics();
        });
    }, [sortedTopics.length, updateMetrics]);

    const isAnimatingRef = useRef(false);

    // Direct synchronous DOM transform & opacity update for silky 120fps scrolling
    const updateCardVisuals = useCallback((scrollLeft: number) => {
        if (!scrollRef.current) return activeIndexRef.current;
        if (metricsRef.current.length === 0) {
            updateMetrics();
            if (metricsRef.current.length === 0) return activeIndexRef.current;
        }
        const container = scrollRef.current;
        const containerWidth = container.clientWidth;
        const scrollCenter = scrollLeft + containerWidth / 2;
        const maxDist = containerWidth * 0.6;
        const children = container.children;

        let closestIndex = activeIndexRef.current;
        let minDistance = Infinity;

        for (let i = 0; i < metricsRef.current.length; i++) {
            const metric = metricsRef.current[i];
            const child = children[i] as HTMLElement;
            if (!child) continue;

            const distance = Math.abs(metric.center - scrollCenter);
            const progress = Math.max(0, 1 - distance / maxDist);
            const easeProgress = Math.pow(progress, 1.8);

            child.style.transform = `scale(${0.85 + easeProgress * 0.15})`;
            child.style.opacity = `${0.3 + easeProgress * 0.7}`;

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = metric.index;
            }
        }
        return closestIndex;
    }, [updateMetrics]);

    const handleScroll = useCallback(() => {
        if (restoringRef.current || (isMobile && isMenuOpen)) return;
        if (!scrollRef.current) return;

        const currentLeft = scrollRef.current.scrollLeft;
        const closestIndex = updateCardVisuals(currentLeft);

        // Immediate activation when crossing card boundaries during horizontal scroll
        if (closestIndex !== activeIndexRef.current && !isDraggingRef.current) {
            activeIndexRef.current = closestIndex;
            React.startTransition(() => {
                setActiveIndex(closestIndex);
            });
        }

        // Fast micro-sync when scroll settles (15ms instead of 70ms)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            if (!isDraggingRef.current) {
                const finalLeft = scrollRef.current?.scrollLeft ?? currentLeft;
                const finalIndex = updateCardVisuals(finalLeft);
                if (finalIndex !== activeIndexRef.current) {
                    activeIndexRef.current = finalIndex;
                    React.startTransition(() => {
                        setActiveIndex(finalIndex);
                    });
                }
            }
        }, 15);
    }, [isMobile, isMenuOpen, updateCardVisuals]);

    // Initialize layout scales on mount & restore saved position
    useEffect(() => {
        const saved = sessionStorage.getItem(`topic-carousel-${subject}`);
        const savedIndex = saved ? parseInt(saved, 10) : 0;

        if (savedIndex > 0) {
            restoringRef.current = true;
            setActiveIndex(savedIndex);
        }

        const restoreScroll = () => {
            if (scrollRef.current && savedIndex > 0) {
                const container = scrollRef.current;
                const targetCard = Array.from(container.children).find(child =>
                    child.classList.contains('carousel-card') && child.getAttribute('data-index') === savedIndex.toString()
                ) as HTMLElement;

                if (targetCard) {
                    const containerWidth = container.clientWidth;
                    const cardWidth = targetCard.offsetWidth;
                    const centerPosition = targetCard.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
                    container.scrollTo({ left: centerPosition, behavior: 'instant' as ScrollBehavior });
                }
            }

            updateMetrics();

            setTimeout(() => {
                restoringRef.current = false;
                if (!(isMobile && isMenuOpen)) {
                    handleScroll();
                }
            }, 100);
        };

        requestAnimationFrame(() => requestAnimationFrame(restoreScroll));

        const handleGlobalResize = () => {
            updateMetrics();
            handleScroll();
        };
        window.addEventListener('resize', handleGlobalResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleGlobalResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [subject, updateMetrics, isMobile, isMenuOpen, handleScroll]);

    const animationFrameRef = useRef<number>(0);

    // Friction & momentum glide to target card (Apple / macOS momentum physics)
    const smoothScrollToTarget = useCallback((index: number, initialVx = 0) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const card = container.children[index] as HTMLElement;
        if (!card) return;

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const containerWidth = container.clientWidth;
        const cardWidth = card.offsetWidth;
        const maxScroll = Math.max(0, container.scrollWidth - containerWidth);
        const targetLeft = Math.max(0, Math.min(card.offsetLeft - (containerWidth / 2) + (cardWidth / 2), maxScroll));
        const startLeft = container.scrollLeft;
        const distance = targetLeft - startLeft;

        if (Math.abs(distance) < 2) {
            container.scrollLeft = targetLeft;
            container.style.scrollSnapType = '';
            updateCardVisuals(targetLeft);
            activeIndexRef.current = index;
            setActiveIndex(index);
            return;
        }

        // Immediately sync activeIndex so feedback (pagination pill, buttons) is instantaneous
        if (activeIndexRef.current !== index) {
            activeIndexRef.current = index;
            React.startTransition(() => {
                setActiveIndex(index);
            });
        }

        container.style.scrollSnapType = 'none';
        isAnimatingRef.current = true;

        const absDist = Math.abs(distance);
        const speedBoost = Math.min(1.4, Math.max(0.7, 1 + Math.abs(initialVx) * 0.45));
        const durationMs = Math.min(500, Math.max(280, (300 + Math.sqrt(absDist) * 7.5) / speedBoost));
        const startTime = performance.now();

        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            // Ease-out cubic curve (exact macOS inertia friction curve)
            const ease = 1 - Math.pow(1 - progress, 3);

            const currentLeft = startLeft + distance * ease;
            container.scrollLeft = currentLeft;
            updateCardVisuals(currentLeft);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(step);
            } else {
                container.scrollLeft = targetLeft;
                container.style.scrollSnapType = '';
                updateCardVisuals(targetLeft);
                isAnimatingRef.current = false;
                setActiveIndex(index);
            }
        };

        animationFrameRef.current = requestAnimationFrame(step);
    }, [updateCardVisuals]);

    const scrollTo = smoothScrollToTarget;

    const handlePrev = useCallback(() => {
        if (activeIndexRef.current > 0) smoothScrollToTarget(activeIndexRef.current - 1);
    }, [smoothScrollToTarget]);

    const handleNext = useCallback(() => {
        if (activeIndexRef.current < sortedTopics.length - 1) smoothScrollToTarget(activeIndexRef.current + 1);
    }, [sortedTopics.length, smoothScrollToTarget]);

    const handleCarouselLeft = useCallback(() => {
        if (isMobile && isMenuOpen) return;
        handlePrev();
    }, [isMobile, isMenuOpen, handlePrev]);

    useShortcut('carouselLeft', handleCarouselLeft);

    const handleCarouselRight = useCallback(() => {
        if (isMobile && isMenuOpen) return;
        handleNext();
    }, [isMobile, isMenuOpen, handleNext]);

    useShortcut('carouselRight', handleCarouselRight);

    const handleCarouselEnter = useCallback(() => {
        if (isMobile && isMenuOpen) return;
        const activeTopic = sortedTopics[activeIndexRef.current];
        if (activeTopic) {
            const versions = allPersonalNotes.filter(n => n.slug === activeTopic.slug);
            const newestUpdate = Math.max(0, ...versions.map(n => n.isUpdated || 0));
            markAsSeen(activeTopic.slug, newestUpdate);
            navigate(`/tema/${activeTopic.slug}`);
        }
    }, [isMobile, isMenuOpen, sortedTopics, navigate, allPersonalNotes, markAsSeen]);

    useShortcut('carouselEnter', handleCarouselEnter);

    const wheelAccumulatorRef = useRef(0);
    const wheelLockRef = useRef(false);
    const wheelLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // Desktop Pointer & Drag Handlers
    // -------------------------------------------------------------------------
    const handleWrapperPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isMobile || e.pointerType !== 'mouse') return;

        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        const overInteractive = Boolean((e.target as HTMLElement | null)?.closest('[data-cursor-interactive="true"]'));
        if (overInteractive !== isHoveringInteractiveRef.current) {
            isHoveringInteractiveRef.current = overInteractive;
            setIsHoveringInteractive(overInteractive);
        }

        if (!isHoveringCarouselRef.current) {
            isHoveringCarouselRef.current = true;
            setIsHoveringCarousel(true);
            showPanRef.current = true;
            setShowPan(true);
            startPanTimer(700);
        }
    }, [isMobile, cursorX, cursorY, startPanTimer]);

    const handleWrapperPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isMobile || e.pointerType !== 'mouse') return;
        isHoveringCarouselRef.current = false;
        setIsHoveringCarousel(false);
        isHoveringInteractiveRef.current = false;
        setIsHoveringInteractive(false);
        clearPanTimer();
        showPanRef.current = false;
        setShowPan(false);
    }, [isMobile, clearPanTimer]);

    const handleScrollPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isMobile || e.pointerType !== 'mouse' || e.button !== 0 || !scrollRef.current || sortedTopics.length <= 1) return;
        if ((e.target as HTMLElement | null)?.closest('[data-cursor-interactive="true"]')) return;

        // Cancel running animation immediately so user arrests cards in place
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            isAnimatingRef.current = false;
        }

        // Prevent browser text-selection interference so mouse drag flows freely
        window.getSelection()?.removeAllRanges();

        isPointerDownRef.current = true;
        hasDraggedRef.current = false;
        dragStartXRef.current = e.clientX;
        dragStartScrollLeftRef.current = scrollRef.current.scrollLeft;
        dragStartIndexRef.current = activeIndexRef.current;
        pointerHistoryRef.current = [{ x: e.clientX, time: performance.now() }];
    }, [isMobile, sortedTopics.length]);

    const handleScrollPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isMobile || e.pointerType !== 'mouse') return;

        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (!isPointerDownRef.current || !scrollRef.current) return;

        const deltaX = e.clientX - dragStartXRef.current;

        if (!hasDraggedRef.current && Math.abs(deltaX) > 4) {
            hasDraggedRef.current = true;
            isDraggingRef.current = true;
            setIsDragging(true);
            suppressNextClickRef.current = true;

            showPanRef.current = true;
            setShowPan(true);
            clearPanTimer();

            try {
                e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
                // Ignore
            }

            scrollRef.current.style.scrollSnapType = 'none';
        }

        if (hasDraggedRef.current) {
            const now = performance.now();
            pointerHistoryRef.current.push({ x: e.clientX, time: now });
            if (pointerHistoryRef.current.length > 8) {
                pointerHistoryRef.current.shift();
            }

            // Direct 1:1 physical follow with soft rubber-band resistance at boundaries
            let newScrollLeft = dragStartScrollLeftRef.current - deltaX;
            const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

            if (newScrollLeft < 0) {
                newScrollLeft = newScrollLeft * 0.3;
            } else if (newScrollLeft > maxScroll) {
                newScrollLeft = maxScroll + (newScrollLeft - maxScroll) * 0.3;
            }

            scrollRef.current.scrollLeft = newScrollLeft;
            const closest = updateCardVisuals(newScrollLeft);
            if (closest !== activeIndexRef.current) {
                activeIndexRef.current = closest;
                React.startTransition(() => {
                    setActiveIndex(closest);
                });
            }
        }
    }, [isMobile, cursorX, cursorY, clearPanTimer, updateCardVisuals]);

    const finishPointerDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDownRef.current) return;
        isPointerDownRef.current = false;

        if (!hasDraggedRef.current) return;

        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore
        }

        isDraggingRef.current = false;
        setIsDragging(false);

        // Keep showing 'pan' until quiet, then switch back to click cursor
        if (isHoveringCarouselRef.current) {
            startPanTimer(1600);
        } else {
            showPanRef.current = false;
            setShowPan(false);
        }

        if (!scrollRef.current || sortedTopics.length <= 1) return;
        const container = scrollRef.current;
        const containerWidth = container.clientWidth;
        const currentScrollLeft = container.scrollLeft;

        // Calculate release velocity from the last 90ms of pointer motion
        const now = performance.now();
        const recent = pointerHistoryRef.current.filter(p => now - p.time < 90);
        let vx = 0;
        if (recent.length >= 2) {
            const first = recent[0];
            const last = recent[recent.length - 1];
            const dt = last.time - first.time;
            if (dt > 8) {
                vx = (last.x - first.x) / dt;
            }
        }

        // Momentum projection (negative vx = flicked left = moves to next cards)
        const momentumDistance = -vx * 260;
        const projectedScrollLeft = currentScrollLeft + momentumDistance;

        let targetIndex = dragStartIndexRef.current;
        let minDistance = Infinity;

        for (let i = 0; i < sortedTopics.length; i++) {
            const card = container.children[i] as HTMLElement;
            if (!card) continue;
            const cardTarget = card.offsetLeft - (containerWidth / 2) + (card.offsetWidth / 2);
            const dist = Math.abs(cardTarget - projectedScrollLeft);
            if (dist < minDistance) {
                minDistance = dist;
                targetIndex = i;
            }
        }

        // Enforce directional intent on swipe
        const totalDeltaX = e.clientX - dragStartXRef.current;
        if (totalDeltaX < -40 && targetIndex <= dragStartIndexRef.current) {
            targetIndex = Math.min(sortedTopics.length - 1, dragStartIndexRef.current + 1);
        } else if (totalDeltaX > 40 && targetIndex >= dragStartIndexRef.current) {
            targetIndex = Math.max(0, dragStartIndexRef.current - 1);
        }

        targetIndex = Math.max(0, Math.min(sortedTopics.length - 1, targetIndex));

        smoothScrollToTarget(targetIndex, vx);

        if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
        suppressClickTimerRef.current = setTimeout(() => {
            suppressNextClickRef.current = false;
            hasDraggedRef.current = false;
        }, 120);
    }, [sortedTopics.length, startPanTimer, smoothScrollToTarget]);

    const handleScrollClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (suppressNextClickRef.current || hasDraggedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressNextClickRef.current = false;
            hasDraggedRef.current = false;
        }
    }, []);

    // -------------------------------------------------------------------------
    // Smooth Desktop Mouse Wheel (converts vertical wheel to snappy carousel slide)
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (isMobile) return;
        const container = carouselWrapperRef.current;
        if (!container) return;

        const onNativeWheel = (e: WheelEvent) => {
            // Trackpad horizontal gestures: let browser natively handle it with instant responsiveness
            if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.4) {
                return;
            }

            // Desktop vertical mouse wheel
            if (Math.abs(e.deltaY) < 6) return;

            e.preventDefault();

            if (wheelLockRef.current) return;

            wheelAccumulatorRef.current += e.deltaY;

            if (Math.abs(wheelAccumulatorRef.current) >= 40) {
                const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
                wheelAccumulatorRef.current = 0;
                wheelLockRef.current = true;

                const currIdx = activeIndexRef.current;
                const nextIdx = direction > 0
                    ? Math.min(sortedTopics.length - 1, currIdx + 1)
                    : Math.max(0, currIdx - 1);

                if (nextIdx !== currIdx) {
                    smoothScrollToTarget(nextIdx);
                }

                if (wheelLockTimerRef.current) clearTimeout(wheelLockTimerRef.current);
                wheelLockTimerRef.current = setTimeout(() => {
                    wheelLockRef.current = false;
                    wheelAccumulatorRef.current = 0;
                }, 220);
            }
        };

        container.addEventListener('wheel', onNativeWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onNativeWheel);
            if (wheelLockTimerRef.current) clearTimeout(wheelLockTimerRef.current);
        };
    }, [isMobile, sortedTopics.length, smoothScrollToTarget]);

    const isDragCursorVisible = !isMobile && sortedTopics.length > 1 && isHoveringCarousel && !isHoveringInteractive && showPan;

    const getCarouselCursorClass = () => {
        if (isDragging) return 'cursor-grabbing';
        if (showPan) return 'cursor-grab';
        return '';
    };

    if (sortedTopics.length === 0) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full p-8 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                        <Book size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {t('subjects.emptyStateTitle', 'No hi ha apunts disponibles')}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {t('subjects.emptyStateDesc', "Els apunts d'aquesta assignatura estan en procés de redacció o en esborrany.")}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <MotionConfig reducedMotion={isMobile && isMenuOpen ? "always" : "never"}>
            <div
                ref={carouselWrapperRef}
                onPointerMove={handleWrapperPointerMove}
                onPointerEnter={handleWrapperPointerMove}
                onPointerLeave={handleWrapperPointerLeave}
                className={`w-full flex-1 flex flex-col justify-center relative group/carousel select-none ${getCarouselCursorClass()}`}
            >
                {/* Apple / Linear Minimalist Custom Drag Cursor (Desktop Only) */}
                {!isMobile && sortedTopics.length > 1 && (
                    <DesktopDragCursor
                        isVisible={isDragCursorVisible}
                        isDragging={isDragging}
                        cursorX={cursorX}
                        cursorY={cursorY}
                        label={t('topics.dragHint', 'Arrossega')}
                    />
                )}

                {/* Desktop Navigation Arrows */}
                {activeIndex > 0 && (
                    <button type="button"
                        data-cursor-interactive="true"
                        onClick={handlePrev}
                        className="hidden md:flex absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3.5 md:p-4 rounded-full bg-slate-900/60 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-all duration-300 backdrop-blur-xl opacity-60 hover:!opacity-100 group-hover/carousel:opacity-90 shadow-2xl hover:scale-105 active:scale-95 group/navleft cursor-pointer"
                        aria-label="Previous topic"
                    >
                        <ChevronLeft size={28} className="group-hover/navleft:-translate-x-1 transition-transform" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/navleft:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-bold tracking-wider text-slate-300">
                                {formatShortcut(leftShortcut)}
                            </span>
                        </div>
                    </button>
                )}

                {activeIndex < sortedTopics.length - 1 && (
                    <button type="button"
                        data-cursor-interactive="true"
                        onClick={handleNext}
                        className="hidden md:flex absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3.5 md:p-4 rounded-full bg-slate-900/60 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-all duration-300 backdrop-blur-xl opacity-60 hover:!opacity-100 group-hover/carousel:opacity-90 shadow-2xl hover:scale-105 active:scale-95 group/navright cursor-pointer"
                        aria-label="Next topic"
                    >
                        <ChevronRight size={28} className="group-hover/navright:translate-x-1 transition-transform" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/navright:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-bold tracking-wider text-slate-300">
                                {formatShortcut(rightShortcut)}
                            </span>
                        </div>
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    onPointerDown={handleScrollPointerDown}
                    onPointerMove={handleScrollPointerMove}
                    onPointerUp={finishPointerDrag}
                    onPointerCancel={finishPointerDrag}
                    onClickCapture={handleScrollClickCapture}
                    className={`flex gap-2 md:gap-3 overflow-x-auto pb-20 pt-12 md:pb-24 md:pt-16 hide-scrollbar snap-x snap-mandatory px-[9vw] md:px-[calc(50%-190px)] ${getCarouselCursorClass()}`}
                >
                    {sortedTopics.map((topic, i) => {
                        const isActive = activeIndex === i;
                        // O(1) lookup from pre-computed metadata Map
                        const meta = topicMeta.get(topic.slug);
                        const hasNewTag = meta?.hasNew ?? false;
                        const newestUpdate = meta?.newestUpdate ?? 0;

                        const isTopicNew = hasNewTag && !seenNewTopicsSet.has(topic.slug);
                        const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

                        return (
                            <div
                                key={topic.slug}
                                data-index={i}
                                className="carousel-card shrink-0 snap-center outline-none"
                                style={{
                                    // Initial styles explicitly set to prevent flash before JS kicks in
                                    transform: isActive ? 'scale(1)' : 'scale(0.85)',
                                    opacity: isActive ? 1 : 0.3
                                }}
                                onClick={(e) => {
                                    if (suppressNextClickRef.current || hasDraggedRef.current) {
                                        e.preventDefault();
                                        return;
                                    }
                                    if (!isActive) {
                                        e.preventDefault();
                                        scrollTo(i);
                                    } else {
                                        markAsSeen(topic.slug, newestUpdate);
                                        navigate(`/tema/${topic.slug}`);
                                    }
                                }}
                            >
                                <SpotlightCard
                                    isActive={isActive}
                                    isMenuOpen={isMenuOpen}
                                    className={`
                                        w-[82vw] md:w-[380px] h-[410px] md:h-[520px]
                                        rounded-[32px] md:rounded-[40px]
                                        flex flex-col justify-between
                                        ${isDragging ? 'cursor-grabbing' : (showPan ? 'cursor-grab' : 'cursor-pointer')}
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'bg-slate-900/80 border-primary/20 shadow-2xl shadow-primary/20 ring-1 ring-primary/20 backdrop-blur-md'
                                            : 'bg-slate-900/40 border-white/5 shadow-none'
                                        }
                                    `}
                                >
                                    {/* Decorative Gradient Orb */}
                                    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* "New" Badge */}
                                    {isTopicNew && (
                                        <div className={`absolute top-6 right-6 md:top-8 md:right-8 z-30 transition duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-rose-500/90 to-pink-500/90 border border-rose-300/30 shadow-[0_0_20px_rgba(244,63,94,0.4)] backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                                                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                    {t('topics.new', 'Nou')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* "Updated" Badge */}
                                    {isTopicUpdated && (
                                        <div className={`absolute top-6 right-6 md:top-8 md:right-8 z-30 transition duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-emerald-500/90 to-teal-500/90 border border-emerald-300/30 shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                                                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                    {t('topics.updated', 'Actualitzat')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="p-5 md:p-10 relative z-20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`
                                                p-3.5 rounded-2xl border backdrop-blur-md transition-colors duration-200
                                                ${isActive
                                                    ? 'bg-primary/10 border-primary/20 text-accent shadow-lg shadow-primary/10'
                                                    : 'bg-white/5 border-white/5 text-slate-500'
                                                }
                                            `}>
                                                <Book size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className={`
                                                font-mono text-6xl font-bold transition-colors duration-200
                                                ${isActive ? 'text-white/10' : 'text-white/5'}
                                            `}>
                                                {(() => {
                                                    const match = topic.title.match(/^Tema (\d+)/);
                                                    if (match) return match[1].padStart(2, '0');
                                                    if (topic.title.toLowerCase().includes('parcial')) return 'P1';
                                                    if (topic.title.toLowerCase().includes('final')) return 'EF';
                                                    return String(i + 1).padStart(2, '0');
                                                })()}
                                            </span>
                                        </div>

                                        <h3 className={`
                                            text-2xl md:text-4xl font-bold leading-[1.1] tracking-tight mb-4 transition-colors duration-200
                                            ${isActive ? 'text-white' : 'text-slate-400'}
                                        `}>
                                            {topic.title}
                                        </h3>

                                        <div className="flex items-center gap-2.5">
                                            <div className={`h-px transition-all duration-300 ${isActive ? 'w-12 bg-primary' : 'w-6 bg-slate-700'}`} />
                                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                                                {topic.readTime || '10 Min'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-5 md:px-10 relative z-20 flex-1">
                                        <p className="text-slate-400 text-[13px] md:text-base leading-relaxed line-clamp-3 font-light">
                                            {topic.description}
                                        </p>
                                    </div>

                                    {/* Link / Action */}
                                    <div
                                        data-cursor-interactive={isActive ? "true" : undefined}
                                        className={`
                                            px-5 md:px-10 pb-5 md:pb-8 mt-auto relative z-20 transition duration-200
                                            ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
                                        `}
                                    >
                                        <div className="flex flex-col gap-3 md:gap-4">
                                            <Link
                                                to={`/tema/${topic.slug}`}
                                                draggable={false}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="group/btn flex items-center justify-between gap-3 text-white font-semibold bg-linear-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition duration-300 transform hover:-translate-y-1 active:translate-y-0 text-[13px] md:text-sm cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span>{t('topics.explore', 'Explorar tema')}</span>
                                                    <span className="hidden md:flex items-center justify-center px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider text-white/90 shadow-sm border border-white/10 opacity-70 group-hover/btn:opacity-100 transition-opacity">
                                                        {formatShortcut(enterShortcut)}
                                                    </span>
                                                </div>
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition duration-300" />
                                            </Link>

                                            <Link
                                                to={`/tema/${topic.slug}/test`}
                                                draggable={false}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="text-slate-500 hover:text-amber-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/test cursor-pointer"
                                            >
                                                <div className="p-1 rounded bg-white/5 group-hover/test:bg-amber-500/10 transition-colors">
                                                    <RefreshCw size={12} className="group-hover/test:rotate-180 transition-transform duration-500" />
                                                </div>
                                                <span>Test</span>
                                            </Link>

                                            <Link
                                                to={getTopicSolutionRoute(topic.slug)}
                                                draggable={false}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="text-slate-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/sol cursor-pointer"
                                            >
                                                <div className="p-1 rounded bg-white/5 group-hover/sol:bg-emerald-500/10 transition-colors">
                                                    {isProgrammingSubject(subject) ? <Terminal size={12} /> : <Calculator size={12} />}
                                                </div>
                                                <span>{getTopicSolutionLabel(subject, topic.slug, t)}</span>
                                            </Link>
                                        </div>
                                    </div>

                                </SpotlightCard>
                            </div>
                        );
                    })}
                </div>

                {/* Elegant Pagination Indicators */}
                <div
                    data-cursor-interactive="true"
                    className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-0 right-0 flex justify-center gap-2 z-50"
                >
                    {sortedTopics.map((_, i) => (
                        <button type="button"
                            key={sortedTopics[i]?.slug || i}
                            onClick={() => scrollTo(i)}
                            className="group p-2 cursor-pointer focus:outline-none flex items-center justify-center"
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <div className={`
                                transition-all duration-500 ease-out rounded-full
                                ${activeIndex === i
                                    ? 'w-12 h-1.5 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]'
                                    : 'w-2 h-2 bg-slate-600 group-hover:bg-slate-400'
                                }
                            `} />
                        </button>
                    ))}
                </div>
            </div>
        </MotionConfig>
    );
});

export default TopicCarousel;
