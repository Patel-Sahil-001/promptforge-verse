export function animateIn(page: HTMLElement) {
    if (!page) return;

    // 1. Title words — slide up staggered
    page.querySelectorAll('.page-title span').forEach((s: any, i) => {
        s.style.transition = 'none';
        s.style.transform = 'translateY(110%)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            s.style.transition = `transform 0.72s cubic-bezier(0.16,1,0.3,1) ${i * 0.09 + 0.04}s`;
            s.style.transform = 'translateY(0)';
        }));
    });

    // 2. Gradient divider — draw from left
    const div = page.querySelector('.divider') as HTMLElement;
    if (div) {
        div.style.transition = 'none';
        div.style.opacity = '0';
        div.style.transform = 'scaleX(0)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            div.style.transition = 'opacity 0.4s ease 0.1s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s';
            div.style.opacity = '1';
            div.style.transform = 'scaleX(1)';
        }));
    }

    // 3. Description — fade up
    const desc = page.querySelector('.page-desc') as HTMLElement;
    if (desc && desc.style.opacity !== '1') {
        desc.style.transition = 'none';
        desc.style.opacity = '0';
        desc.style.transform = 'translateY(18px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            desc.style.transition = 'opacity 0.6s ease 0.32s, transform 0.6s ease 0.32s';
            desc.style.opacity = '1';
            desc.style.transform = 'translateY(0)';
        }));
    }

    // 4. CTA buttons — fade up, latest delay
    const cta = page.querySelector('.page-cta') as HTMLElement;
    if (cta) {
        cta.style.transition = 'none';
        cta.style.opacity = '0';
        cta.style.transform = 'translateY(18px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            cta.style.transition = 'opacity 0.6s ease 0.48s, transform 0.6s ease 0.48s';
            cta.style.opacity = '1';
            cta.style.transform = 'translateY(0)';
        }));
    }

    // 5. Cards — staggered fade-up
    page.querySelectorAll('.card, .mkt-card').forEach((c: any, i) => {
        c.style.transition = 'none';
        c.style.opacity = '0';
        c.style.transform = 'translateY(28px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const d = 0.22 + i * 0.10;
            c.style.transition = `opacity 0.5s ease ${d}s, transform 0.5s ease ${d}s, border-color 0.3s`;
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
        }));
    });

    // 6. Stats — staggered scale-in
    page.querySelectorAll('.stat').forEach((s: any, i) => {
        s.style.transition = 'none';
        s.style.opacity = '0';
        s.style.transform = 'scale(0.92)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const d = 0.28 + i * 0.08;
            s.style.transition = `opacity 0.5s ease ${d}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${d}s`;
            s.style.opacity = '1';
            s.style.transform = 'scale(1)';
        }));
    });

    // 7. Contact form / misc fade up — single fade-up
    const form = page.querySelector('.contact-form, .fade-up-form') as HTMLElement;
    if (form) {
        form.style.transition = 'none';
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            form.style.transition = 'opacity 0.65s ease 0.28s, transform 0.65s ease 0.28s';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }));
    }
}
