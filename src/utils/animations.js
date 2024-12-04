export const animateWithGsapTimeLine = (timeline, target, rotation, startView, endView, animationProps) => {
    timeline.to(target.current.rotation, {
        x: rotation,
        duration: 1,
        ease: 'power2.inOut',
        ...animationProps
    })

    timeline.to(
        startView, {
            ...animationProps,
            ease: 'power2.inOut',
        },
        '<'
    )

    timeline.to(
        endView, {
            ...animationProps,
            ease: 'power2.inOut',
        },
        '<'
    )
};
