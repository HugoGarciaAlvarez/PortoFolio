const GITHUB_USER = 'HugoGarciaAlvarez';

// MENÚ HAMBURGUESA
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
});

// EFECTO MÁQUINA DE ESCRIBIR
const words = ['Desarrollador', 'Diseñador', 'Creativo', 'Programador'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typeWriter() {
    const currentWord = words[wordIndex];
    if (!isDeleting && charIndex <= currentWord.length) {
        typewriterElement.textContent = currentWord.substring(0, charIndex);
        charIndex++;
        if (charIndex > currentWord.length) { isDeleting = true; setTimeout(typeWriter, 3000); return; }
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; charIndex = 0; }
    }
    setTimeout(typeWriter, isDeleting ? 50 : 100);
}

// PROYECTOS DE FALLBACK (en caso de que la API falle o no haya proyectos con estrellas)
const FALLBACK_PROJECTS = [
    {
        name: "CRM",
        description: "herramienta digital para organizar y gestionar todas las interacciones de una empresa con sus clientes en un solo lugar.",
        technologies: ["Angular", "TypeScript"],
        image: "https://via.placeholder.com/400x200/667eea/ffffff?text=Proyecto+Web",
        link: `https://github.com/HugoGarciaAlvarez/CRM_PROYECTO`
    },
    {
        name: "Aventura conversacional",
        description: "Aventura conversacional hecha con Java.",
        technologies: ["Java"],
        image: "https://via.placeholder.com/400x200/764ba2/ffffff?text=API+REST",
        link: `https://github.com/HugoGarciaAlvarez/aventuraConversacional`
    },
    {
        name: "Ascensor Social",
        description: "Panel de control interactivo con gráficos en tiempo real y visualización de datos compleja.",
        technologies: ["Svelte", "Node.js"],
        image: "https://via.placeholder.com/400x200/00d9ff/ffffff?text=Dashboard",
        link: `https://github.com/HugoGarciaAlvarez/Ascensor-social.git`
    }
];

// OBTENER LENGUAJES DETALLADOS DE UN REPO
async function getRepoLanguages(repoName) {
    try {
        const response = await fetch(``);
        const data = await response.json();
        return Object.keys(data); // Devuelve array con lenguajes (ej: ["Java", "HTML", "CSS"])
    } catch { return []; }
}

async function fetchGitHubProjects() {
    const container = document.getElementById('proyectos-grid');
    try {
        const response = await fetch(``);
        
        // Si la respuesta no es OK, usar proyectos de fallback
        if (!response.ok) {
            console.log('API de GitHub no disponible, usando proyectos de ejemplo');
            renderFallbackProjects(container);
            return;
        }
        
        const repos = await response.json();

        // Filtro: Solo con estrellas, máximo 3
        const favoritos = repos
            .filter(repo => !repo.fork && repo.stargazers_count > 0)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 3);

        // Si no hay proyectos con estrellas, usar proyectos de fallback
        if (favoritos.length === 0) {
            console.log('No hay proyectos con estrellas, usando proyectos de ejemplo');
            renderFallbackProjects(container);
            return;
        }

        container.innerHTML = '';

        // Usamos for...of para poder usar await dentro del bucle
        for (const repo of favoritos) {
            const languages = await getRepoLanguages(repo.name);
            const allTech = [...new Set([...languages, ...(repo.topics || [])])]; // Fusionamos lenguajes y temas de GitHub

            const card = document.createElement('div');
            card.className = 'proyecto-card';
            card.innerHTML = `
                <div class="proyecto-info">
                    <h3>${repo.name.replace(/-/g, ' ')}</h3>
                    <p>${repo.description || "Proyecto profesional desarrollado con las últimas tecnologías del mercado."}</p>
                    <div class="proyecto-tech">
                        ${allTech.slice(0, 6).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="proyecto-links">
                        <a href="${repo.html_url}" target="_blank" class="btn-proyecto btn-primary">Ver Código Fuente</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (e) {
        console.error('Error al cargar proyectos de GitHub:', e);
        renderFallbackProjects(container);
    }
}

// Renderizar proyectos de fallback
function renderFallbackProjects(container) {
    container.innerHTML = '';
    
    FALLBACK_PROJECTS.forEach(project => {
        const card = document.createElement('div');
        card.className = 'proyecto-card';
        card.innerHTML = `
            <div class="proyecto-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="proyecto-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="proyecto-links">
                    <a href="${project.link}" target="_blank" class="btn-proyecto btn-primary">Ver Código Fuente</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');

    typeWriter();
    fetchGitHubProjects();

    const revealElements = document.querySelectorAll(
        'section, .home-text, .home-tech, .proyecto-card, .proyecto-destacado-card, .info-card, .redes-sociales'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
});